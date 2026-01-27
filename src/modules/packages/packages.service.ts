import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { StatusHistoryService } from '../status-history/status-history.service';
import {
  PackageActor,
  PACKAGE_STATE_TRANSITIONS,
} from '../../domain/package/package.state-machine';
import { PackageStatus } from '../../domain/package/package-status.enum';

@Injectable()
export class PackagesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly statusHistoryService: StatusHistoryService,
  ) {}

  /**
   * Criação do Package (status inicial: ABERTO)
   */
  async create(params: { userId: string }) {
    const { userId } = params;

    // 1. Criar package
    const pkg = await this.prisma.client.package.create({
      data: {
        userId,
        status: PackageStatus.ABERTO,
      },
    });

    // 2. Registrar auditoria
    await this.statusHistoryService.record({
      entityType: 'PACKAGE',
      entityId: pkg.id,
      toStatus: PackageStatus.ABERTO,
    });

    return pkg;
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

    // 1. Buscar o package
    const pkg = await this.prisma.client.package.findUnique({
      where: { id: packageId },
    });

    if (!pkg) {
      throw new Error('Package não encontrado');
    }

    const fromStatus = pkg.status as PackageStatus;

    // 2. Validar status atual
    if (fromStatus !== PackageStatus.AGUARDANDO_ESCOLHA_CLIENTE) {
      throw new Error(
        `Package não está aguardando escolha do cliente (status atual: ${fromStatus})`,
      );
    }

    // 3. Resolver status destino
    const toStatus =
      choice === 'CONSOLIDATE'
        ? PackageStatus.CONSOLIDANDO
        : PackageStatus.PRONTO_PARA_PRECIFICAR;

    // 4. Validar transição via domínio
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

    // 5. Atualizar status
    const updatedPackage = await this.prisma.client.package.update({
      where: { id: packageId },
      data: { status: toStatus },
    });

    // 6. Registrar auditoria
    await this.statusHistoryService.record({
      entityType: 'PACKAGE',
      entityId: packageId,
      fromStatus,
      toStatus,
    });

    return updatedPackage;
  }
}
