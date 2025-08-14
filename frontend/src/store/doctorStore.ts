
import { create } from 'zustand';
import { getAllMedicens, getDoctorAppointment, getDoctorPatients,getDoctorPriscriptions,getDoctorProfile,getRecentPatientFromAllAppointment, updateDoctorProfile } from '../services/doctorAPI';
import { getRecentUniquePatientAppointments } from '../utility/DoctorUtility';
import type { Appointment, Medicine, Patient, Prescription, Doctor, UpdateDoctorPayload} from '../types/doctorType';

interface DoctorStore {
  appointments: Appointment[];
  allAppointments: Appointment[];
  recentPatients: Appointment[];
  todayAppointments: Appointment[];
  patients: Patient[];
  prescriptons:Prescription[];
  medicines: Medicine[];
  doctor:Doctor|null;
  patientsCount: number;
  completedCount: number;
  remainingCount: number;

  loading:boolean;
  error:string | null;
  fetchAppointments: () => Promise<void>;
  fetchPatients: (doctor_id: number) => Promise<void>;
  fetchRecentPatients: () => Promise<void>;
  fetchPrescriptions:()=>Promise<void>;
  fetchMedicines: () => Promise<void>;
  fetchDoctorProfile:()=>Promise<void>;
  updateDoctorProfile:(data:UpdateDoctorPayload)=>Promise<void>;
}

export const useDoctorStore = create<DoctorStore>((set, get) => ({
  appointments: [],
  allAppointments: [],
  recentPatients: [],
  todayAppointments: [],
  patients: [],
  medicines:[],
  prescriptons:[],
  doctor:null,
  patientsCount: 0,
  completedCount: 0,
  remainingCount: 0,

  loading: false,
  error: null,
  fetchAppointments: async () => {
    set({ loading: true, error: null });
    try {
      const response = await getDoctorAppointment();
      const data = response.data;
      const appointments = data.appointments || [];

      set({
        appointments,
        todayAppointments: appointments,
        completedCount: data.completed_appointments,
        remainingCount: data.remaining_appointments,
        loading:false,
      });
    } catch (error) {
      console.error("Failed to fetch appointments:", error);
      set({ loading: false, error: "Failed to fetch appointments" });
    }
  },

  fetchPatients: async (doctor_id) => {
    set({ loading: true, error: null });
    try {
      const response = await getDoctorPatients(doctor_id);
      const data = response.data.data;

      set({
        patients: data.patients || [],
        patientsCount: data.patient_count,
        loading:false
      });
    } catch (error) {
      console.error("Failed to fetch patients:", error);
      set({ loading: false, error: "Failed to fetch appointments" });
    }
  },

  fetchRecentPatients: async () => {
    set({ loading: true, error: null }); 
    try {  
      const response = await getRecentPatientFromAllAppointment();
      const data = response.data.appointments;

      const recent = getRecentUniquePatientAppointments(data, 3);

      set({
        allAppointments: data,
        recentPatients: recent,
        loading:false
      });
    } catch (error) {
      console.error("Failed to fetch recent patients:", error);
      set({ loading: false, error: "Failed to fetch appointments" });
    }
  },
  fetchPrescriptions:async()=>{
    set({ loading: true, error: null }); 
    try{
      const response=await getDoctorPriscriptions();
      const data=response.data.prescriptions;
      set({prescriptons:data,loading:false})
    }catch(err:any){
      console.log("Faild to load prescription",err);
      set({error:err,loading:false})
    }
  },
  fetchMedicines:async()=>{
    set({loading:true,error:null});
    try{
      const response=await getAllMedicens();
      set({medicines:response.data.data,loading:false})
    }catch(err:any){
      console.log("Faild to load Medice",err);
      set({error:err,loading:false})
    }
  },
  fetchDoctorProfile:async()=>{
    set({loading:true,error:null});
    try{
      const response=await getDoctorProfile();
      set({doctor:response.data.data,loading:false})
    }catch(err:any){
      console.log("Faild to load Profile",err);
      set({error:err,loading:false})
    }
  },
  updateDoctorProfile:async(data)=>{
    set({loading:true,error:null})
    try{
      const response=await updateDoctorProfile(data);
      const updated=Array.isArray(response.data.updatedDoctor)?response.data.updatedDoctor[0]:response.data.updatedDoctor;
      set({doctor:updated as Doctor,loading:false})
    }catch(err:any){
      console.log('Faild to update the profile');
      set({error:err,loading:false})
    }
  },

}));
