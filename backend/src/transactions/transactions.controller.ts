import { Body, Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { TransactionsService } from './transactions.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { WebhookDto } from './dto/webhook.dto';

@Controller()
export class TransactionsController {
  constructor(private readonly svc: TransactionsService) {}

  @UseGuards(JwtAuthGuard)
  @Get('transactions')
  getAll(@Query() query: any) {
    return this.svc.getTransactions(query);
  }

  @UseGuards(JwtAuthGuard)
  @Get('transactions/school/:schoolId')
  getBySchool(@Param('schoolId') schoolId: string, @Query() query: any) {
    return this.svc.getBySchool(schoolId, query);
  }

  @UseGuards(JwtAuthGuard)
  @Get('transaction-status/:custom_order_id')
  getStatus(@Param('custom_order_id') id: string) {
    return this.svc.getStatusByCustomOrderId(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post('create-payment')
  createPayment(@Body() dto: CreatePaymentDto) {
    return this.svc.createPayment(dto);
  }

  @Post('webhook')
  webhook(@Body() dto: WebhookDto) {
    return this.svc.handleWebhook(dto);
  }
}
