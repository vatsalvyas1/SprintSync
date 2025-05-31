import dotenv from "dotenv";
import app from "./app.js";
import connectDB from "./db/index.js";

dotenv.config({
    path: "../env",
});

const startServer = async () => {
    try {
        await connectDB();
        app.listen(process.env.PORT || 8000, () => {
            console.log(
                `Server Started Successfully at Port : ${process.env.PORT}`
            );
        });
    } catch (error) {
        console.log("Server Connection Failed ", error);
    }
};

startServer();
