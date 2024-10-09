const generator = require('otp-generator');
const connection = require('../Config/database');
const accountSid = 'ACf4f2d7b0181a5b5a0ed08490feb3cc70';
const authToken = '3b6bbb79bd607c3f7ac343c65cd07184';
const client = require('twilio')(accountSid, authToken);

async function generateOTP(req, res, next) {  
    const connectionPool = await connection.getConnection();
    const{email,phone} = req.body;   

    if (!email || !phone) {
        return res.status(400).json({
            success: false,
            message: "All fields are Required",
        });
    } 

    const emailotp = generator.generate(6, {
        upperCaseAlphabets: false,
        lowerCaseAlphabets: false,
        specialChars: false,
    });

    const phoneotp = generator.generate(6, {
        upperCaseAlphabets: false,
        lowerCaseAlphabets: false,
        specialChars: false,
    });
    
    

    client.verify.v2.services("VA47eefd23ee4cfc18a869c8ae80dcebe3")
        .verifications
        .create({to: `+91${phone}`, channel: 'sms'})
        .then(verification => console.log(verification.sid));

    
}