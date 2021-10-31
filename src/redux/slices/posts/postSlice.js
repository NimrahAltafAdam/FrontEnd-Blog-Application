import {createAsyncThunk, createSlice, createAction} from "@reduxjs/toolkit";
import axios from "axios";
import baseURL from "../../../utils/baseURL";


const resetPost = createAction('post/reset-post');
//ACTIONS

//Create Post
export const createPostAction = createAsyncThunk('post/create', async (post, {rejectWithValue, getState, dispatch }) => {
  console.log("post1-", post);
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
    //Since we have to add an image with the profile we need to append the string and image data using FormData()
    const formData = new FormData();
    formData.append("title", post?.title);
    formData.append("description", post?.description);
    formData.append("category", post?.category?.label);
    formData.append("image", post?.image);

    console.log(formData, post )
    const {data} = await axios.post(`${baseURL}/api/posts`, formData, config);
    //dispatch action
    dispatch(resetPost());
    return data;
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

  builder.addCase(resetPost, (state,action) => {
    state.isCreated = true;
  })
  builder.addCase(createPostAction.fulfilled, (state, action) => {
    state.post = action?.payload
    state.loading = false;
    state.isCreated = false;
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