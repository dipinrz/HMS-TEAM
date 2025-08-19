
import { Avatar, Box, Chip, Divider, Grid, Typography, useTheme } from "@mui/material";
import { AccessTime, CalendarToday, Description, EventBusy, Group } from "@mui/icons-material";
import { Stethoscope } from "lucide-react";
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider, StaticDatePicker } from '@mui/x-date-pickers';
import { useEffect, useState } from "react";

import CustomButton from "../../components/ui/CustomButton";
import { Card, CardContent, CardHeader } from "../../components/ui/CustomCards";
import { useAuthStore } from "../../store/useAuthStore"; 
import { useDoctorStore } from "../../store/doctorStore";
import { getInitials } from "../../utility/DoctorUtility";


type ThemeColorKey =
  'primary' |
  'secondary' |
  'success' |
  'warning' |
  'error' |
  'info';

interface TodayStats {
  title: string;
  value: string;
  subtitle: string;
  icon: React.ReactNode;
  bgcolor: ThemeColorKey;
}

const DoctorDashboard = () => {
  const {
  appointments,
  todayAppointments,
  patientsCount,
  remainingCount,
  completedCount,
  recentPatients,
  fetchAppointments,
  fetchPatients,
  fetchRecentPatients,
  isHeadDoctor,
  fetchHeadDoctor
} = useDoctorStore();

  const theme = useTheme();
  const {user}=useAuthStore()
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  
 
  useEffect(()=>{
    if(user?.user_id){
      fetchAppointments();
      fetchPatients();
      fetchRecentPatients();
      fetchHeadDoctor();
    }    
  },[])


  
  const getStatusChipColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'success';
      case 'scheduled':
        return 'info';
      case 'stable':
        return 'success';
      case 'monitoring':
        return 'warning';
      case 'recovering':
        return 'info';
      case 'cancelled':
        return 'error';
      default:
        return 'default';
    }
  };

