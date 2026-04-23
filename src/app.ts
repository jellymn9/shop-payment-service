import express from "express";
import orderRoutes from "./routes/order.routes";
import paypalRoutes from "./routes/paypal.routes";

const app = express();

app.use("/paypal", paypalRoutes);

app.use(express.json());
app.use("/orders", orderRoutes);

export default app;
