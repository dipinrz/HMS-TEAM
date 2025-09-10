import commonAPI from "./commonAPI"

export const baseURL = "http://localhost:5000/api/v1"

export const loginAPI = async (data: { email: string, password: string }) => {
    return await commonAPI('POST', `${baseURL}/auth/login`, data)
}

export const registerAPI = async (data: {
    first_name: string;
    last_name: string;
    email: string;
    password: string;
    phone_number?: string
}) => {
    return await commonAPI('POST', `${baseURL}/auth/register/patient`, data)
}


export const forgotPassword = async (email: any) => {
    return await commonAPI('POST', `${baseURL}/auth/forgot-password`, { email })
}

export const resetPassword = async (token: any, password:string) => {
    return await commonAPI('POST', `${baseURL}/auth/reset-password`, { token, password });
}

export const listNotifications=async()=>{
    return await commonAPI("GET",`${baseURL}/notification`)
}

export const updateNotification=async(notifID:number)=>{
    return await commonAPI('PUT',`${baseURL}/notification/update/${notifID}`)
}