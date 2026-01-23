import { Injectable } from '@nestjs/common';
import * as Prisma from '@prisma/client';

@Injectable()
export class PrismaService {
  readonly client: Prisma.PrismaClient;

  constructor() {
    this.client = new Prisma.PrismaClient();
  }
}
