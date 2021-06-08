// const functions = require('firebase-functions');
// var firebase = require('firebase')
var express = require('express');
// const { app } = require('firebase-admin');
var router = express.Router();
const { admin, db } = require('../utils/admin');


router.get('/hi', (req, res) => {
    return res.status(200).json({ "msg": "hello admin you are lit" });
}
)
router.post('/quiz', (req, res) => {
    // var i = 1;
    var adminName = '';
    db.collection('owners').doc(req.body.uid).
        get().then((doc) => {

            adminName = doc.data().displayName;
            db.collection(`quizTopics`).add({
                topic: req.body.topic,
                quizmaster: adminName,
                quizmasterId: req.body.uid
            });
        }).then(() => {
        
            req.body.myQuestionArr.forEach(question => {
                var questionformat = {
                    'quizmasterId': req.body.uid,
                    'quizmaster':adminName,
                    'topic': req.body.topic,
                    'question': question.question,
                    '1': question.options[1].option,
                    '2': question.options[2].option,
                    '3': question.options[3].option,
                    '4': question.options[4].option,
                    'correctAnswer': question.correctAnswer
                }
        
        db.collection('quiz').add({
            questionformat
        })   
    })
    res.status(200).json("successfully uploaded quiz");
    })

        // db.doc(`quiz/${req.body.topic}/${req.body.uid}/${i}/`).set(question);
    });
router.get('/quiz/get', (req, res) => {
    const quizRef = db.collection('user');
    quizRef.get().then((snapshot) => {
        console.log(snapshot.data())
        data = [];
        snapshot.forEach(doc => {
            data.push(doc.data());
            console.log(doc.id, '=>', doc.data());
        });

        res.status(200).json("successfully got quiz" + data);
    }).catch((error) => {
        res.status(403).json("cant get quiz" + error);

    })
});

router.get('quiz/get/', (req, res) => {
    db.doc(`quiz/${req.body.topic}/${req.body.uid}/`).get().then((data) => {
        console.log(data);
    }).then(()=>{
        res.status(200).json("successfully uploaded quiz");

    }).catch((error) => {
        res.status(403).json("cant get quiz",error);

    })
})
module.exports = router;