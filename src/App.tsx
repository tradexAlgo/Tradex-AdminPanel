import React, { useEffect } from "react";
import "./App.css";
import "./styles/sb-admin-2.min.css";
import { BrowserRouter as Router, Switch } from "react-router-dom";
import Login from "./components/Account/Login";
import Admin from "./components/Admin/Admin";
import { PrivateRoute } from "./common/components/PrivateRoute";
import { AccountRoute } from "./common/components/AccountRoute";
import { useDispatch } from "react-redux";
import { LOGIN_SUCCESS } from "./store/actions/account.actions";

const App: React.FC = () => {
  const dispatch = useDispatch();


  useEffect(() => {
    const storedDataString = localStorage.getItem("loginUserData");
    let storedData: any;
    if (storedDataString) {
      // Convert the JSON string back to an object
      storedData = JSON.parse(storedDataString);

      console.log(storedData); // Use the object as needed
    }
    dispatch({
      type: LOGIN_SUCCESS,
      payload: {
        token: localStorage.getItem("authToken"),
        data: storedData, // Include data from response
        email: localStorage.getItem("loginEmail"), // Include data from response
        fullName: localStorage.getItem("logiFullName"), // Include data from response
      },
    });
  }, [])

  return (
    <div className="App" id="wrapper">
      <Router>
        <Switch>
          <PrivateRoute path="/">
            <Admin />
          </PrivateRoute>
          <AccountRoute path="/login"><Login /></AccountRoute>
        </Switch>
      </Router>
    </div>
  );
};

export default App;
