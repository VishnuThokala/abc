const nodemailer = require('nodemailer')
module.exports = function sendVerificationEmail(email,displayName, link) {
    var smtpConfig = {
        host: 'smtp.gmail.com',
        port: 465,
        secure: true, // use SSL
        auth: {
            user: 'yourwebdairy@gmail.com',
            pass: 'usingnamespaceVishnu'
        }
    };
    var transporter = nodemailer.createTransport(smtpConfig);
    var mailOptions = {
        from: "yourwebdairy@gmail.com", // sender address
        to: email, // list of receivers
        subject: "Email verification", // Subject line
        text: " Hi "+displayName+"Email verification, press here to verify your email: " + link,
        html: "<b>Hello there  ,<br> click <a href=" + link + "> here to verify</a></b>" // html body
    };
    transporter.sendMail(mailOptions, (error, response) => {
        if (error) {
            console.log(error);
            return error;
        } else {
            console.log("Message sent: " + response);
            return response;

        }
        // if you don't want to use this transport object anymore, uncomment following line
        //smtpTransport.close(); // shut down the connection pool, no more messages
    });
}