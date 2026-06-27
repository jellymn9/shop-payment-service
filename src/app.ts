import express from "express";
import cors from "cors";
import orderRoutes from "./routes/order.routes";
import paypalRoutes from "./routes/paypal.routes";

const app = express();

app.use(
  cors({
    origin: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

app.use(express.json());
app.use("/paypal", paypalRoutes);
app.use("/orders", orderRoutes);

export default app;
