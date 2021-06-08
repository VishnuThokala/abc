const { admin, db } = require('./admin');
// const firebase = require('firebase')
module.exports = (req, res, next) => {
    let idToken;
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer ')
    ) {
        idToken = req.headers.authorization.split('Bearer ')[1];

    } else {
        console.error('No token found');
        return res.status(403).json({ error: 'Unauthorized' });
    }

    admin
        .auth()
        .verifyIdToken(idToken)
        .then((decodedToken) => {
            req.user = decodedToken;
            return db
                .collection('user')
                .where('userId', '==', req.user.uid)
                .limit(1)
                .get();
        })
        .then(() => {
            // req.user.handle = data.docs[0].data().handle;
            // req.user.imageUrl = data.docs[0].data().imageUrl;
            if (req.user.user) {
                // console.log("user")
                return next();
            } else {
                // Show regular user UI.
                return res.status(403).json("unauthorised you cant access restaurant data");
            }


        })
        .catch((err) => {
            console.error('Error while verifying token ', err);
            return res.status(403).json({ "err": req.user });
        });
};