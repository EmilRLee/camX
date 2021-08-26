import React, {Component} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import axios from 'axios';
import { render } from '@testing-library/react';

export default class UserStreams extends Component {
    constructor(props){
        super(props);
        this.state = {
            uri: []
        }
    }
    
    
    componentDidMount() {
        console.log("getting urls")
        const uri = axios.get(`http://localhost:3001/uri/${sessionStorage.getItem('customerId')}`)
        .then( async (res) =>{
        this.setState({
            uri: res.data
        })
        console.log(res.data)
        })
    }

    render() {
        const classes = {
            table: {
              minWidth: 650,
            }
          }
        return (
        <TableContainer component={Paper}>
            <Table className={classes.table} aria-label="simple table">
            
            <TableBody>
                {this.state.uri.map((row) => (
                <TableRow key={row._id}>
                    
                    <TableCell align="left">{row.uri}</TableCell>
                </TableRow>
                ))}
            </TableBody>
            </Table>
        </TableContainer>
    )}
}
