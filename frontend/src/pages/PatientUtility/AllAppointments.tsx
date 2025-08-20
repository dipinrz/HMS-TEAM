import { useEffect, useState } from "react";
import { getPatientAppointments, getPatientPrescriptionsByAppointmentId } from "../../services/patientApi";
import { toast } from "react-toastify";
import { Box, Typography, Grid, Chip, Paper, useTheme } from "@mui/material";
import CustomButton from "../../components/ui/CustomButton";
import { CalendarToday, MedicalServices, Notes, Person } from "@mui/icons-material";
import PrescriptionModal from "../../components/PATIENT/PrescriptionModal";

function AllAppointments() {
    const [appointments, setAppointments] = useState([]);
    const theme = useTheme();
    const [prescriptions, setPrescriptions] = useState([]);
    const [openModal, setOpenModal] = useState(false);
    // const [, setSelectedAppointmentId] = useState<number | null>(null);

    const viewAllAppointments = async () => {
        try {
            const res = await getPatientAppointments();
            setAppointments(res.data.appointments);
        } catch (error) {
            toast.error("Failed to fetch appointments");
            console.error(error);
        }
    };

    const viewPrescription = async (appointId: number) => {
        try {
            const res = await getPatientPrescriptionsByAppointmentId(appointId);
            setPrescriptions(res.data.prescriptions);
            // setSelectedAppointmentId(appointId);
            setOpenModal(true);
        } catch (error) {
            toast.error("Failed to fetch prescription");
        }
    };

    useEffect(() => {
        viewAllAppointments();
    }, []);

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom sx={{
                fontWeight: 700,
                mb: 4,
                color: theme.palette.text.primary,
                display: 'flex',
                alignItems: 'center',
                gap: 2
            }}>
                <MedicalServices fontSize="large" />
                My Appointments
            </Typography>

            <Grid container spacing={3} >
                {appointments.map((appt: any) => (
                    <Grid size={{ xs: 12 }} key={appt.appointment_id}>
                        <Paper
                            elevation={0}
                            sx={{
                                p: 3,
                                borderRadius: 3,
                                border: `1px solid ${theme.palette.divider}`,
                                background: theme.palette.background.paper,
                                transition: 'all 0.3s ease',
                                // '&:hover': {
                                //     transform: 'translateY(-2px)',
                                //     boxShadow: theme.shadows[4],
                                //     borderColor: theme.palette.primary.light
                                // }
                            }}
                        >
                            <Grid container spacing={3} alignItems="center">
                                {/* Appointment Details */}
                                <Grid size={{ xs: 12, md: 4 }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1.5 }}>
                                        <Box sx={{
                                            background: "linear-gradient(135deg, #020aa5ff 0%, #0a036bff 100%)",
                                            color: theme.palette.primary.main,
                                            borderRadius: '10px',
                                            p: 1.5,
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center'
                                        }}>
                                            <CalendarToday sx={{ color: 'white' }} />
                                        </Box>
                                        <Box>
                                            <Typography variant="h6" fontWeight={600}>
                                                {appt.reason_for_visit}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.5 }}>
                                                <Person fontSize="small" />
                                                Dr. {appt.doctor.first_name} {appt.doctor.last_name}
                                            </Typography>
                                        </Box>
                                    </Box>
                                </Grid>

                                {/* Date/Time and Department */}
                                <Grid size={{ xs: 12, md: 4 }}>
                                    <Box sx={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        gap: 1,
                                        borderLeft: { md: `1px dashed ${theme.palette.divider}` },
                                        pl: { md: 3 },
                                        py: { md: 1 }
                                    }}>
                                        <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <CalendarToday color="primary" fontSize="small" />
                                            {new Date(appt.appointment_date).toLocaleString([], {
                                                weekday: "short",
                                                year: "numeric",
                                                month: "short",
                                                day: "numeric",
                                                hour: "2-digit",
                                                minute: "2-digit",
                                            })}
                                        </Typography>
                                        <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <MedicalServices color="primary" fontSize="small" />
                                            {appt.department.name}
                                        </Typography>
                                        {appt.notes && (
                                            <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                <Notes color="primary" fontSize="small" />
                                                {appt.notes}
                                            </Typography>
                                        )}
                                    </Box>
                                </Grid>

                                {/* Actions */}
                                <Grid size={{ xs: 12, md: 4 }}>
                                    <Box sx={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: { xs: 'flex-start', md: 'flex-end' },
                                        gap: 2,
                                        borderLeft: { md: `1px dashed ${theme.palette.divider}` },
                                        pl: { md: 3 }
                                    }}>
                                        <Chip
                                            label={appt.status}
                                            size="medium"
                                            color={
                                                appt.status === 'completed' ? 'success' :
                                                    appt.status === 'cancelled' ? 'error' : 'primary'
                                            }
                                            sx={{
                                                fontWeight: 600,
                                                textTransform: "capitalize",
                                                alignSelf: { xs: 'flex-start', md: 'flex-end' }
                                            }}
                                        />
                                        <CustomButton
                                            variant="contained"
                                            size="medium"
                                            label="View Prescription"
                                            onClick={() => viewPrescription(appt.appointment_id)}
                                            sx={{
                                                borderRadius: '8px',
                                                px: 3,
                                                py: 1,
                                                textTransform: 'none',
                                                fontWeight: 500
                                            }}
                                        />
                                    </Box>
                                </Grid>
                            </Grid>
                        </Paper>
                    </Grid>
                ))}
            </Grid>

            {/* ✅ Render Modal Outside the Map */}
            <PrescriptionModal
                open={openModal}
                onClose={() => setOpenModal(false)}
                title="Prescription"
                prescriptions={prescriptions}
            />
        </Box >
    );
}

export default AllAppointments;





