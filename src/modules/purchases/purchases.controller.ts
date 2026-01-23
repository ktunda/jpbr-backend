import { Controller, Get } from '@nestjs/common';

@Controller('purchases')
export class PurchasesController {
  @Get()
  list() {
    return {
      message: 'purchases endpoint ok',
    };
  }
}
