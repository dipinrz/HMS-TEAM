import { Avatar, Box, Chip, Divider, Typography, Stack } from "@mui/material";
import CustomModal from "../ui/CustomModal";

interface AppointmentModalProps {
    open: boolean;
    onClose: () => void;
    appointment: any | null;
}

const AppointmentModal: React.FC<AppointmentModalProps> = ({
    open,
    onClose,
    appointment,
}) => {
    if (!appointment) return null;

    const getInitials = (first: string, last: string) =>
        `${first?.[0] || ""}${last?.[0] || ""}`.toUpperCase();

    const getStatusColor = (status: string) => {
        switch (status?.toLowerCase()) {
            case "completed":
                return "success";
            case "cancelled":
                return "error";
            case "upcoming":
                return "info";
            default:
                return "default";
        }
    };

    const formattedDate = new Date(appointment.appointment_date).toLocaleDateString();
    const formattedTime = new Date(appointment.appointment_date).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
    });

    return (
        <CustomModal
            open={open}
            onClose={onClose}
            maxWidth="sm"
            title="Appointment Details"
            content={
                <Stack spacing={3}>
                    {/* Doctor Info */}
                    <Box display="flex" alignItems="center" gap={2}>
                        <Avatar
                            sx={{
                                bgcolor: "primary.main",
                                width: 56,
                                height: 56,
                                fontSize: 20,
                            }}
                        >
                            {getInitials(appointment.doctor?.first_name, appointment.doctor?.last_name)}
                        </Avatar>
                        <Box>
                            <Typography fontWeight={600} fontSize={16}>
                                Dr. {appointment.doctor?.first_name} {appointment.doctor?.last_name}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Department: {appointment.department?.name || "N/A"}
                            </Typography>
                        </Box>
                    </Box>

                    <Divider />

                    {/* Reason & Notes */}
                    <Box>
                        <Typography>
                            <strong>Reason for Visit:</strong> {appointment.reason_for_visit || "N/A"}
                        </Typography>
                        <Typography color="text.secondary" fontSize={14}>
                            <strong>Notes:</strong> {appointment.notes || "No notes provided."}
                        </Typography>
                    </Box>

                    {/* Status */}
                    <Box display="flex" alignItems="center" gap={1.5}>
                        <Typography fontWeight={600}>Status:</Typography>
                        <Chip
                            label={appointment.status}
                            color={getStatusColor(appointment.status)}
                            sx={{ fontWeight: 600 }}
                        />
                    </Box>

                    {/* Date & Time */}
                    <Box display="flex" justifyContent="space-between">
                        <Box>
                            <Typography fontWeight={600}>Date</Typography>
                            <Typography color="text.secondary">{formattedDate}</Typography>
                        </Box>
                        <Box>
                            <Typography fontWeight={600}>Time</Typography>
                            <Typography color="text.secondary">{formattedTime}</Typography>
                        </Box>
                    </Box>
                </Stack>
            }
        />
    );
};

export default AppointmentModal;
