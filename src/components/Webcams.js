import React, {Component} from 'react';
import { io } from 'socket.io-client';
import { Card, CardBody, Button, CardTitle, CardText, CardImg } from 'reactstrap';
import axios from 'axios';

class Webcams extends Component {
    constructor(props){
        super(props);
        this.state = {
            customerId: sessionStorage.getItem('customerId'),
            devices: sessionStorage.getItem('devices')
        }   
    }

    componentDidMount() {
        const socket = io(`http://localhost:3001/`)
            
        socket.on('connect', () => {
            socket.emit('web', this.state.customerId, sessionStorage.getItem('devices'))
            const nsp = io(`http://localhost:3001/${this.state.customerId}`)
            console.log(`joining rooms ${sessionStorage.getItem('devices')}`)
            nsp.emit('join', sessionStorage.getItem('devices'))
            console.log(`joined room ${sessionStorage.getItem('devices')} in namespace ${this.state.customerId}`)

            nsp.on("image", (image) => {
                console.log('recieving image')
                const img = document.getElementById('image');
                img.src = `data:image/jpeg;base64,${image}`
            })
        })
    }
   
    render() {
        
         
        return (
            <div>
                <Card>
                    <CardImg id="image" top width="100%"  alt="Card image cap" />
                    <CardBody>
                    <CardTitle tag="h5">camX</CardTitle>
                    <CardText>live from camx</CardText>
                    <CardText>
                        <small className="text-muted">Last updated 3 mins ago</small>
                    </CardText>
                    </CardBody>
                </Card>
            </div>
        )
    }
}

export default Webcams