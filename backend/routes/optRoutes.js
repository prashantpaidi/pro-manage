const Otp = require('../models/Otp');

const verifynumber = async(req, res) => {
    // Logic to verify OTP

    let number = req.body.number;
    // palaceholder logic for sending OTP

    let otp = Math.random(); 
    
    
    try {
        Otp.create({
            userId: req.body.userId,
            otp: otp,
            expiresAt: new Date(Date.now() + 20 * 60 * 1000) // OTP valid for 20 minutes
        });

        await Otp.save();
    } catch (error) {  
        return res.status(500).send('Error generating OTP');
    }

    res.send(`OTP sent to number: ${number}`);
    
}

const validateOtp = (req, res) => {
    // Logic to validate OTP
    let { userId, otp } = req.body;

    const otpData  = Otp.findOne({ userId: userId, otp: otp });

    if (!otpData) {
        return res.status(400).send('Invalid OTP');
    }

    if (otpData.expiresAt < new Date()) {
        return res.status(400).send('OTP has expired');
    }

    res.send('OTP validated successfully');
}