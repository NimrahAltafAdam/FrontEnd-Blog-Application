
import {createAsyncThunk, createSlice, createAction} from "@reduxjs/toolkit";
import axios from "axios";
import baseURL from "../../../utils/baseURL";

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
        const {data} = axios.post(`${baseURL}/api/comments`, {
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
            state.comment = action?.payload;
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
    }
})

export default commentSlices.reducer;