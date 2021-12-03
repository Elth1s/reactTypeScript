import { IUser } from "../../../types/auth";

export interface ILoginModel {
    email: string,
    password: string,

}

export interface ILoginResponse {
    access_token: string,
    expires_in: string,
    user: IUser
}

export interface LoginServerError {
    status: number,
    email: Array<string>,
    password: Array<string>,
    error: string
}