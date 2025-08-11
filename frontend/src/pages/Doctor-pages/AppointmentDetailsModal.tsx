import { Avatar, Box, Chip, Divider, Typography } from "@mui/material";
import type { Appointment } from "../../types/doctorType";


interface AppointmentDetailsModalProps {
    appointmentDetails: Appointment;
    formattedDateOfBirth: string;
    getInitials: (firstName: string, lastName: string) => string;
    getStatusColor: (status: string) => "success" | "warning" | "error" | "default" | "info" | "primary" | "secondary";
}
function AppointmentDetailsModal({ appointmentDetails, formattedDateOfBirth, getInitials, getStatusColor }: AppointmentDetailsModalProps) {
    return (
        <>
            {/* Header */}
            <Typography variant="h5" fontWeight={700} mb={3} textAlign="center">
                Appointment Details
            </Typography>

            {/* Patient Info */}
            <Box display="flex" alignItems="center" gap={2} mb={3}>
                <Avatar
                    sx={{
                        bgcolor: "primary.main",
                        width: 56,
                        height: 56,
                        fontSize: 20,
                    }}
                >
                    {getInitials(
                        appointmentDetails.patient.first_name,
                        appointmentDetails.patient.last_name
                    )}
                </Avatar>
                <Box>
                    <Typography fontWeight={600} fontSize={16}>
                        {appointmentDetails.patient.first_name}{" "}
                        {appointmentDetails.patient.last_name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Gender: {appointmentDetails.patient.gender} • DOB:{" "}
                        {formattedDateOfBirth}
                    </Typography>
                </Box>
            </Box>

            <Divider sx={{ mb: 2 }} />

            {/* Reason & Notes */}
            <Box mb={2}>
                <Typography mb={0.5}>
                    <strong>Reason for Visit:</strong> {appointmentDetails.reason_for_visit}
                </Typography>
                <Typography color="text.secondary" fontSize={14}>
                    <strong>Notes:</strong>{" "}
                    {appointmentDetails.notes || "No notes provided."}
                </Typography>
            </Box>

            {/* Status */}
            <Box display="flex" alignItems="center" gap={1.5} mb={2}>
                <Typography fontWeight={600}>Status:</Typography>
                <Chip
                    label={appointmentDetails.status}
                    color={getStatusColor(appointmentDetails.status)}
                    sx={{ fontWeight: 600 }}
                />
            </Box>

            {/* Date & Time */}
            <Box display="flex" justifyContent="space-between" mt={2}>
                <Box>
                    <Typography fontWeight={600}>Date</Typography>
                    <Typography color="text.secondary">
                        {new Date(appointmentDetails.appointment_date).toLocaleDateString()}
                    </Typography>
                </Box>
                <Box>
                    <Typography fontWeight={600}>Time</Typography>
                    <Typography color="text.secondary">
                        {new Date(appointmentDetails.appointment_date).toLocaleTimeString(
                            [],
                            { hour: "2-digit", minute: "2-digit" }
                        )}
                    </Typography>
                </Box>
            </Box>
        </>
    );
}

export default AppointmentDetailsModal;
