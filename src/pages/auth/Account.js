import AccountInfo from '../AccountInfo';

export default function Account() {

    
    if(sessionStorage.getItem('customerId')){
        return (
            <div>
                <AccountInfo />
            </div>
        )
    } else {
        return(
            <div>
                <h1>You need to be logged in to view your camX Profile</h1>
            </div>
        )
    }
}
