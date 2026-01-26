import { QuoteStatus } from './quote-status.enum';

/**
 * Quem pode executar a transição
 */
export type QuoteActor =
  | 'CLIENT'
  | 'ADMIN'
  | 'SYSTEM';

/**
 * Definição de uma transição válida
 */
export interface QuoteStateTransition {
  from: QuoteStatus;
  to: QuoteStatus;
  allowedActors: QuoteActor[];
}

/**
 * Lista oficial de transições válidas do Quote
 */
export const QUOTE_STATE_TRANSITIONS: QuoteStateTransition[] = [
  {
    from: QuoteStatus.ATIVO,
    to: QuoteStatus.EXPIRADO,
    allowedActors: ['SYSTEM'],
  },
  {
    from: QuoteStatus.ATIVO,
    to: QuoteStatus.CANCELADO,
    allowedActors: ['ADMIN'],
  },
];
