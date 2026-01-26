import { IsEnum } from 'class-validator';
import { PurchaseStatus } from '../../../domain/purchase/purchase-status.enum';
import { PurchaseActor } from '../../../domain/purchase/purchase.state-machine';

export class UpdatePurchaseStatusDto {
  @IsEnum(PurchaseStatus)
  toStatus: PurchaseStatus;

  @IsEnum(['CLIENT', 'ADMIN', 'OPERATOR', 'SYSTEM'])
  actor: PurchaseActor;
}
