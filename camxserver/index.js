const express = require('express');
const mongoose = require('mongoose');
//const cv = require('opencv4nodejs-prebuilt');
//const io = require('socket.io');
const Bcrypt = require('bcryptjs');
const bodyParser = require('body-parser');
const User = require('./Models/User');
const cors = require('cors');
const router = express.Router();
const app = express();
const port = 3001;
const server = require('http').createServer(app);
const io = require('socket.io')(server, {
    cors: {
    origin: "*",
    methods: ["GET", "POST"]
}});
app.use(cors());



mongoose.connect('mongodb://localhost:27017/camx', {useNewUrlParser: true,});

async function getCustomerId(hwId){
    const devices = await User.find({"devices": hwId})
    const customerId = devices.map(device => {
        console.log(device)
        return device
    })
    console.log(hwId)
    //console.log(customerId[0]._id)
    return customerId[0]._id
}

io.on('connection', (socket) => {
    

    
    socket.on('web', (customerId, hwId) => {
        console.log("getting namespace connection for web user")
        //set namespace to customerId
        let nsp = io.of(`/${customerId}`);
        console.log(`setting namespace to ${customerId}`);
        

        nsp.on("connection", (socket) => {
            console.log("got namespace connection from web");
            socket.on('webjoin', hwId => {
                const devices = JSON.parse(hwId)
                const rooms = devices.map(room => {
                    socket.join(room)
                    console.log(`joining ${customerId} in room ${room}`)
                })
            })
        })
    })

    
    socket.on('cam', async (hwId) => {
        //query database to get customerId for hwId then set the namespace to customerId
    //      socket.handshake.query.customer
    //     return the customerId and put it namespace.. For now we will simulate this.
    //
        const customerId = await getCustomerId(hwId)
    
        if(customerId) {
            console.log("setting namespace connection for camX device")
            socket.emit('customer', customerId)
            //set namespace to customerId
            let nsp = io.of(`/${customerId}`);
            console.log(`setting namespace to ${customerId} for camx device`);
            

            nsp.on("connection", (socket) => {
                //console.log("got namespace connection from camx cam");
                socket.on('camjoin', hwId => {
                    socket.join(hwId)
                    //console.log(`new camXcam join for ${hwId} in namespace ${returnedCustomerID}`)
                    socket.on('image', (image, hwId) => {
                        //console.log(`got images from device ${hwId}`)
                        //setInterval(() => {
                        socket.to(hwId).emit('image', image, hwId)
                        console.log(`sending images to ${hwId} in namespace ${customerId}`);
                            //}, 1000 / 60)
                    })
                })
                
            })
        }
    })
    
})
          
app.set('socketio', io);

//get devices and return 
app.get('/devices/:customerId', async (req, res) => {
   const devices = User.find({"_id": req.params.customerId}, "devices", (error, devices) => {
       console.log(devices[0].devices[0])
       res.send(devices[0].devices[0])
   })
})

const urlencodedParser = bodyParser.urlencoded({ extended: false });

app.get('/login/:username/:password', urlencodedParser, async (req, res) => {
    console.log({
        data: req.params
    });
    try{
        const validUser = await User.findOne({"username": req.params.username})
        if(validUser){
            console.log(validUser.devices);
            if(!Bcrypt.compareSync(req.params.password, validUser.password)) {
                
                return res.send({ 
                    message: "The password is invalid",
                    isvalid: false
                });
            } else {
                res.send({
                    customerId: validUser._id,
                    devices: validUser.devices,
                    isvalid: true
                })
            }
        } else {
            res.send({
                message: "username is invalid",
                isvalid: false
            });
        }
    } catch{
        console.log("something went wrong again")
    }

});

app.get('/checkuser/:username', async (req, res) => {
    console.log('got checkeuser')
    const validUser = await User.findOne({"username": req.params.username})
    if(validUser){
        res.send({
            available: false
        });
    } else {
        res.send({
            available: true
        });
    }
})

app.get('/checkemail/:email', async (req, res) => {
    console.log('got checkemail')
    const validUser = await User.findOne({"email": req.params.email})
    if(validUser){
        res.send({
            available: false
        });
    } else {
        res.send({
            available: true
        });
    }
})

app.get('/register/:fname/:lname/:email/:username/:password', async (req, res) => {
    
    try{
        const validUser = await User.findOne({"email": req.params.email})
        if(validUser){
            console.log("Valid User");
            res.send({
                registered: false
            });
        } else {
            console.log("Registering User Now");
            console.log(req.params.username);
            req.params.password = Bcrypt.hashSync(req.params.password, 10);
            console.log("encrypt success");
            const user = new User({
                fname: req.params.fname,
                lname: req.params.lname,
                email: req.params.email,
                username: req.params.username,
                password: req.params.password,
                devices: [],
                users: []
            });
            await user.save();
            res.send({
                registered: true
            });
        }
    } catch{
        console.log("something went wrong");
    }

});

server.listen(port, '0.0.0.0', () => {
  console.log(`app listening at ${port}`)
})
//console.log("waiting connection");
