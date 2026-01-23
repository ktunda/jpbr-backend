import { Controller, Get, Post, Body } from '@nestjs/common';
import { CreatePurchaseDto } from './dto/create-purchase.dto';

@Controller('purchases')
export class PurchasesController {
  @Get()
  list() {
    return {
      message: 'purchases endpoint ok',
    };
  }

  @Post()
  create(@Body() body: CreatePurchaseDto) {
    return {
      message: 'purchase received',
      data: body,
    };
  }
}
