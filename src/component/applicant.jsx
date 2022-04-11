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
  Chip,
  LinearProgress,
  ButtonGroup,
  List,
  ListSubheader,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction,
  Divider
} from "@material-ui/core"; 

import Skeleton from '@material-ui/lab/Skeleton';

import { useHistory } from "react-router-dom";

import {
  PostAdd,
  Close,
  AccountCircle,
  Lock,
  Block,
  CheckCircleOutline,
  Done,
  HourglassEmpty,
  ArrowBack,
  AssignmentInd,
  PhoneAndroid,
  AlternateEmail,
  Subject,
  Event,
  Wc,
  Public,
  Stars,
  GetApp
} from "@material-ui/icons";

import {JobService} from "../utils/web_config";

import axios from 'axios';


const useStyles = makeStyles((theme) => ({
  title: {
    flexGrow: 1,
  }
}));


function Applicant(props){
  const classes = useStyles();
  const history=useHistory();

  const [hrProfile,setHrProfile]=useState({});

  useEffect(()=>{
    if(localStorage.getItem("hr_profile")==null){
      history.push("/login");
    }
    var data=JSON.parse(localStorage.getItem("hr_profile"));
    setHrProfile(data);
    console.log(history.location.state?.id);
    axios.defaults.baseURL = new JobService().BASE_URL;
    get_application(data.token,history.location.state?.id);
  },[])

  

  const [loading,setLoading]=useState(false);
  const [applicationInfo,setApplicationInfo]=useState({});
  const get_application=(token,id)=>{
    setLoading(true);
    const applicantsInstance=axios.create(new JobService().getHeaders(token));
    applicantsInstance.get("/api/v1/application/"+id)
    .then(res=>{
      var data=res.data.data;
      setApplicationInfo(data);
      setLoading(false);
    })
    .catch(err=>{
      setLoading(false);
    });
  }


  // download cv 

  const [cvLoading,setCvLoading]=useState(false);

  const view_cv=(id)=>{
    setCvLoading(true);
    const cvInstance=axios.create(new JobService().getHeaders(hrProfile.token));
    cvInstance.get("/api/v1/application/download/"+id)
    .then(res=>{
      setCvLoading(false);
    })
    .catch(err=>{
      setCvLoading(false);
    });
  }




  return(
    <div>
      <AppBar position="static">
     <Toolbar>
          <Box className={classes.title} ml={2}>
          <IconButton aria-label="upload picture" component="span" onClick={()=>{
            history.push("/home");
          }}>
          <ArrowBack color={"secondary"} />
          </IconButton>
              {/* <Typography variant="h6">{hrProfile?.first_name+" "+hrProfile?.last_name}</Typography> */}
          </Box>
          <IconButton onClick={()=>{
             localStorage.removeItem("hr_profile");
             history.push("/login");
          }}  aria-label="logout" component="span">
          <Lock fontSize="large" />
        </IconButton>
        </Toolbar>
      </AppBar>
      <Container maxWidth="sm">
        <Box mt={2}>
        <List subheader={<ListSubheader><Typography variant="h5">Applicant Details</Typography></ListSubheader>} >
        <Divider />
        <ListItem>
        <ListItemIcon>
          <AssignmentInd color={"primary"} />
        </ListItemIcon>
        <ListItemText id="names" primary="Names" />
        <ListItemSecondaryAction>
        {loading?<Skeleton variant="text" width={120} />:<Typography>{applicationInfo?.firstName}{applicationInfo?.lastName}</Typography>}
        </ListItemSecondaryAction>
      </ListItem>
      <Divider />
      <ListItem>
        <ListItemIcon>
          <PhoneAndroid color={"primary"}  />
        </ListItemIcon>
        <ListItemText id="phone" primary="Phone" />
        <ListItemSecondaryAction>
        {loading?<Skeleton variant="text" width={120}  />:<Typography>{applicationInfo?.phoneNumber}</Typography>}
        </ListItemSecondaryAction>
      </ListItem> 
      <Divider />
      <ListItem>
        <ListItemIcon>
          <AlternateEmail color={"primary"}  />
        </ListItemIcon>
        <ListItemText id="email" primary="Email" />
        <ListItemSecondaryAction>
        {loading?<Skeleton variant="text" width={120}  />:<Typography>{applicationInfo?.email}</Typography>}
        </ListItemSecondaryAction>
      </ListItem>  
      <Divider />
      <ListItem>
        <ListItemIcon>
          <Event color={"primary"}  />
        </ListItemIcon>
        <ListItemText id="birthdate" primary="Birth Date" />
        <ListItemSecondaryAction>
        {loading?<Skeleton variant="text" width={120}  />:<Typography>{applicationInfo?.birthDate}</Typography>}
        </ListItemSecondaryAction>
      </ListItem>
      <Divider />
      <ListItem>
        <ListItemIcon>
          <Wc color={"primary"}  />
        </ListItemIcon>
        <ListItemText id="gender" primary="Gender" />
        <ListItemSecondaryAction>
        {loading?<Skeleton variant="text" width={120}  />:<Typography>{applicationInfo?.gender}</Typography>}
        </ListItemSecondaryAction>
      </ListItem>  
      <Divider />
      <ListItem>
        <ListItemIcon>
          <Public color={"primary"}  />
        </ListItemIcon>
        <ListItemText id="country" primary="Country" />
        <ListItemSecondaryAction>
        {loading?<Skeleton variant="text" width={120}  />:<Typography>{applicationInfo?.country}</Typography>}
        </ListItemSecondaryAction>
      </ListItem>  
      <Divider />
      <ListItem>
        <ListItemIcon>
          <Stars color={"primary"}  />
        </ListItemIcon>
        <ListItemText id="status" primary="Status" />
        <ListItemSecondaryAction>
        {loading?<Skeleton variant="text" width={120}  />:
         <Box>
         {applicationInfo?.status=="PENDING"&&
         <Chip
         variant="outlined"
         size="small"
         label={"Pending"}
         icon={<HourglassEmpty />}
       ></Chip>
         }
         {applicationInfo?.status=="DROPPED"&&
         <Chip
         color="secondary"
         variant="outlined"
         size="small"
         label={"Dropped"}
         icon={<Block/>}
       ></Chip>
         }

         {applicationInfo?.status=="PASSED"&&
         <Chip
         color="primary"
         variant="outlined"
         size="small"
         label={"Passed"}
         icon={<CheckCircleOutline/>}
       ></Chip>
         }
       
   </Box>}
        </ListItemSecondaryAction>
      </ListItem> 
      <Divider />
      <ListItem>
        <ListItemIcon>
          <Subject color={"primary"}  />
        </ListItemIcon>
        <ListItemText id="cv" primary="CV / Resume" />
        <ListItemSecondaryAction>
        <IconButton
        onClick={()=>{
          const win = window.open("https://jobapplicationservice.herokuapp.com/job_application/api/v1/application/download/"+applicationInfo?.id, "_blank");
          win.focus();
        }}
        color="primary" aria-label="download-cv" component="span">
          {cvLoading?<CircularProgress fontSize={23}/>:<GetApp />}
        </IconButton>
        </ListItemSecondaryAction>
      </ListItem>

        </List>
        </Box>
      </Container>
    </div>
  );
}

export default Applicant;