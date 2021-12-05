import { IUser } from "../../../types/auth";

export interface IRegisterModel {
    name: string,
    email: string,
    password: string,
    password_confirmation: string
};

export interface RegisterServerError {
    status: number,
    name: Array<string>,
    email: Array<string>,
    password: Array<string>,
    error: string
}