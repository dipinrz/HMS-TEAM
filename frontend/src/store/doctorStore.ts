
import { create } from 'zustand';
import { getDoctorAppointment, getDoctorPatients,getRecentPatientFromAllAppointment } from '../services/doctorAPI';
import { getRecentUniquePatientAppointments } from '../utility/DoctorUtility';
import type { Appointment, Patient } from '../types/doctorType';

interface DoctorStore {
  appointments: Appointment[];
  allAppointments: Appointment[];
  recentPatients: Appointment[];
  todayAppointments: Appointment[];
  patients: Patient[];
  patientsCount: number;
  completedCount: number;
  remainingCount: number;

  loading:boolean;
  error:string | null;
  fetchAppointments: () => Promise<void>;
  fetchPatients: (doctor_id: number) => Promise<void>;
  fetchRecentPatients: () => Promise<void>;
}

export const useDoctorStore = create<DoctorStore>((set, get) => ({
  appointments: [],
  allAppointments: [],
  recentPatients: [],
  todayAppointments: [],
  patients: [],
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
    try {
        set({ loading: true, error: null });   
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
}));
