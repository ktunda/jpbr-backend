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
  const declaredValueBrl = totalDeclaredJpy * fxRateApplied;

  // 3.1 Frete fixo provisório
  const freightAmount = 300;

  // 3.2 Imposto de Importação (II) — sempre calculado
  const importTaxRate = 0.6;
  const importTaxAmount = declaredValueBrl * importTaxRate;

  return {
    freightAmount,
    importTaxAmount,
    icmsAmount: 0,
    adminFeeAmount: 0,
    riskBufferAmount: 0,
    totalAmount: declaredValueBrl + freightAmount + importTaxAmount,
    fxRateApplied,
  };
}
