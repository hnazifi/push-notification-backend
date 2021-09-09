const express = require('express');
const PushNotifications = require("@pusher/push-notifications-server")
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const uuid = require('uuid')

const app = express();
const port = 4001

const beamsClient = new PushNotifications({
    instanceId: 'e0cf1a94-54f9-4385-9c33-3b8c82214286',
    secretKey: 'FC0939DE095A5953596211914D5C94ED40046276DB1C537E22CEB8A659A45F6C'
})

app.post('/auth', function (req, res) {

    const user = req.body.user

})

app.get('/pusher/beams-auth', function (req, res) {
    console.log(req.query)
    const userId = "a702f1e7-2076-4aa4-8a42-27b9fba86628"
    const userIDInQueryParam = req.query["userId"]
    if (userId !== userIDInQueryParam) {
        res.status(401).send('inconsistent request')
    } else {
        const beamsToken = beamsClient.generateToken(userId)
        res.send(JSON.stringify(beamsToken))
    }
})

app.post('/send', function (req, res) {
    const userId = "a702f1e7-2076-4aa4-8a42-27b9fba86628"
    beamsClient.publishToUsers([userId], {
        web: {
            notification: {
                title: 'hadi nazifi',
                body: 'webapp',
            }
        }
    }).then((pub) => {
        console.log(pub)
        res.send(pub)
    }).catch((err) => {
        console.log(err)
        res.status(400).send(err)
    })
})


app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE')
    res.setHeader('Access-Control-Allow-Headers', '*')
})

app.listen(port, () => console.log('Listening on port ' + port))

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


module.exports = app;