// const functions = require('firebase-functions');
// var firebase = require('firebase')
var express = require('express');
// const { app } = require('firebase-admin');
var router = express.Router();
const { admin, db } = require('../utils/admin');

router.get('/hi', (req, res) => {
    return res.status(200).json({ "msg": "hello user you are just ok! " });
}
)

router.get('/quiz/get', (req, res) => {
    const quizRef = db.collection('quizTopics');
    quizRef.get().then((snapshot)=>{
        data = [];
        snapshot.forEach(doc => {
            
        data.push(doc.data());
        // console.log(doc.id, '=>', doc.data());
    });
        
    res.status(200).json(data);
    }).catch((error) => {
        res.status(403).json("successfully got quiz" + data);

    })
})

router.get('/quiz/get/:topic/:quizmaster', (req, res) => {
    result = [];
    
    db.collection('quiz').get().then((snap) => {
        snap.forEach((doc) => {
            if (doc.data().questionformat.topic == req.params.topic && doc.data().questionformat.quizmasterId == req.params.quizmaster) {
                result.push(doc.data());
            }
        })
        res.status(200).json(result);
    }).catch((error) => {
        res.status(403).json("cant get quiz"+ error);

    })
});
module.exports = router;