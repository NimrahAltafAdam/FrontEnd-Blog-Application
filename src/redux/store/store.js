import {configureStore} from '@reduxjs/toolkit';
import categoriesReducer from '../slices/category/categorySlice';
import usersReducer from "../slices/Users/usersSlices";
import postsReducer from "../slices/posts/postSlice";

const store = configureStore({
  reducer: {
    users: usersReducer,
    category: categoriesReducer,
    post: postsReducer,
  } 
});

export default store;