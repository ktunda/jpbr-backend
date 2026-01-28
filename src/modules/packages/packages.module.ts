import { Module } from '@nestjs/common';
import { PackagesController } from './packages.controller';
import { PackagesService } from './packages.service';
import { PackageItemsService } from './package-items.service';
import { PackageItemsController } from './package-items.controller';
import { PrismaModule } from '../../prisma/prisma.module';
import { StatusHistoryModule } from '../status-history/status-history.module';
import { PurchasesModule } from '../purchases/purchases.module';

@Module({
  imports: [PrismaModule, StatusHistoryModule, PurchasesModule],
  controllers: [
    PackagesController,
    PackageItemsController,
  ],
  providers: [
    PackagesService,
    PackageItemsService,
  ],
})
export class PackagesModule {}
