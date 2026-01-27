import { Controller, Get, Post, Patch, Body, Param } from '@nestjs/common';
import { PurchasesService } from './purchases.service';
import { CreatePurchaseDto } from './dto/create-purchase.dto';
import { UpdatePurchaseStatusDto } from './dto/update-purchase-status.dto';

@Controller('purchases')
export class PurchasesController {
  constructor(private readonly purchasesService: PurchasesService) {}

  @Get()
  async list() {
    return this.purchasesService.list();
  }


  @Post()
  async create(@Body() body: CreatePurchaseDto) {
    const purchase = await this.purchasesService.create(body);

    return purchase;
  }
  @Patch(':id/status')
  async updateStatus(
    @Param('id') id: string,
    @Body() body: UpdatePurchaseStatusDto,
  ) {
    const { toStatus, actor } = body;

    const updatedPurchase = await this.purchasesService.transitionStatus(
      id,
      toStatus,
      actor,
    );

    return updatedPurchase;
  }

}
