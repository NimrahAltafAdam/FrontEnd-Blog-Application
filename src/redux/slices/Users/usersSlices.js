import {createAction, createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import axios from "axios";
import baseURL from "../../../utils/baseURL";



const resetProfile = createAction('user/profilePhoto/reset');
const resetUserAction = createAction("user/profile/reset"); 


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


// Profile
export const userProfileAction = createAsyncThunk(
  "user/profile",
  async (id, { rejectWithValue, getState, dispatch }) => {
    //get user token
    const user = getState()?.users;
    const { userAuth } = user;
    const config = {
      headers: {
        Authorization: `Bearer ${userAuth?.token}`,
      },
    };
    //http call
    try {
      const { data } = await axios.get(
        `${baseURL}/api/users/profile/${id}`,
        config
      );
      return data;
    } catch (error) {
      if (!error?.response) {
        throw error;
      }
      return rejectWithValue(error?.response?.data);
    }
  }
);


//Upload Profile Photo
export const uploadProfilePhotoAction = createAsyncThunk('user/upload', async (profile, {rejectWithValue, getState, dispatch }) => {
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
    formData.append("image", profile?.image);

    console.log(formData, profile )
    const {data} = await axios.put(`${baseURL}/api/users/profilephoto-upload`, formData, config);
    //dispatch action
    dispatch(resetProfile());
    return data;
  } catch (error) {
    if(!error?.response) {
      throw error;
    }
    return rejectWithValue(error?.response?.data);
  }
});


//UpdateUser
//We will not be updating profile by passing id as params as on the backend the id is retrieved through the login user(check controller)
export const updateUserAction = createAsyncThunk('user/update', async (userData, {rejectWithValue, getState, dispatch}) => {
  //get user token
  const user = getState()?.users;
  const {userAuth} = user;
  const config = {
    headers : {
      Authorization: `Bearer ${userAuth?.token}`
    }
  }

  try {
    const {data} =  await axios.put(`${baseURL}/api/users`, {
      firstName: userData?.firstName,
      lastName: userData?.lastName,
      email: userData?.email,
      bio: userData?.bio
    }, config);
    //dispatch action
    dispatch(resetUserAction());
    return data;
  } catch (error) {
    if(!error?.response) {
      throw error;
    }
    return rejectWithValue(error?.response?.data);
  }
});

//fetch User details
export const fetchUserDetailsAction = createAsyncThunk(
  "user/detail",
  async (id, { rejectWithValue, getState, dispatch }) => {
    try {
      const { data } = await axios.get(`${baseURL}/api/users/${id}`);
      return data;
    } catch (error) {
      if (!error?.response) throw error;
      return rejectWithValue(error?.response?.data);
    }
  }
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
      state.loading = false;
      state.registered = action?.payload;
      state.appErr = undefined;
      state.serverErr = undefined;

    });
    builder.addCase(registerUserAction.rejected, (state, action) => {
      state.loading = false;
      state.appErr = action?.payload?.message;
      state.serverErr = action?.error?.message;
    });

    //user details
    builder.addCase(fetchUserDetailsAction.pending, (state, action) => {
      state.loading = true;
      state.appErr = undefined;
      state.serverErr = undefined;
    });
    builder.addCase(fetchUserDetailsAction.fulfilled, (state, action) => {
      state.loading = false;
      state.userDetails = action?.payload;
      state.appErr = undefined;
      state.serverErr = undefined;
    });
    builder.addCase(fetchUserDetailsAction.rejected, (state, action) => {
      console.log(action.payload);
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
      state.loading = false;
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

    //Profile
    builder.addCase(userProfileAction.pending, (state, action) => {
      state.loading = true;
      state.appErr = undefined;
      state.serverErr = undefined;
    });
    builder.addCase(userProfileAction.fulfilled, (state, action) => {
      state.profile = action?.payload;
      state.loading = false
      state.appErr = undefined;
      state.serverErr = undefined;
    });
    builder.addCase(userProfileAction.rejected, (state, action) => {
      state.loading = false;
      state.appErr = action?.payload?.message;
      state.serverErr = action?.error?.message;
    })

    //ProfilePhotoUpload
    builder.addCase(uploadProfilePhotoAction.pending, (state, action) => {
      state.loading = true;
      state.appErr = undefined;
      state.serverErr = undefined;
    });
    builder.addCase(resetProfile, (state,action) => {
      state.isUploaded = true;
    })
    builder.addCase(uploadProfilePhotoAction.fulfilled, (state, action) => {
      state.photoUploaded = action?.payload;
      state.isUploaded = false;
      state.loading = false
      state.appErr = undefined;
      state.serverErr = undefined;
    });
    builder.addCase(uploadProfilePhotoAction.rejected, (state, action) => {
      state.loading = false;
      state.appErr = action?.payload?.message;
      state.serverErr = action?.error?.message;
    })

     //UpdateProfile
     builder.addCase(updateUserAction.pending, (state, action) => {
      state.loading = true;
      state.appErr = undefined;
      state.serverErr = undefined;
    });
    builder.addCase(resetUserAction, (state,action) => {
      state.isUpdated = true;
    })
    builder.addCase(updateUserAction.fulfilled, (state, action) => {
      state.userUpdated = action?.payload;
      state.loading = false;
      state.isUpdated = false;
      state.appErr = undefined;
      state.serverErr = undefined;
    });
    builder.addCase(updateUserAction.rejected, (state, action) => {
      state.loading = false;
      state.appErr = action?.payload?.message;
      state.serverErr = action?.error?.message;
    })
  }
});




export default usersSlices.reducer;
