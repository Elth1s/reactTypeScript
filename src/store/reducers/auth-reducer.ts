import { LoginAction, RegisterAction, AuthState, AuthActionTypes, ProfileAction } from '../../types/auth'

const initialState: AuthState = {
    user: {
        name: "",
        email: "",
        image: ""
    },
    error: null,
    isAuth: false,
    loading: false
}

export const authReducer = (state = initialState, action: LoginAction | RegisterAction | ProfileAction): AuthState => {
    switch (action.type) {
        case AuthActionTypes.LOGIN_AUTH_SUCCESS:
            return {
                ...state,
                user: action.payload,
                isAuth: true
            }
        case AuthActionTypes.REGISTER_AUTH_SUCCESS:
            return {
                ...state,
                user: action.payload,
                isAuth: true
            }
        case AuthActionTypes.GET_PROFILE:
            return {
                ...state,
                user: action.payload,
            }
        default:
            return state;
    }
}