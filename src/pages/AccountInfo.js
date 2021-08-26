import React, { Component } from 'react'
import UsersTable from '../components/UsersTable';
import UserStreams from '../components/UserStreams'
import CustomAppBar from '../components/AppBar';
import axios from 'axios';
import { Form, FormGroup, Label, Input, FormText } from 'reactstrap';
import { HomeOutlined } from '@material-ui/icons'
import { Redirect } from 'react-router-dom';
import { Snackbar } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import { Base64 } from 'js-base64';

export default class AccountUsers extends Component {
    constructor(props){
        super(props);
        this.state = {
            redirect: false,
            message: null,
            showSnackbar: false,
            title: "",
            rtsp: "",
            users: []
        }
        this.toggleModal = this.toggleModal.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount() {
        axios.get(`http://localhost:3001/accountusers/${sessionStorage.getItem('customerId')}`)
        .then((res) => {
            console.log("getting users");
            this.setState({
                users: res.data.users
            })
        })
    }

    toggleModal() {
        console.log("modal");
        this.setState({
            showModal: !this.state.showModal
        })
    }

    handleChange(event) {
        const target = event.target;
        const value = target.value;
        const name = target.name;

        this.setState({
            [name]: value
        });
    }

    async addCamera() {
        const rtsp = Base64.encode(this.state.rtsp)
        await axios.get(`http://localhost:3001/addcamera/${sessionStorage.getItem('customerId')}/${this.state.title}/${rtsp}`)
        .then((res) =>{
            console.log(res.data)
                if(res.data.succeeded === true){
                    
                    this.setState({redirect: true});
                } else {
                    console.log("showsnackbar = true ")
                    this.setState({
                        showSnackbar: true,
                        message: "Error occured when adding camera. Try Again"
                    });
                }
            
        })
    }

    handleSubmit(event) {
        console.log('An new device was submitted: ' + this.state.title);
        this.addCamera();
        event.preventDefault();
    }

    handleRedirect(){
        if(this.state.redirect === true){
            return(
                <Redirect to="/home" />
            )
        }
    }

    closeSnackbar(){
        this.setState({
            showSnackbar: false
        });
    }

    render() {

        const classes = theme => ({
            paper: {
              marginTop: theme.spacing(8),
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            },
            avatar: {
              margin: theme.spacing(1),
              backgroundColor: theme.palette.secondary.main,
            },
            form: {
              width: '100%', // Fix IE 11 issue.
              marginTop: theme.spacing(1),
            },
            submit: {
              margin: theme.spacing(3, 0, 2),
            },
          });

        return (
            <div>
                <CustomAppBar />
                <Snackbar 
                    open={this.state.showSnackbar}
                    autoHideDuration={6000}
                    onClose={() => this.closeSnackbar()}
                    message={this.state.message}
                />
                <Form onSubmit={this.handleSubmit} className={classes.form}>
                        <Container component="main" maxWidth="xs">
                            <CssBaseline />
                            <div className={classes.paper}>
                                
                                
                                <Typography component="h1" variant="h5">
                                Add Third-Party Camera 
                                </Typography>
                                
                                <FormGroup >
                                    <TextField
                                        variant="outlined"
                                        margin="normal"
                                        required
                                        fullWidth
                                        id="title"
                                        label="Title"
                                        name="title"
                                        autoComplete="title"
                                        autoFocus
                                        onChange={this.handleChange}
                                    />
                                </FormGroup>
                                <FormGroup>
                                    <TextField
                                        variant="outlined"
                                        margin="normal"
                                        required
                                        fullWidth
                                        name="rtsp"
                                        label="RTSP"
                                        type="rtsp"
                                        id="rtsp"
                                        autoComplete="rtsp"
                                        onChange={this.handleChange}
                                    />
                                </FormGroup>
                                <Button
                                    type="submit"
                                    fullWidth
                                    variant="contained"
                                    color="primary"
                                    className={classes.submit}
                                >
                                    Add Camera
                                </Button>
                                
                            
                            </div>
                            
                        </Container>
                    </Form>
                <Typography component="h1" variant="h5">
                   Live Stream Url's 
                </Typography>
                <UserStreams />
                {
                /*
                <Typography component="h1" variant="h5">
                    Manage Users 
                </Typography>
                
                    <UsersTable users={this.state.users}/>
                */
                }
                {this.handleRedirect()}
            </div>
        )
    }
}
