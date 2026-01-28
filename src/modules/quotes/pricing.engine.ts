import {
  PricingInput,
  PricingResult,
} from './pricing.types';

export function calculatePrice(
  input: PricingInput,
): PricingResult {
  // 1. Somar valor declarado dos itens (JPY)
  const totalDeclaredJpy = input.items.reduce(
    (sum, item) => sum + item.declaredValueJpy,
    0,
  );

  // 2. Câmbio efetivo (com spread)
  const fxRateBase = input.fx?.rateJpyBrl ?? 1;
  const fxSpread = input.fx?.spreadPercent ?? 0;
  const fxRateApplied = fxRateBase * (1 + fxSpread);

  // 3. Converter para BRL
  const baseAmount = totalDeclaredJpy * fxRateApplied;

  // 3.1 Frete fixo provisório
  const freightAmount = 300;

  // 3.2 Parâmetros do Imposto de Importação (II)
  const usdExchangeRate = 150; // provisório
  const importTaxThresholdUsd = 50;
  const importTaxRate = 0.6;

  // 3.3 Converter valor declarado para USD
  const totalDeclaredUsd = totalDeclaredJpy / usdExchangeRate;

  // 3.4 Calcular Imposto de Importação (II)
  const importTaxAmount =
    totalDeclaredUsd > importTaxThresholdUsd
      ? totalDeclaredUsd * importTaxRate * fxRateApplied
      : 0;

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
