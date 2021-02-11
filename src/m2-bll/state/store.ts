import {applyMiddleware, combineReducers, createStore} from "redux";
import {authReducer} from "../redusers/auth-reducer";
import thunk from "redux-thunk";
import {profileReducer} from "../redusers/profile-reducer";
import {loginReducer} from "../redusers/login-reducer";
import { restoreReducer } from '../redusers/restore-reducer';


const rootReducer = combineReducers({
    auth: authReducer,
    profile: profileReducer,
    login: loginReducer,
    restore: restoreReducer
})

export const store = createStore(rootReducer, applyMiddleware(thunk))

export type AppRootStateType = ReturnType<typeof rootReducer>