import { IUser } from "../../../types/auth";

export interface ILoginModel {
    email: string,
    password: string,
}

export interface LoginServerError {
    status: number,
    email: Array<string>,
    password: Array<string>,
    error: string
}