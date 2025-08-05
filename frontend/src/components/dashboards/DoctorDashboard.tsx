import { Avatar, Box, Chip, Grid, Typography, useTheme } from "@mui/material";
import Navbar from "../NavBar";
import { Card, CardContent, CardHeader } from "../ui/CustomCards";
import { AccessTime, CalendarToday, Description, ErrorOutline, Group} from "@mui/icons-material";
import CustomButton from "../ui/CustomButton";
import { Stethoscope } from "lucide-react";

type ThemeColorKey = 
  'primary' | 
  'secondary' | 
  'success' | 
  'warning' | 
  'error' | 
  'info';

interface TodayStats{
    title:string;
    value:string;
    subtitle:string;
    icon:React.ReactNode;
    bgcolor:ThemeColorKey;
  }
interface Appointment {
  id: number;
  time: string;
  patient: string;
  type: string;
  status: string;
  duration: string;
  condition: string;
  urgency: string;
}
 const statsData:TodayStats[]= [
    {
      title: "Today's Appointments",
      value: '8',
      subtitle: '2 completed, 6 remaining',
      icon: <CalendarToday color="primary" />,
      bgcolor:"primary"
    },
    {
      title: 'Total Patients',
      value: '156',
      subtitle: 'Under your care',
      icon: <Group color="success" />,
      bgcolor:"success"
    },
    {
      title: 'Pending Reports',
      value: '12',
      subtitle: 'Require your review',
      icon: <Description color="warning" />,
      bgcolor:"warning"
    },
    {
      title: 'Next Appointment',
      value: '10:30 AM',
      subtitle: 'Sarah Johnson',
      icon: <AccessTime color="secondary" />,
      bgcolor:"secondary"
    }
  ];

  const todayAppointments: Appointment[] = [
    {
      id: 1,
      time: '09:00 AM',
      patient: 'John Smith',
      type: 'Follow-up',
      status: 'completed',
      duration: '30 min',
      condition: 'Hypertension',
      urgency: 'normal'
    },
    {
      id: 2,
      time: '09:30 AM',
      patient: 'Emily Davis',
      type: 'Consultation',
      status: 'completed',
      duration: '45 min',
      condition: 'Diabetes',
      urgency: 'normal'
    },
    {
      id: 3,
      time: '10:30 AM',
      patient: 'Sarah Johnson',
      type: 'Check-up',
      status: 'upcoming',
      duration: '30 min',
      condition: 'Routine',
      urgency: 'normal'
    },
    {
      id: 4,
      time: '11:00 AM',
      patient: 'Michael Brown',
      type: 'Emergency',
      status: 'upcoming',
      duration: '60 min',
      condition: 'Chest Pain',
      urgency: 'high'
    },
    {
      id: 5,
      time: '02:00 PM',
      patient: 'Lisa Wilson',
      type: 'Follow-up',
      status: 'upcoming',
      duration: '30 min',
      condition: 'Recovery',
      urgency: 'normal'
    }
  ];

const DoctorDashboard= () => {
    const theme = useTheme();
      const getStatusChipColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'success';
      case 'upcoming':
        return 'info';
      default:
        return 'default';
    }
  };
  return (
    <Box  sx={{ mt: 10, px: 4 }}>
      <Navbar />
      <Box mb={4} display={"flex"} justifyContent="space-between" alignItems={"center"}>
        <Box>
          <Typography variant="h4">Good morning, Dr. Wilson</Typography>
          <Typography variant="subtitle1">You have 6 appointments scheduled for today</Typography>
        </Box>
        <Box display="flex" gap={2}>
          <CustomButton startIcon={<Description/>} sx={{backgroundColor: theme.palette.common.white,color: theme.palette.text.primary,
          border: '1px solid #ddd','&:hover': {backgroundColor: '#f5f5f5',},}} label="View Reports"></CustomButton>
          <CustomButton startIcon={<Stethoscope/>} label="Start Consultation"></CustomButton>
          
        </Box>
      </Box>
        <Grid container spacing={5} style={{ width: '100%' }}>
          {statsData.map((stat,index)=>(
          <Grid size ={{ xs:12, sm:6 ,md:4, lg:3}} key={index}>
            <Card elevation={2} sx={{ height: '100%',width:'100%' }}>
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
                      backgroundColor:`${theme.palette[stat.bgcolor].main}1A`,
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

          <Grid container size= {{xs:12, md:8}} width={'100%'}>
          <Card  sx={{width:'100%'}}>
            <CardHeader title="Today's Schedule" subheader={new Date().toLocaleDateString()} />
            <CardContent>
              {todayAppointments.map((appt) => (
                <Box
                  key={appt.id}
                  borderLeft={4}
                  borderColor={appt.urgency === 'high' ? 'error.main' : 'primary.main'}
                  bgcolor="#f9f9f9"
                  p={2}
                  mb={2}
                  borderRadius={2}
                >
                  <Grid container alignItems="center" justifyContent="space-between">
                    <Grid size={{xs:8 }} display="flex" alignItems="center" gap={2}>
                      <Avatar>{appt.patient.split(' ').map(n => n[0]).join('')}</Avatar>
                      <Box>
                        <Typography fontWeight={600}>{appt.patient}</Typography>
                        <Typography variant="body2">{appt.type} • {appt.condition}</Typography>
                      </Box>
                    </Grid>
                    <Grid display="flex" alignItems="center" gap={1}>
                      {appt.urgency === 'high' && <ErrorOutline color="error" />}
                      <Chip  label={appt.status} color={getStatusChipColor(appt.status)} />
                      {appt.status === 'upcoming' && (
                        <CustomButton variant="contained" size="small" label="Start"></CustomButton>
                      )}
                    </Grid>
                  </Grid>
                </Box>
              ))}
            </CardContent>
          </Card>
        </Grid>
        </Grid>
        
      </Box>
  );
};

export default DoctorDashboard;
