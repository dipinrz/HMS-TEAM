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
