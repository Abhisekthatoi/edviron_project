import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class OrderStatus extends Document {
  @Prop({ type: Types.ObjectId, ref: 'Order', required: true, index: true })
  collect_id: Types.ObjectId;

  @Prop({ type: Number }) order_amount: number;
  @Prop({ type: Number }) transaction_amount: number;
  @Prop({ type: String }) payment_mode: string;
  @Prop({ type: String }) payment_details: string;
  @Prop({ type: String }) bank_reference: string;
  @Prop({ type: String }) payment_message: string;
  @Prop({ type: String, index: true }) status: string;
  @Prop({ type: String }) error_message: string;
  @Prop({ type: Date, index: true }) payment_time: Date;
  @Prop({ type: String }) gateway: string;
}

export const OrderStatusSchema = SchemaFactory.createForClass(OrderStatus);
OrderStatusSchema.index({ status: 1, payment_time: -1 });
OrderStatusSchema.index({ collect_id: 1 });
