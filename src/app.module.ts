import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PurchasesModule } from './modules/purchases/purchases.module';
import { PackagesModule } from './modules/packages/packages.module';

@Module({
  imports: [PurchasesModule, PackagesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
