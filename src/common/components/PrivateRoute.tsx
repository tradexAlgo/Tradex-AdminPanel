import { Route, RouteProps } from "react-router";
import React from "react";
import { useSelector } from "react-redux";
import { IStateType } from "../../store/models/root.interface";
import { IAccount } from "../../store/models/account.interface";
import Login from "../../components/Account/Login";


export function PrivateRoute({ children, ...rest }: RouteProps): JSX.Element {

    const account: IAccount = useSelector((state: IStateType) => state.account);
    const tokenFromLocalStorage = localStorage.getItem("authToken");

    // Determine if the user is authenticated
    const isAuthenticated = !!(account.token || tokenFromLocalStorage);
    console.log("accountaccountaccount", account)

    return (
        <Route
            {...rest}
            render={() =>
                isAuthenticated ? (
                    children
                ) : <Login/>
            }
        />
    );
}