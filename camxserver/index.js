const express = require('express');
const fs = require('fs');
const mongoose = require('mongoose');
const { spawn, exec } = require('child_process');
const cv2 = require('opencv4nodejs-prebuilt');
const Stream = require('node-rtsp-stream-jsmpeg');
const { v4: uuidv4 } = require('uuid');
const base64 = require('base-64');
//const rtsp555 = require('rtsp-live555');
const RtspServer = require('rtsp-streaming-server').default;
//const HLSServer = require('hlsServer');
//const io = require('socket.io');
const Bcrypt = require('bcryptjs');
const bodyParser = require('body-parser');
const User = require('./Models/User');
const cors = require('cors');
const Hls = require('./Models/Hls');
const router = express.Router();
const app = express();
const port = 3001;
const server = require('http').createServer(app);
//const { proxy, scriptUrl } = require('rtsp-relay')(app);
const ffmpeg = require('fluent-ffmpeg')
const io = require('socket.io')(server, {
    cors: {
    origin: "*",
    methods: ["GET", "POST"]
}});
app.use(cors());



mongoose.connect('mongodb://localhost:27017/camx', {useNewUrlParser: true,});


//--------------------- SOCKET.IO STUFF ------------------------

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
// ----------- SERVERS ------------------
/*
const rtspserver = new RtspServer({
    serverPort: 5554,
    clientPort: 6554,
    rtpPortStart: 10000,
    rtpPortCount: 10000
});
rtspserver.start()

const HLSserver = new HLSServer({
    port: 8080,
    mediaPath: "./streams",       // Root path to store media files
    cors: {                     // CORS options
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Request-Method": "*",
        "Access-Control-Allow-Methods": "OPTIONS, GET",
        "Access-Control-Allow-Headers": "*" 
    }
    transOptions: [             // FFMPEG transcoding options
        "-c:v copy",
        "-c:a copy"
    ],
    hlsOptions: [ // Specific FFMPEG HLS options
        "-hls_list_size 5",              
        "-hls_wrap 5",
        "-hls_time 5"
    ],
    hlsFileName: `${cam.hwId}.m3u8`   // m3u8 and segments basename
});  // See config options for more information
HLSserver.run();
*/

//------------ END SERVERS ----------------

app.get('/streams/:customerId/:hwId/:file', (req, res) => {
    const filePath = `./streams/${req.params.customerId}/${req.params.hwId}/${req.params.file}`
    fs.readFile(filePath, function(error, content) {
        res.writeHead(200, { 'Access-Control-Allow-Origin': '*' });
        if (error) {
            if(error.code == 'ENOENT'){
                
            }
            else {
                res.writeHead(500);
                res.end('Sorry, check with the site admin for error: '+error.code+' ..\n');
                res.end(); 
            }
        }
        else {
            res.end(content, 'utf-8');
        }
    });
})



