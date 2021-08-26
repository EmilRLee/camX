import React, { Component } from 'react';
import { Redirect } from 'react-router';
import {io} from 'socket.io-client';

export default class Logout extends Component {
    constructor(props){
        super(props)
        this.state = {

        };
    }

    clearSession(){
    
        sessionStorage.clear();

    }

    handleRedirect(){
        return(
            
            
            <Redirect to="/login" />
            
        );

    }

    render() {
        return (
            <div >
                {this.clearSession()}
                {this.handleRedirect()}
            </div>
        )
    }
}
