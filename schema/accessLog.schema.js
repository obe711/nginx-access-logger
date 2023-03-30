const mongoose = require("mongoose");

const accessLogSchema = new mongoose.Schema({
    tsId: { type: String, unique: true },
    address: { type: String, },
    ts: { type: String, },
    method: { type: String, },
    host: { type: String, },
    hostname: { type: String, },
    request: { type: String, },
    requestUri: { type: String },
    uri: { type: String },
    status: { type: Number, },
    bytes: { type: Number, },
    referer: { type: String, },
    agent: { type: String, },
    args: { type: String },
    duration: {
        request: { type: Number, default: 0 },
        connect: { type: Number, default: 0 },
        header: { type: Number, default: 0 },
        response: { type: Number, default: 0 },
    }

}, { timestamps: true });

accessLogSchema.statics.log = function (logData) {
    return this.create(logData);
}

accessLogSchema.statics.check = async function (logData) {
    const { tsId } = logData;
    const logged = await this.findOne({ tsId });
    return !!logged;
}



module.exports = accessLogSchema;