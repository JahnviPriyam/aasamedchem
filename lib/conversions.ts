export function convertToBaseUnit(
  quantity: number,
  unit: string
) {
  switch (unit) {
    case "kg":
      return quantity * 1000;

    case "g":
      return quantity;

    case "L":
      return quantity * 1000;

    case "mL":
      return quantity;

    case "item":
      return quantity;

    default:
      return quantity;
  }
}

export function getBaseUnit(unit: string) {
  if (unit === "kg" || unit === "g") {
    return "g";
  }

  if (unit === "L" || unit === "mL") {
    return "mL";
  }

  return "item";
}

export function calculatePrice(
  convertedQuantity: number,
  pricePerBaseUnit: number
) {
  return convertedQuantity * pricePerBaseUnit;
}