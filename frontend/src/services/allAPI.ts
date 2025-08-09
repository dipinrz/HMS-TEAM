import commonAPI from "./commonAPI"

export const baseURL = "http://localhost:5000/api/v1"

export const loginAPI = async(data:{email:string,password:string})=>{
    return await commonAPI('POST',`${baseURL}/auth/login`,data)
}

export const registerAPI=async(data:{
    first_name:string;
    last_name:string;
    email:string;
    password:string;
    phone_number?:string
})=>{
    return await commonAPI('POST',`${baseURL}/auth/register/patient`,data)
}