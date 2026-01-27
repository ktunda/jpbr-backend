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
    return this.prisma.client.statusHistory.create({
      data: params,
    });
  }

  async list(params: {
    entityType: string;
    entityId: string;
  }) {
    const { entityType, entityId } = params;

    return this.prisma.client.statusHistory.findMany({
      where: {
        entityType,
        entityId,
      },
      orderBy: {
        createdAt: 'asc',
      },
    });
  }
}
