import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import './App.css';
import Main from './components/Main';

function App() {
  return (
    <Router>
        <Switch>
          <Route path="/">
            <Main />
          </Route>
        </Switch>
    </Router>
  );
}

export default App;
