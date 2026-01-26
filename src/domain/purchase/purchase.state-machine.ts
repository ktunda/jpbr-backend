import { PurchaseStatus } from './purchase-status.enum';

/**
 * Quem pode executar a transição
 */
export type PurchaseActor =
  | 'CLIENT'
  | 'ADMIN'
  | 'OPERATOR'
  | 'SYSTEM';

/**
 * Definição de uma transição válida
 */
export interface PurchaseStateTransition {
  from: PurchaseStatus;
  to: PurchaseStatus;
  allowedActors: PurchaseActor[];
}

/**
 * Lista oficial de transições válidas da Purchase
 */
export const PURCHASE_STATE_TRANSITIONS: PurchaseStateTransition[] = [
  {
    from: PurchaseStatus.CADASTRADO,
    to: PurchaseStatus.EM_TRANSITO_JP,
    allowedActors: ['CLIENT'],
  },
  {
    from: PurchaseStatus.CADASTRADO,
    to: PurchaseStatus.RECEBIDO_NO_JAPAO,
    allowedActors: ['ADMIN', 'OPERATOR'],
  },
  {
    from: PurchaseStatus.EM_TRANSITO_JP,
    to: PurchaseStatus.RECEBIDO_NO_JAPAO,
    allowedActors: ['ADMIN', 'OPERATOR'],
  },
  {
    from: PurchaseStatus.RECEBIDO_NO_JAPAO,
    to: PurchaseStatus.EM_INSPECAO,
    allowedActors: ['ADMIN', 'OPERATOR'],
  },
  {
    from: PurchaseStatus.EM_INSPECAO,
    to: PurchaseStatus.AGUARDANDO_CONSOLIDACAO,
    allowedActors: ['ADMIN', 'OPERATOR'],
  },
  {
    from: PurchaseStatus.AGUARDANDO_CONSOLIDACAO,
    to: PurchaseStatus.CONSOLIDADO,
    allowedActors: ['SYSTEM', 'ADMIN'],
  },
  {
    from: PurchaseStatus.CADASTRADO,
    to: PurchaseStatus.CANCELADO,
    allowedActors: ['CLIENT'],
  },
  {
    from: PurchaseStatus.EM_TRANSITO_JP,
    to: PurchaseStatus.CANCELADO,
    allowedActors: ['CLIENT', 'ADMIN'],
  },
];

/**
 * Verifica se uma transição de status é permitida
 */
export function canTransition(
  from: PurchaseStatus,
  to: PurchaseStatus,
  actor: PurchaseActor,
): boolean {
  const transition = PURCHASE_STATE_TRANSITIONS.find(
    (t) => t.from === from && t.to === to,
  );

  if (!transition) {
    return false;
  }

  return transition.allowedActors.includes(actor);
}
