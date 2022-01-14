import {createAsyncThunk, createSlice, createAction} from "@reduxjs/toolkit";
import axios from "axios";
import baseURL from "../../../utils/baseURL";


const resetPost = createAction('post/reset-post');
const resetPostEditAction = createAction('post/update-post');
const resetPostDeleteAction = createAction('category/reset-delete')
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
    formData.append("category", post?.category);
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


//Fetch all posts
export const fetchPostsAction = createAsyncThunk('post/fetch', async (postCategory, {rejectWithValue, getState, dispatch}) => {

  //http call
  try {
    const {data} = await axios.get(`${baseURL}/api/posts?category=${postCategory}`);
    console.log(data);
    return data
  } catch (error) {
    if(!error?.response) {
      throw error;
    }
    return rejectWithValue(error?.response?.data);
  }
});


//Add Likes to post

export const toggleAddLikesToPost = createAsyncThunk('post/like', 

  async (postId, {rejectWithValue, getState, dispatch}) => {

  //Get User Token
  const user = getState()?.users;
  const {userAuth} = user;
  const config = {
    headers : {
      Authorization: `Bearer ${userAuth?.token}`
    }
  };
  try {
    const {data} = await axios.put(`http://localhost:4000/api/posts/likes`, { postId }, config);
    return data;
  } catch (error) {
    if(!error?.response) throw error;
    return rejectWithValue(error?.response?.data);
  }
});

//Add dislikes to post

export const toggleAddDisLikesToPost = createAsyncThunk('post/dislike',
  async (postId, {rejectWithValue, getState, dispatch}) => {

    //Get user tOKEN
    const user = getState()?.users;
    const {userAuth} = user;
    const config = {
      headers : {
        Authorization: `Bearer ${userAuth?.token}`
      }
    };
    try {
      const {data} = await axios.put(`${baseURL}/api/posts/dislikes`, { postId }, config);
      return data;
    } catch (error) {
      if(!error?.response) throw error;
      return rejectWithValue(error?.response?.data);
    }
  });

  //PostDetails
  export const fetchPostDetailsAction = createAsyncThunk('post/detail', 
  async (id, {rejectWithValue, getState, dispatch}) => {
    //Get User Token
    const user = getState()?.users;
    const {userAuth} = user;
    const config = {
    headers : {
      Authorization: `Bearer ${userAuth?.token}`
    }};

    try {
      const {data} = await axios.get(`${baseURL}/api/posts/${id}`, config);
      return data
    } catch (error) {
      if(!error?.response) {
        throw error;
      }
      return rejectWithValue(error?.response?.data);
    }
  });

  //UpdatePost
  export const updatePostAction = createAsyncThunk('post/update', async (post, {rejectWithValue, getState, dispatch}) => {

    //get userToken
    const user = getState()?.users;
    const {userAuth} = user;
    const config = {
      headers : {
        Authorization : `Bearer ${userAuth?.token}`
      }
    };

    try {
      const data = await axios.put(`${baseURL}/api/posts/${post?.id}`, post,
      /*{title: post?.title,
       description: post?.description
      }*/ config);
      //dispatch action to reset the updated data
      dispatch(resetPostEditAction());
      return data
    } catch (error) {
      if(!error?.response) {
        throw error;
      }
      return rejectWithValue(error?.response?.data);
    }
  });


  //delete
export const deletePostAction = createAsyncThunk('post/delete', async (id, {rejectWithValue, getState, dispatch}) => {
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
    const {data} = await axios.delete(`${baseURL}/api/posts/${id}`, config);
    dispatch(resetPostDeleteAction())
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

  //Fetch PostList
  builder.addCase(fetchPostsAction.pending, (state, action) => {
    state.loading = true;
  });

  builder.addCase(fetchPostsAction.fulfilled, (state, action) => {
    state.postList = action?.payload
    state.loading = false;
    state.appErr = undefined;
    state.serverErr = undefined; 
  });
  builder.addCase(fetchPostsAction.rejected, (state, action) => {
    state.loading = false;
    state.appErr = action?.payload?.message;
    state.serverErr = action?.error?.message;
  });


  //Likes
  builder.addCase(toggleAddLikesToPost.pending, (state, action) => {
    state.loading = true;
  });

  builder.addCase(toggleAddLikesToPost.fulfilled, (state, action) => {
    state.likes = action?.payload
    state.loading = false;
    state.appErr = undefined;
    state.serverErr = undefined; 
  });
  builder.addCase(toggleAddLikesToPost.rejected, (state, action) => {
    state.loading = false;
    state.appErr = action?.payload?.message;
    state.serverErr = action?.error?.message;
  });

  //DisLikes
  builder.addCase(toggleAddDisLikesToPost.pending, (state, action) => {
    state.loading = true;
  });

  builder.addCase(toggleAddDisLikesToPost.fulfilled, (state, action) => {
    state.dislikes = action?.payload
    state.loading = false;
    state.appErr = undefined;
    state.serverErr = undefined; 
  });
  builder.addCase(toggleAddDisLikesToPost.rejected, (state, action) => {
    state.loading = false;
    state.appErr = action?.payload?.message;
    state.serverErr = action?.error?.message;
  });

  //PostDetails
  builder.addCase(fetchPostDetailsAction.pending, (state, action) => {
    state.loading = true;
  });

  builder.addCase(fetchPostDetailsAction.fulfilled, (state, action) => {
    state.postDetails = action?.payload
    state.loading = false;
    state.appErr = undefined;
    state.serverErr = undefined; 
  });
  builder.addCase(fetchPostDetailsAction.rejected, (state, action) => {
    state.loading = false;
    state.appErr = action?.payload?.message;
    state.serverErr = action?.error?.message;
  });

  //UpdatePost
  builder.addCase(updatePostAction.pending, (state, action) => {
    state.loading = true;
  });

  //Dispatch action-Since this is a custom action we do not need to handle pending or fulfilled condition as it is not making any request to the backend
  builder.addCase(resetPostEditAction, (state,action) => {
    state.isUpdated = true;
  })

  builder.addCase(updatePostAction.fulfilled, (state, action) => {
    state.updatePost = action?.payload
    state.loading = false;
    state.isUpdated = false;
    state.appErr = undefined;
    state.serverErr = undefined; 
  });
  builder.addCase(updatePostAction.rejected, (state, action) => {
    state.loading = false;
    state.appErr = action?.payload?.message;
    state.serverErr = action?.error?.message;
  });

  //Delete Post
  builder.addCase(deletePostAction.pending, (state, action) => {
    state.loading = true;
  });
  //dispatch for redirect
  builder.addCase(resetPostDeleteAction, (state,action) => {
    state.isDeleted = true;
  })
  builder.addCase(deletePostAction.fulfilled, (state, action) => {
    state.deletedCategory = action?.payload;
    state.loading = false;
    state.isDeleted = false;
    state.appErr = undefined;
    state.serverErr = undefined; 
  });
  builder.addCase(deletePostAction.rejected, (state, action) => {
    state.loading = false;
    state.appErr = action?.payload?.message;
    state.serverErr = action?.error?.message;
  });

  
}});

export default postSlices.reducer;