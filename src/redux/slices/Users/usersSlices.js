import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import axios from "axios";
import baseURL from "../../../utils/baseURL";


//register action
//first you need to create a payload for this register action. in this case it will be called user
//we have added rejectWithValue so that we can display user friendly errors
export const registerUserAction = createAsyncThunk('users/register', async (user, {rejectWithValue, getState, dispatch})=>{
  try {
    //http call
    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };
    const {data} = await axios.post(`${baseURL}/api/users/register`, user, config);
    return data;
  } catch (error) {
    if(!error?.response) {
      throw error;
    }
    return rejectWithValue(error?.response?.data);
  };
} );

//Login Action
export const loginUserAction = createAsyncThunk(
  'user\login', //We will pass action type as a parameter
  async (userData, {rejectWithValue, getState, dispatch}) => {
    //config
    const config = {
      headers : {
        'Content-Type': 'application/json',
      }
    };
    try {
      //make http call
      const {data} = await axios.post(`${baseURL}/api/users/login`, userData, config);
      //save user into local storage
      localStorage.setItem('userInfo', JSON.stringify(data));
      return data;
    } catch (error) {
      if(!error?.response) {
        throw error;
      }
      return rejectWithValue(error?.response?.data);
    }
  } // then a function with parameters that will take the payload from frontend
);

//Logout
export const logoutUserAction = createAsyncThunk(
  'user\logout', //We will pass action type as a parameter
  async (payload, {rejectWithValue, getState, dispatch}) => {
    try {
      localStorage.removeItem('userInfo');
    } catch (error) {
      if(!error?.response) {
        throw error;
      }
      return rejectWithValue(error?.response);
    }
  } // then a function with parameters that will take the payload from frontend
);

//now we have to redirect users to their profile. for this we will get the user detail saved in the local storage and populate the initialState

//get user from the local storage and place into store
const userLoginFromStorage = localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')) : null;

//slices
// we have to handle all our reducers inside slices
const usersSlices = createSlice({
  name: 'users',
  initialState: {
    userAuth : userLoginFromStorage
  },
  extraReducers: (builder) => {
    builder.addCase(registerUserAction.pending, (state, action) => {
      state.loading = true;
      state.appErr = undefined;
      state.serverErr = undefined;
    });
    builder.addCase(registerUserAction.fulfilled, (state, action) => {
      state.registered = action?.payload;
      state.appErr = undefined;
      state.serverErr = undefined;

    });
    builder.addCase(registerUserAction.rejected, (state, action) => {
      state.loading = false;
      state.appErr = action?.payload?.message;
      state.serverErr = action?.error?.message;
    });

    //login
    builder.addCase(loginUserAction.pending, (state, action) => {
      state.loading = true;
      state.appErr = undefined;
      state.serverErr = undefined;
    });
    builder.addCase(loginUserAction.fulfilled, (state, action) => {
      state.userAuth = action?.payload;
      state.loading = false
      state.appErr = undefined;
      state.serverErr = undefined;
    });
    builder.addCase(loginUserAction.rejected, (state, action) => {
      state.loading = false;
      state.appErr = action?.payload?.message;
      state.serverErr = action?.error?.message;
    })
    //logout
    builder.addCase(logoutUserAction.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(logoutUserAction.fulfilled, (state, action) => {
      state.userAuth = undefined;
      state.loading = false
      state.appErr = undefined;
      state.serverErr = undefined;
    });
    builder.addCase(logoutUserAction.rejected, (state, action) => {
      state.loading = false;
      state.appErr = action?.payload?.message;
      state.serverErr = action?.error?.message;
    })
  }
});




export default usersSlices.reducer;


