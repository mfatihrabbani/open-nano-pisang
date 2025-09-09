import express from "express";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import cors from "cors";
import dotenv from "dotenv";
import apiRoutes from "./routes/api";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API routes
app.use("/api", apiRoutes);

// Serve static files first
app.use(express.static(join(__dirname, "../spa")));

// Catch-all handler for SPA routing - this should be last
app.use((req, res) => {
  res.sendFile(join(__dirname, "../spa/index.html"));
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

export default app;
