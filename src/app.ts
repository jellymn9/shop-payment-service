import express from "express";
import cors from "cors";
import orderRoutes from "./routes/order.routes";
import paypalRoutes from "./routes/paypal.routes";

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

app.use("/paypal", paypalRoutes);

app.use(express.json());
app.use("/orders", orderRoutes);

export default app;
