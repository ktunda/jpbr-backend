import { Controller, Post, Param, Body } from '@nestjs/common';
import { QuotesService } from './quotes.service';

@Controller('packages')
export class QuotesController {
  constructor(
    private readonly quotesService: QuotesService,
  ) {}

  @Post(':id/quote')
  async createQuote(
    @Param('id') packageId: string,
    @Body() body: { destinationState: string },
  ) {
    return this.quotesService.createQuote({
      packageId,
      destinationState: body.destinationState,
    });
  }
}
