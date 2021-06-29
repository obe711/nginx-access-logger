const mongoose = require('mongoose');

module.exports = async function DBconnect(MONGO_DB = null) {
    try {
        await mongoose.connect(MONGO_DB || "mongodb://localhost:27017/forgeApi", {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
            useFindAndModify: false,
            autoIndex: false, // Don't build indexes
            poolSize: 10, // Maintain up to 10 socket connections
            serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
            socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
            family: 4 // Use IPv4, skip trying IPv6
        });

        console.log(`Connected to ${process.env.NODE_ENV} ForgeAPI MongoDB`);

        const Access = await mongoose.model("Access", require('../schema/accessLog.schema'));

        return {
            Access
        }

    } catch (err) {
        console.log("DB error", err);
    }

};