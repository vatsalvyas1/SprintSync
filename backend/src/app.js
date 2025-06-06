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
import formRouter from "./routes/form.routes.js";
import checklistRouter from "./routes/checklist.routes.js";
import errorHandler from "./middlewares/errorHandler.middleware.js";

app.use("/api/v1/user", userRouter);
app.use("/api/v1/form", formRouter);
app.use("/api/v1/checklist", checklistRouter);
app.use(errorHandler);

export default app;
