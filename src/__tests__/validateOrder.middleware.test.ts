import { Request, Response, NextFunction } from "express";
import { validateOrder } from "../middleware/validateOrder.middleware";

const mockRes = () => {
  const res = {} as Response;
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

const validItem = { productId: "1", name: "Product", price: 10, quantity: 2 };

describe("validateOrder middleware", () => {
  it("calls next() for a valid cart", () => {
    const req = { body: { items: [validItem] } } as Request;
    const res = mockRes();
    const next = jest.fn() as NextFunction;

    validateOrder(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
  });

  it("returns 400 when items is missing", () => {
    const req = { body: {} } as Request;
    const res = mockRes();
    const next = jest.fn() as NextFunction;

    validateOrder(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: "Cart is empty" });
    expect(next).not.toHaveBeenCalled();
  });

  it("returns 400 when items is empty array", () => {
    const req = { body: { items: [] } } as Request;
    const res = mockRes();
    const next = jest.fn() as NextFunction;

    validateOrder(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: "Cart is empty" });
  });

  it("returns 400 when item is missing productId", () => {
    const req = { body: { items: [{ ...validItem, productId: "" }] } } as Request;
    const res = mockRes();
    const next = jest.fn() as NextFunction;

    validateOrder(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: "Each item must have a productId and name" });
  });

  it("returns 400 when item price is 0", () => {
    const req = { body: { items: [{ ...validItem, price: 0 }] } } as Request;
    const res = mockRes();
    const next = jest.fn() as NextFunction;

    validateOrder(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: `Invalid price for item: ${validItem.name}` });
  });

  it("returns 400 when item quantity is not an integer", () => {
    const req = { body: { items: [{ ...validItem, quantity: 1.5 }] } } as Request;
    const res = mockRes();
    const next = jest.fn() as NextFunction;

    validateOrder(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: `Invalid quantity for item: ${validItem.name}` });
  });

  it("returns 400 when item quantity is 0", () => {
    const req = { body: { items: [{ ...validItem, quantity: 0 }] } } as Request;
    const res = mockRes();
    const next = jest.fn() as NextFunction;

    validateOrder(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: `Invalid quantity for item: ${validItem.name}` });
  });
});
