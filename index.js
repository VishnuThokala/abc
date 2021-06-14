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
// var uploadFile = require('./utils/uploadFile')
firebase.initializeApp(config);

const port = process.env.PORT || 8000;





app.use('/', userAuthRoute);
app.use('/', adminAuthRoute);
app.use('/user', userAuthorisation, userRoute);
app.use('/admin', adminAuthorisation, adminRoute);


app.get('/', (req, res) => {
    return res.status(200).json({ msg: 'hi its running!' });
});


app.post('/login', (req, res) => {
    var email = String(req.body.email);
    var password = String(req.body.password);
    if (email.length < 4) {
        return res.status(403).json({ msg: 'Please enter an email address.' });

    }
    if (password.length < 4) {
        return res.status(403).json({ msg: 'Please enter a valid password.' });
    }
    firebase
        .auth()
        .signInWithEmailAndPassword(email, password)
        .then((data, error) => {
            if (error) {
                return res.status(403).json({ 'msg': error.message });
                
            }
            else {
                user = data.user;
                return data.user.getIdToken();
            }
        },
        )
        .then((token) => {
             admin
                .auth()
                .getUser(user.uid)
                 .then((userRecord) => {
                     console.log(userRecord.toJSON())
                     return res.status(200).json({ token, 'customClaims': userRecord.customClaims, 'user': userRecord});
                })
                .catch((error) => {
                    return res.status(403).json({ 'msg':  error.message});
                });
            
        })
        .catch((error) => {
            console.error(error);
            return res.status(403).json({ 'msg': error.message });
        })
    return null;
});

app.get('/logout', (req, res) => {
    console.log("called logout")
    firebase.auth().signOut().then(() => {
        return res.status(200).json("successfully loggedout")
    }).catch((error) => {
        return res.status(403).json(error)
    });
})

app.post('/editProfile', (req, res) => {
    admin
        .auth()
        .updateUser(req.body.uid, {
            email: req.body.email,
            phoneNumber:req.body.phoneNumber,
            // emailVerified: false,
            // password: 'newPassword',
            displayName: req.body.displayName,
            photoURL: req.body.photoURL,
            disabled: false,
        })
        .then((userRecord) => {
            
            return res.status(200).json({ 'user': userRecord });

        })
        .catch((error) => {
            console.log('Error updating user:', error);
            return res.status(403).json({ 'msg': error});

        });
})



// app.post('/updateFile', (req, res) => {
//     var url = uploadFile(req.body.file);
//     console.log(url);
//     admin
//         .auth()
//         .updateUser(req.body.uid, {
//             photoURL: req.body.photoURL,
//         })
//         .then((userRecord) => {
            
//             return res.status(200).json({ 'user': userRecord });

//         })
//         .catch((error) => {
//             console.log('Error updating user:', error);
//             return res.status(403).json({ 'msg': error});

//         });
// })

app.post('/forgotPassword', (req, res) => {
    var email = req.body.email;
    firebase.auth().sendPasswordResetEmail(email)
        .then((data) => {
            return res.status(200).send({'msg':data})
        })
        .catch((error) => {
            return res.status(403).send({ 'msg': error})

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
