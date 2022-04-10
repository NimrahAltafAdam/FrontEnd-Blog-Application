import {configureStore} from '@reduxjs/toolkit';
import categoriesReducer from '../slices/category/categorySlice';
import usersReducer from "../slices/Users/usersSlices";
import postsReducer from "../slices/posts/postSlice";
import commentsReducer from "../slices/comments/commentSlice"
import sendMailReducer from "../slices/Email/emailSlice.";
import accVerification from "../slices/accountVerification/accVerificationSlices";

const store = configureStore({
  reducer: {
    users: usersReducer,
    category: categoriesReducer,
    //post,
    //comment
    post: postsReducer,
    comment: commentsReducer,
    email: sendMailReducer,
    accountVerification: accVerification,
  } 
});

export default store;