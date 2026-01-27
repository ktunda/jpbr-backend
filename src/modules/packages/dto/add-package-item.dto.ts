import { IsUUID } from 'class-validator';

export class AddPackageItemDto {
  @IsUUID()
  purchaseId: string;
}
