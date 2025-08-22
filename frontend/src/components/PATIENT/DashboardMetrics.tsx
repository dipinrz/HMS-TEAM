import React, { useEffect, useState } from 'react';
import { Box, Grid, Typography, Avatar } from '@mui/material';
import {
    Calendar,
    FileText,
    Stethoscope,
} from 'lucide-react';
import { Card, CardContent } from '../ui/CustomCards';
import { getPatientAppointments, getPatientPrescriptions } from '../../services/patientApi';

const DashboardMetrics: React.FC = () => {
    const [appointments, setAppointments] = useState([]);
    const [prescriptions, setPrescriptions] = useState([]);
    const [upcoming, setUpcomming] = useState([]);

    const fetchPatientAppointments = async () => {
        try {
            const res = await getPatientAppointments();
            const allAppointments = res.data.appointments;

            setAppointments(allAppointments);

            const now = new Date();


            const upcomingDate = allAppointments.filter((appt: any) => {
                const apptDate = new Date(appt.appointment_date);
                return apptDate > now;
            });

            upcomingDate.sort((a: any, b: any) =>
                new Date(a.appointment_date).getTime() - new Date(b.appointment_date).getTime()
            );

            setUpcomming(upcomingDate);
            console.log(upcomingDate);

        } catch (error) {
            console.error('Failed to fetch appointments:', error);
        }
    };


    const fetchPatientPrescriptions = async () => {
        try {
            const res = await getPatientPrescriptions();
            setPrescriptions(res.data.prescription);
        } catch (error) {
            console.error('Failed to fetch prescriptions:', error);

        }
    }

    useEffect(() => {
        fetchPatientAppointments();
        fetchPatientPrescriptions();
    }, []);


    const metrics = [
        {
            title: "Total Appointments",
            value: appointments.length,
            trend: "up",
            icon: Calendar,
            color: "#10B981",
        },
        {
            title: "Upcoming Appointments",
            value: upcoming.length,
            trend: "up",
            icon: Calendar,
            color: "#10B981",
        },
        {
            title: "Prescriptions",
            value: prescriptions.length,
            trend: "up",
            icon: FileText,
            color: "#8B5CF6",
        },
        {
            title: "Assigned Doctors",
            value: "1",
            trend: "up",
            icon: Stethoscope,
            color: "#F97316",
        },
    ];

    return (
        <Box sx={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center'
        }}>
            <Grid container spacing={5} sx={{ width: '100%' }}>
                {metrics.map((metric, index) => {
                    const Icon = metric.icon;

                    return (
                        <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={index} >
                            <Card sx={{ width: '100%' }} animated={false}>
                                <CardContent>
                                    <Box display="flex" justifyContent="space-between" alignItems="center">
                                        <Box sx={{ display: 'flex', flexDirection: 'column'}}>
                                            <Typography variant="subtitle2" color="text.secondary">
                                                {metric.title}
                                            </Typography>
                                            <Typography variant="h5" fontWeight="bold" mt={0.5}>
                                                {metric.value}
                                            </Typography>
                                        </Box>
                                        <Avatar
                                            sx={{
                                                bgcolor: `${metric.color}20`,
                                                width: 40,
                                                height: 40,
                                            }}
                                        >
                                            <Icon size={20} color={metric.color} />
                                        </Avatar>
                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid>
                    );
                })}
            </Grid>
        </Box>
    );
};

export default DashboardMetrics;




