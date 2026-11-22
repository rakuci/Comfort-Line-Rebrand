// One-way EUR reference fares per vehicle.
// Class order matches the labels below. Airport pages reuse the matching city fares.
export const routeFares: Record<string, { outbound: number[]; inbound: number[] } | undefined> = {
  "/minsk-vilnius-transfer": {
    outbound: [249, 299, 399, 549, 399, 499],
    inbound: [249, 299, 399, 549, 399, 499],
  },
  "/minsk-kaunas-transfer": {
    outbound: [239, 299, 399, 549, 349, 499],
    inbound: [239, 299, 399, 549, 349, 499],
  },
  "/minsk-klaipeda-transfer": {
    outbound: [349, 399, 499, 649, 449, 599],
    inbound: [349, 399, 499, 649, 449, 599],
  },
  "/riga-transfer": {
    outbound: [349, 449, 549, 649, 499, 649],
    inbound: [349, 449, 549, 649, 499, 649],
  },
  "/minsk-daugavpils-transfer": {
    outbound: [249, 299, 399, 599, 299, 449],
    inbound: [249, 299, 399, 599, 299, 449],
  },
  "/warsaw-transfer": {
    outbound: [399, 499, 649, 799, 549, 699],
    inbound: [399, 499, 649, 799, 549, 699],
  },
  "/minsk-krakow-transfer": {
    outbound: [699, 849, 849, 1149, 899, 899],
    inbound: [599, 699, 849, 1149, 699, 899],
  },
  "/minsk-gdansk-transfer": {
    outbound: [599, 699, 849, 1149, 699, 899],
    inbound: [599, 699, 849, 1149, 699, 899],
  },
  "/minsk-lodz-transfer": {
    outbound: [449, 549, 699, 949, 549, 749],
    inbound: [449, 549, 699, 949, 549, 749],
  },
  "/minsk-poznan-transfer": {
    outbound: [649, 749, 899, 1199, 749, 949],
    inbound: [649, 749, 899, 1199, 749, 949],
  },
  "/berlin-transfer": {
    outbound: [899, 1099, 1399, 1999, 999, 1299],
    inbound: [899, 1099, 1399, 1999, 999, 1299],
  },
  "/prague-transfer": {
    outbound: [999, 1199, 1549, 2199, 1199, 1499],
    inbound: [999, 1199, 1549, 2199, 1199, 1499],
  },
};

export const fareClasses = {
  ru: ["Эконом", "Комфорт", "Бизнес", "VIP", "Минивэн Комфорт", "Минивэн Бизнес"],
  en: ["Economy", "Comfort", "Business", "VIP", "Comfort minivan", "Business minivan"],
};

export function roundedByn(eur: number, bynPerEur: number): number {
  // NBRB quotes EUR to four decimal places. Use integer units at the ceiling boundary.
  return Math.ceil(eur * Math.round(bynPerEur * 10000) / 100000) * 10;
}
