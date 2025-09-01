import type { FormData } from "../pages/PatientUtility/Appointment";
import commonAPI from "./commonAPI";

export const baseURL = "http://localhost:5000/api/v1";

export const addAppoinment = async (formData: FormData) => {
  return commonAPI("POST", `${baseURL}/appointment`, formData);
};

export const cancelAppointent = async (appointmentId: number) => {
  return commonAPI("DELETE", `${baseURL}/appointment/${appointmentId}`);
};

export const getPatientById = async (id: number) => {
  return await commonAPI("GET", `${baseURL}/patients/${id}`);
};

export const updatePatient = async (payload: any) => {
  return await commonAPI("PATCH", `${baseURL}/patients/update`, payload);
};
export const getPatientAppointments = async () => {
  return await commonAPI("GET", `${baseURL}/patients/appointments`);
};
export const getPatientPrescriptions = async () => {
  return await commonAPI("GET", `${baseURL}/patients/prescriptions`);
};

export const getPatientMedicalReport = async () => {
    return await commonAPI('GET', `${baseURL}/records`)
}
export const getPatientPrescriptionsByAppointmentId = async (id: number) => {
    return await commonAPI('GET', `${baseURL}/prescription/appointment/${id}`)

}


export const viewAllBills = async () => {
    return await commonAPI('GET', `${baseURL}/bill`)

}

export const getPatientPaymentHistory=async()=>{
    return await commonAPI("GET",`${baseURL}/payment/history/user`)
}

export const getDeptAndDoc=async()=>{
  return await commonAPI("GET",`${baseURL}/department/departments-And-doctors`)
}

export const getMedications=async()=>{
  return await commonAPI("GET",`${baseURL}/records/patient-medicines`)
}