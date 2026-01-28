import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { calculatePrice } from './pricing.engine';

@Injectable()
export class QuotesService {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  async createQuote(params: {
    packageId: string;
  destinationState: string;
  }) {
    const { packageId } = params;

    // 1. Buscar o Package
    const pkg = await this.prisma.client.package.findUnique({
      where: { id: packageId },
    });

    // 2. Validar existência
    if (!pkg) {
      throw new Error('Package não encontrado');
    }

    // 3. Validar status
    if (pkg.status !== 'PRONTO_PARA_PRECIFICAR') {
      throw new Error(
        `Package não pode ser precificado no status ${pkg.status}`,
      );
    }

    // 4. Buscar itens do Package
    const items = await this.prisma.client.packageItem.findMany({
      where: {
        packageId,
      },
      include: {
        purchase: true,
      },
    });

    // 5. Validar se o Package tem itens
    if (items.length === 0) {
      throw new Error('Package não possui itens para precificação');
    }

    // 5.1 Calcular preço base (engine)
    const pricing = calculatePrice({
      items: items.map(item => ({
        declaredValueJpy: item.purchase.declaredValueJpy,
      })),
      destinationState: params.destinationState,
    });

    // 5.2 Expirar quotes ativos anteriores (boa prática)
    await this.prisma.client.quote.updateMany({
      where: {
        packageId: packageId,
        status: 'ATIVO',
      },
      data: {
        status: 'EXPIRADO',
      },
    });

    // 6. Criar Quote (valores dummy, sem cálculo)
    const quote = await this.prisma.client.quote.create({
      data: {
        packageId: packageId,

        status: 'ATIVO',

        freightAmount: pricing.freightAmount,
        importTaxAmount: pricing.importTaxAmount,
        icmsAmount: pricing.icmsAmount,
        adminFeeAmount: pricing.adminFeeAmount,
        riskBufferAmount: pricing.riskBufferAmount,
        totalAmount: pricing.totalAmount,

        currency: 'BRL',
        fxRateApplied: pricing.fxRateApplied,

        expiresAt: new Date(
          Date.now() + 24 * 60 * 60 * 1000,
        ),
      },
    });

    return quote;

  }

  async listByPackage(packageId: string) {
    return this.prisma.client.quote.findMany({
      where: {
        packageId,
      },
      orderBy: {
        createdAt: 'asc',
      },
    });
  }

}
