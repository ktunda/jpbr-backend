import { IsString, IsNumber, IsOptional } from 'class-validator';

export class CreatePurchaseDto {
  @IsString()
  storeName: string;

  @IsOptional()
  @IsString()
  productUrl?: string;

  @IsOptional()
  @IsString()
  productTitle?: string;

  @IsNumber()
  declaredValueJpy: number;

  @IsString()
  jpTrackingCode: string;
}
