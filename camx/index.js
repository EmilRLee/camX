
// Developed By: Emil R. Lee  |  ALL Rights Reserved

//const express = require('express');
const cv = require('opencv4nodejs-prebuilt');
const io = require('socket.io-client');
const hwID = "5d6f3803"
//const cors = require('cors');
//const app = express();
//const port = 3001;
//const server = require('http').createServer(app);
//const io = require('socket.io')(server, {
//    cors: {
//    origin: "http://localhost:3000",
//    methods: ["GET", "POST"]
//}});
//app.use(cors());



const socket = io.connect(`http://localhost:3001`)
const video = new cv.VideoCapture(0)
//video.set(cv.CAP_PROP_FRAME_WIDTH, 500)
//video.set(cv.CAP_PROP_FRAME_HEIGHT, 500)

socket.on('connect', () => {
    socket.emit('cam', hwID)
    console.log("sent hwid to server")

    socket.on('customer', (customerId) => {
        const nsp = io.connect(`http://localhost:3001/${customerId}`) 

        nsp.on('connect', () => {
            nsp.emit('join', hwID)
            console.log(`joined ${hwID} on namespace ${customerId}`)

            
            setInterval(async () => {
                const frame = video.read();
                const image = cv.imencode('.jpg', frame).toString('base64');
                await nsp.emit('image', image, hwID,customerId)
                console.log(`sending images to room ${hwID} in namespace ${customerId}`); 
            }, 1000 / 15)
        })
    })        
})


//app.set('socketio', io);

//server.listen(port, () => {
//  console.log(`app listening at http://localhost:${port}`)
//})
console.log("waiting connection");
