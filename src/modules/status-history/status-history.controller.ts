import { Controller, Get, Query } from '@nestjs/common';
import { StatusHistoryService } from './status-history.service';

@Controller('status-history')
export class StatusHistoryController {
  constructor(
    private readonly statusHistoryService: StatusHistoryService,
  ) {}

  @Get()
  async list(
    @Query('entityType') entityType: string,
    @Query('entityId') entityId: string,
  ) {
    return this.statusHistoryService.list({
      entityType,
      entityId,
    });
  }
}
