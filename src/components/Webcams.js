import React, {Component} from 'react';
import { io } from 'socket.io-client';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import axios from 'axios';
import {CardMedia, Grid, Paper} from '@material-ui/core/';
import CustomAppBar from '../components/AppBar';



class Webcams extends Component {
    constructor(props){
        super(props);
        this.state = {
            customerId: sessionStorage.getItem('customerId'),
            devices: JSON.parse(sessionStorage.getItem('devices'))
        }
        this.getStreams = this.getStreams.bind(this);   
    }

    componentDidMount() {
        const socket = io(`http://localhost:3001/`)
            
        socket.on('connect', () => {
            socket.emit('web', this.state.customerId, JSON.parse(sessionStorage.getItem('devices')))
            const nsp = io(`http://localhost:3001/${this.state.customerId}`)
            console.log(`joining rooms ${sessionStorage.getItem('devices')}`)
            nsp.emit('webjoin', sessionStorage.getItem('devices'))
            console.log(`joined room ${sessionStorage.getItem('devices')} in namespace ${this.state.customerId}`)

            nsp.on("image", (image, hwId) => {
                console.log(`recieving image for ${hwId}`)
                const img = document.getElementById(hwId);
                img.src = `data:image/jpeg;base64,${image}`
            })
        })
    }

    imageError = () => {
        console.log("image load error")
    }

    getStreams() {
        console.log("getting Streams")
        const devices = JSON.parse(sessionStorage.getItem('devices'))
        console.log(devices)
        const streams = devices.map(device => {
            return (
                <Grid key={device} item xs={12} lg={4}>
                    <Paper>
                    <Card >
                        <CardActionArea>
                            <img id={device} top width="100%" height="300" alt={device} onError={this.imageError()} />
                            <CardContent>
                            <Typography gutterBottom variant="h5" component="h2">
                                Device ID: {device}
                            </Typography>
                            
                            </CardContent>
                        </CardActionArea>
                        <CardActions>
                            <Button size="small" color="primary">
                            Edit
                            </Button>
                            <Button size="small" color="primary">
                            Settings
                            </Button>
                        </CardActions>
                        </Card>
                    </Paper>
                </Grid>
            )
        })
        return streams
    }
   
    render() {
        
         
        return (
            <div>
                <CustomAppBar />
                <Grid container justifyContent="center" spacing={2}>
                    {this.getStreams()}
                </Grid>
            </div>
        )
    }
}

export default Webcams