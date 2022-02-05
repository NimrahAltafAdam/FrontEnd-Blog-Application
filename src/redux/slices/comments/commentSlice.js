
import {createAsyncThunk, createSlice, createAction} from "@reduxjs/toolkit";
import axios from "axios";
import baseURL from "../../../utils/baseURL";

const resetCommentEditAction = createAction('comment/update-comment');

//ACTIONS

export const createCommentAction = createAsyncThunk('comment/create', async(comment,{rejectWithValue, getState, dispatch})=> {
    //get user token
    const user = getState()?.users;
    const {userAuth} = user;
    const config = {
        headers : {
            Authorization : `Bearer ${userAuth?.token}`
        }
    }
    
    //http call
    try {
        const {data} = await axios.post(`${baseURL}/api/comments`, {
            description : comment?.description,
            postId: comment?.postId
        }, config);
        return data
    } catch (error) {
        if(!error?.response) {
            throw error;
          }
          return rejectWithValue(error?.response?.data);
    }
});

//DeleteComment
export const deleteCommentAction = createAsyncThunk('comment/delete', async(commentId,{rejectWithValue, getState, dispatch})=> {
    //get user token
    const user = getState()?.users;
    const {userAuth} = user;
    const config = {
        headers : {
            Authorization : `Bearer ${userAuth?.token}`
        }
    }
    
    //http call
    try {
        const {data} = await axios.delete(`${baseURL}/api/comments/${commentId}`, config);
        return data
    } catch (error) {
        if(!error?.response) {
            throw error;
          }
          return rejectWithValue(error?.response?.data);
    }
});

//UpdateComment
export const updateCommentAction = createAsyncThunk('comment/update', async (comment, {rejectWithValue, getState, dispatch}) => {

    //get userToken
    const user = getState()?.users;
    const {userAuth} = user;
    const config = {
      headers : {
        Authorization : `Bearer ${userAuth?.token}`
      }
    };

    try {
      const data = await axios.put(`${baseURL}/api/comments/${comment?.id}`, comment,
      config);
      //dispatch action to reset the updated data
      dispatch(resetCommentEditAction());
      return data
    } catch (error) {
      if(!error?.response) {
        throw error;
      }
      return rejectWithValue(error?.response?.data);
    }
  });

  //Comment
  export const fetchACommentAction = createAsyncThunk('comment/detail', 
  async (id, {rejectWithValue, getState, dispatch}) => {
    //Get User Token
    const user = getState()?.users;
    const {userAuth} = user;
    const config = {
    headers : {
      Authorization: `Bearer ${userAuth?.token}`
    }};

    try {
      const {data} = await axios.get(`${baseURL}/api/comments/${id}`, config);
      return data
    } catch (error) {
      if(!error?.response) throw error;
        return rejectWithValue(error?.response?.data);
    }
  });

//SLICES

const commentSlices = createSlice({
    name: 'comment',
    initialState: {},
    extraReducers: (builder) => {
        //create
        builder.addCase(createCommentAction.pending, (state, action) => {
            state.loading = true;
        });
        builder.addCase(createCommentAction.fulfilled, (state, action) => {
            state.commentCreated = action?.payload;
            state.isCreated = false;
            state.loading = false;
            state.appErr = undefined;
            state.serverErr = undefined;
        });
        builder.addCase(createCommentAction.rejected, (state, action) => {
            state.loading = false;
            state.appErr = action?.payload?.message;
            state.serverErr = action?.error?.message;
        });

         //delete
         builder.addCase(deleteCommentAction.pending, (state, action) => {
            state.loading = true;
        });
        builder.addCase(deleteCommentAction.fulfilled, (state, action) => {
            state.commentDeleted = action?.payload;
            state.isDeleted = false;
            state.loading = false;
            state.appErr = undefined;
            state.serverErr = undefined;
        });
        builder.addCase(deleteCommentAction.rejected, (state, action) => {
            state.loading = false;
            state.appErr = action?.payload?.message;
            state.serverErr = action?.error?.message;
        });

        //update
        builder.addCase(updateCommentAction.pending, (state, action) => {
            state.loading = true;
        });

        //Dispatch action-Since this is a custom action we do not need to handle pending or fulfilled condition as it is not making any request to the backend
        builder.addCase(resetCommentEditAction, (state,action) => {
        state.isUpdated = true;
        });

        builder.addCase(updateCommentAction.fulfilled, (state, action) => {
            state.commentUpdated = action?.payload;
            state.isUpdated = false;
            state.loading = false;
            state.appErr = undefined;
            state.serverErr = undefined;
        });
        builder.addCase(updateCommentAction.rejected, (state, action) => {
            state.loading = false;
            state.appErr = action?.payload?.message;
            state.serverErr = action?.error?.message;
        });

        //fetchAComment
        builder.addCase(fetchACommentAction.pending, (state, action) => {
            state.loading = true;
        });
        builder.addCase(fetchACommentAction.fulfilled, (state, action) => {
            state.commentFetched = action?.payload;
            state.loading = false;
            state.appErr = undefined;
            state.serverErr = undefined;
        });
        builder.addCase(fetchACommentAction.rejected, (state, action) => {
            state.loading = false;
            state.appErr = action?.payload?.message;
            state.serverErr = action?.error?.message;
        });
    }
})

export default commentSlices.reducer;