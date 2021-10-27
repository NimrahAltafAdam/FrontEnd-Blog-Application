import { BrowserRouter, Switch, Route } from "react-router-dom";
import HomePage from "./components/HomePage/HomePage";
import Login from "./components/Users/Login/Login";
import Register from "./components/Users/Register/Register";
import Navbar from "./Navigation/Navbar";
import AddNewCategory from "./components/Categories/AddNewCategory";
import CategoryList from "./components/Categories/CategoryList";
import UpdateCategory from "./components/Categories/UpdateCategory";
import { PrivateProtecteRoute } from "./Navigation/ProtectedRoutes/PrivateProtecteRoute";
import  AdminRoute  from "./Navigation/ProtectedRoutes/AdminRoute";
import CreatePost from "./components/Posts/CreatePost";
function App() {
  return (
    <BrowserRouter>
     <Navbar />
      <Switch>
      <AdminRoute exact path="/update-category/:id" component={UpdateCategory} />
      <PrivateProtecteRoute exact path="/create-post" component={CreatePost} />
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

