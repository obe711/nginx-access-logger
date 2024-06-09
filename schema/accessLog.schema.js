const mongoose = require("mongoose");
const config = require("../config/config");

const accessLogSchema = new mongoose.Schema({
    tsId: { type: String },
    address: { type: String, },
    ts: { type: String, },
    method: { type: String, },
    host: { type: String, },
    hostname: { type: String, },
    request: { type: String, },
    requestUri: { type: String },
    uri: { type: String },
    status: { type: String, },
    bytes: { type: String, },
    referer: { type: String, },
    agent: { type: String, },
    args: { type: String },
    duration: {
        request: { type: String, default: "0" },
        connect: { type: String, default: "0" },
        header: { type: String, default: "0" },
        response: { type: String, default: "0" },
    },
    expireAt: {
        type: Date,
        default: Date.now,
    }
}, { timestamps: true });

accessLogSchema.index({ expireAt: 1 }, { expires: 10 });

accessLogSchema.statics.log = function (logData) {
    const expireAtDate = new Date();
    expireAtDate.setDate(expireAtDate.getDate() + config.mongoose.expireInDays);
    Object.assign(logData, { expireAt: expireAtDate.toISOString().split("T")[0] })
    return this.create(logData);
}

accessLogSchema.statics.check = async function (logData) {
    const { tsId } = logData;
    const logged = await this.findOne({ tsId });
    return !!logged;
}



module.exports = accessLogSchema;