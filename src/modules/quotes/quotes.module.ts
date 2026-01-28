import { Module } from '@nestjs/common';
import { QuotesService } from './quotes.service';
import { PrismaModule } from '../../prisma/prisma.module';
import { QuotesController } from './quotes.controller';

@Module({
  imports: [PrismaModule],
  providers: [QuotesService],
  controllers: [QuotesController],
})
export class QuotesModule {}
