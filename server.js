// server.js
import dotenv from "dotenv";
import app from "./app.js";
import connectDB from "./utils/connection.js";

dotenv.config();

// Validate environment variables
const requiredEnvVars = ["NODE_ENV", "MONGO_URI", "PORT"];
const missingEnvVars = requiredEnvVars.filter(
  (varName) => !process.env[varName]
);
if (missingEnvVars.length > 0) {
  console.error(`Missing environment variables: ${missingEnvVars.join(", ")}`);
  process.exit(1);
}

(async () => {
  await connectDB();

  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
})();

export default app;
