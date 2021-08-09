const express = require('express');
//const cv = require('opencv4nodejs-prebuilt');
//const io = require('socket.io');
const cors = require('cors');
const app = express();
const port = 3001;
const server = require('http').createServer(app);
const io = require('socket.io')(server, {
    cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
}});
app.use(cors());

let returnedCustomerID = "5d6f3803-11f1-4b7f-8b66-cef174152f98";


io.on('connection', (socket) => {
    

    
    socket.on('web', (customerId, hwId) => {
        console.log("getting namespace connection for web user")
        //set namespace to customerId
        let nsp = io.of(`/${customerId}`);
        console.log(`setting namespace to ${customerId}`);
        

        nsp.on("connection", (socket) => {
            console.log("got namespace connection from web");
            socket.on('join', hwId => {
                socket.join(hwId)
                console.log(`new join for ${hwId} in namespace ${customerId}`)
            })
            
        })
    })

    
    socket.on('cam', (hwId) => {
        //query database to get customerId for hwId then set the namespace to customerId
    //      socket.handshake.query.customer
    //     return the customerId and put it namespace.. For now we will simulate this.
    //
        console.log("setting namespace connection for cam device")
        socket.emit('customer', returnedCustomerID)
        //set namespace to customerId
        let nsp = io.of(`/${returnedCustomerID}`);
        console.log(`setting namespace to ${returnedCustomerID}`);
        

        nsp.on("connection", (socket) => {
            console.log("got namespace connection from camx cam");
            socket.on('join', hwId => {
                socket.join(hwId)
                console.log(`new camXcam join for ${hwId} in namespace ${returnedCustomerID}`)
                socket.on('image', (image, hwId, customerId) => {
                    console.log(`got images from device ${hwId}`)
                    //setInterval(() => {
                    socket.to(hwId).emit('image', image)
                    console.log(`sending images to ${hwId} in namespace ${customerId}`);
                        //}, 1000 / 60)
                })
            })
            
        })

    })
    
})
          

    

app.set('socketio', io);

server.listen(port, '0.0.0.0', () => {
  console.log(`app listening at ${port}`)
})
//console.log("waiting connection");
