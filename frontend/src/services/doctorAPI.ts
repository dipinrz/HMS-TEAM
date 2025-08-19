import type { UpdateDoctorPayload } from "../types/doctorType";
import { baseURL } from "./allAPI";
import commonAPI from "./commonAPI";

export const getDoctorAppointment=async()=>{
    const response=await commonAPI('GET',`${baseURL}/doctor/appointments?today=true`);
    return response;
}

export const getRecentPatientFromAllAppointment=async()=>{
    const response=await commonAPI('GET',`${baseURL}/doctor/appointments`);
    return response;
}
export const getDoctorPatients=async(doctor_id:number)=>{
    const response=await commonAPI('GET',`${baseURL}/doctor/patients/${doctor_id}`)
    return response;
}

export const getDoctorAppointmentById = async(id: number) => {
    const response=await commonAPI('GET',`${baseURL}/appointment/${id}`);
    return response;
};

export const getDoctorPriscriptions=async()=>{
    const response=await commonAPI('GET',`${baseURL}/doctor/prescription`);
    return response;
};

export const getAllMedicens=async()=>{
    const response=await commonAPI('GET',`${baseURL}/medicine/fetchAll`);
    return response;
}

export const createPrescription =async(data:any)=>{
    console.log(data)
    await commonAPI('POST',`${baseURL}/prescription`,data);
}

export const getDoctorProfile=async()=>{
    const response=await commonAPI('GET',`${baseURL}/doctor/getProfile`);
    return response;
}

export const updateDoctorProfile=async(data:UpdateDoctorPayload)=>{
    const response=await commonAPI('PATCH',`${baseURL}/doctor/update`,data);
    return response;
}

export const getPatientRecord=async(id:number)=>{
    const response=await commonAPI('GET',`${baseURL}/records/${id}`);
    return response;
}

