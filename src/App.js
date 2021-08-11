import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import './App.css';
import LoginForm from "./components/LoginForm";
import Logout from "./components/Logout";
import Main from './components/Main';

function App() {
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
        </Switch>
    </Router>
  );
}

export default App;
