const functions = require('firebase-functions');
var firebase = require('firebase')
var express = require('express')
var router = express.Router();
var sendVerificationEmail = require('../utils/emailUtil')
const { admin, db } = require('../utils/admin')

// var uploadFile = require('../utils/upload');


// Sign up
router.post("/userSignup", (request, response) => {
//   var file = request.files.file;
//   const url = uploadFile(file);
//   console.log(url);

  var token = "abc";
  var userData;
    const newUser = {
    email: request.body.email,
    password: request.body.password,
      displayName: request.body.username,
    phoneNumber:request.body.phone,
  }

   firebase.auth()
          .createUserWithEmailAndPassword(
            newUser.email,
            newUser.password
          )
    .then((data) => {
        userId = data.user.uid;

      //   var setHash = db.collection('Email-Verifications').doc(userId).set({ userId });
      // var verificationLink = "http://localhost:5001/webapp-92251/us-central1/app/user/confirm_email/" + userId;
      //   sendVerificationEmail(newUser.email, verificationLink);

      return data.user.getIdToken();


    })
    .then((idtoken) => {
      token = idtoken
      // Set user role on the user corresponding to uid.
        const user = {
        email: request.body.email,
        password: request.body.password,
        displayName: request.body.username,
        phoneNumber:request.body.phone,
        createdAt: new Date().toISOString(),
          userId
      };
      
      return db.doc(`user/${userId}`).set(user);

    })
    .then(async (data) => {
      userData = data;
      // Verify the ID token and decode its payload.
      // &&claims.email_verified &&claims.email.endsWith('@admin.example.com')
        try {
        const claims = await admin.auth().verifyIdToken(token);
        // Verify user is eligible for additional privileges.
        if (typeof claims.email !== 'undefined' &&
          typeof claims.email_verified !== 'undefined') {
          // Add custom claims for additional privileges.
          return admin.auth().setCustomUserClaims(claims.sub, {
            user: true
          })
            .then((data_1) => {
              return response.status(200).json({ msg:"successfully registerd",token,'user':userData });
            })
            .catch((error) => {
              return response.status(500).json({ error });

            });
        }
        else {
          // Return nothing.
          return response.end(JSON.stringify({ status: 'ineligible' }));
        }
      } catch (error_1) {
        return response.status(201).json({ error });
      }

    })
    .catch((err) => {
      console.error(err);
      if (err.code === 'auth/email-already-in-use') {
        return response.status(400).json({ msg: 'Email already in use' });
      } else {
        return response.status(500).json({ msg: 'Something went wrong, please try again' });
      }
    });

}
);



// router.post('/forgotPassword', (req, res) => {
//   return res.status(500).json("not yet implemented");
// });

module.exports = router;
