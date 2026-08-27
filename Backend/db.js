const mongoose = require('mongoose');

const mongoURI = process.env.MONGO_URI;

const connectToMongo = async () => {
    try {
        await mongoose.connect(mongoURI, { serverSelectionTimeoutMS: 10000 });
        console.log("Connected to Mongo Successfully");
    } catch (err) {
        console.error("Failed to connect to MongoDB:", err.message);
        process.exit(1);
    }
}

module.exports = connectToMongo;