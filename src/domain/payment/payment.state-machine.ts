import { PaymentStatus } from './payment-status.enum';

/**
 * Quem pode executar a transição
 */
export type PaymentActor =
  | 'CLIENT'
  | 'ADMIN'
  | 'SYSTEM';

/**
 * Definição de uma transição válida
 */
export interface PaymentStateTransition {
  from: PaymentStatus;
  to: PaymentStatus;
  allowedActors: PaymentActor[];
}

/**
 * Lista oficial de transições válidas do Payment
 */
export const PAYMENT_STATE_TRANSITIONS: PaymentStateTransition[] = [
  {
    from: PaymentStatus.CRIADO,
    to: PaymentStatus.PENDENTE,
    allowedActors: ['SYSTEM'],
  },
  {
    from: PaymentStatus.PENDENTE,
    to: PaymentStatus.CONFIRMADO,
    allowedActors: ['SYSTEM'],
  },
  {
    from: PaymentStatus.PENDENTE,
    to: PaymentStatus.FALHOU,
    allowedActors: ['SYSTEM'],
  },
  {
    from: PaymentStatus.PENDENTE,
    to: PaymentStatus.EXPIRADO,
    allowedActors: ['SYSTEM'],
  },
  {
    from: PaymentStatus.CRIADO,
    to: PaymentStatus.CANCELADO,
    allowedActors: ['CLIENT', 'ADMIN'],
  },
];