const statsData: TodayStats[] = [
  {
    title: "Today's Appointments",
    value:`${appointments.length}`,
    subtitle: `${completedCount} completed, ${remainingCount} remaining`,
    icon: <CalendarToday color="primary" />,
    bgcolor: "primary"
  },
  {
    title: 'Total Patients',
    value: `${patientsCount}`,
    subtitle: 'Under your care',
    icon: <Group color="success" />,
    bgcolor: "success"
  },
  {
    title: 'Pending Reports',
    value: '12',
    subtitle: 'Require your review',
    icon: <Description color="warning" />,
    bgcolor: "warning"
  },
  {
    title: 'Next Appointment',
    value: '10:30 AM',
    subtitle: 'Sarah Johnson',
    icon: <AccessTime color="secondary" />,
    bgcolor: "secondary"
  }
];
  return (
    <Box sx={{p:2}}>
      
      <Box mb={4} display={"flex"} justifyContent="space-between" alignItems={"center"}>
        <Box>
          <Typography variant="h4" color="text.primary" fontWeight={600} sx={{ fontSize: { xs: "1.75rem", sm: "2.125rem" } }}>Good morning, Dr {user?.first_name}</Typography>
          <Typography variant="body1" color="text.secondary" sx={{ fontSize: { xs: "0.875rem", sm: "1rem" }, mt: 0.5 }}>You have {appointments.length} appointments scheduled for today</Typography>
        </Box>
        <Box display="flex" gap={2}>
          <CustomButton startIcon={<Description />} sx={{
            backgroundColor: theme.palette.common.white, color: theme.palette.text.primary,
            border: '1px solid #ddd', '&:hover': { backgroundColor: '#f5f5f5', },
          }} label="View Reports"></CustomButton>
          <CustomButton startIcon={<Stethoscope />} label="Start Consultation"></CustomButton>

        </Box>
      </Box>
      <Grid container spacing={5} style={{ width: '100%' }}>
        {statsData.map((stat, index) => (
          <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={index}>
            <Card elevation={2} sx={{ height: '100%', width: '100%' }}>
              <CardContent>
                <Box display="flex" alignItems="center" justifyContent="space-between">
                  <Box>
                    <Typography variant="body2" color="text.secondary" fontWeight={500}>
                      {stat.title}
                    </Typography>
                    <Typography variant="h5" fontWeight={700} mt={1}>
                      {stat.value}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" mt={1}>
                      {stat.subtitle}
                    </Typography>
                  </Box>

                  <Box
                    sx={{
                      p: 1.5,
                      borderRadius: '50%',
                      backgroundColor: `${theme.palette[stat.bgcolor].main}1A`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {stat.icon}
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}

        <Grid container size={{ xs: 12, md: 8 }} width={'100%'}>
          <Card sx={{ width: '100%' }}>
            <CardHeader title="Today's Schedule" subheader={new Date().toLocaleDateString()} />
            <CardContent sx={{display:'flex',alignItems:'center',justifyContent:'center'}}>
              {todayAppointments.length>0 ?(
              todayAppointments.map((appointent) => (
                <Box
                  key={appointent.appointment_id}
                  borderLeft={4}
                  borderColor={appointent.status=== 'scheduled' ? 'primary.main':appointent.status==='completed'?'success.main' :'error.main' }
                  bgcolor="#f9f9f9"
                  p={2}
                  mb={2}
                  borderRadius={2}
                >
                  <Grid container alignItems="center" justifyContent="space-between">
                    <Grid size={{ xs: 8 }} display="flex" alignItems="center" gap={2}>
                      <Avatar>{getInitials(appointent.patient.first_name,appointent.patient.last_name)}</Avatar>
                      <Box>
                        <Typography fontWeight={600}>{appointent.patient.first_name}{appointent.patient.last_name}</Typography>
                        <Typography variant="body2">{appointent.reason_for_visit} {appointent.notes}</Typography>
                      </Box>
                    </Grid>
                    <Grid display="flex" alignItems="center" gap={1}>
                      {/* {appointent.urgency === 'high' && <ErrorOutline color="error" />} */}
                      <Chip label={appointent.status} size="small" color={getStatusChipColor(appointent.status)} />
                      {appointent.status === 'scheduled' && (
                        <CustomButton variant="contained" size="small" label="Start"></CustomButton>
                      )}
                    </Grid>
                  </Grid>
                </Box>
              ))):(
                <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" mt={4} mb={4}>
                  <EventBusy sx={{ fontSize: 48, color: 'text.disabled' }} />
                  <Typography variant="h6" color="text.secondary" mt={2}>
                    No appointments scheduled for today
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
        <Grid container size={{ xs: 12, md: 4 }} display={'flex'}>
          <Card sx={{width:'100%'}}>
            <CardHeader title="Calendar" subheader="Navigate your schedule" />
            <CardContent>
              <LocalizationProvider dateAdapter={AdapterDateFns} >
                <StaticDatePicker
                  displayStaticWrapperAs="desktop"
                  value={selectedDate}
                  onChange={(newValue: Date | null) => setSelectedDate(newValue)}
                  sx={{width:"100%"}}
                />
              </LocalizationProvider>
              <Box mt={2} display="flex" flexDirection="column" gap={1}>
                <CustomButton variant="outlined" label="View Full Schedule" sx={{
                backgroundColor: theme.palette.common.white, color: theme.palette.text.primary,
                border: '1px solid #ddd', '&:hover': { backgroundColor: '#f5f5f5', },
                }} startIcon={<CalendarToday />}></CustomButton>
                <CustomButton variant="outlined" label="Set Availability" sx={{
                backgroundColor: theme.palette.common.white, color: theme.palette.text.primary,
                border: '1px solid #ddd', '&:hover': { backgroundColor: '#f5f5f5', },
                }}startIcon={<AccessTime />}></CustomButton>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      <Box mt={4}>
        <Card sx={{width:"100%"}}>
          <CardHeader title="Recent Patients" subheader="Patients you have recently treated"></CardHeader>
          <Grid container spacing={5} padding={2}>
                {recentPatients.map((appointent)=>(
                  <Grid size={{xs:12,md:4}} key={appointent.patient.user_id}>
                    <Card variant="outlined" sx={{width:"100%"}}>
                      <CardContent>
                        <Box display="flex" gap={2} mb={2} alignItems="center">
                          <Avatar>{getInitials(appointent.patient.first_name,appointent.patient.last_name)}</Avatar>
                          <Box>
                            <Typography fontWeight={600}>{appointent.patient.first_name}</Typography>
                            <Typography variant="body2" color="textSecondary">Age {appointent.patient.date_of_birth} • {appointent.patient.gender}</Typography>
                          </Box>
                        </Box>
                        <Divider/>
                        <Box mt={2} mb={2}>
                          <Box display="flex" justifyContent="space-between"> 
                            <Typography variant="body2">Condition: </Typography>
                            <Typography><strong>{appointent.reason_for_visit}</strong></Typography>
                          </Box>
                          <Box display="flex" justifyContent="space-between"> 
                            <Typography variant="body2">Status:  </Typography>
                            <Typography color={getStatusChipColor(appointent.status)}><strong>{appointent.status}</strong></Typography>
                          </Box>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                ))} 
          </Grid>
        </Card>
      </Box>
    </Box> 
  );
};

export default DoctorDashboard;
