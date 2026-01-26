import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import {
  canTransition,
  PurchaseActor,
} from '../../domain/purchase/purchase.state-machine';
import { PurchaseStatus } from '../../domain/purchase/purchase-status.enum';
import { StatusHistoryService } from '../status-history/status-history.service';

@Injectable()
export class PurchasesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly statusHistoryService: StatusHistoryService,
  ) {}

  async transitionStatus(
    purchaseId: string,
    toStatus: PurchaseStatus,
    actor: PurchaseActor,
  ) {
    // 1. Buscar a purchase no banco
    const purchase = await this.prisma.client.purchase.findUnique({
      where: { id: purchaseId },
    });

    if (!purchase) {
      throw new Error('Purchase não encontrada');
    }

    const fromStatus = purchase.status as PurchaseStatus;

    // 2. Validar transição via domínio
    const allowed = canTransition(fromStatus, toStatus, actor);

    if (!allowed) {
      throw new Error(
        `Transição inválida: ${fromStatus} → ${toStatus} por ${actor}`,
      );
    }

    // 3. Atualizar status
    const updatedPurchase = await this.prisma.client.purchase.update({
      where: { id: purchaseId },
      data: { status: toStatus },
    });

    // 4. Registrar auditoria
    await this.statusHistoryService.record({
      entityType: 'PURCHASE',
      entityId: purchaseId,
      fromStatus,
      toStatus,
    });

    return updatedPurchase;
  }
}
