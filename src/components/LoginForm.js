import React, { Component } from 'react'
import { Form, FormGroup, Label, Input, FormText } from 'reactstrap';
import axios from 'axios';
import { HomeOutlined } from '@material-ui/icons'
import { Redirect } from 'react-router-dom';
import { Snackbar } from '@material-ui/core';

import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import { withStyles } from '@material-ui/styles';

export default class LoginForm extends Component {
    constructor(props){
        super(props);
        this.state = {
            username: "",
            password: "",
            redirect: false,
            showSnackbar: false,
            message: null
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    async validateUser(username,pass){
        console.log(username + pass);
        const formData = JSON.stringify({
            username: username,
            password: pass
        })
        await axios.get(`http://localhost:3001/login/${username}/${pass}`)
            .then((res) => {
                console.log(res.data)
                if(res.data.isvalid === true){
                    console.log(res.data.devices)
                    sessionStorage.setItem("customerId",res.data.customerId)
                    sessionStorage.setItem("devices", JSON.stringify(res.data.devices))
                    console.log(`user devices are ${JSON.parse(sessionStorage.getItem("devices"))}`)
                    console.log(`${sessionStorage.getItem("customerId")} is set as the logged in user`);
                    this.setState({redirect: true});
                } else {
                    console.log("showsnackbar = true ")
                    this.setState({
                        showSnackbar: true,
                        message: "Invalid username or password"
                    });
                }
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

    handleSubmit(event) {
        console.log('An username was submitted: ' + this.state.username);
        this.validateUser(this.state.username,this.state.password);
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

        /*
        return (
            <div>

                <HomeOutlined />
                <Snackbar 
                    open={this.state.showSnackbar}
                    autoHideDuration={6000}
                    onClose={() => this.closeSnackbar()}
                    message={this.state.message}
                />
                <Form onSubmit={this.handleSubmit}>
                    <FormGroup>
                        <Label for="exampleEmail">Email</Label>
                        <Input type="email" name="email" id="exampleEmail" placeholder="with a placeholder" onChange={this.handleChange} />
                    </FormGroup>
                    <FormGroup>
                        <Label for="examplePassword">Password</Label>
                        <Input type="password" name="password" id="examplePassword" placeholder="password placeholder" onChange={this.handleChange} />
                    </FormGroup>
                    <Button type="submit">Submit</Button>
                </Form>
                {this.handleRedirect()}
            </div>
        ) */

    
        return(
            <div>
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
                            <Avatar className={classes.avatar}>
                            <LockOutlinedIcon />
                            </Avatar>
                            <Typography component="h1" variant="h5">
                            Sign in
                            </Typography>
                            
                            <FormGroup >
                                <TextField
                                    variant="outlined"
                                    margin="normal"
                                    required
                                    fullWidth
                                    id="username"
                                    label="username"
                                    name="username"
                                    autoComplete="username"
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
                                    name="password"
                                    label="Password"
                                    type="password"
                                    id="password"
                                    autoComplete="current-password"
                                    onChange={this.handleChange}
                                />
                            </FormGroup>
                            <FormControlLabel
                                control={<Checkbox value="remember" color="primary" />}
                                label="Remember me"
                            />
                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                color="primary"
                                className={classes.submit}
                            >
                                Sign In
                            </Button>
                            <Grid container>
                                <Grid item xs>
                                <Link href="#" variant="body2">
                                    Forgot password?
                                </Link>
                                </Grid>
                                <Grid item>
                                <Link href="#" variant="body2">
                                    {"Don't have an account? Sign Up"}
                                </Link>
                                </Grid>
                            </Grid>
                        
                        </div>
                        
                    </Container>
                </Form>
                {this.handleRedirect()}
            </div>
        )
    }

}

