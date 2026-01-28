import {
  PricingInput,
  PricingResult,
} from './pricing.types';

const ICMS_RATES: Record<string, number> = {
  AC: 0.19, AL: 0.19, AP: 0.18, AM: 0.20,
  BA: 0.205, CE: 0.20, DF: 0.20, ES: 0.17,
  GO: 0.19, MA: 0.23, MT: 0.17, MS: 0.17,
  MG: 0.18, PA: 0.19, PB: 0.20, PR: 0.195,
  PE: 0.205, PI: 0.225, RJ: 0.22, RN: 0.20,
  RS: 0.17, RO: 0.195, RR: 0.20, SC: 0.17,
  SP: 0.18, SE: 0.19, TO: 0.20,
};

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

  // 3.2 Imposto de Importação (II)
  const importTaxRate = 0.6;
  const importTaxAmount = declaredValueBrl * importTaxRate;

  // 3.3 ICMS por UF
  const icmsRate = ICMS_RATES[input.destinationState] ?? 0;
  const icmsBase = declaredValueBrl + freightAmount + importTaxAmount;
  const icmsAmount = icmsBase * icmsRate;

  return {
    freightAmount,
    importTaxAmount,
    icmsAmount,
    adminFeeAmount: 0,
    riskBufferAmount: 0,
    totalAmount:
      declaredValueBrl +
      freightAmount +
      importTaxAmount +
      icmsAmount,
    fxRateApplied,
  };
}
