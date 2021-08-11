import React, {Component} from 'react';
import { io } from 'socket.io-client';
import { Card, CardBody, Button, CardTitle, CardText, CardImg } from 'reactstrap';
import axios from 'axios';

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

    getStreams() {
        console.log("getting Streams")
        const devices = JSON.parse(sessionStorage.getItem('devices'))
        console.log(devices)
        const streams = devices.map(device => {
            return (
                <Card>
                    <CardImg id={device} top width="100%"  alt={device} />
                    <CardBody>
                    <CardTitle tag="h3">{device}</CardTitle>
                    <CardText>live from camx</CardText>
                    <CardText>
                        <small className="text-muted">Last updated 3 mins ago</small>
                    </CardText>
                    </CardBody>
                </Card>
            )
        })
        return streams
    }
   
    render() {
        
         
        return (
            <div>
                {this.getStreams()}
            </div>
        )
    }
}

export default Webcams