import { calculateTotal } from "../utils/price.utils";

describe("calculateTotal", () => {
  it("calculates total for a single item", () => {
    expect(calculateTotal([{ productId: "1", name: "A", price: 10, quantity: 2 }])).toBe(20);
  });

  it("calculates total for multiple items", () => {
    expect(
      calculateTotal([
        { productId: "1", name: "A", price: 10, quantity: 2 },
        { productId: "2", name: "B", price: 5.5, quantity: 3 },
      ])
    ).toBe(36.5);
  });

  it("rounds to 2 decimal places", () => {
    expect(calculateTotal([{ productId: "1", name: "A", price: 0.1, quantity: 3 }])).toBe(0.3);
  });

  it("returns 0 for empty array", () => {
    expect(calculateTotal([])).toBe(0);
  });
});
