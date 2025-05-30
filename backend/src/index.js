import 'dotenv/config';
import dotenv from "dotenv";
import connectDB from "./config/db.js";

dotenv.config(
    {path : "../.env"}
);

connectDB();   