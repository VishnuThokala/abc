const functions = require('firebase-functions');
const express = require('express');
const firebase = require('firebase');
const cors = require('cors');
const app = express();
app.use(cors({ origin: true }));

const { admin, db } = require('./utils/admin');
const config = require("./utils/config");
const userAuthRoute = require('./routes/userSignup');
const adminAuthRoute = require('./routes/adminSignup');
const adminAuthorisation = require('./utils/adminAuthorisation');
const userAuthorisation = require('./utils/userAuthorisation');
const userRoute = require('./routes/user');
const adminRoute = require('./routes/admin');
var sendVerificationEmail = require('./utils/emailUtil')

firebase.initializeApp(config);
const port = process.env.PORT || 3000;

app.use('/', userAuthRoute);
app.use('/', adminAuthRoute);
app.use('/user', userAuthorisation, userRoute);
app.use('/admin', adminAuthorisation, adminRoute);


app.get('/hi', (req, res) => {
    return res.status(200).json({ msg: 'hi its running!' });
});


app.post('/login', (req, res) => {
    console.log(req.body)
    var user;
    var email = String(req.body.email);
    var password = String(req.body.password);
    if (email.length < 4) {
        return res.status(500).json({ msg: 'Please enter an email address.' });

    }
    if (password.length < 4) {
        return res.status(500).json({ msg: 'Please enter a valid password.' });
    }
    firebase
        .auth()
        .signInWithEmailAndPassword(email, password)
        .then((data) => {
            user = data.user;
            return data.user.getIdToken();
        })
        .then((token) => {
            return res.json({ token, user });
        })
        .catch((error) => {
            console.error(error);
            return res.status(403).json('wrong credentials, please try again');
        })
    return null;
});

var actionCodeSettings = {
    url: 'https://localhost',
    iOS: {
        bundleId: 'com.example.ios'
    },
    android: {
        packageName: 'com.example.android',
        installApp: true,
        minimumVersion: '12'
    },
    handleCodeInApp: true,
    // When multiple custom dynamic link domains are defined, specify which
    // one to use.
    dynamicLinkDomain: "http://localhost:5000/webapp-92251/us-central1/app/forgotpassword"
};
app.get('/forgotpassword', (req, res) => {
    const email = 'vishnureddynani11@gmail.com';
    admin
        .auth()
        .generatePasswordResetLink(email, actionCodeSettings)
        .then((link) => {
            // Construct password reset email template, embed the link and send
            // using custom SMTP server.
            return sendVerificationEmail(email, displayName, link);
        })
        .catch((error) => {
            console.log(error)
            return res.status(403).json('You arent a existing user!' + error);
        });
})

// exports.app = functions.https.onRequest(app);
app.listen(port, (err) => {
    if (err) {
        console.log(err)
    }
    else {
        console.log("server running on port 3000")
    }
})
