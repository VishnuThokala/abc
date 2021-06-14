const functions = require('firebase-functions');
var firebase = require('firebase')
var express = require('express')
var router = express.Router();
var sendVerificationEmail = require('../utils/emailUtil')
const { admin, db } = require('../utils/admin')

// var uploadFile = require('../utils/upload');



router.post("/userSignup", (req, res) => {
  
  admin
    .auth()
    .createUser({
      email: String(req.body.email),
      phoneNumber: "+91"+String(req.body.phone),
      password:String(req.body.password),
      displayName: String(req.body.username),
      photoURL: 'http://www.example.com/12345678/photo.png',
    })
    .then((userRecord) => {
      admin.auth().setCustomUserClaims(userRecord.uid, { user: true }).then((token) => {
        // console.log(token)
        return res.status(200).json({ 'user': userRecord, token });
        })
        .catch((error) => {
          return res.status(403).json({ 'msg': 'cannot set userclaims'  });
        });
    })
    .catch((error) => {
      if (error.code === 'auth/email-already-in-use') {
        return res.status(403).json({ 'msg': 'Email already in use' });
      } else {
        return res.status(403).json({ 'msg': error.code });
      }
    });
});

// router.post('/forgotPassword', (req, res) => {
//   return res.status(500).json("not yet implemented");
// });

module.exports = router;
