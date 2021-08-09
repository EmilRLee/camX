//const express = require('express');
const cv = require('opencv4nodejs-prebuilt');
const io = require('socket.io-client');
let customerID = "5d6f3803-11f1-4b7f-8b66-cef174152f98";
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



const socket = io.connect(`http://localhost:3001`,{query: {
    customer: customerID,
    hwId: hwID
  }})
const video = new cv.VideoCapture(0)
video.set(cv.CAP_PROP_FRAME_WIDTH, 500)
video.set(cv.CAP_PROP_FRAME_HEIGHT, 500)

socket.on('connect', () => {
    socket.emit('cam', hwID)
    console.log("sent hwid to server")

    socket.on('customer', (customerId) => {
        const nsp = io.connect(`http://localhost:3001/${customerId}`,{query: {
            customer: customerID,
            hwId: hwID
        }}) 

        nsp.on('connect', () => {
            nsp.emit('join', hwID)
            console.log(`joined ${hwID} on namespace ${customerId}`)

            
            setInterval(() => {
                const frame = video.read();
                const image = cv.imencode('.jpg', frame).toString('base64');
                nsp.emit('image', image, hwID,customerId)
                console.log(`sending images to room ${hwID} in namespace ${customerId}`); 
            }, 1000 / 100)
        })
    })     

    
    
})


//app.set('socketio', io);

//server.listen(port, () => {
//  console.log(`app listening at http://localhost:${port}`)
//})
console.log("waiting connection");
