import { AuthAction, AuthState, AuthActionTypes } from '../../types/auth'

const initialState: AuthState = {
    user: {
        name: "",
        email: "",
    },
    error: null,
    isAuth: false,
    loading: false
}

export const authReducer = (state = initialState, action: AuthAction): AuthState => {
    switch (action.type) {
        case AuthActionTypes.LOGIN_AUTH_SUCCESS:
            return {
                ...state,
                user: action.payload,
                isAuth: true
            }
        default:
            return state;
    }
}