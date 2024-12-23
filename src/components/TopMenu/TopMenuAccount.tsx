import React, { useState, Dispatch } from "react";
import { useDispatch, useSelector } from "react-redux";
import { LOGIN_SUCCESS, logout } from "../../store/actions/account.actions";
import { IStateType } from "../../store/models/root.interface";
import { IAccount } from "../../store/models/account.interface";

function TopMenuAccount(): JSX.Element {
  const dispatch: Dispatch<any> = useDispatch();
  const account: any = useSelector((state: IStateType) => state.account);
  const [isShow, setShow] = useState(false);
  const logOut = () => {
    localStorage.removeItem("loginUserData")
    localStorage.removeItem("loginEmail")
    localStorage.removeItem("logiFullName")
    localStorage.removeItem("authToken")
    dispatch({
      type: LOGIN_SUCCESS,
      payload: {
        token: "",
        fullName: "",
        email: "",
        data: {}, // Include data from response
      },
    });
  }

  return (

    <li className="nav-item dropdown no-arrow">
      <div className="nav-link dropdown-toggle"
        onClick={() => {
          setShow(!isShow);
        }}
        // href="# "
        id="userDropdown"
        role="button"
        data-toggle="dropdown"
        aria-haspopup="true"
        aria-expanded="false">
        <div className="ProfileStyle">
          <span className="mr-2 d-none d-lg-inline small cadet">{account.fullName}</span>
          <span className="mr-2 d-none d-lg-inline small cadet">{account.email}</span>
        </div>
        <img className="img-profile rounded-circle" alt=""
          src="https://www.stryx.com/cdn/shop/articles/man-looking-attractive.jpg?v=1666662774" />
      </div>

      <div className={`dropdown-menu dropdown-menu-right shadow animated--grow-in ${(isShow) ? "show" : ""}`}
        aria-labelledby="userDropdown">
        <div className="dropdown-item"
          onClick={() => logOut()}
          // to="# "
          style={{ cursor: "pointer" }}
          data-toggle="modal"
          data-target="#logoutModal">
          <i className="fas fa-sign-out-alt fa-sm fa-fw mr-2 text-gray-400"></i>
          Logout
        </div>
      </div>
    </li>
  );
};

export default TopMenuAccount;
