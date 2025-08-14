import commonAPI from "./commonAPI"

export const baseURL = "http://localhost:5000/api/v1";

export const getPatientById = async (id: number) => {
    return await commonAPI('GET', `${baseURL}/patients/${id}`);
}

export const updatePatient = async (payload: any) => {
    return await commonAPI('PATCH', `${baseURL}/patients/update`, payload);

}