import commonAPI from "./commonAPI"

export interface medicineType{
    medicine_name: string;
    description: string
    cost: number,
    expiry_date: string
}

export const baseURL = "http://localhost:5000/api/v1"

export const getMedicineAPI = async()=>{
    return await commonAPI('GET',`${baseURL}/medicine/fetchAll`);
}

export const addMedicineAPI = async (medicine: medicineType) => {
    return await commonAPI('POST', `${baseURL}/medicine/create`, medicine)
}