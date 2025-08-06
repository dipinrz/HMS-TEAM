import React from 'react';
import {Box,Grid,Avatar,Typography,Stack,Divider,Chip,
} from '@mui/material';
import {UserPlus,Stethoscope,Building2,CreditCard,Activity,
} from 'lucide-react';
import CustomButton from '../ui/CustomButton';
import { Card, CardContent, CardHeader } from '../ui/CustomCards';

const recentAppointments = [
  {
    id: 1,
    patient: "John Doe",
    doctor: "Dr. Smith",
    department: "Cardiology",
    time: "10:00 AM",
    status: "Confirmed",
  },
  {
    id: 2,
    patient: "Jane Roe",
    doctor: "Dr. Adams",
    department: "Neurology",
    time: "11:30 AM",
    status: "Pending",
  },{
    id: 3,
    patient: "Harry Kane",
    doctor: "Dr. Hane",
    department: "Ortho",
    time: "04:10 AM",
    status: "Cancelled",
  },
];


const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case 'confirmed':
      return 'success';
    case 'pending':
      return 'warning';
    case 'cancelled':
      return 'error';
    default:
      return 'default';
  }
};

const AppointmentsAndActions: React.FC = () => {
  return (
    <Box sx={{ width: '100%', mt: 5 }}>
      <Grid container spacing={3}>
        <Grid size={{xs:12,lg:8}}>
          <Card
            sx={{
              border: 'none',
              boxShadow: '0px 1px 2px rgba(0, 0, 0, 0.05)',
              borderRadius: '2rem',
              width: '100%',
              height:'100%'
            }}
          >
            <CardHeader
              title="Today's Appointments"
              subheader="Recent appointment bookings and status updates"

            />
            <CardContent>
              <Stack spacing={2}>
                {recentAppointments.map((appointment) => (
                  <Box
                    key={appointment.id}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      p: 2,
                      bgcolor: 'grey.50',
                      borderRadius: 2,
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Avatar>
                        {appointment.patient
                          .split(' ')
                          .map((n) => n[0])
                          .join('')}
                      </Avatar>
                      <Box>
                        <Typography fontWeight={600} color="text.primary">
                          {appointment.patient}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {appointment.doctor} • {appointment.department}
                        </Typography>
                      </Box>
                    </Box>
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1.5,
                      }}
                    >
                      <Typography
                        variant="body2"
                        fontWeight={600}
                        color="text.primary"
                      >
                        {appointment.time}
                      </Typography>
                      <Chip
                        label={appointment.status}
                        color={getStatusColor(appointment.status)}
                        size="small"
                        sx={{
                          fontWeight: 500,
                          minWidth: 80,
                          justifyContent: 'center',
                        }}
                      />
                    </Box>
                  </Box>
                ))}
              </Stack>
              <Divider sx={{ my: 3 }} />
              <CustomButton fullWidth variant="outlined" label="View All Appointments" />
            </CardContent>
          </Card>
        </Grid>

        {/* Quick Actions */}
        <Grid size={{xs:12,lg:4}}>
          <Card
            sx={{
              border: 'none',
              boxShadow: '0px 1px 2px rgba(0, 0, 0, 0.05)',
              borderRadius: '2rem',
              width: '100%',
            }}
          >
            <CardHeader
              title="Quick Actions"
              subheader="Frequently used administrative tasks"
            />
            <CardContent>
              <Stack spacing={2}>
                <CustomButton
                  fullWidth
                  variant="contained"
                  startIcon={<UserPlus />}
                  sx={{
                    bgcolor: 'primary.main',
                    py: 1.5,
                    borderRadius: 2,
                    textTransform: 'none',
                    fontWeight: 500,
                    justifyContent: 'center',
                    '&:hover': { bgcolor: 'primary.dark' },
                  }}
                  label="Add New Patient"
                />
                <CustomButton
                  fullWidth
                  variant="contained"
                  startIcon={<Stethoscope />}
                  sx={{
                    bgcolor: 'primary.main',
                    py: 1.5,
                    borderRadius: 2,
                    textTransform: 'none',
                    fontWeight: 500,
                    justifyContent: 'center',
                    '&:hover': { bgcolor: 'primary.dark' },
                  }}
                  label="Register Doctor"
                />
                <CustomButton
                  fullWidth
                  variant="contained"
                  startIcon={<Building2 />}
                  sx={{
                    bgcolor: 'primary.main',
                    py: 1.5,
                    borderRadius: 2,
                    textTransform: 'none',
                    fontWeight: 500,
                    justifyContent: 'center',
                    '&:hover': { bgcolor: 'primary.dark' },
                  }}
                  label="Manage Departments"
                />
                <CustomButton
                  fullWidth
                  variant="contained"
                  startIcon={<CreditCard />}
                  sx={{
                    bgcolor: 'primary.main',
                    py: 1.5,
                    borderRadius: 2,
                    textTransform: 'none',
                    fontWeight: 500,
                    justifyContent: 'center',
                    '&:hover': { bgcolor: 'primary.dark' },
                  }}
                  label="Process Billing"
                />
                <CustomButton
                  fullWidth
                  variant="contained"
                  startIcon={<Activity />}
                  sx={{
                    bgcolor: 'primary.main',
                    py: 1.5,
                    borderRadius: 2,
                    textTransform: 'none',
                    fontWeight: 500,
                    justifyContent: 'center',
                    '&:hover': { bgcolor: 'primary.dark' },
                  }}
                  label="System Reports"
                />
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AppointmentsAndActions;
