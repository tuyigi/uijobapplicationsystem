import React, { useState, useEffect } from "react";
import { makeStyles } from '@material-ui/core/styles';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Container,
  Stepper,
  Step,
  StepButton,
  Box,
  TextField,
  FormControl,
  MenuItem,
  InputLabel,
  Select,
  CircularProgress,
  Collapse,
  Paper
} from "@material-ui/core"; 
import Alert from '@material-ui/lab/Alert';

import {
  PostAdd,
  Close,
  CheckCircleOutline,
  AccountCircle
} from "@material-ui/icons";

import {JobService} from "../utils/web_config";

import { useHistory } from "react-router-dom";

import { useSnackbar } from "notistack";

import axios from 'axios';
const useStyles = makeStyles((theme) => ({
 paper: {
    padding: 15,
  },
}));

function Login(props){
  const classes = useStyles();
  const history = useHistory();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  useEffect(()=>{
    axios.defaults.baseURL = new JobService().BASE_URL;
  },[]);

  const [loading,setLoading]=useState(false);
  const [username,setUsername]=useState({value:"",error:""});
  const [password,setPassword]=useState({value:"",error:""});


  const login=()=>{
    if(username.value==""){
      setUsername({value:"",error:"Enter username"});
    }else if(password.value==""){
      setPassword({value:"",error:"Enter password"});
    }else{
      var obj={
        username:username.value,
        password:password.value
      }
      setLoading(true);
      const loginInstance = axios.create(new JobService().getMsHeaders());
      loginInstance.post("/api/v1/authenticate",obj)
      .then(res=>{
        enqueueSnackbar("Logged in successful", {
          variant: "success",
          action: (k) => (
            <IconButton
              onClick={() => {
                closeSnackbar(k);
              }}
              size="small"
            >
              <Close fontSize="small" />
            </IconButton>
          ),
        });

        var data=res.data.data;
        localStorage.setItem("hr_profile", JSON.stringify(res.data.data));
        history.push("/home");
        setLoading(false);

      })
      .catch(err=>{
        var e = err.message;
        if (err.response) {
          e = err.response.data.message;
          enqueueSnackbar(e, {
            variant: "error",
            action: (k) => (
              <IconButton
                onClick={() => {
                  closeSnackbar(k);
                }}
                size="small"
              >
                <Close fontSize="small" />
              </IconButton>
            ),
          });
        }
       

        setLoading(false);
      });
    }

  }
  
  return(
  <div>

      <AppBar position="static">
        <Toolbar>

        </Toolbar>
      </AppBar>

      <Container maxWidth="sm">
      <Box pt={12}>
            <Paper className={classes.paper}>
            <Box p={2} display="flex" flexDirection="column">
                <Box display="flex" alignItems="center" justifyContent="center">
                  <Box mr={2}>
                    <AccountCircle color="primary" fontSize="large" />
                  </Box>
                  <Typography variant="h4">
                    Hello
                  </Typography>
                </Box>
                <Typography color="textSecondary" align="center">
                 Welcome on HR Admin
                </Typography>
              </Box>

              <Box mt={2}>
              <TextField
                      size="small"
                      variant="outlined"
                      color="primary"
                      placeholder={"Username"}
                      value={username.value}
                      label={"Username"}
                      fullWidth
                      onChange={(e)=>{
                        setUsername({value:e.target.value,error:""});
                      }}
                      helperText={username.error}
                      error={username.error !== ""}
                    />
              </Box>
              <Box mt={2}>
              <TextField
                      size="small"
                      variant="outlined"
                      color="primary"
                      type="password"
                      value={password.value}
                      placeholder={"Password"}
                      label={"Password"}
                      fullWidth
                      onChange={(e)=>{
                        setPassword({value:e.target.value,error:""});
                      }}
                      helperText={password.error}
                      error={password.error !== ""}
                    />
              </Box>
              <Box mt={2} mb={6}>
                <Button
                  type="submit"
                  color="primary"
                  fullWidth
                  variant="contained"
                  disableElevation
                  disabled={loading}
                  onClick={login}
                >
                  {loading ? (
                    <CircularProgress size={25} />
                  ) : (
                    "Login"
                  )}
                </Button>
              </Box>
            
            </Paper>
      </Box>

        </Container>



  </div>
  );

}

export default Login;