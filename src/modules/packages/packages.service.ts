import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { StatusHistoryService } from '../status-history/status-history.service';
import {
  PackageActor,
  PACKAGE_STATE_TRANSITIONS,
} from '../../domain/package/package.state-machine';
import { PackageStatus } from '../../domain/package/package-status.enum';
import { PurchasesService } from '../purchases/purchases.service';
import { PurchaseStatus } from '../../domain/purchase/purchase-status.enum';

@Injectable()
export class PackagesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly statusHistoryService: StatusHistoryService,
    private readonly purchasesService: PurchasesService,
  ) {}

  /**
   * Criação do Package (status inicial: ABERTO)
   */
  async create(params: { userId: string }) {
    const { userId } = params;

    const pkg = await this.prisma.client.package.create({
      data: {
        userId,
        status: PackageStatus.ABERTO,
      },
    });

    await this.statusHistoryService.record({
      entityType: 'PACKAGE',
      entityId: pkg.id,
      toStatus: PackageStatus.ABERTO,
    });

    return pkg;
  }

  /**
   * Buscar Package por ID
   */
  async findById(packageId: string) {
    const pkg = await this.prisma.client.package.findUnique({
      where: { id: packageId },
    });

    if (!pkg) {
      throw new Error('Package não encontrado');
    }

    return pkg;
  }


  /**
   * Avanço de status pelo SYSTEM
   */
  async advanceStatus(params: {
    packageId: string;
    toStatus: PackageStatus;
  }) {
    const { packageId, toStatus } = params;

    const pkg = await this.prisma.client.package.findUnique({
      where: { id: packageId },
    });

    if (!pkg) {
      throw new Error('Package não encontrado');
    }

    const fromStatus = pkg.status as PackageStatus;

    const transitionAllowed = PACKAGE_STATE_TRANSITIONS.some(
      (t) =>
        t.from === fromStatus &&
        t.to === toStatus &&
        t.allowedActors.includes('SYSTEM'),
    );

    if (!transitionAllowed) {
      throw new Error(
        `Transição inválida: ${fromStatus} → ${toStatus} por SYSTEM`,
      );
    }

    const updatedPackage = await this.prisma.client.package.update({
      where: { id: packageId },
      data: { status: toStatus },
    });

    await this.statusHistoryService.record({
      entityType: 'PACKAGE',
      entityId: packageId,
      fromStatus,
      toStatus,
    });

    return updatedPackage;
  }

  /**
   * Escolha do cliente: consolidar ou não
   */
  async chooseConsolidation(params: {
    packageId: string;
    choice: 'CONSOLIDATE' | 'DO_NOT_CONSOLIDATE';
    actor: PackageActor;
  }) {
    const { packageId, choice, actor } = params;

    const pkg = await this.prisma.client.package.findUnique({
      where: { id: packageId },
    });

    if (!pkg) {
      throw new Error('Package não encontrado');
    }

    const fromStatus = pkg.status as PackageStatus;

    if (fromStatus !== PackageStatus.AGUARDANDO_ESCOLHA_CLIENTE) {
      throw new Error(
        `Package não está aguardando escolha do cliente (status atual: ${fromStatus})`,
      );
    }

    const toStatus =
      choice === 'CONSOLIDATE'
        ? PackageStatus.CONSOLIDANDO
        : PackageStatus.PRONTO_PARA_PRECIFICAR;

    const transitionAllowed = PACKAGE_STATE_TRANSITIONS.some(
      (t) =>
        t.from === fromStatus &&
        t.to === toStatus &&
        t.allowedActors.includes(actor),
    );

    if (!transitionAllowed) {
      throw new Error(
        `Transição inválida: ${fromStatus} → ${toStatus} por ${actor}`,
      );
    }

    const updatedPackage = await this.prisma.client.package.update({
      where: { id: packageId },
      data: { status: toStatus },
    });

    await this.statusHistoryService.record({
      entityType: 'PACKAGE',
      entityId: packageId,
      fromStatus,
      toStatus,
    });

    return updatedPackage;
  }

/**
 * Finalizar consolidação do Package
 * Regra de negócio: só após itens vinculados
 */
async finishConsolidation(packageId: string) {
  // 1. Buscar package
  const pkg = await this.prisma.client.package.findUnique({
    where: { id: packageId },
    include: { items: true },
  });

  if (!pkg) {
    throw new Error('Package não encontrado');
  }

  // 2. Validar status atual
  if (pkg.status !== PackageStatus.CONSOLIDANDO) {
    throw new Error(
      `Package não está em CONSOLIDANDO (status atual: ${pkg.status})`,
    );
  }

  // 3. Validar se possui itens
  if (!pkg.items || pkg.items.length === 0) {
    throw new Error('Package não possui purchases vinculadas');
  }

  // 4. Consolidar todas as Purchases vinculadas (via domínio)
  for (const item of pkg.items) {
    await this.purchasesService.transitionStatus(
      item.purchaseId,
      PurchaseStatus.CONSOLIDADO,
      'SYSTEM',
    );
  }

  // 5. Atualizar status do package
  const updatedPackage = await this.prisma.client.package.update({
    where: { id: packageId },
    data: {
      status: PackageStatus.PRONTO_PARA_PRECIFICAR,
    },
  });

  // 6. Auditoria
  await this.statusHistoryService.record({
    entityType: 'PACKAGE',
    entityId: packageId,
    fromStatus: PackageStatus.CONSOLIDANDO,
    toStatus: PackageStatus.PRONTO_PARA_PRECIFICAR,
  });

  return updatedPackage;
}

}
