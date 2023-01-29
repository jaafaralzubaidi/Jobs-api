const express = require('express');
const app = express();
const dotenv = require('dotenv')
const connectDatabase = require('./config/database')
const errorMiddleware = require('./middlewares/errors')
const ErrorHandler = require('./utils/errorHandler')

//setting up config.env file variables
dotenv.config({ path: './config/config.env' });

// Handling Uncaught Exception (at the top to catch all)
process.on('uncaughtException', err => {
    console.log(`ERROR: ${err.message}`);
    console.log("Shutting down due to uncaught exception");
    process.exit(1);
});

//Connecting to DB
connectDatabase();

// set up body parser
app.use(express.json())


//Importing all routes
const jobs = require('./routes/jobs');
app.use('/api/v1', jobs);

// Handling unhandled routes (after all defined routes)
app.all('*', (req, res, next) => {
    next(new ErrorHandler(`${req.originalUrl} route not found`, 404));
})

//Middleware to handle errors
app.use(errorMiddleware);




const PORT = process.env.PORT;
const server = app.listen(PORT, () => {
    console.log(`server is running on port ${process.env.PORT} in ${process.env.NODE_ENV}`)
});

// Handling unhandled Promise rejection
process.on('unhandledRejection', err => {
    console.log(`Error: ${err.message}.`);
    console.log("Shutting down the server due to unhandled promise rejection.");
    server.close( () => {
        process.exit(1);
    })
});

