import { Dispatch } from "react"
import http from "../../http_common";
import axios, { AxiosError } from "axios";
import { AuthAction, AuthActionTypes } from "../../types/auth"
import { ILoginModel, ILoginResponse, LoginServerError } from "../../components/Auth/Login/types";

export const LoginUser = (data: ILoginModel) => {
    return async (dispatch: Dispatch<AuthAction>) => {
        await http.post<ILoginResponse>('api/auth/login', data)
            .then(response => {
                dispatch({
                    type: AuthActionTypes.LOGIN_AUTH_SUCCESS,
                    payload: { name: response.data.user.name, email: response.data.user.email }
                })
                return Promise.resolve();
            }).catch(error => {
                // dispatch({ type: AuthActionTypes.LOGIN_AUTH_ERROR, payload: "Error" })
                if (axios.isAxiosError(error)) {
                    const serverError = error as AxiosError<LoginServerError>;
                    if (serverError && serverError.response) {
                        serverError.response.data.status = serverError.response.status;
                        return Promise.reject(serverError.response.data);
                    }
                }
                return Promise.reject(error.response.status)
            });
    }
}