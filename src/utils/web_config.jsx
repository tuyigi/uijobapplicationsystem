import React, { useEffect } from "react";

class JobService {
  constructor() {
  
    this.ORIGIN = process.env.REACT_APP_ORIGIN;
    this.BASE_URL = process.env.REACT_APP_BASE_URL;
    
    this.SAVE_CONDIDATE_PROFILE = this.BASE_URL + "/api/v1/application";
    this.UPLOAD_CONDIDATE_CV= this.BASE_URL + "/api/v1/application/upload/";

  }

  getHeaders = (token) => {
    return {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": this.ORIGIN,
        Authorization: "Bearer " + token,
      },
    };
  };

  getMsHeaders = () => {
    return {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": this.ORIGIN,
      },
    };
  };
}



export {
  JobService
};
