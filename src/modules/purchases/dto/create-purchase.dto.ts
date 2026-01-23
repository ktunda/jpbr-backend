export class CreatePurchaseDto {
  storeName: string;
  productUrl?: string;
  productTitle?: string;
  declaredValueJpy: number;
  jpTrackingCode: string;
}
