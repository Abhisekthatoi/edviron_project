import { IsNumber, IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class CreatePaymentDto {
  @IsString() @IsNotEmpty() custom_order_id: string;
  @IsNumber() order_amount: number;
  @IsString() @IsNotEmpty() gateway_name: string;
  @IsString() @IsOptional() payment_mode?: string;
}
