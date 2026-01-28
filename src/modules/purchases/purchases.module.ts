import { Module } from '@nestjs/common';
import { PurchasesController } from './purchases.controller';
import { PurchasesService } from './purchases.service';
import { PrismaModule } from '../../prisma/prisma.module';
import { StatusHistoryModule } from '../status-history/status-history.module';

@Module({
  imports: [PrismaModule, StatusHistoryModule],
  controllers: [PurchasesController],
  providers: [PurchasesService],
  exports: [PurchasesService],
})
export class PurchasesModule {}
