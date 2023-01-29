const ErrorHandler = require("../utils/errorHandler");

module.exports = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    // Development 
    if (process.env.NODE_ENV === "development") {
        res.status(err.statusCode).json({
            success: false,
            error: err,
            errMessage: err.message,
            stack: err.stack
        });
    }

    // Production
    if (process.env.NODE_ENV === "production") {
        console.log(process.env.NODE_ENV)

        let error = { ...err };
        console.log("here 1")
        error.message = err.message;

        //Wrong Mongoose Object ID Error
        if (err.name === 'CastError') {
            const message = `Resource not found. Invalid: ${err.path}`;
            error = new ErrorHandler(message, 404);
        }
        // Handling Mongoose ValidationError // error {errors: { message: , ...}, ....}
        if (err.name === 'ValidationError') {
            const message = Object.values(err.errors).map(value => value.message);
            error = new ErrorHandler(message, 404);
        }
        console.log(error.statusCode)

        res.status(error.statusCode).json({
            success: false,
            message: error.message || "Internal Server Error."
        })

    }

}