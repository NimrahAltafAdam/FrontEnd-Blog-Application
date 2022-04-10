import { createAsyncThunk, createSlice, createAction } from "@reduxjs/toolkit";
import axios from "axios";
import baseURL from "../../../utils/baseURL";

//action for redirect
const resetAcc = createAction("account/verify-reset");

//Create Mail
export const accVerificationSendTokenAction = createAsyncThunk('account/token', async (accDetails, {rejectWithValue, getState, dispatch }) => {
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
        const {data} = await axios.post(`${baseURL}/api/users/generate-verify-email-token`,{}, config);
        //dispatch action
        //dispatch(resetMailAction());
        return data
      } catch (error) {
        if(!error?.response) {
          throw error;
        }
        return rejectWithValue(error?.response?.data);
      }
  });

  //verify account
export const verifyAccountAction = createAsyncThunk('account/verify', async (token, {rejectWithValue, getState, dispatch }) => {
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
      const {data} = await axios.put(`${baseURL}/api/users/verify-account`,{token}, config);
      //dispatch action
      dispatch(resetAcc());
      return data
    } catch (error) {
      if(!error?.response) {
        throw error;
      }
      return rejectWithValue(error?.response?.data);
    }
});



  //slices
const accVerificationSlices = createSlice({
    name : 'accVerification', 
initialState: {},
extraReducers: (builder) => {
    //verificationToken
    builder.addCase(accVerificationSendTokenAction.pending, (state, action) => {
        state.loading = true;
        state.appErr = undefined;
        state.serverErr = undefined;
      });

      /*builder.addCase(accVerificationAction, (state,action) => {
        state.isSent = true;
      })*/
      builder.addCase(accVerificationSendTokenAction.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action?.payload;
        //state.isSent = false;
        state.appErr = undefined;
        state.serverErr = undefined;
  
      });
      builder.addCase(accVerificationSendTokenAction.rejected, (state, action) => {
        state.loading = false;
        state.appErr = action?.payload?.message;
        state.serverErr = action?.error?.message;
      });

    //accVerified
    builder.addCase(verifyAccountAction.pending, (state, action) => {
      state.loading = true;
      state.appErr = undefined;
      state.serverErr = undefined;
    });

    builder.addCase(resetAcc, (state,action) => {
      state.isVerified = true;
    })
    builder.addCase(verifyAccountAction.fulfilled, (state, action) => {
      state.loading = false;
      state.verified = action?.payload;
      state.isVerified = false;
      state.appErr = undefined;
      state.serverErr = undefined;

    });
    builder.addCase(verifyAccountAction.rejected, (state, action) => {
      state.loading = false;
      state.appErr = action?.payload?.message;
      state.serverErr = action?.error?.message;
    });

}});

export default accVerificationSlices.reducer;