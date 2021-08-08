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


io.on('connection', (socket) => {
    console.log("got connection")

    socket.on('image', (image) => {
        //setInterval(() => {
        io.emit('image', image)
        console.log("sending image");
         //}, 1000 / 60)
    }) 
})

app.set('socketio', io);

server.listen(port, () => {
  console.log(`app listening at http://localhost:${port}`)
})
//console.log("waiting connection");
