import {createAsyncThunk, createSlice, createAction} from "@reduxjs/toolkit";
import axios from "axios";
import baseURL from "../../../utils/baseURL";

//we need to create a custom action that does not require any http method so that once the user is redirected to the category-list after updating a category, the updatedCategory is removed from the store
//Action to redirect
const resetEditAction = createAction('category/reset-edit');
const resetDeleteAction = createAction('category/reset-delete')
const resetCategoryAction = createAction('category/reset-category')



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
    //dispatch action
    dispatch(resetCategoryAction());
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


//update
//for update we do not only want the id but the title as well therfore we will pass category as the payload 
export const updateCategoriesAction = createAsyncThunk('category/update', async (category, {rejectWithValue, getState, dispatch}) => {
  //get user token
  const user = getState()?.users;
  const {userAuth} = user;
  const config = {
    headers : {
      Authorization: `Bearer ${userAuth?.token}`
    }
  }
  
  //http call
  try {
    const {data} = await axios.put(`${baseURL}/api/category/${category?.id}`,{title: category?.title} ,config);
    //dispatch action to reset the updated data
    dispatch(resetEditAction());
    return data
  } catch (error) {
    if(!error?.response) {
      throw error;
    }
    return rejectWithValue(error?.response?.data);
  }
});

//delete
export const deleteCategoriesAction = createAsyncThunk('category/delete', async (id, {rejectWithValue, getState, dispatch}) => {
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
    const {data} = await axios.delete(`${baseURL}/api/category/${id}`, config);
    dispatch(resetDeleteAction())
    return data
  } catch (error) {
    if(!error?.response) {
      throw error;
    }
    return rejectWithValue(error?.response?.data);
  }
});


//fetch details
export const fetchCategoryAction = createAsyncThunk('category/details', async (id, {rejectWithValue, getState, dispatch}) => {
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
    const {data} = await axios.get(`${baseURL}/api/category/${id}`, config);
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
  //dispatch action to redirect
  builder.addCase(resetCategoryAction, (state,action) => {
    state.isCreated = true;
  })
  builder.addCase(createCategoryAction.fulfilled, (state, action) => {
    state.category = action?.payload;
    state.isCreated = false;
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


  //UPDATE CATEGORIES
  builder.addCase(updateCategoriesAction.pending, (state, action) => {
    state.loading = true;
  });
  //Dispatch action-Since this is a custom action we do not need to handle pending or fulfilled condition as it is not making any request to the backend
  builder.addCase(resetEditAction, (state,action) => {
    state.isEdited = true;
  })
  builder.addCase(updateCategoriesAction.fulfilled, (state, action) => {
    state.updatedCategory = action?.payload;
    state.loading = false;
    state.isEdited = false;
    state.appErr = undefined;
    state.serverErr = undefined; 
  });
  builder.addCase(updateCategoriesAction.rejected, (state, action) => {
    state.loading = false;
    state.appErr = action?.payload?.message;
    state.serverErr = action?.error?.message;
  });

  //Delete categories
  builder.addCase(deleteCategoriesAction.pending, (state, action) => {
    state.loading = true;
  });
  //dispatch for redirect
  builder.addCase(resetDeleteAction, (state,action) => {
    state.isDeleted = true;
  })
  builder.addCase(deleteCategoriesAction.fulfilled, (state, action) => {
    state.deletedCategory = action?.payload;
    state.loading = false;
    state.isDeleted = false;
    state.appErr = undefined;
    state.serverErr = undefined; 
  });
  builder.addCase(deleteCategoriesAction.rejected, (state, action) => {
    state.loading = false;
    state.appErr = action?.payload?.message;
    state.serverErr = action?.error?.message;
  });

  //fetch category details
  builder.addCase(fetchCategoryAction.pending, (state, action) => {
    state.loading = true;
  });
  builder.addCase(fetchCategoryAction.fulfilled, (state, action) => {
    state.category = action?.payload;
    state.loading = false;
    state.appErr = undefined;
    state.serverErr = undefined; 
  });
  builder.addCase(fetchCategoryAction.rejected, (state, action) => {
    state.loading = false;
    state.appErr = action?.payload?.message;
    state.serverErr = action?.error?.message;
  });

  
}
});

export default categorySlices.reducer;