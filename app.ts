import express from "express";
import cookieParser from "cookie-parser";
import {
  authRouter,
  healthPostRouter,
  userRouter,
  locationRouter
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
  origin: [
    "https://healthpost.vercel.app",
    "http://localhost:3000",
    "https://www.healthsync.me",
    "http://10.10.2.134"
  ],
}));

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/healthpost", healthPostRouter);
app.use("/api/location", locationRouter);

app.use(errorHandler);
app.use(unknownEndpoint);

app.listen(port, () => {
  console.log(`Listining on port ${port}`);
});

export default app;
