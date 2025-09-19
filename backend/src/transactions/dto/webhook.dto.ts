import { IsDateString, IsNumber, IsObject, IsOptional, IsString } from 'class-validator';

export class WebhookOrderInfoDto {
  @IsString() order_id: string; // collect_id / transaction_id
  @IsNumber() order_amount: number;
  @IsNumber() transaction_amount: number;
  @IsString() gateway: string;
  @IsString() bank_reference: string;
  @IsString() status: string;
  @IsString() payment_mode: string;
  @IsString() payemnt_details: string; // note: matches doc typo
  @IsString() Payment_message: string;
  @IsDateString() payment_time: string;
  @IsString() error_message: string;
}

export class WebhookDto {
  @IsNumber() status: number;
  @IsObject() order_info: WebhookOrderInfoDto;
}