io.on('connection', (socket) => {


    socket.on('web', (customerId, hwId) => {
        console.log("getting namespace connection for web user")
        //set namespace to customerId
        let nsp = io.of(`/${customerId}`);
        console.log(`setting namespace to ${customerId}`);
        

        nsp.on("connection", (socket) => {
            console.log("got namespace connection");

            socket.on('webjoin', hwId => {
                const devices = hwId
                console.log('got webjoin')
                
                if(devices) {
                    const rooms = devices.map(room => {
                        socket.join(room)
                        console.log(`joining ${customerId} in room ${room}`)
                    })
                }
            })

            socket.on('rtspjoin', data => {
                console.log('got rtspjoin')
                socket.join(data.hwId)
            })

            socket.on('rtspimage',(data) => {
                //console.log(`got images from device ${hwId}`)
                //setInterval(() => {
                socket.to(data.hwId).emit('external_image', data.image, data.hwId)
                //console.log(`sending images to ${data.hwId} in namespace ${customerId}`);
                    //}, 1000 / 60)
            })

            socket.on('external_cam_images', async (customerId) => {
                console.log("got external cams")
                console.log(customerId)
                const rtsp = await User.findOne({"_id": customerId}, "external_cams", (error, cams) => {
                    console.log(cams.external_cams)
                    cams.external_cams.map( async (cam) => {
                        /*
                        const video = new cv2.VideoCapture(cam.uri, cv2.CAP_V4L2)
                        setInterval(async () => {
                            const frame = video.read();
                            const image = cv2.imencode('.jpg', frame).toString('base64');
                            await socket.to()('image', image, hwID)
                            console.log(`sending images to room ${hwID} in namespace ${customerId}`); 
                        }, 1000 / 15)     
                        

                        const stream = new Stream({
                            name: cam.title.toString(),
                            streamUrl: 'rtsp://service:Serv!c3!@68.35.27.38:10604/rtsp_tunnel',
                            wsPort: cam.hwId,
                            ffmpegOptions: { // options ffmpeg flags
                            '-stats': '', // an option with no neccessary value uses a blank string
                            '-r': 30 // options with required values specify the value after the key
                            }
                        })
                        */


                        try {
                            //console.log(`trying ${cam.hwId}`)
                            const hlsserver = await Hls.findOne({"device": `${cam.hwId}`}, (error, hlsserver) =>{
                                if(hlsserver) {
                                    
                                    //Creates directories for video
                                    dir = `./streams/${customerId}/${cam.hwId}/`;
                                    if (!fs.existsSync(dir)){
                                        fs.mkdirSync(dir, {recursive: true});
                                    }
                                    
                                    console.log("======== setting HLS stream Directories ========")
                                    /*
                                    const command = ffmpeg(cam.uri)
                                        .outputOptions([
                                            '-hls_time 5',
                                            '-hls_playlist_type event',
                                            '-hls_list_size 10',
                                            '-hls_wrap 7',
                                            '-live_start_index 5'
                                        ])
                                        .output(`./streams/${customerId}/${cam.hwId}/${cam.hwId}.m3u8`)
                                        .on('start', () => {
                                            console.log('listening for stop_stream events')
                                            socket.on('stop_stream', async () => {
                                                command.kill()
                                                hlsserver.isrunning = false;
                                                await hlsserver.save()
                                                console.log(`Stopped HLS stream for Device: ${cam.hwId}`)
                                            })
                                        })
                                        .on('end', async () =>{
                                            hlsserver.isrunning = false;
                                            await hlsserver.save()
                                        })
                                        .run()


                                    /*
                                    const command = `ffmpeg -i ${cam.uri} -f hls -hls_time 5 -hls_playlist_type event -hls_list_size 6 -hls_wrap 6 ./streams/${customerId}/${cam.hwId}/${cam.hwId}.m3u8`;
                                    const ffmpeg = await exec(command, (error, stdout, stderr) => {
                                        if (error) {
                                            console.log(`error: ${error.message}`);
                                            return;
                                        }
                                        if (stderr) {
                                            console.log(`stderr: ${stderr}`);
                                            return;
                                        }
                                        console.log(`stdout: ${stdout}`);
                                    });
                                    nsp.on('logout', async () => {
                                        ffmpeg.kill()
                                        hlsserver.isrunning = false;
                                        await hlsserver.save()
                                        console.log('logout')
                                    })
                                    ffmpeg.on('exit', async () => {
                                        hlsserver.isrunning = false;
                                        await hlsserver.save() 
                                    })
                                    */
                                    hlsserver.isrunning = true;
                                    hlsserver.save()
                                    console.log(`set device ${cam.hwId} to running`)
                                }
                            })
                            //console.log(hlsserver)
                        
                            
                            
                                                                /*
                                                            try {
                                                                
                                                                
                                                                    const stream = new Stream({
                                                                        name: cam.title,
                                                                        streamUrl: `rtsp://localhost:6554/${cam.hwId}`,
                                                                        wsPort: 7554
                                                                    })
                                                                
                                                                    
                                                                    const video = new cv2.VideoCapture(`${cam.hwId}.m3u8`, cv2.CAP_ANY)
                                                                    setInterval(async () => {
                                                                        const frame = video.read();
                                                                        const image = cv2.imencode('.jpg', frame).toString('base64');
                                                                        await socket.to(cam.hwId).emit('external_image', image, cam.hwId)
                                                                        console.log(`sending images to room ${cam.hwId} in namespace ${customerId}`); 
                                                                    }, 1000 / 15)
                                                                
                                                                
                                                                
                                                            } catch (error){
                                                                console.error(error);
                                                            }
                                                            */
                        } catch (error){
                            console.error(error)
                            return null
                        }  
                    })
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
                        //console.log(`sending images to ${hwId} in namespace ${customerId}`);
                            //}, 1000 / 60)
                    })
                })
                
            })
        }
    })
    
})
       


