import express from "express";
import cors from "cors";
import orderRoutes from "./routes/order.routes";
import paypalRoutes from "./routes/paypal.routes";

const app = express();

app.use(
  cors({
    origin: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

app.use("/paypal", paypalRoutes);

app.use(express.json());
app.use("/orders", orderRoutes);

//temporary route for testing
app.get("/debug-google", async (_req, res) => {
  try {
    const response = await fetch(
      "https://www.googleapis.com/robot/v1/metadata/x509/securetoken@system.gserviceaccount.com",
    );

    const text = await response.text();

    res.status(200).json({
      status: response.status,
      bodyStart: text.slice(0, 200),
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

export default app;
