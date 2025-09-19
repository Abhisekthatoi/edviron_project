import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Order extends Document {
  @Prop({ type: Types.ObjectId, index: true })
  school_id: Types.ObjectId | string;

  @Prop({ type: Types.ObjectId })
  trustee_id: Types.ObjectId | string;

  @Prop({
    type: { name: String, id: String, email: String },
    required: true
  })
  student_info: { name: string; id: string; email: string };

  @Prop() gateway_name: string;

  @Prop({ required: true, unique: true, index: true })
  custom_order_id: string;
}
export const OrderSchema = SchemaFactory.createForClass(Order);
OrderSchema.index({ school_id: 1 });
OrderSchema.index({ custom_order_id: 1 }, { unique: true });
