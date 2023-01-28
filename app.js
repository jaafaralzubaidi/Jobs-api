const express = require('express');
const app = express();
const dotenv = require('dotenv')
const connectDatabase = require('./config/database')
const errorMiddleware = require('./middlewares/errors')

//setting up config.env file variables
dotenv.config({ path: './config/config.env' });

//Connecting to DB
connectDatabase();

// set up body parser
app.use(express.json())


//Importing all routes
const jobs = require('./routes/jobs');


app.use('/api/v1', jobs);


//Middleware to handle errors
app.use(errorMiddleware);




const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`server is running on port ${process.env.PORT} in ${process.env.NODE_ENV}`)
});