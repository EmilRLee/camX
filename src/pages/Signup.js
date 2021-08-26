import React, { Component } from 'react';
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
import axios from 'axios';
import { Redirect } from 'react-router';



class Signup extends Component {
    constructor(props){
        super(props);
        this.state = {
            fname: null,
            lname: null,
            username: null,
            password: null,
            redirect: false,
            disableSubmit: true,
            message: null,
            error: null,
            showSnackbar: false,
            checkEmail: null,
            checkUser: null,
            validUser: false,
            validEmail: false
        }
        this.handleChange = this.handleChange.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
        this.enableSubmit = this.enableSubmit.bind(this)
    }

    Copyright() {
        return (
          <Typography variant="body2" color="textSecondary" align="center">
            {'Copyright © '}
            <Link color="inherit" href="https://camxcloud.io">
              CamX - 
            </Link>{''}
            {new Date().getFullYear()}
            {'.'}
          </Typography>
        );
    }

    enableSubmit() {
        
        if(this.state.validUser == true && this.state.validEmail == true) {
            this.setState({
                disableSubmit: false
            })
        } else {
            this.setState({
                disableSubmit: true
            })
        }
        console.log(this.state.disableSubmit)
    }

    async checkUser(e){

        const username = e.target.value
        console.log(username);
        
        await axios.get(`http://localhost:3001/checkuser/${username}`)
            .then((res) => {
                console.log(res.data)
                if(res.data.available === false){
                    this.setState({
                        username: username,
                        checkUser: `${username} is taken`,
                        validUser: false
                    })
                    this.enableSubmit()
                } else {
                    console.log("showsnackbar = true ")
                    this.setState({
                        username: username,
                        checkUser: `${username} is Available`,
                        validUser: true
                    });
                    this.enableSubmit()
                }
            })
    }
    async checkEmail(e){
        const email = e.target.value
        console.log(email);
        
        await axios.get(`http://localhost:3001/checkemail/${email}`)
            .then((res) => {
                console.log(res.data)
                if(res.data.available === false){
                    this.setState({
                        email: email,
                        checkEmail: `${email} is unavailible`,
                        validEmail: false
                    })
                    this.enableSubmit()
                } else {
                    console.log("showsnackbar = true ")
                    this.setState({
                        email: email,
                        checkEmail: `${email} is availible`,
                        validEmail: true
                    });
                    this.enableSubmit()
                }
            })
    }

    async registerUser(fname,lname,email,username,password) {

        await axios.get(`http://localhost:3001/register/${fname}/${lname}/${email}/${username}/${password}`)
            .then((res) => {
                console.log(res.data)
                if(res.data.registered == true){
                    this.setState({
                        redirect: true
                    })
                } else {
                    
                    this.setState({
                        showSnackbar: true,
                        message: "there was an error registering your account" 
                    })
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
        event.preventDefault();
        console.log('An username was submitted: ' + this.state.username);
        this.registerUser(
            this.state.fname,
            this.state.lname,
            this.state.email,
            this.state.username,
            this.state.password
        )
        
    }

    handleRedirect(){
        if(this.state.redirect === true){
            return(
                <Redirect to="/login" />
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
            marginTop: theme.spacing(3),
            },
            submit: {
            margin: theme.spacing(3, 0, 2),
            },
        })

    return (
        <Container component="main" maxWidth="xs">
        <CssBaseline />
        <div className={classes.paper}>
            <Avatar className={classes.avatar}>
            <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
            Sign up
            </Typography>
            <form className={classes.form} noValidate onSubmit={(e) => this.handleSubmit(e)}>
            <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                <TextField
                    autoComplete="fname"
                    name="fname"
                    variant="outlined"
                    required
                    fullWidth
                    id="fname"
                    label="First Name"
                    autoFocus
                    onBlur={(e) =>this.handleChange(e)}
                />
                </Grid>
                <Grid item xs={12} sm={6}>
                <TextField
                    variant="outlined"
                    required
                    fullWidth
                    id="lastName"
                    label="Last Name"
                    name="lname"
                    autoComplete="lname"
                    onBlur={(e) =>this.handleChange(e)}
                />
                </Grid>
                <Grid item xs={12}>
                <TextField
                    variant="outlined"
                    required
                    fullWidth
                    id="email"
                    label="Email Address"
                    name="email"
                    autoComplete="email"
                    onBlur={(e) => this.checkEmail(e)}
                />
                <p>{this.state.checkEmail}</p>
                </Grid>
                <Grid item xs={12}>
                <TextField
                    variant="outlined"
                    required
                    fullWidth
                    id="username"
                    label="create username"
                    name="username"
                    autoComplete="password"
                    onBlur={(e) => this.checkUser(e)}
                />
                <p>{this.state.checkUser}</p>
                </Grid>
                <Grid item xs={12}>
                <TextField
                    variant="outlined"
                    required
                    fullWidth
                    name="password"
                    label="Password"
                    type="password"
                    id="password"
                    autoComplete="current-password"
                    onChange={(e) =>this.handleChange(e)}
                />
                </Grid>
    
            </Grid>
            <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                className={classes.submit}
                disabled={this.state.disableSubmit}
            >
                Sign Up
            </Button>
            <Grid container justifyContent="flex-end">
                <Grid item>
                <Link href="/login" variant="body2">
                    Already have an account? Sign in
                </Link>
                </Grid>
            </Grid>
            </form>
        </div>
        <Box mt={5}>
            {this.Copyright()}
        </Box>
        {this.handleRedirect()}
        </Container>
        
    )}
}

export default Signup