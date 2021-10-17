import {configureStore} from '@reduxjs/toolkit';
import categoriesReducer from '../slices/category/categorySlice';
import usersReducer from "../slices/Users/usersSlices";

const store = configureStore({
  reducer: {
    users: usersReducer,
    category: categoriesReducer,
  } 
});

export default store;