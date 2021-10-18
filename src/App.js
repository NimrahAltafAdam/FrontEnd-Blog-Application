import { BrowserRouter, Switch, Route } from "react-router-dom";
import HomePage from "./components/HomePage/HomePage";
import Login from "./components/Users/Login/Login";
import Register from "./components/Users/Register/Register";
import Navbar from "./Navigation/Navbar";
import AddNewCategory from "./components/Categories/AddNewCategory";
import CategoryList from "./components/Categories/CategoryList";

function App() {
  return (
    <BrowserRouter>
     <Navbar />
      <Switch>
        <Route exact path="/add-category" component={AddNewCategory} />
        <Route exact path="/category-list" component={CategoryList} />
        <Route exact path="/" component={HomePage} />
        <Route exact path="/register" component={Register} />
        <Route exact path="/login" component={Login} />
      </Switch>
    </BrowserRouter>
  );
}

export default App;
