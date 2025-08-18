import React, { useEffect, useMemo } from 'react';
import { Box, Grid, Typography, Avatar } from '@mui/material';
import {
  Users,
  Calendar,
  DollarSign,
  Stethoscope,
} from "lucide-react";
import { Card, CardContent } from '../../ui/CustomCards';
import { useAdminStore } from '../../../store/adminStore';

const DashboardMetrics: React.FC = () => {
  const { patients, doctors, appointments, fetchPatients, fetchDoctors, fetchAppointments } =
    useAdminStore();

  useEffect(() => {
    fetchPatients();
    fetchDoctors();
    fetchAppointments();
  }, []);



  const metrics = useMemo(() => [
    {
      title: "Total Patients",
      value: patients.length.toString(),
      trend: "up",
      icon: Users,
      color: "#3B82F6",
    },
    {
      title: "Total Appointments",
      value: appointments.length.toString(),

      trend: "up",
      icon: Calendar,
      color: "#10B981",
    },
    {
      title: "Monthly Revenue",
      value: "₹45,231", 

      trend: "up",
      icon: DollarSign,
      color: "#8B5CF6",
    },
    {
      title: "Active Doctors",
      value: doctors.length.toString(),

      trend: "up",
      icon: Stethoscope,
      color: "#F97316",
    },
  ], [patients, doctors, appointments]);

  return (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <Grid container spacing={5} sx={{ width: '100%' }}>
        {metrics.map((metric, index) => {
          const Icon = metric.icon;
          const isUp = metric.trend === 'up';

          return (
            <Grid size={{xs:12,sm:6,md:4,lg:3}} key={index}>
              <Card sx={{ width: '100%' }} animated={false}>
                <CardContent>
                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Box>
                      <Typography variant="subtitle2" color="text.secondary">
                        {metric.title}
                      </Typography>
                      <Typography textAlign={'center'} variant="h5" fontWeight="bold" mt={0.5}>
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
