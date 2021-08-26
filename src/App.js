import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import './App.css';
import LoginForm from "./pages/LoginForm";
import Logout from "./pages/auth/Logout";
import Main from './pages/auth/Main';
import SignUp from "./pages/Signup";
import Account from './pages/auth/Account'


function App() {
  const reload = () => window.location.reload();
  return (
    <Router>
        <Switch>
          <Route path="/home">
            <Main />
          </Route>
          <Route path="/login">
            <LoginForm />
          </Route>
          <Route path="/logout">
            <Logout />
          </Route>
          <Route path="/signup">
            <SignUp />
          </Route>
          <Route path="/account">
            <Account />
          </Route>
          <Route path="/streams/:hwId" onEnter={reload} />
        </Switch>
    </Router>
  );
}

export default App;
