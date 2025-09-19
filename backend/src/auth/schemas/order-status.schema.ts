import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class OrderStatus extends Document {
  @Prop({ type: Types.ObjectId, ref: 'Order', required: true, index: true })
  collect_id: Types.ObjectId;

  @Prop() order_amount: number;
  @Prop() transaction_amount: number;
  @Prop() payment_mode: string;
  @Prop() payment_details: string;
  @Prop() bank_reference: string;
  @Prop() payment_message: string;
  @Prop({ index: true }) status: string;
  @Prop() error_message: string;
  @Prop({ type: Date, index: true }) payment_time: Date;
  @Prop() gateway: string;
}
export const OrderStatusSchema = SchemaFactory.createForClass(OrderStatus);
OrderStatusSchema.index({ status: 1, payment_time: -1 });
OrderStatusSchema.index({ collect_id: 1 });
