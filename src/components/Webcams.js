import React from 'react';
import { io } from 'socket.io-client';
import { Card, CardBody, Button, CardTitle, CardText, CardImg } from 'reactstrap';

export default function Webcams() {
    const customerId = "5d6f3803-11f1-4b7f-8b66-cef174152f98"
    const hwId = "5d6f3803"

    const socket = io(`http://localhost:3001/`)
    

    socket.on('connect', () => {
        socket.emit('web', customerId, hwId)
        const nsp = io(`http://localhost:3001/${customerId}`,{query: {
            customer: customerId,
            hwId: hwId
        }})

        nsp.emit('join', hwId);
        console.log(`joined room ${hwId} in namespace ${customerId}`)

        nsp.on("image", (image) => {
            console.log('recieving image')
            const img = document.getElementById('image');
            img.src = `data:image/jpeg;base64,${image}`
        })

    })
    
    
    
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
