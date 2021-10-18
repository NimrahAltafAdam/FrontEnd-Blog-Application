import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import axios from "axios";
import baseURL from "../../../utils/baseURL";


//action
//create category
//category parameter means the data we will recieve from the form
export const createCategoryAction = createAsyncThunk('category/create', async (category, {rejectWithValue, getState, dispatch}) => {
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
    const {data} = await axios.post(`${baseURL}/api/category`, {
      title: category?.title
    }, config
    );
    return data
  } catch (error) {
    if(!error?.response) {
      throw error;
    }
    return rejectWithValue(error?.response?.data);
  }
});
//Fetch all categories
export const fetchCategoriesAction = createAsyncThunk('category/fetch', async (category, {rejectWithValue, getState, dispatch}) => {
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
    const {data} = await axios.get(`${baseURL}/api/category`, config);
    return data
  } catch (error) {
    if(!error?.response) {
      throw error;
    }
    return rejectWithValue(error?.response?.data);
  }
});




//slices 
const categorySlices = createSlice({name: 'category',
initialState: {},
extraReducers : (builder) => {
  //create
  builder.addCase(createCategoryAction.pending, (state, action) => {
    state.loading = true;
  });
  builder.addCase(createCategoryAction.fulfilled, (state, action) => {
    state.category = action?.payload;
    state.loading = false;
    state.appErr = undefined;
    state.serverErr = undefined; 
  });
  builder.addCase(createCategoryAction.rejected, (state, action) => {
    state.loading = false;
    state.appErr = action?.payload?.message;
    state.serverErr = action?.error?.message;
  });

  //Fetch all categories
  builder.addCase(fetchCategoriesAction.pending, (state, action) => {
    state.loading = true;
  });
  builder.addCase(fetchCategoriesAction.fulfilled, (state, action) => {
    state.categoryList = action?.payload;
    state.loading = false;
    state.appErr = undefined;
    state.serverErr = undefined; 
  });
  builder.addCase(fetchCategoriesAction.rejected, (state, action) => {
    state.loading = false;
    state.appErr = action?.payload?.message;
    state.serverErr = action?.error?.message;
  });

  
}
});

export default categorySlices.reducer;