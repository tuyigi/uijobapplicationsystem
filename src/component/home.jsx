import React, { useState, useEffect } from "react";
import { makeStyles } from '@material-ui/core/styles';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Box,
  Chip,
  LinearProgress,
  ButtonGroup
} from "@material-ui/core"; 
import Alert from '@material-ui/lab/Alert';
import { useHistory } from "react-router-dom";
import MUIDataTable from "mui-datatables";

import {
  PostAdd,
  Close,
  AccountCircle,
  Lock,
  Block,
  CheckCircleOutline,
  Done,
  HourglassEmpty
} from "@material-ui/icons";

import {JobService} from "../utils/web_config";

import axios from 'axios';

const useStyles = makeStyles((theme) => ({
  title: {
    flexGrow: 1,
  }
}));




function Home(props){
  const classes = useStyles();
  const history=useHistory();

  const [hrProfile,setHrProfile]=useState({});

  useEffect(()=>{
    axios.defaults.baseURL = new JobService().BASE_URL;
    if(localStorage.getItem("hr_profile")==null){
      history.push("/login");
    }
    var data=JSON.parse(localStorage.getItem("hr_profile"));
    setHrProfile(data);
    get_applicatns(data.token);

  },[])

  const [loading,setLoading]=useState(true);
  const [message,setMessage]=useState("Loading...");
  const [applicants,setApplicants]=useState([]);

  const get_applicatns=(token)=>{

    const applicantsInstance=axios.create(new JobService().getHeaders(token));
    applicantsInstance.get("/api/v1/application")
    .then(res=>{
      var data=res.data.data;
      setApplicants(data);
      setLoading(false);
    })
    .catch(err=>{

    });

  }


const columns = [
  {
    name: "id",
    label: "id",
    options: {
      display:false,
     filter: true,
     sort: true,
    }
   },
  {
   name: "first_name",
   label: "First Name",
   options: {
    filter: true,
    sort: true,
   }
  },{
   name: "last_name",
   label: "Last Name",
   options: {
    filter: true,
    sort: false,
   }
  },
  {
    name: "email",
    label: "Email",
    options: {
     filter: true,
     sort: false,
    }
   },{
    name: "phone_number",
    label: "Phone Number",
    options: {
     filter: true,
     sort: true,
    }
   },{
    name: "gender",
    label: "Gender",
    options: {
     filter: true,
     sort: true,
    }
   },{
    name: "degree",
    label: "Degree",
    options: {
     filter: true,
     sort: true,
    }
   },
   {
    name: "birth_date",
    label: "Birth Date",
    options: {
     filter: true,
     sort: true,
    }
   },
   {
    name: "experience",
    label: "Experience",
    options: {
     filter: true,
     sort: true,
    }
   },
   {
    name: "status",
    label: "Status",
    options: {
     filter: true,
     sort: true,
     customBodyRender: (value, tableMeta, updateValue) => {

   
    
      if(value=="PENDING" || value=="DROPPED" || value=="PASSED"){
        
        return (
          <Box>
            {value=="PENDING"&&
            <Chip
            variant="outlined"
            size="small"
            label={"Pending"}
            icon={<HourglassEmpty />}
          ></Chip>
            }
            {value=="DROPPED"&&
            <Chip
            color="secondary"
            variant="outlined"
            size="small"
            label={"Dropped"}
            icon={<Block/>}
          ></Chip>
            }

            {value=="PASSED"&&
            <Chip
            color="primary"
            variant="outlined"
            size="small"
            label={"Passed"}
            icon={<CheckCircleOutline/>}
          ></Chip>
            }
          
      </Box>
            
        );
      }else{
        return (
          <Chip
          color="primary"
          label={"Invalid"}
          size="small"
          variant="outlined"
          icon={<Done />}

        ></Chip>
            
        );
      }

       
    
   }
    }
   },
   {
    name: "id",
    label: "Action",
    options: {
     filter: true,
     sort: true,
     customBodyRender: (value, tableMeta, updateValue) => {
      var obj=applicants.filter((o)=>o.id==value)[0];
     return (
          <Box>
            <ButtonGroup disableElevation variant="contained" >
             
              <Button color="primary" disabled={obj.status=="PASSED"} onClick={()=>{
                pass_application(value);
              }}>Pass</Button>
              <Button color="secondary" disabled={obj.status=="DROPPED"} onClick={()=>{
                drop_application(value);
              }}>Drop</Button>
            </ButtonGroup>
         </Box>

        );
    
    
   }
    }
   }
 ];
 
 const options = {
  textLabels: {
    body: {
      noMatch: message
    },
  },
   filterType: 'checkbox',
   download:true,
   responsive:"standard",
   selectableRows:"single",
   rowsPerPage: 10,
   elevation:0,
   customToolbarSelect: (selectedRows, displayData, setSelectedRows) => (
    <Box display="flex">
      <Button variant="outlined" color="primary" onClick={()=>{
       var id=displayData[selectedRows.data[0]['index']]['data'][0];
       history.push("/applicant",{id:id});
      }}>View Details</Button>
    </Box>
      )
 };


 const drop_application=(id)=>{
    setLoading(true);
    const dropInstance=axios.create(new JobService().getHeaders(hrProfile.token));
    dropInstance.put("/api/v1/application/drop/"+id)
    .then(res=>{
      var objs=applicants;
      var index=objs.findIndex((o)=>o.id==id);
      objs[index]['status']="DROPPED";
      setApplicants(objs);
      setLoading(false);
    })
    .catch(err=>{
      setLoading(false);
    })

 }


 const pass_application=(id)=>{
    setLoading(true);
    const dropInstance=axios.create(new JobService().getHeaders(hrProfile.token));
    dropInstance.put("/api/v1/application/pass/"+id)
    .then(res=>{
      var objs=applicants;
      var index=objs.findIndex((o)=>o.id==id);
      objs[index]['status']="PASSED";
      setApplicants(objs);
      setLoading(false);
    })
    .catch(err=>{
      setLoading(false);
    })

 }

  return(
  <div>
     <AppBar position="static">
     <Toolbar>
         <AccountCircle fontSize="large"/>
          <Box className={classes.title} ml={2}>
              <Typography variant="h6">{hrProfile?.first_name+" "+hrProfile?.last_name}</Typography>
          </Box>
          <IconButton 
          onClick={()=>{
            localStorage.removeItem("hr_profile");
            history.push("/login");
          }}  aria-label="logout" component="span">
          <Lock fontSize="large" />
        </IconButton>
        </Toolbar>
      </AppBar>
      <Box mt={2}>
      {loading&&<LinearProgress />}
      <MUIDataTable
        title={"Applicants"}
        data={applicants}
        columns={columns}
        options={options}
      />
      </Box>

  </div>
  );

}

export default Home