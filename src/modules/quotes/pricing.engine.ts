export type PricingInput = {
  items: {
    declaredValueJpy: number;
  }[];
  destinationState: string;
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

export function calculatePrice(
  input: PricingInput,
): PricingResult {
  // 1. Somar valor declarado dos itens (JPY)
  const totalDeclaredJpy = input.items.reduce(
    (sum, item) => sum + item.declaredValueJpy,
    0,
  );

  // 2. Câmbio provisório (fixo)
  const fxRateApplied = 1;

  // 3. Converter para BRL (por enquanto igual)
  const baseAmount = totalDeclaredJpy * fxRateApplied;
  // 3.1 Frete fixo provisório
  const freightAmount = 300;
  // 3.2 Parâmetros do Imposto de Importação (II)
  const usdExchangeRate = 150; // 1 USD = 150 JPY (provisório)
  const importTaxThresholdUsd = 50;
  const importTaxRate = 0.6; // 60%
  // 3.3 Converter valor declarado para USD
  const totalDeclaredUsd = totalDeclaredJpy / usdExchangeRate;

  // 3.4 Calcular Imposto de Importação (II)
  const importTaxAmount =
    totalDeclaredUsd > importTaxThresholdUsd
      ? totalDeclaredUsd * importTaxRate * fxRateApplied
      : 0;

  // 4. Retornar estrutura completa (demais valores zerados)
  return {
    freightAmount,
    importTaxAmount,
    icmsAmount: 0,
    adminFeeAmount: 0,
    riskBufferAmount: 0,
    totalAmount: baseAmount + freightAmount + importTaxAmount,
    fxRateApplied,
  };
}


