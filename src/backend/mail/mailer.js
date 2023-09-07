const nodemailer = require('nodemailer');
const { EMAIL_SERVICE, EMAIL_USER, EMAIL_PASS } = process.env;

const transporter = nodemailer.createTransport({
    service: EMAIL_SERVICE,
    auth: {
        user: EMAIL_USER,
        pass: EMAIL_PASS
    }
});

transporter.verify(function(error, success) {
    if (error) {
        console.log(error);
    } else {
        console.log('[OK] Email Server connected to smtp.gmail.com');
    }
});

function sendEmail(email, sub, text){
    const mailOptions = {
        from: EMAIL_USER,
        to: email,
        subject: sub,
        html: `${text}`
    };
    
    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
      }
    });
}

module.exports = {
    transporter,
    sendEmail
}