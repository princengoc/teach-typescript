// Task 1: every item costs 7.
export function price(items: number): number {
  return items * 7;
}

// Task 2: delivery is a flat 4 on top.
export function priceWithDelivery(items: number): number {
  return price(items) + 4;
}
