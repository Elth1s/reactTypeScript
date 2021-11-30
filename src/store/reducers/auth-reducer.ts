import { AuthAction, AuthState } from '../../types/auth'


const initialState: AuthState = {
    user: {
        email: "",
        image: ""
    },
    error: null,
    isAuth: false,
    loading: false
}

export const authReducer = (state = initialState, action: AuthAction): AuthState => {
    switch (action.type) {
        default:
            return state;
    }
}