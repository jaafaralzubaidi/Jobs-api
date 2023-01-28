const mongoose = require("mongoose");

const connectDatabase = () => {
    mongoose.set('strictQuery', false);
    // mongoose.set('useNewUrlParser', true);
    // mongoose.set('useUnifiedTopology', true);
    // mongoose.set('useCreateIndex', true);
    
    mongoose.connect(process.env.DB_LOCAL_URL, {
        // useNewUrlParser: true,
        // useUnifiedTopology: true,
        // useCreateIndex: true
    }).then(con => {
        console.log(`Mongodb Database connected with host: ${con.connection.host}`);
    })
};


module.exports = connectDatabase;