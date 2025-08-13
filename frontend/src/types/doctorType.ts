export interface Patient {
  user_id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string | null;
  address: string | null;
  date_of_birth: string | null;
  gender: string | null;
  role: string;
  created_at: string;
  is_active: boolean;
}

export interface Appointment {
  appointment_id: number;
  appointment_date: string;
  status: string;
  reason_for_visit: string | null;
  notes: string | null;
  patient: Patient;
}

export interface Prescription{
  prescription_id: number;
  diagnosis: string;
  prescribed_date: string;
  appointment: Appointment;  
}

export interface Medicine {
  medicine_id: number;
  medicine_name: string;
  description: string;
  cost: string; // if cost is always a string like "30.00"
  expiry_date: string; // ISO date string format: "YYYY-MM-DD"
}

