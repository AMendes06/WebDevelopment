const mongoose = require('mongoose');
require('dotenv').config();

const conectionDB = async ()=>{
    try {
       await mongoose.connect(process.env.MONGODB_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        })
        console.log('Database connected!');
    } catch (error) {
        const msg = "ERROR! Unable to connect to MongoDB!";
        console.log("\x1b[41m%s\x1b[37m", msg, "\x1b[0m");
    }
}
module.exports= conectionDB