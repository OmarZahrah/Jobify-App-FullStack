import "express-async-errors";
import * as dotenv from "dotenv";
import express from "express";
import morgan from "morgan";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import { dirname } from "path";
import { fileURLToPath } from "url";
import path from "path";
import cloudinary from "cloudinary";

// ROuters
import jobRouter from "./routes/jobRouter.js";
import userRouter from "./routes/userRouter.js";
import authRouter from "./routes/authRouter.js";

// Middlewares
import errorHandlerMiddleware from "./middleware/errorHandlerMiddleware.js";
import { authenticateUser } from "./middleware/authMiddleware.js";

dotenv.config();
const __dirname = dirname(fileURLToPath(import.meta.url));

const port = process.env.PORT || 3000;
const app = express();
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

app.use(cookieParser());
app.use(express.json());
app.use(express.static(path.resolve(__dirname, "./client/dist")));

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.get("/", (req, res) => {
  res.send("Hello World!");
});
app.get("/api/v1/test", (req, res) => {
  console.log(res.status);
  res.status(200).json({ msg: "test route" });
});

/////////////////////////////////////////////
/////////////////////////////////////////////
// Routers
/////////////////////////////////////////////
/////////////////////////////////////////////
app.use("/api/jobs", authenticateUser, jobRouter);

app.use("/api/users", authenticateUser, userRouter);

app.use("/api/auth", authRouter);

app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "./client/dist", "index.html"));
});

app.use("*", (req, res) => {
  res.status(404).json({ msg: "not found" });
});

/////////////////////////////////////////////
/////////////////////////////////////////////
// Middleware
/////////////////////////////////////////////
/////////////////////////////////////////////

app.use(errorHandlerMiddleware);

/////////////////////////////////////////////
/////////////////////////////////////////////
// Database
/////////////////////////////////////////////
/////////////////////////////////////////////
try {
  await mongoose.connect(process.env.MONGO_URL);
  app.listen(port, () => console.log(`Server running on port ${port}`));
} catch (error) {
  console.log(error);
  process.exit(1);
}
