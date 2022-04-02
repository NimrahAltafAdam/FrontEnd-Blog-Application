import {createAction, createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import axios from "axios";
import baseURL from "../../../utils/baseURL";


const resetMailAction = createAction("mail/reset"); 

//Create Mail
export const sendEmailAction = createAsyncThunk('email/send', async (mail, {rejectWithValue, getState, dispatch }) => {
    //get user token
    const user = getState()?.users;
    const {userAuth} = user;
    const config = {
      headers : {
        Authorization: `Bearer ${userAuth?.token}`
      }
    }
    //console.log(userAuth?.token);
    //http call
    try {
        const {data} = await axios.post(`${baseURL}/api/email`,{
            to: mail?.to,
            subject: mail?.subject,
            message: mail?.message
        }, config);
        console.log("email2", data)
        //dispatch action
        dispatch(resetMailAction());
        return data
      } catch (error) {
        if(!error?.response) {
          throw error;
        }
        return rejectWithValue(error?.response?.data);
      }
  });



  //slices
const emailSlices = createSlice({
    name : 'email', 
initialState: {},
extraReducers: (builder) => {
    //sendMail
    builder.addCase(sendEmailAction.pending, (state, action) => {
        state.loading = true;
        state.appErr = undefined;
        state.serverErr = undefined;
      });

      builder.addCase(resetMailAction, (state,action) => {
        state.isSent = true;
      })
      builder.addCase(sendEmailAction.fulfilled, (state, action) => {
        state.loading = false;
        state.mailSent = action?.payload;
        state.isSent = false;
        state.appErr = undefined;
        state.serverErr = undefined;
  
      });
      builder.addCase(sendEmailAction.rejected, (state, action) => {
        state.loading = false;
        state.appErr = action?.payload?.message;
        state.serverErr = action?.error?.message;
      });

}});

export default emailSlices.reducer;