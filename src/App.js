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

function App() {
  return (
    <BrowserRouter>
     <Navbar />
      <Switch>
      <AdminRoute exact path="/update-category/:id" component={UpdateCategory} />
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

/*import { BrowserRouter, Switch, Route } from "react-router-dom";
import AddNewCategory from "./components/Categories/AddNewCategory";
import HomePage from "./components/HomePage/HomePage";
import Navbar from "./Navigation/Navbar";
import Login from "./components/Users/Login/Login";
import Register from "./components/Users/Register/Register";
import CategoryList from "./components/Categories/CategoryList";
import UpdateCategory from "./components/Categories/UpdateCategory";
import { PrivateProtecteRoute } from "./Navigation/ProtectedRoutes/PrivateProtecteRoute";
import AdminRoute  from "./Navigation/ProtectedRoutes/AdminRoute";

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Switch>
        <AdminRoute
          exact
          path="/update-category/:id"
          component={UpdateCategory}
        />
        <AdminRoute exact path="/add-category" component={AddNewCategory} />
        <AdminRoute exact path="/category-list" component={CategoryList} />
        <Route exact path="/" component={HomePage} />
        <Route exact path="/register" component={Register} />
        <Route exact path="/login" component={Login} />
      </Switch>
    </BrowserRouter>
  );
}

export default App;*/