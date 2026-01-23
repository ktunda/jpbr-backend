import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PurchasesModule } from './modules/purchases/purchases.module';

@Module({
  imports: [PurchasesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
