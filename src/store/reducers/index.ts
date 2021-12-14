import { combineReducers } from "redux";
import { ProductsReducer } from "../../components/Products/reducer";
import { authReducer } from "./auth-reducer";



export const rootReducer = combineReducers({
    auth: authReducer,
    product: ProductsReducer
});

export type RootState = ReturnType<typeof rootReducer>;