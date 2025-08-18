// import { create } from "zustand";
// import { fetchAllDepartments, getAllDoctors, getAllPatients } from "../services/adminAPi";


// interface AdminStore {
//   patients: any[];
//   doctors: any[];
//   departments: any[];

//   loading: boolean;
//   error: string | null;

//   fetchPatients: () => Promise<void>;
//   fetchDoctors: () => Promise<void>;
//   fetchDepartments: () => Promise<void>;
// }

// export const useAdminStore = create<AdminStore>((set) => ({
//   patients: [],
//   doctors: [],
//   departments: [],

//   loading: false,
//   error: null,

//   fetchPatients: async () => {
//     console.log("🔄 Fetching all patients...");
//     set({ loading: true, error: null });
//     try {
//       const response = await getAllPatients();
//       console.log("✅ Patients API Response:", response);
//       set({ patients: response.data.patients || [], loading: false });
//       console.log("📦 Stored Patients in Zustand:", response.data.patients || []);
//     } catch (error) {
//       console.error("❌ Failed to fetch patients:", error);
//       set({ loading: false, error: "Failed to fetch patients" });
//     }
//   },

//   fetchDoctors: async () => {
//     console.log("🔄 Fetching all doctors...");
//     set({ loading: true, error: null });
//     try {
//       const response = await getAllDoctors();
//       console.log("✅ Doctors API Response:", response);
//       set({ doctors: response.data.data || [], loading: false });
//       console.log("📦 Stored Doctors in Zustand:", response.data.data || []);
//     } catch (error) {
//       console.error("❌ Failed to fetch doctors:", error);
//       set({ loading: false, error: "Failed to fetch doctors" });
//     }
//   },

//   fetchDepartments: async () => {
//     console.log("🔄 Fetching all departments...");
//     set({ loading: true, error: null });
//     try {
//       const response = await fetchAllDepartments();
//       console.log("✅ Departments API Response:", response);
//       set({ departments: response.data.data.departments || [], loading: false });
//       console.log("📦 Stored Departments in Zustand:", response.data.data.departments || []);
//     } catch (error) {
//       console.error("❌ Failed to fetch departments:", error);
//       set({ loading: false, error: "Failed to fetch departments" });
//     }
//   },
// }));



import { create } from "zustand";
import { fetchAllDepartments, getAllDoctors, getAllPatients,fetchAllAppointmentsAPI } from "../services/adminAPi";

interface AdminStore {
  patients: any[];
  doctors: any[];
  departments: any[];
  appointments: any[];

  loading: boolean;
  error: string | null;

  fetchPatients: () => Promise<void>;
  fetchDoctors: () => Promise<void>;
  fetchDepartments: () => Promise<void>;
  fetchAppointments: () => Promise<void>;
}

export const useAdminStore = create<AdminStore>((set) => ({
  patients: [],
  doctors: [],
  departments: [],
  appointments: [],

  loading: false,
  error: null,

  fetchPatients: async () => {
    // console.log("🔄 Fetching all patients...");
    set({ loading: true, error: null });
    try {
      const response = await getAllPatients();
      // console.log("✅ Patients API Response:", response);
      set({ patients: response.data.patients || [], loading: false });
      // console.log("📦 Stored Patients in Zustand:", response.data.patients || []);
    } catch (error) {
      console.error("❌ Failed to fetch patients:", error);
      set({ loading: false, error: "Failed to fetch patients" });
    }
  },

  fetchDoctors: async () => {
    // console.log("🔄 Fetching all doctors...");
    set({ loading: true, error: null });
    try {
      const response = await getAllDoctors();
      // console.log("✅ Doctors API Response:", response);
      set({ doctors: response.data.data || [], loading: false });
      // console.log("📦 Stored Doctors in Zustand:", response.data.data || []);
    } catch (error) {
      console.error("❌ Failed to fetch doctors:", error);
      set({ loading: false, error: "Failed to fetch doctors" });
    }
  },

  fetchDepartments: async () => {
    // console.log("🔄 Fetching all departments...");
    set({ loading: true, error: null });
    try {
      const response = await fetchAllDepartments();
      // console.log("✅ Departments API Response:", response);
      set({ departments: response.data.data.departments || [], loading: false });
      // console.log("📦 Stored Departments in Zustand:", response.data.data.departments || []);
    } catch (error) {
      console.error("❌ Failed to fetch departments:", error);
      set({ loading: false, error: "Failed to fetch departments" });
    }
  },

  fetchAppointments: async () => {
    // console.log("🔄 Fetching all appointments...");
    set({ loading: true, error: null });
    try {
      const response = await fetchAllAppointmentsAPI();
      // console.log("✅ Appointments API Response:", response);
      set({ appointments: response.data.data.appointments || [], loading: false });
      // console.log("📦 Stored Appointments in Zustand:", response.data.data.appointments || []);
    } catch (error) {
      console.error("❌ Failed to fetch appointments:", error);
      set({ loading: false, error: "Failed to fetch appointments" });
    }
  },
}));
