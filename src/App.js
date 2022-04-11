import logo from './logo.svg';
import './App.css';
import {
  BrowserRouter as Router,
  Route,
  Switch,
  useHistory,
} from "react-router-dom";

import JobApply from "./component/job_apply";
import Login from "./component/login";
import Home from "./component/home";
import Applicant from "./component/applicant";

function App(props) {
  return (
    <Router>
        <Switch>
          <Route exact path="/" component={() => <JobApply {...props} />} />
          <Route path="/login" component={() => <Login {...props} />} />
          <Route path="/home" component={() => <Home {...props} />} />
          <Route path="/applicant" component={() => <Applicant {...props} />} />
        </Switch>
      </Router>
  );
}

export default App;
