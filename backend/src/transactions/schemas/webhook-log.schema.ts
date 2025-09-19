import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

@Schema({ timestamps: true })
export class WebhookLog extends Document {
  @Prop() event: string;

  // Arbitrary JSON payload; explicit type + default avoids runtime inference errors
  @Prop({ type: MongooseSchema.Types.Mixed, default: {} })
  payload: Record<string, any>;

  @Prop() statusCode: number;
}

export const WebhookLogSchema = SchemaFactory.createForClass(WebhookLog);
