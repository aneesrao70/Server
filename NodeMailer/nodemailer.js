const nodemailer = require('nodemailer');

require('dotenv').config();
const emailHost = process.env.EMAIL_HOST;
const sender = process.env.EMAIL_HOST_USER;
const password = process.env.EMAIL_HOST_PASSWORD;



const sendEmail = async (email , text) => {
    try {
        const transporter = nodemailer.createTransport({
            service: emailHost,
            auth: {
                user: sender,
                pass: password
            }
        })
        await transporter.sendMail({
            from : sender,
            to : email,
            subject : 'Verify Your Email',
            text : text,
        })

        console.log('Verification email sent successfully')

    } catch(error) {
        console.log('email could not be sent', error)

    }
}

module.exports = sendEmail;