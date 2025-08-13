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
    await commonAPI('POST',`${baseURL}/prescription`,data);
}
