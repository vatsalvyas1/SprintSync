import ApiError from "../utils/ApiError.js";

const errorHandler = (err, req, res, next) => {
    if (err instanceof ApiError) {
        return res.status(err.statusCode || 200).json({
            success: false,
            message: err.message || "Something Went Wrong",
            errors: err.errors || [],
        });
    }
    return res.status(200).json({
        success: false,
        message: "Internal Server Error",
    });
};

export default errorHandler;
