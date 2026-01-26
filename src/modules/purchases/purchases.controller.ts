import { Controller, Get, Post, Body } from '@nestjs/common';
import { PurchasesService } from './purchases.service';
import { CreatePurchaseDto } from './dto/create-purchase.dto';

@Controller('purchases')
export class PurchasesController {
  constructor(private readonly purchasesService: PurchasesService) {}

  @Get()
  list() {
    return {
      message: 'purchases endpoint ok',
    };
  }

  @Post()
  async create(@Body() body: CreatePurchaseDto) {
    const purchase = await this.purchasesService.create(body);

    return purchase;
  }
}
