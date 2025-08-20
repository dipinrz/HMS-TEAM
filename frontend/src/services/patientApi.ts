import type { FormData } from "../pages/PatientUtility/Appointment"
import commonAPI from "./commonAPI"

export const baseURL = "http://localhost:5000/api/v1"



export const addAppoinment = async (formData: FormData) => {
    return commonAPI('POST', `${baseURL}/appointment`, formData)
}

export const getPatientById = async (id: number) => {
    return await commonAPI('GET', `${baseURL}/patients/${id}`);
}

export const updatePatient = async (payload: any) => {
    return await commonAPI('PATCH', `${baseURL}/patients/update`, payload);

}
export const getPatientAppointments = async () => {
    return await commonAPI('GET', `${baseURL}/patients/appointments`);

}
export const getPatientPrescriptions = async () => {
    return await commonAPI('GET', `${baseURL}/patients/prescriptions`);

}

export const getPatientMedicalReport=async()=>{
    return await commonAPI('GET',`${baseURL}/records`)
}