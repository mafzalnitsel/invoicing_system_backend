// app.js
import express, { json } from "express";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import hpp from "hpp";
import compression from "compression";
import dotenv from "dotenv";

// import cacheMiddleware from "./middlewares/cache.js";
import errorHandler from "./middlewares/errorHandler.js";
import routes from "./routes/index.js";

dotenv.config();

const app = express();

// Middleware
app.use(cors({ origin: "*", credentials: true }));
app.use(json());
app.use(morgan("dev"));
app.use(helmet());
app.use(hpp());
app.use(compression());

// Cache
// app.use("/api", cacheMiddleware);

// Routes
app.use("/api", routes);

// Root endpoint
app.get("/", (req, res) => {
  res.send(
    `API is running... - ${
      process.env.NODE_ENV === "development" ? "Dev" : "Prod"
    }`
  );
});

// Error handler
app.use(errorHandler);

export default app;
