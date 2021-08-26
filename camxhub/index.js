
// Developed By: Emil R. Lee  |  ALL Rights Reserved

//const express = require('express');
//const cv = require('opencv4nodejs-prebuilt');
const io = require('socket.io-client');
//const hwID = "5d6f3809"
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


/*
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
            nsp.emit('camjoin', hwID)
            console.log(`joined ${hwID} on namespace ${customerId}`)

            
            setInterval(async () => {
                const frame = video.read();
                const image = cv.imencode('.jpg', frame).toString('base64');
                await nsp.emit('image', image, hwID)
                console.log(`sending images to room ${hwID} in namespace ${customerId}`); 
            }, 1000 / 15)
        })
    })        
})


//app.set('socketio', io);

//server.listen(port, () => {
//  console.log(`app listening at http://localhost:${port}`)
//})

onvif.Discovery.on('device', function(cam){
// function will be called as soon as NVT responses
	cam.username = "admin";
	cam.password = "password";
	cam.connect(console.log);
})

onvif.Discovery.on('error', (error) => {
    console.log(error)
})

setInterval(async () => {
    console.log('scanning for cameras');
    onvif.Discovery.probe();
}, 30000)
*/
//hostname: "zetounabeecher.gvdip.com",
   
const onvif = require('node-onvif');
 
// Create an OnvifDevice object
let device = new onvif.OnvifDevice({
  xaddr: 'http://zetounabeecher.gvdip.com:1001',
  user : 'service',
  pass : 'Serv!c3!'
});
 
// Initialize the OnvifDevice object
device.init().then((info) => {
  // Show the detailed information of the device.
  console.log(JSON.stringify(info, null, '  '));
}).catch((error) => {
  console.error(error);
});


console.log("waiting connection");
