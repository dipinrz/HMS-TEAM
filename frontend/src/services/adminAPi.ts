import commonAPI from "./commonAPI"
export const baseURL = "http://localhost:5000/api/v1"

export const getAllPatients = async()=>{
    return await commonAPI('GET',`${baseURL}/patients`)
}

export const getAllDoctors = async()=>{
    return await commonAPI('GET',`${baseURL}/doctor/all`)
}

export const deletePatient = async(id:number)=>{
    return await commonAPI('DELETE',`${baseURL}/users/delete/${id}`) 
}

export const deleteDoctor = async(id:number)=>{
    return await commonAPI('DELETE',`${baseURL}/users/delete/${id}`) 
}

export const fetchAllDepartments = async ()=>{
    return await commonAPI('GET',`${baseURL}/department`)
}