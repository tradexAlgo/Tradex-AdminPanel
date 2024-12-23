export const LOG_IN: string = "LOG_IN";
export const LOG_OUT: string = "LOG_OUT";
export const LOGIN_SUCCESS = "LOGIN_SUCCESS";
export const LOGIN_FAILURE = "LOGIN_FAILURE";

export function login(email: string): ILogInActionType {
    return { type: LOG_IN, email: email };
}

export function logout(): ILogOutActionType {
    return { type: LOG_OUT};
}

interface ILogInActionType { type: string, email: string };
interface ILogOutActionType { type: string };
