const firebase = require('firebase');
var express = require('express')
var router = express.Router();
var sendVerificationEmail = require('../utils/emailUtil')
const { admin, db } = require('../utils/admin')

router.post("/adminSignup", (request, response) => {
    var token = "abc";
    var userData;
    const newAdmin = {
        email: request.body.email,
        password: request.body.password,

    }

    firebase.auth()
        .createUserWithEmailAndPassword(
            newAdmin.email,
            newAdmin.password,
        )
        .then((data) => {
            newAdminId = data.user.uid;

            // var setHash = db.collection('Owner-Email-Verifications').doc(newAdminId).set({ newAdminId });
            // var verificationLink = "http://localhost:5001/webapp-92251/us-central1/app/admin/confirm_email/" + newAdminId;
            // sendVerificationEmail("vishnuthokala14@gmail.com", verificationLink);

            return data.user.getIdToken();


        })
        .then((idtoken) => {
            token = idtoken
            // Set admin privilege on the user corresponding to uid.
            const adminDetails = {
                email: request.body.email,
                displayName: request.body.username,
                createdAt: new Date().toISOString(),
                newAdminId
            };

            return db.doc(`owners/${newAdminId}`).set(adminDetails);

        })
        .then((data) => {
            userData = data;
            // Verify the ID token and decode its payload.
            // &&claims.email_verified &&claims.email.endsWith('@admin.example.com')
            return admin.auth().verifyIdToken(token)
                .then((claims) => {
                    // Verify user is eligible for additional privileges.
                    if (typeof claims.email !== 'undefined' &&
                        typeof claims.email_verified !== 'undefined') {
                        // Add custom claims for additional privileges.
                        return admin.auth().setCustomUserClaims(claims.sub, {
                            admin: true
                        })
                            .then((data) => {
                                return response.status(200).json({ token });
                            })
                            .catch((error) => {
                                return response.status(500).json({ error });

                            })
                    }
                    else {
                        // Return nothing.
                        return response.end(JSON.stringify({ status: 'ineligible' }));
                    }
                })
                .catch((error) => {
                    return response.status(201).json({ error });

                })

        })
        .catch((err) => {
            console.error(err);
            if (err.code === 'auth/email-already-in-use') {
                return response.status(400).json({ email: 'Email already in use' });
            } else {
                return response.status(500).json({ general: 'Something went wrong, please try again' });
            }
        });

});



module.exports = router;