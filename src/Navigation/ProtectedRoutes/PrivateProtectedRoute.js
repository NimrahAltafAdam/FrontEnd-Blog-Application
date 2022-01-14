
//120-Protect Route
import React from 'react';
import {Route, Redirect} from "react-router-dom";
//STEP 2- WE will first have to check the state if the user is logged in or not for this we will use useSelector
import {useSelector} from "react-redux";



//1st STEP-here we are basically creating a custom component that will be returned along with the protected route. 
//the rest of the stauff like exact path are provided using the sprea operator and we have also used the spread operator 
//along with the component as sometimes we have to pass hisotory ect. as well  
export const PrivateProtectedRoute = ({component : Component, ...rest }) => {
  //check if user is logged in or not
  const user = useSelector(state => state?.users);
  const {userAuth} = user;
  return (
    <Route 
    {...rest} 
    render = {() => 
      userAuth ? <Component {...rest} /> : <Redirect to = "/login" />
    } 
    />
  )
}