app.set('socketio', io);

//-------------------- END SOCKET.IO STUFF ----------------------


//-------------------- API ENDPOINTS ----------------------------


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

app.get('/adduser/customerId/:fname/:lname/:email/:password', async (req, res) => {
    
    try{
        const validUser = await User.findOne({"_id": req.params.customerId})
        if (validUser) {
            console.log("adding user to account");
            req.params.password = Bcrypt.hashSync(req.params.password, 10);
            console.log("encrypt success");
            const useradd = User.findOneAndUpdate({
                "_id": req.params.customerId},
                {$push: {"users": {
                    "fname": req.params.fname,
                    "lname": req.params.lname,
                    "email": req.params.email,
                    "password": req.params.password
                }}})
            res.send({
                added: true
            });
        } else {
            res.send({
                added: false
            });
        }
    } catch{
        console.log("something went wrong");
    }

});

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

app.get('/accountusers/:customerId', async (req, res) => {
    const users = User.findOne({"_id": req.params.customerId},"users", (error, users) => {
        console.log(users)
        res.send(users)
    })
})

app.get('/uri/:customerId', async (req, res) => {
    const hls = Hls.find({"user": req.params.customerId}, "uri", (error, uri) => {
        console.log(uri)
        res.send(uri)
    })
})

app.get('/addcamera/:customerId/:title/:rtsp', async (req, res) => {
    console.log('adding cameras')
    const user = await User.findOne({"_id": req.params.customerId})
    console.log(user)
    const uuid = uuidv4()
    const rtsp = base64.decode(req.params.rtsp)
    newcam = {
        hwId: uuid,
        title: req.params.title,
        uri: rtsp
    }
    user.external_cams = [...user.external_cams, newcam]
    console.log(user.external_cams)
    if (user.save()) {
        const newHLS = new Hls({
            user: req.params.customerId,
            device: newcam.hwId,
            isrunning: false,
            uri: `http://localhost:3001/streams/${req.params.customerId}/${uuid}/${uuid}.m3u8`
        })
        await newHLS.save()
        res.send({
            succeeded: true
        })
    } else {
        res.send({
            succeeded: false
        })
    }
    
})

app.get('/devices/:customerId', async (req,res) => {
    const devices = await User.findOne({"_id": req.params.customerId}, "devices", (error, devices) =>{
        console.log(`devices are : ${devices.devices}`)
        res.send(devices.devices)
    })
})

app.get('/externalcams/:customerId', async (req,res) => {
    const devices = await User.findOne({"_id": req.params.customerId}, "external_cams", (error, devices) => {
        console.log(devices.external_cams)
        res.send(devices.external_cams)
    })
})
//---------------------- END API ENDPOINTS ------------------------

/* ---------------------- RTSP RELAY ------------------------------- 

const handler = proxy({
  url: `rtsp://service:Serv!c3!@68.34.27.38:10604/rtsp_tunnel`,
  // if your RTSP stream need credentials, include them in the URL as above
  verbose: false,
});

// the endpoint our RTSP uses
app.ws('/camx/stream', handler);

*///---------------------- END RTSP RELAY --------------------------- 
server.listen(port, '0.0.0.0', () => {
  console.log(`app listening at ${port}`)
})
//console.log("waiting connection");
