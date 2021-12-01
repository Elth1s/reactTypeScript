import { Dispatch } from "react"
import http from "../../http_common";
import { AuthAction, AuthActionTypes } from "../../types/auth"
import { ILoginModel, ILoginResponse } from "../../components/Auth/Login/types";

export const LoginUser = (data: ILoginModel) => {
    return async (dispatch: Dispatch<AuthAction>) => {
        try {
            // dispatch({ type: AuthActionTypes.LOGIN_AUTH });
            const response = await http.post<ILoginResponse>('api/auth/login', data);
            dispatch({ type: AuthActionTypes.LOGIN_AUTH_SUCCESS, payload: { name: response.data.user.name, email: response.data.user.email } });
            return Promise.resolve();
        }
        catch (error) {
            // dispatch({ type: AuthActionTypes.LOGIN_AUTH_ERROR, payload: "Error" })
            return Promise.reject(error);
        }
    }
}