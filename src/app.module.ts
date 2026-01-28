import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { PurchasesModule } from './modules/purchases/purchases.module';
import { PackagesModule } from './modules/packages/packages.module';
import { UsersModule } from './modules/users/users.module';
import { QuotesModule } from './modules/quotes/quotes.module';

@Module({
  imports: [
    PrismaModule,
    PurchasesModule,
    PackagesModule,
    UsersModule,
    QuotesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
