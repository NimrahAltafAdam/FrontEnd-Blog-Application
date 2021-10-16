import {configureStore} from '@reduxjs/toolkit';
import usersReducer from "../slices/Users/usersSlices";

const store = configureStore({
  reducer: usersReducer
});

export default store;