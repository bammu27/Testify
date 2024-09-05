const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

function connectDB() {

    mongoose.connect(process.env.MONGO_URL).then(() => {
        
        console.log('DB Connected');
        
    }
    ).catch((err) => {
            
            console.log('Error: ', err.message);
    });

}

module.exports = connectDB;