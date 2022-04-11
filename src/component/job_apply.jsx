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
  Collapse
} from "@material-ui/core"; 
import Alert from '@material-ui/lab/Alert';

import {
  PostAdd,
  Close,
  CheckCircleOutline
} from "@material-ui/icons";

import {JobService} from "../utils/web_config";

import axios from 'axios';

const useStyles = makeStyles((theme) => ({
  form: {
    border:"solid 1px #000",
    borderRadius:8
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
}));

function getSteps() {
  return ['Personal Info', 'Upload your CV'];
}



function JobApply(props){
  const classes = useStyles();

  const [activeStep, setActiveStep] = useState(0);
  const [completed, setCompleted] = useState({});
  const steps = getSteps();

  const totalSteps = () => {
    return steps.length;
  };

  const completedSteps = () => {
    return Object.keys(completed).length;
  };

  const isLastStep = () => {
    return activeStep === totalSteps() - 1;
  };

  const allStepsCompleted = () => {
    return completedSteps() === totalSteps();
  };

  const handleNext = () => {
    const newActiveStep =
      isLastStep() && !allStepsCompleted()
        ? // It's the last step, but not all steps have been completed,
          // find the first step that has been completed
          steps.findIndex((step, i) => !(i in completed))
        : activeStep + 1;
    setActiveStep(newActiveStep);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleStep = (step) => () => {
    setActiveStep(step);
  };

  

  const handleReset = () => {
    setActiveStep(0);
    setCompleted({});
  };

  useEffect(()=>{
    axios.defaults.baseURL = new JobService().BASE_URL;
  },[]);

  const [open,setOpen]=useState(false);

  const [firstName,setFirstName]=useState({value:"",error:""});
  const [lastName,setLastName]=useState({value:"",error:""});
  const [phoneNumber,setPhoneNumber]=useState({value:"",error:""});
  const [email,setEmail]=useState({value:"",error:""});
  const [degree,setDegree]=useState({value:"",error:""});
  const [experience,setExperience]=useState({value:"",error:""});
  const [birthDate,setBirthDate]=useState({value:"",error:""});
  const [gender,setGender]=useState({value:"",error:""});
  const [country,setCountry]=useState({value:"",error:""});
  const [cv,setCv]=useState(null);

  // step one save 

  const [loading,setLoading]=useState(false);
  const save_profile=()=>{
    if(firstName.value==""){
      setFirstName({value:"",error:"Enter first name"});
    }else if(lastName.value==""){
      setLastName({value:"",error:"Enter last name"});
    }else if(phoneNumber.value==""){
      setPhoneNumber({value:"",error:"Enter phone number"});
    }else if(email.value==""){
      setEmail({value:"",error:"Enter your email"});
    }else if(degree.value==""){
      setDegree({value:"",error:"Select your degree"});
    }else if(experience.value==0){
      setExperience({value:"",error:"Atleast 1 year experience"});
    }else if(country.value==""){
      setCountry({value:"",error:"Enter your country"});
    }else if(gender.value==""){
      setGender({value:"",error:"Select your gender"});
    }else{
      setLoading(true);

      var obj={
        first_name:firstName.value,
        last_name:lastName.value,
        phone_number:phoneNumber.value,
        email:email.value,
        degree:degree.value,
        experience:experience.value,
        birth_date:birthDate.value,
        gender:gender.value,
        country:country.value
    }
      const saveInstance = axios.create(new JobService().getMsHeaders());
      saveInstance.post("/api/v1/application",obj)
      .then(res=>{
        var data=res.data.data;
        console.log(data);
        upload_cv(data.id);
      })
      .catch(err=>{
        setLoading(false);
        console.log(err);
      });

    }
  }

  // upload CV 

  const upload_cv=(id)=>{
    const data = new FormData()
    data.append('file',cv)
    const uploadInstance = axios.create(new JobService().getMsHeaders());
    uploadInstance.put("/api/v1/application/upload/"+id,data)
    .then(res=>{
      console.log("cv uploaded successful");
      console.log(res);
      setLoading(false);
      setOpen(true);

      // reset form 
      setActiveStep(0);
      setFirstName({value:"",error:""});
      setLastName({value:"",error:""});
      setPhoneNumber({value:"",error:""});
      setEmail({value:"",error:""});
      setDegree({value:"",error:""});
      setExperience({value:"",error:""});
      setBirthDate({value:"",error:""});
      setGender({value:"",error:""});
      setCountry({value:"",error:""});
      setCv(null);
    })
    .catch(err=>{
      setLoading(false);
      console.log(err);
    });
  }


  
  return(
    <div>
      <AppBar position="static">
        <Toolbar>
          <IconButton edge="start"  color="inherit" aria-label="menu">
            <PostAdd />
          </IconButton>
          <Typography variant="h6" >
            Submit Your Profile
          </Typography>

        
         
        </Toolbar>
      </AppBar>

     
      <Container maxWidth="sm">
      <Box mt={6}className={classes.form} p={4} >
      <Box display="flex" justifyContent="center"><Typography variant="h5">Submit Your Profile</Typography>
       
      </Box>
      <Collapse in={open}>
        <Alert
          action={
            <IconButton
              aria-label="close"
              color="inherit"
              size="small"
              onClick={() => {
                setOpen(false);
              }}
            >
              <Close fontSize="inherit" />
            </IconButton>
          }
        >
          Your profile submitted successfully!
        </Alert>
      </Collapse>
      <Stepper nonLinear activeStep={activeStep}>
        {steps.map((label, index) => (
          <Step key={label}>
            <StepButton onClick={handleStep(index)} completed={completed[index]}>
              {label}
            </StepButton>
          </Step>
        ))}
      </Stepper>
      <div>
        {allStepsCompleted() ? (
          <div>
            <Typography className={classes.instructions}>
              All steps completed - you&apos;re finished
            </Typography>
            <Button onClick={handleReset}>Reset</Button>
          </div>
        ) : (
          <div>

            {activeStep==0&&(
              <Box>
                <Box>
                  <Typography>First Name</Typography>
                </Box>
               <Box mt={1}>
               <TextField
                      size="small"
                      variant="outlined"
                      color="primary"
                      placeholder={"First Name"}
                      value={firstName.value}
                      label={"First Name"}
                      fullWidth
                      onChange={(e)=>{
                        if(e.target.value==""){
                          setFirstName({value:"",error:"Please provide first name"})
                        }else{
                          setFirstName({value:e.target.value,error:""})
                        }
                      }}
                      helperText={firstName.error}
                      error={firstName.error !== ""}
                    />
               </Box>

               <Box mt={1}>
                  <Typography>Last Name</Typography>
                </Box>
               <Box mt={1}>
               <TextField
                      size="small"
                      variant="outlined"
                      color="primary"
                      placeholder={"Last Name"}
                      label={"Last Name"}
                      value={lastName.value}
                      fullWidth
                      onChange={(e)=>{
                        if(e.target.value==""){
                          setLastName({value:"",error:"Please provide last name"})
                        }else{
                          setLastName({value:e.target.value,error:""})
                        }
                      }}
                      helperText={lastName.error}
                      error={lastName.error !== ""}
                    />
               </Box>
               <Box mt={1}>
                  <Typography>Email</Typography>
                </Box>
               <Box mt={1}>
               <TextField
                      size="small"
                      variant="outlined"
                      color="primary"
                      placeholder={"Email"}
                      label={"Email"}
                      value={email.value}
                      fullWidth
                      onChange={(e)=>{
                        if(e.target.value==""){
                          setEmail({value:"",error:"Please provide your email"})
                        }else{
                          setEmail({value:e.target.value,error:""})
                        }
                      }}
                      helperText={email.error}
                      error={email.error !== ""}
                    />
               </Box>

               <Box mt={1}>
                  <Typography>Phone Number</Typography>
                </Box>
               <Box mt={1}>
               <TextField
                      size="small"
                      variant="outlined"
                      color="primary"
                      type="tel"
                      placeholder={"Phone Number"}
                      value={phoneNumber.value}
                      label={"Start with 2507"}
                      fullWidth
                      onChange={(e)=>{
                        if(e.target.value==""){
                          setPhoneNumber({value:"",error:"Please provide your phone number"})
                        }else{
                          setPhoneNumber({value:e.target.value,error:""})
                        }
                      }}
                      helperText={phoneNumber.error}
                      error={phoneNumber.error !== ""}
                    />
               </Box>

               <Box mt={1}>
                  <Typography>Birth Date</Typography>
                </Box>
               <Box mt={1}>
               <TextField
                      size="small"
                      variant="outlined"
                      color="primary"
                      type="date"
                      placeholder={"Birth Date"}
                      fullWidth
                      onChange={(e)=>{
                        if(e.target.value==""){
                          setBirthDate({value:"",error:"Please provide birth date"})
                        }else{
                          setBirthDate({value:e.target.value,error:""})
                        }
                      }}
                      helperText={birthDate.error}
                      error={birthDate.error !== ""}
                    />
               </Box>


               
               <Box mt={1}>
               <FormControl  variant="outlined" size="small" fullWidth>
                  <InputLabel id="degree">Degree</InputLabel>
                  <Select
                    labelId="degree"
                    size="small"
                    value={degree.value}
                    onChange={(e)=>{
                      setDegree({value:e.target.value,error:""});
                    }}
                    label="Age"
                  >
                    <MenuItem value="">
                      <em>None</em>
                    </MenuItem>
                    <MenuItem value={"HIGH_SCHOOL"}>HIGH SCHOOL</MenuItem>
                    <MenuItem value={"DIPLOMA"}>DIPLOMA</MenuItem>
                    <MenuItem value={"BACHELOR"}>BACHELOR</MenuItem>
                    <MenuItem value={"MASTER"}>MASTER</MenuItem>
                    <MenuItem value={"PHD"}>PHD</MenuItem>
                  </Select>
                </FormControl>
               </Box>

               <Box mt={1}>
               <TextField
                      size="small"
                      variant="outlined"
                      color="primary"
                      type="number"
                      placeholder={"Experience"}
                      label={"Experience"}
                      value={experience.value}
                      fullWidth
                      onChange={(e)=>{
                        if(e.target.value==0){
                          setExperience({value:"",error:"Please provide your experience"})
                        }else{
                          setExperience({value:e.target.value,error:""})
                        }
                      }}
                      helperText={experience.error}
                      error={experience.error !== ""}
                    />
               </Box>

               <Box mt={1}>
               <FormControl  variant="outlined" size="small" fullWidth>
                  <InputLabel id="gender">Gender</InputLabel>
                  <Select
                    labelId="gender"
                    size="small"
                    value={gender.value}
                    onChange={(e)=>{
                      setGender({value:e.target.value,error:""});
                    }}
                    label="Age"
                  >
                    <MenuItem value="">
                      <em>None</em>
                    </MenuItem>
                    <MenuItem value={"MALE"}>Male</MenuItem>
                    <MenuItem value={"FEMALE"}>Female</MenuItem>
                  </Select>
                </FormControl>
               </Box>

               <Box mt={1}>
               <TextField
                      size="small"
                      variant="outlined"
                      color="primary"
                      type="text"
                      value={country.value}
                      placeholder={"Country"}
                      fullWidth
                      onChange={(e)=>{
                        if(e.target.value==""){
                          setCountry({value:"",error:"Fulfil country"})
                        }else{
                          setCountry({value:e.target.value,error:""})
                        }
                      }}
                      helperText={country.error}
                      error={country.error !== ""}
                    />
               </Box>

              </Box>
              
            )}

            {activeStep==1&&(
              <Box>
                <Box mt={1}>
               <TextField
                      size="small"
                      variant="outlined"
                      color="primary"
                      type="file"
                      placeholder={"Your CV"}
                      fullWidth
                      onChange={(e)=>{
                        setCv(e.target.files[0]);
                      }}
                      helperText={country.error}
                      error={country.error !== ""}
                    />
               </Box>
              </Box>
            )}

           

            <Box mt={1}>
              <Button disabled={activeStep === 0} onClick={handleBack} className={classes.button}>
                Back
              </Button>
              {loading==false?<Button
                disableElevation
                variant="contained"
                disabled={loading}
                color="primary"
                onClick={()=>{
                  if(activeStep==0){
                    handleNext();
                  }else{
                    save_profile();
                  }
                } }
                className={classes.button}
              >
                {activeStep==1&&loading!=true?"Submit":"Next"}
               
              </Button>: <Button
                disableElevation
                variant="contained"
                disabled={loading}
                color="primary"><CircularProgress size={23} /></Button>}
               
            </Box>
          </div>
        )}
      </div>
      </Box>
      </Container>
      
    </div>
  );

}

export default JobApply;