import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { StatusHistoryService } from '../status-history/status-history.service';
import { PurchaseStatus } from '../../domain/purchase/purchase-status.enum';
import { PackageStatus } from '../../domain/package/package-status.enum';

@Injectable()
export class PackageItemsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly statusHistoryService: StatusHistoryService,
  ) {}

  async addPurchaseToPackage(params: {
    packageId: string;
    purchaseId: string;
  }) {
    const { packageId, purchaseId } = params;

    // 1. Buscar Package
    const pkg = await this.prisma.client.package.findUnique({
      where: { id: packageId },
    });

    if (!pkg) {
      throw new Error('Package não encontrado');
    }

    if (
      ![
        PackageStatus.ABERTO,
        PackageStatus.CONSOLIDANDO,
      ].includes(pkg.status as PackageStatus)
    ) {
      throw new Error(
        `Package não aceita itens no status ${pkg.status}`,
      );
    }

    // 2. Buscar Purchase
    const purchase = await this.prisma.client.purchase.findUnique({
      where: { id: purchaseId },
    });

    if (!purchase) {
      throw new Error('Purchase não encontrada');
    }

    if (
       ![
         PurchaseStatus.CADASTRADO,
         PurchaseStatus.EM_TRANSITO_JP,
         PurchaseStatus.RECEBIDO_NO_JAPAO,
         PurchaseStatus.EM_INSPECAO,
         PurchaseStatus.AGUARDANDO_CONSOLIDACAO,
        ].includes(purchase.status as PurchaseStatus)
      ) {
      throw new Error(
        `Purchase em status inválido para vinculação: ${purchase.status}`,
      );
    }

    // 3. Verificar se já está em outro package
    const existing = await this.prisma.client.packageItem.findFirst({
      where: { purchaseId },
    });

    if (existing) {
      throw new Error('Purchase já vinculada a outro Package');
    }

    // 4. Criar vínculo
    const item = await this.prisma.client.packageItem.create({
      data: {
        packageId,
        purchaseId,
      },
    });

    // 5. Auditoria correta (PackageItem)
    await this.statusHistoryService.record({
      entityType: 'PACKAGE_ITEM',
      entityId: item.id,
      toStatus: 'ADDED',
    });

    return item;
  }
}
