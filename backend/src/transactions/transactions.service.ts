import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Order } from './schemas/order.schema';
import { OrderStatus } from './schemas/order-status.schema';
import { WebhookDto } from './dto/webhook.dto';
import axios from 'axios';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectModel(Order.name) private orderModel: Model<Order>,
    @InjectModel(OrderStatus.name) private orderStatusModel: Model<OrderStatus>
  ) {}

  buildAggregation(match: any, sort: any, skip: number, limit: number) {
    return [
      { $match: match },
      {
        $lookup: {
          from: 'orderstatuses',
          localField: '_id',
          foreignField: 'collect_id',
          as: 'status_docs'
        }
      },
      { $unwind: { path: '$status_docs', preserveNullAndEmptyArrays: true } },
      {
        $project: {
          collect_id: '$_id',
          school_id: 1,
          gateway: '$status_docs.gateway',
          order_amount: '$status_docs.order_amount',
          transaction_amount: '$status_docs.transaction_amount',
          status: '$status_docs.status',
          custom_order_id: 1,
          payment_time: '$status_docs.payment_time'
        }
      },
      { $sort: sort },
      { $skip: skip },
      { $limit: limit }
    ];
  }

  async getTransactions(query: any) {
    const page = Math.max(parseInt(query.page ?? '1'), 1);
    const limit = Math.min(Math.max(parseInt(query.limit ?? '10'), 1), 100);
    const skip = (page - 1) * limit;

    const sortField = query.sort ?? 'payment_time';
    const order = (query.order ?? 'desc').toLowerCase() === 'asc' ? 1 : -1;
    const sort: any = { [sortField]: order };

    const match: any = {};
    if (query.status) {
      const statuses = Array.isArray(query.status) ? query.status : String(query.status).split(',');
      match['status_docs.status'] = { $in: statuses };
    }
    if (query.schoolIds) {
      const ids = String(query.schoolIds).split(',').map((s) => s.trim());
      match['school_id'] = { $in: ids.map((x) => (Types.ObjectId.isValid(x) ? new Types.ObjectId(x) : x)) };
    }
    if (query.from || query.to) {
      match['status_docs.payment_time'] = {};
      if (query.from) match['status_docs.payment_time'].$gte = new Date(query.from);
      if (query.to) match['status_docs.payment_time'].$lte = new Date(query.to);
    }

    const pipeline = this.buildAggregation(match, sort, skip, limit);
    const data = await this.orderModel.aggregate(pipeline);
    const total = await this.orderModel.aggregate([
      { $match: match },
      { $lookup: { from: 'orderstatuses', localField: '_id', foreignField: 'collect_id', as: 'status_docs' } },
      { $unwind: { path: '$status_docs', preserveNullAndEmptyArrays: true } },
      { $count: 'count' }
    ]);
    const count = total[0]?.count ?? 0;

    return { page, limit, count, data };
  }

  async getBySchool(schoolId: string, query: any) {
    query.schoolIds = schoolId;
    return this.getTransactions(query);
  }

  async getStatusByCustomOrderId(customOrderId: string) {
    const order = await this.orderModel.findOne({ custom_order_id: customOrderId });
    if (!order) throw new NotFoundException('Order not found');
    const status = await this.orderStatusModel.findOne({ collect_id: order._id }).sort({ createdAt: -1 });
    return { custom_order_id: customOrderId, status: status?.status ?? 'unknown' };
  }

  async createPayment(payload: {
    custom_order_id: string;
    order_amount: number;
    gateway_name: string;
    payment_mode?: string;
  }) {
    // Ensure order exists or create minimal order shell
    let order = await this.orderModel.findOne({ custom_order_id: payload.custom_order_id });
    if (!order) {
      order = await this.orderModel.create({
        school_id: process.env.SCHOOL_ID,
        trustee_id: undefined,
        student_info: { name: 'NA', id: 'NA', email: 'NA' },
        gateway_name: payload.gateway_name,
        custom_order_id: payload.custom_order_id
      });
    }

    const signingKey = process.env.PAYMENT_API_KEY_JWT!;
    const body = {
      pg_key: process.env.PG_KEY,
      custom_order_id: payload.custom_order_id,
      order_amount: payload.order_amount,
      school_id: process.env.SCHOOL_ID,
      gateway_name: payload.gateway_name,
      payment_mode: payload.payment_mode
    };
    const signed = jwt.sign(body, signingKey, { algorithm: 'HS256' });

    const url = `${process.env.PAYMENT_API_BASE}/create-collect-request`;
    const res = await axios.post(
      url,
      { token: signed },
      { headers: { 'Content-Type': 'application/json' } }
    );

    // Upsert an OrderStatus placeholder upon initiation
    await this.orderStatusModel.updateOne(
      { collect_id: order._id },
      {
        $setOnInsert: {
          collect_id: order._id,
          order_amount: payload.order_amount,
          status: 'initiated',
          gateway: payload.gateway_name
        }
      },
      { upsert: true }
    );

    // Return redirect link supplied by payment API
    return res.data;
  }

  async handleWebhook(dto: WebhookDto) {
    const info = dto.order_info;
    // order_id in webhook holds collect_id/transaction_id per doc
    const customOrCollect = info.order_id;

    // Prefer matching by custom_order_id first; fallback to ObjectId if present
    let order = await this.orderModel.findOne({ custom_order_id: customOrCollect });
    if (!order && Types.ObjectId.isValid(customOrCollect)) {
      order = await this.orderModel.findById(customOrCollect);
    }
    if (!order) throw new NotFoundException('Order for webhook not found');

    await this.orderStatusModel.updateOne(
      { collect_id: order._id },
      {
        $set: {
          order_amount: info.order_amount,
          transaction_amount: info.transaction_amount,
          payment_mode: info.payment_mode,
          payment_details: info.payemnt_details,
          bank_reference: info.bank_reference,
          payment_message: info.Payment_message,
          status: info.status,
          error_message: info.error_message,
          payment_time: new Date(info.payment_time),
          gateway: info.gateway
        }
      },
      { upsert: true }
    );

    return { ok: true };
  }
}
