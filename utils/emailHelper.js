const nodemailer = require('nodemailer')

const emailHelper = async (mailOptions) => {
    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS
        }
    });

    //options
    const option = {
        from: '"dev" <devmode@gmail.com>', // sender address
        to: mailOptions.email, // list of receivers
        subject: mailOptions.subject, // Subject line
        text: mailOptions.message, // plain text body
    }
    // send mail with defined transport object
    const info = await transporter.sendMail(option);

    return info
}

module.exports = emailHelper