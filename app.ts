import express from "express";
import cookieParser from "cookie-parser";
import {
  authRouter,
  healthPostRouter,
} from "@app/src/routes/index.route";
import {
  errorHandler,
  unknownEndpoint,
} from "@app/utils/index.utils";
import { CONFIG } from "./utils/config.utils";
import cors from "cors";

const port = CONFIG.PORT || 3000;

const app = express();

app.use(cors({
  credentials: true,
  origin: ["https://healthpost.vercel.app", "http://localhost:3000", "https://www.healthsync.me"],
}));

app.use(cookieParser());
app.use(express.json());

app.use("/api/auth", authRouter);
app.use("/api/healthpost", healthPostRouter);

app.use(errorHandler);
app.use(unknownEndpoint);

app.listen(port, () => {
  console.log(`Listining on port ${port}`);
});

export default app;
