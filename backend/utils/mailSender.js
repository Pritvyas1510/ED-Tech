const nodemailer = require('nodemailer');

const mailSender = async (email, title, body) => {
    try {
        // Mailtrap SMTP configuration
        const transporter = nodemailer.createTransport({
            host: 'smtp.mailtrap.io',
            port: 587, // or 2525, check Mailtrap for specifics
            auth: {
                user: "f6743b14472383",  // your Mailtrap username
                pass: "69cb95346855c8"   // your Mailtrap password
            }
        });

        const info = await transporter.sendMail({
            from: 'StudyNotion || by Aniruddha Gade',
            to: email,
            subject: title,
            html: body
        });

        return info;
    }
    catch (error) {
        console.log('Error while sending mail (mailSender) - ', email);
        console.error(error);
    }
}

module.exports = mailSender;
