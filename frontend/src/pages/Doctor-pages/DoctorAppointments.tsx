import {
    Box,
    Typography,
    Avatar,
    Grid,
    Chip,
    Divider,
    CircularProgress,
} from "@mui/material";
import { format } from 'date-fns';

import { useEffect, useState } from "react";
import { useDoctorStore } from "../../store/doctorStore";
import { useAuthStore } from "../../store/useAuthStore";
import CustomButton from "../../components/ui/CustomButton";
import { Card } from "../../components/ui/CustomCards";
import { getInitials, getStatusColor } from "../../utility/DoctorUtility";
import CustomModal from "../../components/ui/CustomModal";
import type { Appointment } from "../../types/doctorType";
import { getDoctorAppointmentById } from "../../services/doctorAPI";
import AppointmentDetailsModal from "./AppointmentDetailsModal";
import { useNavigate } from "react-router-dom";


const DoctorAppointments = () => {
    const { user } = useAuthStore();
    const { allAppointments, fetchRecentPatients,loading, error } = useDoctorStore();
    const [openModal, setOpenModal] = useState(false);
    const [selectedAppointmentId, setSelectedAppointmentId] = useState<number | null>(null);
    const [appointmentDetails, setAppointmentDetails] = useState<Appointment | null>(null);
    const navigate=useNavigate();
    const formattedDateOfBirth = appointmentDetails?.patient.date_of_birth ? new Date(appointmentDetails.patient.date_of_birth).toLocaleDateString() : "N/A";

    const handleOpenModal = (id: number) => {
        setSelectedAppointmentId(id);
        setOpenModal(true);
    };

    const handleCloseModal = () => {
        setOpenModal(false);
        setSelectedAppointmentId(null);
        setAppointmentDetails(null);
    };
    useEffect(() => {
        if (user?.user_id) {
            fetchRecentPatients();
        }
    }, [user?.user_id]);

    const handleAddPrescription=(id:number)=>{
        navigate(`/doctor/prescription/${id}`)    
    }

    useEffect(() => {
        const fetchAppointment = async () => {
            try {
                const response = await getDoctorAppointmentById(Number(selectedAppointmentId));
                setAppointmentDetails(response.data.data.appointment);
            } catch (err) {
                console.error('Failed to fetch appointment', err);
            } finally {
                
            }
        };

        if (openModal) { fetchAppointment(); }
    }, [selectedAppointmentId, openModal]);

    return (
        <Box p={2}>
            
            <Typography variant="h4" fontWeight={600} mb={4}>
                All Appointments
            </Typography>
            {loading?(
                 <Box display="flex" justifyContent="center" mt={4}>
                    <CircularProgress />
                </Box>
            ):error?(
                 <Typography color="error">{error}</Typography>
            ):(
            <Grid container spacing={3}  >
                {allAppointments.length === 0 ? (
                    <Typography variant="body1" color="text.secondary">
                        No appointments found.
                    </Typography>
                ) : (
                    [...allAppointments].sort((a,b)=>new Date(b.appointment_date).getTime()-new Date(a.appointment_date).getDate()).map((appointment) => (
                        <Grid size={{ xs: 12, md: 4 }} key={appointment.appointment_id}>
                            <Card elevation={3}  sx={{ p: 2, borderLeft: `5px solid`, width: "100%", borderColor: `${getStatusColor(appointment.status)}.main` }}>
                                <Box display="flex" alignItems="center" onClick={()=>handleOpenModal(appointment.appointment_id)} justifyContent="space-between" gap={2}>
                                    <Box display="flex" alignItems="center" gap={2}>
                                        <Avatar>
                                            {getInitials(
                                                appointment.patient.first_name,
                                                appointment.patient.last_name
                                            )}
                                        </Avatar>

                                        <Box>
                                            <Typography fontWeight={600}>
                                                {appointment.patient.first_name} {appointment.patient.last_name}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                {appointment.reason_for_visit}
                                            </Typography>
                                        </Box>
                                    </Box>
                                    <Typography fontWeight={600}>
                                        {format(new Date(appointment.appointment_date), 'dd-MM-yyyy')}
                                    </Typography>

                                </Box>
                                <Divider sx={{ my: 1.5 }} />
                                <Box display="flex" justifyContent="space-between" alignItems="center">
                                    <Chip
                                        label={appointment.appointment_id}//make it previkdjnfsjdfn  status
                                        color={getStatusColor(appointment.status)}
                                        size="small"
                                    />
                                    {appointment.status === "scheduled" && (
                                        <CustomButton size="small" onClick={()=>handleAddPrescription(appointment.appointment_id) } label="Start" />
                                    )}
                                </Box>
                                
                            </Card>
                        </Grid>
                    ))
                )}
            </Grid>
            )}
            <CustomModal
                open={openModal}
                onClose={handleCloseModal}
                maxWidth="sm"
                content={
                    appointmentDetails ? (
                        <AppointmentDetailsModal appointmentDetails={appointmentDetails} formattedDateOfBirth={formattedDateOfBirth}
                        getInitials={getInitials} getStatusColor={getStatusColor}/>
                        ) : (
                        <Typography>No data available</Typography>
                    )
                }
            />
        </Box>


    );
};

export default DoctorAppointments;
