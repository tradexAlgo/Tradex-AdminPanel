import { IActionBase } from "../models/root.interface";
import { IAccount } from "../models/account.interface";
import {
  LOG_IN,
  LOG_OUT,
  LOGIN_FAILURE,
  LOGIN_SUCCESS,
} from "../actions/account.actions";

const initialState: IAccount = {
  email: "",
  fullName: "",
  token: "",
  role: "",
  data: {
    fullName: "",
    email: "",
    permissions: {
      canCreateAdmin: false,
      canDeleteAdmin: false,
      canManageUsers: false,
    },
    isActive: false,
    createdAt: "",
    updatedAt: "",
    isAuthenticated: false,
    error: "",
    token: "",
    role: "",
  },
  permissions: {
    canCreateAdmin: false,
    canDeleteAdmin: false,
    canManageUsers: false,
  },
  isActive: false,
  createdAt: "",
  updatedAt: "",
  isAuthenticated: false,
  error: "",
};

function accountReducer(
  state: IAccount = initialState,
  action: IActionBase
): IAccount {
  switch (action.type) {
    case LOG_IN: {
      return { ...state, email: action.email };
    }
    case LOG_OUT: {
      return { ...state, email: "" };
    }
    case LOGIN_SUCCESS: {
      return {
        ...state,
        ...action.payload, // Spread the entire payload object into the state
        isAuthenticated: true,
        error: "", // Clear any previous errors
      };
    }
    case LOGIN_FAILURE: {
      return {
        ...state,
        ...action.payload, // Spread the entire payload object into the state
        isAuthenticated: false,
        error: action.payload, // Store the error message
      };
    }
    default:
      return state;
  }
}

export default accountReducer;
