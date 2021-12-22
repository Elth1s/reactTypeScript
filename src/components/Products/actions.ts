import { Dispatch } from "react"
import http from "../../http_common";
import { IProduct, IProductsModel, ProductAction, ProductsActionTypes, DeleteProductServerError, UpsertProductServerError, IProductModel, IProductItem, IProductSearch } from "./types"
import axios, { AxiosError } from "axios";

export const GetProducts = (search: IProductSearch) => {
    return async (dispatch: Dispatch<ProductAction>) => {
        try {
            let response = await http.get<IProductsModel>("api/products",
                {
                    params: search
                });
            const { data, last_page } = response.data;
            dispatch({
                type: ProductsActionTypes.GET_PRODUCTS,
                payload: {
                    data: data,
                    last_page: last_page,
                },
            });
            return Promise.resolve(data);
        } catch (ex) {
            console.log("Problem get");
            return Promise.reject();
        }
    }
}

export const CreateProduct = (data: IProduct, image: File) => {
    return async () => {

        try {
            var formData = new FormData();
            formData.append("name", data.name);
            formData.append("detail", data.detail);
            formData.append("file", image);
            await http.post('api/products/store', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })
            return Promise.resolve();
        }
        catch (ex) {
            if (axios.isAxiosError(ex)) {
                const serverError = ex as AxiosError<UpsertProductServerError>;
                if (serverError && serverError.response) {
                    serverError.response.data.status = serverError.response.status;
                    serverError.response.data.error = serverError.response.statusText;
                    return Promise.reject(serverError.response.data);
                }
            }
            return Promise.reject(ex)
        }
    }
}

export const DeleteProduct = (id: number) => {
    return async () => {
        try {
            await http.delete(`api/products/destroy/${id}`);
            return Promise.resolve();
        }
        catch (ex) {
            if (axios.isAxiosError(ex)) {
                const serverError = ex as AxiosError<DeleteProductServerError>;
                if (serverError && serverError.response) {
                    serverError.response.data.status = serverError.response.status;
                    serverError.response.data.error = serverError.response.statusText;
                    return Promise.reject(serverError.response.data);
                }
            }
            return Promise.reject(ex)
        }
    }
}

export const GetProduct = (id: string | null) => {
    return async (dispatch: Dispatch<ProductAction>) => {
        try {
            let response = await http.get<IProductModel>(`api/products/show/${id}`);
            const { data } = response.data;
            dispatch({
                type: ProductsActionTypes.GET_PRODUCT,
                payload: data,
            });
            return Promise.resolve();
        }
        catch (ex) {
            if (axios.isAxiosError(ex)) {
                const serverError = ex as AxiosError<DeleteProductServerError>;
                if (serverError && serverError.response) {
                    serverError.response.data.status = serverError.response.status;
                    serverError.response.data.error = serverError.response.statusText;
                    return Promise.reject(serverError.response.data);
                }
            }
            return Promise.reject(ex)
        }
    }
}

export const UpdateProduct = (data: IProductItem, image?: File) => {
    return async () => {
        try {
            var formData = new FormData();
            formData.append("name", data.name);
            formData.append("detail", data.detail);
            if (image)
                formData.append("file", image);
            await http.post(`api/products/update/${data.id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })
            return Promise.resolve();
        }
        catch (ex) {
            if (axios.isAxiosError(ex)) {
                const serverError = ex as AxiosError<UpsertProductServerError>;
                if (serverError && serverError.response) {
                    serverError.response.data.status = serverError.response.status
                    serverError.response.data.error = serverError.response.statusText
                    return Promise.reject(serverError.response.data);
                }
            }
            return Promise.reject(ex)
        }
    }
}