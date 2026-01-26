import { PurchaseActor } from '../purchase/purchase.state-machine';
import {
  PURCHASE_STATE_TRANSITIONS,
  PurchaseStateTransition,
} from '../purchase/purchase.state-machine';
import { PurchaseStatus } from '../purchase/purchase-status.enum';

/**
 * Erro padrão para transição inválida
 */
export class InvalidStateTransitionError extends Error {
  constructor(
    public readonly from: string,
    public readonly to: string,
    public readonly actor: string,
  ) {
    super(`Invalid state transition from ${from} to ${to} by ${actor}`);
  }
}

/**
 * Serviço central de validação de transições de estado
 */
export class StateMachineService {
  static validatePurchaseTransition(
    from: PurchaseStatus,
    to: PurchaseStatus,
    actor: PurchaseActor,
  ): PurchaseStateTransition {
    const transition = PURCHASE_STATE_TRANSITIONS.find(
      (t) =>
        t.from === from &&
        t.to === to &&
        t.allowedActors.includes(actor),
    );

    if (!transition) {
      throw new InvalidStateTransitionError(from, to, actor);
    }

    return transition;
  }
}
