import type { Appointment } from "../types/doctorType";




export const getRecentUniquePatientAppointments = (
  appointments: Appointment[],
  limit: number = 5
): Appointment[] => {
  // Step 1: Sort appointments by date (descending)
  const sortedAppointments = [...appointments].sort(
    (a, b) =>
      new Date(b.appointment_date).getTime() - new Date(a.appointment_date).getTime()
  );

  // Step 2: Track unique patients by user_id
  const uniquePatientAppointments = new Map<number, Appointment>();

  for (const appointment of sortedAppointments) {
    const patientId = appointment.patient.user_id;
    if (!uniquePatientAppointments.has(patientId)) {
      uniquePatientAppointments.set(patientId, appointment);
    }

    if (uniquePatientAppointments.size >= limit) break;
  }

  return Array.from(uniquePatientAppointments.values());
};

