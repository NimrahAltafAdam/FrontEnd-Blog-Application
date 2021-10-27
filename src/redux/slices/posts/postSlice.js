import {createAsyncThunk, createSlice, createAction} from "@reduxjs/toolkit";
import axios from "axios";
import baseURL from "../../../utils/baseURL";

//ACTIONS

//Create Post
export const createPostAction = createAsyncThunk('post/create', async (post, {rejectWithValue, getState, dispatch }) => {
  //get user token
  const user = getState()?.users;
  const {userAuth} = user;
  const config = {
    headers : {
      Authorization: `Bearer ${userAuth?.token}`
    }
  }
  console.log(userAuth?.token);
  //http call
  try {
    const {data} = await axios.post(`${baseURL}/api/posts`, post, config);
    return data
  } catch (error) {
    if(!error?.response) {
      throw error;
    }
    return rejectWithValue(error?.response?.data);
  }
});

//slices
const postSlices = createSlice({name : 'post', 
initialState: {},
extraReducers: (builder) => {
   //create
   builder.addCase(createPostAction.pending, (state, action) => {
    state.loading = true;
  });
  builder.addCase(createPostAction.fulfilled, (state, action) => {
    state.post = action?.payload
    state.loading = false;
    state.appErr = undefined;
    state.serverErr = undefined; 
  });
  builder.addCase(createPostAction.rejected, (state, action) => {
    state.loading = false;
    state.appErr = action?.payload?.message;
    state.serverErr = action?.error?.message;
  });
}});

export default postSlices.reducer;