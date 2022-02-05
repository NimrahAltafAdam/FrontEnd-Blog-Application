import { BrowserRouter, Switch, Route } from "react-router-dom";
import HomePage from "./components/HomePage/HomePage";
import Login from "./components/Users/Login/Login";
import Register from "./components/Users/Register/Register";
import Navbar from "./Navigation/Navbar";
import AddNewCategory from "./components/Categories/AddNewCategory";
import CategoryList from "./components/Categories/CategoryList";
import UpdateCategory from "./components/Categories/UpdateCategory";
import { PrivateProtectedRoute } from "./Navigation/ProtectedRoutes/PrivateProtectedRoute";
import  AdminRoute  from "./Navigation/ProtectedRoutes/AdminRoute";
import CreatePost from "./components/Posts/CreatePost";
import PostsList from "./components/Posts/PostsList";
import PostDetails from "./components/Posts/PostDetails";
import UpdatePost from "./components/Posts/UpdatePost";
import UpdateComment from "./components/Comments/UpdateComment";


function App() {
  return (
    <BrowserRouter>
     <Navbar />
      <Switch>
      <AdminRoute exact path="/update-category/:id" component={UpdateCategory} />
      <PrivateProtectedRoute exact path="/update-comment/:id" component={UpdateComment} />
      <PrivateProtectedRoute exact path="/update-post/:id" component={UpdatePost} />
      <PrivateProtectedRoute exact path="/create-post" component={CreatePost} />
      
      
      <Route exact path="/posts" component={PostsList} />
      <Route exact path="/posts/:id" component={PostDetails} />
        <AdminRoute exact path="/add-category" component={AddNewCategory} />
        <AdminRoute exact path="/category-list" component={CategoryList} />
        <Route exact path="/" component={HomePage} />
        <Route exact path="/register" component={Register} />
        <Route exact path="/login" component={Login} />
        
      </Switch>
    </BrowserRouter>
  );
}

export default App;

