import { IsString, IsNumber, IsOptional, IsUUID } from 'class-validator';

export class CreatePurchaseDto {
  @IsUUID()
  userId: string;

  @IsString()
  storeName: string;

  @IsNumber()
  declaredValueJpy: number;

  @IsOptional()
  @IsString()
  productUrl?: string;

  @IsOptional()
  @IsString()
  productTitle?: string;

  @IsOptional()
  @IsString()
  jpTrackingCode?: string;
}
