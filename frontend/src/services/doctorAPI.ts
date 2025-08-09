import { baseURL } from "./allAPI";
import commonAPI from "./commonAPI";

export const getDoctorAppointment=async()=>{
    const response=await commonAPI('GET',`${baseURL}/doctor/appointments?today=true`);
    return response;
}

export const getRecentPatient=async()=>{
    const response=await commonAPI('GET',`${baseURL}/doctor/appointments`);
    return response;
}
export const getDoctorPatients=async(doctor_id:number)=>{
    const response=await commonAPI('GET',`${baseURL}/doctor/patients/${doctor_id}`)
    return response;
}
