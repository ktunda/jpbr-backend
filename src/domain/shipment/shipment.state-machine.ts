import { ShipmentStatus } from './shipment-status.enum';

/**
 * Quem pode executar a transição
 */
export type ShipmentActor =
  | 'ADMIN'
  | 'OPERATOR'
  | 'SYSTEM';

/**
 * Definição de uma transição válida
 */
export interface ShipmentStateTransition {
  from: ShipmentStatus;
  to: ShipmentStatus;
  allowedActors: ShipmentActor[];
}

/**
 * Lista oficial de transições válidas do Shipment
 */
export const SHIPMENT_STATE_TRANSITIONS: ShipmentStateTransition[] = [
  {
    from: ShipmentStatus.CRIADO,
    to: ShipmentStatus.COLETADO,
    allowedActors: ['ADMIN', 'OPERATOR'],
  },
  {
    from: ShipmentStatus.COLETADO,
    to: ShipmentStatus.EM_TRANSITO,
    allowedActors: ['SYSTEM'],
  },
  {
    from: ShipmentStatus.EM_TRANSITO,
    to: ShipmentStatus.EM_EXCECAO,
    allowedActors: ['SYSTEM'],
  },
  {
    from: ShipmentStatus.EM_EXCECAO,
    to: ShipmentStatus.EM_TRANSITO,
    allowedActors: ['ADMIN', 'OPERATOR'],
  },
  {
    from: ShipmentStatus.EM_TRANSITO,
    to: ShipmentStatus.ENTREGUE,
    allowedActors: ['SYSTEM'],
  },
  {
    from: ShipmentStatus.CRIADO,
    to: ShipmentStatus.CANCELADO,
    allowedActors: ['ADMIN'],
  },
];
