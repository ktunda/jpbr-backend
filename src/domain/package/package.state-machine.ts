import { PackageStatus } from './package-status.enum';

/**
 * Quem pode executar a transição
 */
export type PackageActor =
  | 'CLIENT'
  | 'ADMIN'
  | 'OPERATOR'
  | 'SYSTEM';

/**
 * Definição de uma transição válida
 */
export interface PackageStateTransition {
  from: PackageStatus;
  to: PackageStatus;
  allowedActors: PackageActor[];
}

/**
 * Lista oficial de transições válidas do Package
 */
export const PACKAGE_STATE_TRANSITIONS: PackageStateTransition[] = [
  {
    from: PackageStatus.ABERTO,
    to: PackageStatus.AGUARDANDO_ESCOLHA_CLIENTE,
    allowedActors: ['SYSTEM', 'ADMIN'],
  },
  {
    from: PackageStatus.AGUARDANDO_ESCOLHA_CLIENTE,
    to: PackageStatus.CONSOLIDANDO,
    allowedActors: ['CLIENT'],
  },
  {
    from: PackageStatus.AGUARDANDO_ESCOLHA_CLIENTE,
    to: PackageStatus.PRONTO_PARA_PRECIFICAR,
    allowedActors: ['CLIENT'],
  },
  {
    from: PackageStatus.CONSOLIDANDO,
    to: PackageStatus.PRONTO_PARA_PRECIFICAR,
    allowedActors: ['ADMIN', 'OPERATOR'],
  },
  {
    from: PackageStatus.PRONTO_PARA_PRECIFICAR,
    to: PackageStatus.PRECIFICADO,
    allowedActors: ['SYSTEM', 'ADMIN'],
  },
  {
    from: PackageStatus.PRECIFICADO,
    to: PackageStatus.AGUARDANDO_PAGAMENTO,
    allowedActors: ['SYSTEM'],
  },
  {
    from: PackageStatus.AGUARDANDO_PAGAMENTO,
    to: PackageStatus.PAGO,
    allowedActors: ['SYSTEM'],
  },
  {
    from: PackageStatus.PAGO,
    to: PackageStatus.PRONTO_PARA_ENVIO,
    allowedActors: ['ADMIN', 'OPERATOR'],
  },
  {
    from: PackageStatus.PRONTO_PARA_ENVIO,
    to: PackageStatus.ENVIADO,
    allowedActors: ['ADMIN', 'OPERATOR'],
  },
  {
    from: PackageStatus.ENVIADO,
    to: PackageStatus.FINALIZADO,
    allowedActors: ['SYSTEM', 'ADMIN'],
  },
  {
    from: PackageStatus.ABERTO,
    to: PackageStatus.CANCELADO,
    allowedActors: ['CLIENT', 'ADMIN'],
  },
];
