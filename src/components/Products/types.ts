export enum ProductsActionTypes {
    GET_PRODUCTS = "GET_PRODUCTS",
    DELETE_PRODUCT = "DELETE_PRODUCT",
    GET_PRODUCT = "GET_PRODUCT",
}

export interface IProductItem {
    id: number,
    name: string,
    detail: string,
    image: string
}

export interface IProduct {
    name: string,
    detail: string,
}

export interface IProductsModel {
    data: Array<IProductItem>,
    last_page: number,
}

export interface IProductModel {
    success: boolean,
    message: string,
    data: IProductItem,
}

export interface IProductSearch {
    page?: null | number | string,
    id?: null | number | string,
    name?: null | string,
    detail?: null | string,
}

export interface UpsertProductServerError {
    status: number,
    name: Array<string>,
    detail: Array<string>,
    error: string
}
export interface DeleteProductServerError {
    status: number,
    error: string
}

export interface ProductsState {
    products: Array<IProductItem>,
    last_page: number,
    currentProduct: IProductItem
}


export interface GetProductsAction {
    type: ProductsActionTypes.GET_PRODUCTS,
    payload: IProductsModel
}

export interface DeleteProductAction {
    type: ProductsActionTypes.DELETE_PRODUCT,
    payload: Array<IProductItem>
}

export interface GetProductAction {
    type: ProductsActionTypes.GET_PRODUCT,
    payload: IProductItem
}


export type ProductAction = GetProductsAction | DeleteProductAction | GetProductAction;