import axios from "axios";

const instance = axios.create({
    baseURL: "http://localhost:7542/2.0/",
    withCredentials: true
})

const instanceHeroku = axios.create(({
    withCredentials: true,
    baseURL: 'https://neko-back.herokuapp.com/2.0/',
}))

// Request types
export type RegistrationParamsType = {
    email: string
    password: string
}
export type LoginDataType = {
    email: string
    password: string
    rememberMe?: boolean
}

//Response types
type ResponseRestoreType = {
    info: string,
    error?: string
};

type ResponseLoginRegistrationType = {
    email: string
    created: string
    isAdmin: boolean
    name: string
    publicCardPacksCount: number
    rememberMe: boolean
    updated: string
    verified: boolean
    _id: string
}
type RegistrationType = {
    __v: number
}
 type LoginType = {
    avatar?: string;
    error?: string;
}

type ResponseRegistrationType = ResponseLoginRegistrationType & RegistrationType
type LoginResponseType = ResponseLoginRegistrationType & LoginType


export const loginApi = {
    login(data: LoginDataType) {
        return instance.post<LoginResponseType>('/auth/login', data)
    }
}

export const restoreAPI = {
    restorePassword: async (email: string | null) => {
        const promise = await instanceHeroku.post<ResponseRestoreType>('auth/forgot', {
            email,
            from: 'dreamonaut@mail.ru',
            message: `<div style="background-color: lime; padding: 15px">
              password recovery link: 	
              <a href='http://localhost:3000/#/new-password/$token$'>	
              link</a></div>`,
        });
        return promise;
    },
    setNewPassword: async (password: string, resetPasswordToken: string) => {
        const promise = await instanceHeroku.post<ResponseRestoreType>('auth/set-new-password', {
            password: password,
            resetPasswordToken: resetPasswordToken,
        });
        return promise;
    },
};

export const registrationAPI = {
    setRegistration(data: RegistrationParamsType) {
        return instance.post<ResponseRegistrationType>("auth/register", data)
    }
}