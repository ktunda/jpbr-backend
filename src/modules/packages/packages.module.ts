import { Module } from '@nestjs/common';
import { PackagesController } from './packages.controller';
import { PackagesService } from './packages.service';
import { PrismaModule } from '../../prisma/prisma.module';
import { StatusHistoryModule } from '../status-history/status-history.module';

@Module({
  imports: [PrismaModule, StatusHistoryModule],
  controllers: [PackagesController],
  providers: [PackagesService],
})
export class PackagesModule {}
