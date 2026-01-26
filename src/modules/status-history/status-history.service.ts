import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class StatusHistoryService {
  constructor(private readonly prisma: PrismaService) {}

  async record(params: {
    entityType: string;
    entityId: string;
    fromStatus?: string;
    toStatus: string;
  }) {
    const { entityType, entityId, fromStatus, toStatus } = params;

    return this.prisma.client.statusHistory.create({
      data: {
        entityType,
        entityId,
        fromStatus,
        toStatus,
      },
    });
  }
}
