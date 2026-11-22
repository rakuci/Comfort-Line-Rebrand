// One-way BYN tariffs set on 2026-11-22. TransferMinsk city-to-city class
// benchmarks less EUR 1, converted once at 3.2913 BYN/EUR. Empty = quote only.
// Class order matches the labels below. Airport pages reuse the matching city fares.
export const routeFares: Record<string, { outbound: number[]; inbound: number[] } | undefined> = {
  "/minsk-vilnius-transfer": {
    outbound: [819.53, 984.10, 1313.23, 1806.92, 1313.23, 1642.36],
    inbound: [819.53, 984.10, 1313.23, 1806.92, 1313.23, 1642.36],
  },
  "/minsk-kaunas-transfer": {
    outbound: [786.62, 984.10, 1313.23, 1806.92, 1148.66, 1642.36],
    inbound: [786.62, 984.10, 1313.23, 1806.92, 1148.66, 1642.36],
  },
  "/minsk-klaipeda-transfer": {
    outbound: [1148.66, 1313.23, 1642.36, 2136.05, 1477.79, 1971.49],
    inbound: [1148.66, 1313.23, 1642.36, 2136.05, 1477.79, 1971.49],
  },
  "/riga-transfer": {
    outbound: [1148.66, 1477.79, 1806.92, 2136.05, 1642.36, 2136.05],
    inbound: [1148.66, 1477.79, 1806.92, 2136.05, 1642.36, 2136.05],
  },
  "/minsk-daugavpils-transfer": {
    outbound: [819.53, 984.10, 1313.23, 1971.49, 984.10, 1477.79],
    inbound: [819.53, 984.10, 1313.23, 1971.49, 984.10, 1477.79],
  },
  "/warsaw-transfer": {
    outbound: [1313.23, 1642.36, 2136.05, 2629.75, 1806.92, 2300.62],
    inbound: [1313.23, 1642.36, 2136.05, 2629.75, 1806.92, 2300.62],
  },
  "/minsk-krakow-transfer": {
    outbound: [2300.62, 2794.31, 2794.31, 3781.70, 2958.88, 2958.88],
    inbound: [1971.49, 2300.62, 2794.31, 3781.70, 2300.62, 2958.88],
  },
  "/minsk-gdansk-transfer": {
    outbound: [1971.49, 2300.62, 2794.31, 3781.70, 2300.62, 2958.88],
    inbound: [1971.49, 2300.62, 2794.31, 3781.70, 2300.62, 2958.88],
  },
  "/minsk-lodz-transfer": {
    outbound: [1477.79, 1806.92, 2300.62, 3123.44, 1806.92, 2465.18],
    inbound: [1477.79, 1806.92, 2300.62, 3123.44, 1806.92, 2465.18],
  },
  "/minsk-poznan-transfer": {
    outbound: [2136.05, 2465.18, 2958.88, 3946.27, 2465.18, 3123.44],
    inbound: [2136.05, 2465.18, 2958.88, 3946.27, 2465.18, 3123.44],
  },
  "/berlin-transfer": {
    outbound: [2958.88, 3617.14, 4604.53, 6579.31, 3288.01, 4275.40],
    inbound: [2958.88, 3617.14, 4604.53, 6579.31, 3288.01, 4275.40],
  },
  "/prague-transfer": {
    outbound: [3288.01, 3946.27, 5098.22, 7237.57, 3946.27, 4933.66],
    inbound: [3288.01, 3946.27, 5098.22, 7237.57, 3946.27, 4933.66],
  },
};

export const fareClasses = {
  ru: ["Эконом", "Комфорт", "Бизнес", "VIP", "Минивэн Комфорт", "Минивэн Бизнес"],
  en: ["Economy", "Comfort", "Business", "VIP", "Comfort minivan", "Business minivan"],
};

// Recover the whole-euro reference used when setting these BYN fares.
export function referenceEuros(byn: number): number {
  return Math.round(byn / 3.2913);
}
