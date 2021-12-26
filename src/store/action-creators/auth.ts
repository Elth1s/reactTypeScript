import { Dispatch } from "react"
import http from "../../http_common";
import axios, { AxiosError } from "axios";
import jwt from "jsonwebtoken";
import { LoginAction, RegisterAction, AuthActionTypes, ILoginResponse, IUser, ProfileAction } from "../../types/auth"
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

export const RegisterUser = (data: IRegisterModel, image: File) => {
    return async (dispatch: Dispatch<RegisterAction>) => {
        var formData = new FormData();
        formData.append("name", data.name);
        formData.append("email", data.email);
        formData.append("password", data.password);
        formData.append("password_confirmation", data.password_confirmation);
        formData.append("file", image);
        await http.post<ILoginResponse>('api/auth/register', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        }).then(response => {
            dispatch({
                type: AuthActionTypes.REGISTER_AUTH_SUCCESS,
                payload: { name: response.data.user.name, email: response.data.user.email, image: response.data.user.image }
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

export const GetUserProfile = () => {
    return async (dispatch: Dispatch<ProfileAction>) => {
        try {
            const response = await http.get<IUser>('api/auth/user-profile');
            const data = response.data;
            dispatch({
                type: AuthActionTypes.GET_PROFILE,
                payload: { name: data.name, email: data.email, image: data.image },
            });
            return Promise.resolve();
        } catch (ex) {
            console.log("Problem get");
            return Promise.reject();
        }
    }
}

export const AuthUser = (token: string, dispatch: Dispatch<LoginAction>) => {
    const user = jwt.decode(token) as IUser;
    dispatch({
        type: AuthActionTypes.LOGIN_AUTH_SUCCESS,
        payload: { name: user.name, email: user.email, image: user.image }
    })
}