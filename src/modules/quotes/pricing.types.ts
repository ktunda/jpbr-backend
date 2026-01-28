export type PricingItemInput = {
  declaredValueJpy: number;
  weightG?: number;
  dimensionsMm?: {
    l: number;
    w: number;
    h: number;
  };
};

export type PricingInput = {
  items: PricingItemInput[];
  destinationState: string;

  fx?: {
    rateJpyBrl: number;
    spreadPercent: number;
  };

  shipmentContext?: {
    senderType: 'PF' | 'PJ';
    receiverType: 'PF' | 'PJ';
    nature: 'COMMERCIAL' | 'NON_COMMERCIAL';
    allowIsencaoAte50: boolean;
  };
};

export type PricingResult = {
  freightAmount: number;
  importTaxAmount: number;
  icmsAmount: number;
  adminFeeAmount: number;
  riskBufferAmount: number;
  totalAmount: number;
  fxRateApplied: number;
};
