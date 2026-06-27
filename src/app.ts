import express, { ErrorRequestHandler } from "express";
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

app.options(/(.*)/, cors());
app.use(express.json());
app.use("/paypal", paypalRoutes);
app.use("/orders", orderRoutes);

const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  res.header("Access-Control-Allow-Origin", req.headers.origin || "*");
  res
    .status(err.status || 500)
    .json({ message: err.message ?? "Internal server error" });
};

app.use(errorHandler);

export default app;
