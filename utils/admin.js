var admin = require("firebase-admin");

var serviceAccount = require("./adminsdk.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://webapp-92251.firebaseio.com",
    storageBucket: "webapp-92251.appspot.com",

});
const db = admin.firestore();
// db.settings({ ignoreUndefinedProperties: true })
const storageRef = admin.storage();


module.exports = { admin, db ,storageRef };