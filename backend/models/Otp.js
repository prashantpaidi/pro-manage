import { Mongoose } from "mongoose";

const otpSchema = new Mongoose.Schema({
    userId: { type: Mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    otp: { type: String, required: true },
    expiresAt: { type: Date, required: true }
});

export const Otp = Mongoose.model('Otp', otpSchema);