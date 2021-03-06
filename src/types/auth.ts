export enum AuthActionTypes {
    LOGIN_AUTH = "LOGIN_AUTH",
    LOGIN_AUTH_SUCCESS = "LOGIN_AUTH_SUCCESS",
    LOGIN_AUTH_ERROR = "LOGIN_AUTH_ERROR",
    REGISTER_AUTH = "REGISTER_AUTH",
    REGISTER_AUTH_SUCCESS = " REGISTER_AUTH_SUCCESS",
    REGISTER_AUTH_ERROR = "REGISTER_AUTH_FAILED",
    GET_PROFILE = "GET_PROFILE"
}


export interface IUser {
    name: string,
    email: string,
    image: string
}

export interface ILoginResponse {
    access_token: string,
    expires_in: string,
    user: IUser
}

export interface AuthState {
    user: IUser,
    isAuth: boolean,
    loading: boolean,
    error: null | string
}

export interface LoginAuthAction {
    type: AuthActionTypes.LOGIN_AUTH
}

export interface LoginAuthSuccessAction {
    type: AuthActionTypes.LOGIN_AUTH_SUCCESS,
    payload: IUser
}

export interface LoginAuthErrorAction {
    type: AuthActionTypes.LOGIN_AUTH_ERROR,
    payload: string
}

export interface RegisterAuthAction {
    type: AuthActionTypes.REGISTER_AUTH
}

export interface RegisterAuthSuccessAction {
    type: AuthActionTypes.REGISTER_AUTH_SUCCESS,
    payload: IUser
}

export interface RegisterAuthErrorAction {
    type: AuthActionTypes.REGISTER_AUTH_ERROR,
    payload: string
}

export interface GetProfileAction {
    type: AuthActionTypes.GET_PROFILE,
    payload: IUser
}

export type LoginAction = LoginAuthAction | LoginAuthSuccessAction | LoginAuthErrorAction;
export type RegisterAction = RegisterAuthAction | RegisterAuthSuccessAction | RegisterAuthErrorAction;
export type ProfileAction = GetProfileAction;