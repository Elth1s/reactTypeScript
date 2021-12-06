import { Dispatch } from "react"
import http from "../../http_common";
import axios, { AxiosError } from "axios";
import jwt from "jsonwebtoken";
import { LoginAction, RegisterAction, AuthActionTypes, ILoginResponse, IUser } from "../../types/auth"
import { ILoginModel, LoginServerError } from "../../components/Auth/Login/types";
import { IRegisterModel, RegisterServerError } from "../../components/Auth/Register/types";

export const LoginUser = (data: ILoginModel) => {
    return async (dispatch: Dispatch<LoginAction>) => {
        await http.post<ILoginResponse>('api/auth/login', data)
            .then(response => {
                const { access_token } = response.data;
                localStorage.token = access_token;
                AuthUser(access_token, dispatch);
                return Promise.resolve();
            }).catch(error => {
                // dispatch({ type: AuthActionTypes.LOGIN_AUTH_ERROR, payload: "Error" })
                if (axios.isAxiosError(error)) {
                    const serverError = error as AxiosError<LoginServerError>;
                    if (serverError && serverError.response) {
                        serverError.response.data.status = serverError.response.status;
                        serverError.response.data.error = serverError.response.statusText
                        return Promise.reject(serverError.response.data);
                    }
                }
                return Promise.reject(error.response.status)
            });
    }
}

export const RegisterUser = (data: IRegisterModel) => {
    return async (dispatch: Dispatch<RegisterAction>) => {
        // dispatch({ type: AuthActionTypes.REGISTER_AUTH });
        await http.post<ILoginResponse>('api/auth/register', data)
            .then(response => {
                dispatch({
                    type: AuthActionTypes.REGISTER_AUTH_SUCCESS,
                    payload: { name: response.data.user.name, email: response.data.user.email }
                })
                return Promise.resolve();
            }).catch(error => {
                // dispatch({ type: AuthActionTypes.REGISTER_AUTH_ERROR, payload: "Error" })
                if (axios.isAxiosError(error)) {
                    const serverError = error as AxiosError<RegisterServerError>;
                    if (serverError && serverError.response) {
                        serverError.response.data.status = serverError.response.status;
                        serverError.response.data.error = serverError.response.statusText;
                        return Promise.reject(serverError.response.data);
                    }
                }
                return Promise.reject(error.response.status)
            });
    }
}

export const GetUserProfile = async () => {
    return async () => {
        await http.get('api/auth/user-profile')
            .then(response => {
                return response;
            }).catch(error => {
                console.log(error)
            });
    }
}

export const AuthUser = (token: string, dispatch: Dispatch<LoginAction>) => {
    const user = jwt.decode(token) as IUser;
    dispatch({
        type: AuthActionTypes.LOGIN_AUTH_SUCCESS,
        payload: { name: user.name, email: user.email }
    })
}