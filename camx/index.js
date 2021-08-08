//const express = require('express');
const cv = require('opencv4nodejs-prebuilt');
const io = require('socket.io-client');
const uuid = "5d6f3803-11f1-4b7f-8b66-cef174152f97"
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


const socket = io.connect('http://localhost:3001');
const video = new cv.VideoCapture(0)
video.set(cv.CAP_PROP_FRAME_WIDTH, 500)
video.set(cv.CAP_PROP_FRAME_HEIGHT, 500)

socket.on('connect', () => {
   console.log("got connection")
   socket.emit('join', uuid)
   setInterval(() => {
       const frame = video.read();
       const image = cv.imencode('.jpg', frame).toString('base64');
       socket.emit('image', image)
       console.log("sending image"); 
    }, 1000 / 100) 
})

//app.set('socketio', io);

//server.listen(port, () => {
//  console.log(`app listening at http://localhost:${port}`)
//})
console.log("waiting connection");
