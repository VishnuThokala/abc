const functions = require('firebase-functions');
const express = require('express');
const firebase = require('firebase');
const cors = require('cors');
const app = express();
const bodyParser = require('body-parser');
app.use(cors({ origin: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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


app.get('/logout', (req, res) => {
    console.log("called logout")
    firebase.auth().signOut().then(() => {
        return res.status(200).json("successfully loggedout")
    }).catch((error) => {
        return res.status(500).json(error)
    });
})


app.use('/', userAuthRoute);
app.use('/', adminAuthRoute);
app.use('/user', userAuthorisation, userRoute);
app.use('/admin', adminAuthorisation, adminRoute);


app.get('/', (req, res) => {
    console.log("hiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiii")
    return res.status(200).json({ msg: 'hi its running!' });
});


app.post('/login', (req, res) => {
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
             admin
                .auth()
                .getUser(user.uid)
                .then((userRecord) => {
                    return res.status(200).json({ token,'user': userRecord });
                })
                .catch((error) => {
                    return res.status(403).json('wrong credentials, please try again'+error);
                });
            
        })
        .catch((error) => {
            console.error(error);
            return res.status(403).json('wrong credentials, please try again');
        })
    return null;
});

app.post('/editProfile', (req, res) => {
    const uid = "8YzXxMknBwcYtfPqQLh37Mgcdd53";
    console.log(req.body);
    admin
        .auth()
        .updateUser(uid, {
            email: req.body.email,
            phoneNumber: req.body.phoneNumber,
            emailVerified: false,
            // password: 'newPassword',
            displayName: req.body.displayName,
            photoURL: 'http://www.example.com/12345678/photo.png',
            disabled: false,
        })
        .then((userRecord) => {
            // See the UserRecord reference doc for the contents of userRecord.
            console.log('Successfully updated user', userRecord.toJSON());

            return res.status(200).json({ 'user': userRecord });

        })
        .catch((error) => {
            console.log('Error updating user:', error);
            return res.status(403).json('wrong credentials, please try again' + error);

        });
})

// exports.app = functions.https.onRequest(app);
app.listen(port, (err) => {
    if (err) {
        console.log(err)
    }
    else {
        console.log("server running on "+port)
    }
})
