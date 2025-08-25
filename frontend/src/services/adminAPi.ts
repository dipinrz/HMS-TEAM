import commonAPI from "./commonAPI";
export const baseURL = "http://localhost:5000/api/v1";

interface doctor_data {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  specialization: string;
  qualification: string;
  years_of_experience: number;
  license_number: string;
  department_id:number
}

interface dept_data{
  name: string;
  description: string;
  consultation_fee: number;
 head_doctor: number;
}



export const getAllPatients = async () => {
  return await commonAPI("GET", `${baseURL}/patients`);
};

export const getAllDoctors = async () => {
  return await commonAPI("GET", `${baseURL}/doctor/all`);
};

export const deletePatient = async (id: number) => {
  return await commonAPI("DELETE", `${baseURL}/users/delete/${id}`);
};

export const deleteDoctor = async (id: number) => {
  return await commonAPI("DELETE", `${baseURL}/users/delete/${id}`);
};

export const fetchAllDepartments = async() => {
  return await commonAPI("GET", `${baseURL}/department`);
};

export const registerDoctor = async (data:doctor_data) => {
  return await commonAPI('POST',`${baseURL}/users/register-doctor`,data)
};

export const deleteDept = async(id:number)=>{
  return await commonAPI('DELETE',`${baseURL}/department/${id}`)
} 

export const addDept = async(data:dept_data)=>{
  return await commonAPI('POST',`${baseURL}/department`,data)
}

export const updateDepartmentById = async (id: number, data: any) => { 
  return await commonAPI('POST', `${baseURL}/department/update/${id}`, data);
};

export const updateDoctorById = async (id: number, data: any) => { 
  return await commonAPI('POST', `${baseURL}/doctor/update/${id}`, data);
};

export const fetchAllAppointmentsAPI = async () => {
  return await commonAPI('GET', `${baseURL}/appointment`);
}

export const fetchDepartmentwiseAppointmentAPI = async () => {
  return await commonAPI('GET', `${baseURL}/department/appointment-count`);
}

export const fetchTodaysAppoinments = async () =>{
  return await commonAPI('GET',`${baseURL}/users/todayAppoinments`)
}

export const getMonthlyRevenue = async ()=>{
  return await commonAPI('GET',`${baseURL}/payment/monthly`)
}

export const getAllPayments = async()=>{
  return await commonAPI('GET',`${baseURL}/payment/allPayments`)
}