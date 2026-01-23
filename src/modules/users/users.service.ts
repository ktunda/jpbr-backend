import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(name: string, email: string) {
    return this.prisma.client.user.create({
      data: {
        name,
        email,
      },
    });
  }

  async findAll() {
    return this.prisma.client.user.findMany();
  }
}
