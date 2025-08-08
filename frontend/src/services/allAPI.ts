import commonAPI from "./commonAPI"

const baseURL = "http://localhost:5000"

export const loginAPI = async(data:{email:string,password:string})=>{
    return await commonAPI('POST',`${baseURL}/api/v1/auth/login`,data)
}

export const registerAPI=async(data:{
    first_name:string;
    last_name:string;
    email:string;
    password:string;
    phone_number?:string
})=>{
    return await commonAPI('POST',`${baseURL}/api/v1/auth/register/patient`,data)
}