import React, {Component} from 'react';
import { io } from 'socket.io-client';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

import axios from 'axios';
import {CardMedia, Grid, Paper, Modal} from '@material-ui/core/';
import CustomAppBar from '../components/AppBar';
//import { loadPlayer } from 'rtsp-relay/browser';
//import FlvPlayer from 'flvplayer';
//import JSMpeg from '@cycjimmy/jsmpeg-player';
import ReactHlsPlayer from 'react-hls-player/dist';





class Webcams extends Component {
    constructor(props){
        super(props);
        this.state = {
            customerId: sessionStorage.getItem('customerId'),
            devices: [],
            external_cams: []
        }
        this.getStreams = this.getStreams.bind(this);
        this.getExternalCams = this.getExternalCams.bind(this);
        this.openModal = this.openModal.bind(this);
        this.closeModal = this.closeModal.bind(this);
    }

    async componentDidMount() {
        const req = await axios.get(`http://localhost:3001/devices/${sessionStorage.getItem('customerId')}`)
        const xreq = await axios.get(`http://localhost:3001/externalcams/${sessionStorage.getItem('customerId')}`)
        

        const xdevices = []
        const external_devices = xreq.data.map(device =>{
            this.setState({
                external_cams: [...this.state.external_cams, device]
            })
            xdevices.push(device)
        })
        
    
        const devices = req.data
        this.setState({
            devices: devices
        })

        const socket = io(`http://localhost:3001/`)
            
        socket.on('connect', () => {
            socket.emit('web', this.state.customerId, devices)
            const nsp = io(`http://localhost:3001/${this.state.customerId}`)
            console.log(`joining rooms ${devices}`)
            nsp.emit('webjoin', devices)
            const xroom = []
            xdevices.map(device => {
                xroom.push(device.hwId)
            })
            nsp.emit('webjoin', xroom)
            if (sessionStorage.getItem('customerId')){
                nsp.emit('external_cam_images', sessionStorage.getItem('customerId'))
            }
            //axios.get(`http://localhost:3001/stream/${this.state.customerId}`)
            console.log(`joined room ${devices} in namespace ${this.state.customerId}`)

            nsp.on("image", (image, hwId) => {
                console.log(`recieving image for ${hwId}`)
                const img = document.getElementById(hwId);
                img.src = `data:image/jpeg;base64, ${image}`
            })

            nsp.on('external_image',  (image, hwId) => {
                /*
                console.log("rtsp server started")
                const websocket = `http://localhost:8554/${hwId}`;
                const canvas = document.getElementById(hwId);
                console.log(canvas)
                const player = new JSMpeg.VideoElement(canvas, websocket);
                player.play()
                */
                console.log(`recieving image for ${hwId}`)
                const img = document.getElementById(hwId);
                img.src = `data:image/jpeg;base64,${image}`
                
            })

            document.addEventListener('beforeunload', function (e) {
                // Cancel the event
                e.preventDefault(); // If you prevent default behavior in Mozilla Firefox prompt will always be shown
                // Chrome requires returnValue to be set
                e.returnValue = '';
                nsp.emit('stop_stream')

              });
        })
    }

    imageError = () => {
        console.log("image load error")
    }

    getStreams() {
        console.log("getting Streams")
        const devices = this.state.devices
        console.log(devices)
        const streams = devices.map(device => {
            return (
                <Grid key={device} item xs={12} lg={4}>
                    <Paper>
                    <Card >
                        <CardActionArea>
                            <img id={device} top height="300" width="500" />
                        
                            <CardContent>
                            <Typography gutterBottom variant="h5" component="h2">
                                CamX ID: {device}
                            </Typography>
                            
                            </CardContent>
                        </CardActionArea>
                        <CardActions>
                            
                            
                        </CardActions>
                        </Card>
                    </Paper>
                </Grid>
            )
        })
        return streams
    }
   
    getExternalCams() {
        console.log("getting external cams")
        const devices = this.state.external_cams
        console.log(devices)
        if(devices){
            const cams = devices.map(device => {
                return (
                    <Grid key={device.hwId} item xs={12} lg={4}>
                        <Paper>
                        <Card >
                            <CardActionArea>
                            <img id={device.hwId} top height="300" width="500" />
                                {/*
                                <ReactHlsPlayer
                                    src={`http://localhost:3001/streams/${this.state.customerId}/${device.hwId}/${device.hwId}.m3u8`}
                                    autoPlay={true}
                                    controls={true}
                                    width="100%"
                                    height="auto"
                                />
                                */}
                                <CardContent>
                                <Typography gutterBottom variant="h5" component="h2">
                                    {device.title}
                                </Typography>
                                
                                </CardContent>
                            </CardActionArea>
                            <CardActions>
                                
                                
                                
                                
                            </CardActions>
                            </Card>
                        </Paper>
                    </Grid>
                )
            }) 
            return cams
        }
    }

    openModal(){
        this.setState({
            showModal: true
        })
    }
    
    closeModal(){
        this.setState({
            showModal: false
        })
    }

    render() {
        
        const classes = {
              position: 'absolute',
              width: 400,
              backgroundColor: 'white',
              border: '2px solid #000'
              
            }
         
        return (
            <div>
                <CustomAppBar />
                
                <Grid container justifyContent="center" spacing={2}>
                    {this.getStreams()}
                    {this.getExternalCams()}
                </Grid>
                
            </div>
        )
    }
}

export default Webcams