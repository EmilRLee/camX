import Webcams from './Webcams';

export default function Main() {

    
    if(sessionStorage.getItem('customerId')){
        return (
            <div>
                <p>camX</p>
                <Webcams />
            </div>
        )
    } else {
        return(
            <div>
                <h1>You need to be logged in to view your camX devices</h1>
            </div>
        )
    }
}
