// const functions = require('firebase-functions');
// var firebase = require('firebase')
var express = require('express');
// const { app } = require('firebase-admin');
var router = express.Router();

router.get('/hi', (req, res) => {
    return res.status(200).json({ "msg": "hello user you are just ok! " });
}
)
module.exports = router;