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

import { SnackbarProvider } from "notistack";

function App(props) {
  return (
    <SnackbarProvider
    preventDuplicate
    anchorOrigin={{
      vertical: "bottom",
      horizontal: "right",
    }}
    maxSnack={2}
  >
    <Router>
        <Switch>
          <Route exact path="/" component={() => <JobApply {...props} />} />
          <Route path="/login" component={() => <Login {...props} />} />
          <Route path="/home" component={() => <Home {...props} />} />
          <Route path="/applicant" component={() => <Applicant {...props} />} />
        </Switch>
      </Router>
    </SnackbarProvider>
  );
}

export default App;
