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