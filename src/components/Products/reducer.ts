import { ProductAction, ProductsActionTypes, ProductsState } from "./types";

const initialState: ProductsState = {
    products: [],
    last_page: 0,
    currentProduct: {
        id: 0,
        name: "",
        detail: "",
        image: ""
    }
}

export const ProductsReducer = (state = initialState, action: ProductAction): ProductsState => {
    switch (action.type) {
        case ProductsActionTypes.GET_PRODUCT:
            return {
                ...state,
                currentProduct: action.payload,
            }
        case ProductsActionTypes.DELETE_PRODUCT:
            return {
                ...state,
                products: action.payload,
            }
        case ProductsActionTypes.GET_PRODUCTS:
            return {
                ...state,
                products: action.payload.data,
                last_page: action.payload.last_page,
            }
        default:
            return state;
    }
}