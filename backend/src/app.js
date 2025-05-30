import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

app.use(
    cors({
        origin: process.env.CORS_ORIGIN,
        credentials: true,
    })
);

app.use(
    express.json({
        limit: "16kb",
    })
);

app.use(cookieParser());

import userRouter from "./routes/user.routes.js";
import errorHandler from "./middlewares/errorHandler.middleware.js";

app.use("/api/v1/user", userRouter);

app.use(errorHandler);

export default app;
