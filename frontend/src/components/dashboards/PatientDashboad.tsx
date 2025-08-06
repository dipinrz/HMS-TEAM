import {
  Avatar,
  Box,
  Chip,
  Grid,
  Typography,
  useTheme,
  Alert,
  LinearProgress,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Badge,
  Paper,
} from "@mui/material";
import Navbar from "../NavBar";
import { Card, CardContent, CardHeader } from "../ui/CustomCards";
import {
  CalendarToday,
  Description,
  ReceiptLong,
  MedicalServices,
  AccessTime,
  Download,
  Notifications,
  FavoriteRounded,
  TrendingUp,
  Warning,
  CheckCircle,
  LocalPharmacy,
  Phone,
  VideoCall,
  Message,
} from "@mui/icons-material";
import CustomButton from "../ui/CustomButton";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider, StaticDatePicker } from "@mui/x-date-pickers";
import { useState } from "react";

interface ThemeColorKey {
  primary: string;
  secondary: string;
  success: string;
  warning: string;
  error: string;
  info: string;
}

interface PatientStats {
  title: string;
  value: string;
  subtitle: string;
  icon: React.ReactNode;
  bgcolor: keyof ThemeColorKey;
  trend?: string;
  action?: string;
}

interface Appointment {
  id: number;
  time: string;
  doctor: string;
  type: string;
  status: string;
  duration: string;
  location?: string;
  appointmentType?: "in-person" | "video" | "phone";
}

interface Medication {
  id: number;
  name: string;
  dosage: string;
  frequency: string;
  remaining: number;
  refillDate: string;
}

interface HealthMetric {
  title: string;
  value: string;
  unit: string;
  status: "normal" | "warning" | "critical";
  lastUpdated: string;
}

const statsData: PatientStats[] = [
  {
    title: "Upcoming Appointments",
    value: "2",
    subtitle: "Next: Today at 2:00 PM",
    icon: <CalendarToday color="primary" />,
    bgcolor: "primary",
    trend: "+1 this week",
    action: "View All",
  },
  {
    title: "Health Score",
    value: "87%",
    subtitle: "Excellent condition",
    icon: <FavoriteRounded color="success" />,
    bgcolor: "success",
    trend: "+5% vs last month",
    action: "View Details",
  },
  {
    title: "Pending Actions",
    value: "3",
    subtitle: "2 bills, 1 prescription",
    icon: <Warning color="warning" />,
    bgcolor: "warning",
    action: "Take Action",
  },
  {
    title: "Medical Records",
    value: "15",
    subtitle: "Lab results available",
    icon: <Description color="info" />,
    bgcolor: "info",
    action: "Download",
  },
];

const appointmentHistory: Appointment[] = [
  {
    id: 1,
    time: "08 Aug 2025 - 2:00 PM",
    doctor: "Dr. Sarah Wilson",
    type: "Cardiology Follow-up",
    status: "upcoming",
    duration: "45 min",
    location: "Room 302",
    appointmentType: "in-person",
  },
  {
    id: 2,
    time: "10 Aug 2025 - 10:00 AM",
    doctor: "Dr. Mike Chen",
    type: "Telemedicine Consultation",
    status: "upcoming",
    duration: "30 min",
    appointmentType: "video",
  },
  {
    id: 3,
    time: "02 Aug 2025 - 4:00 PM",
    doctor: "Dr. John Smith",
    type: "General Checkup",
    status: "completed",
    duration: "30 min",
    location: "Room 105",
  },
  {
    id: 4,
    time: "20 Jul 2025 - 11:00 AM",
    doctor: "Dr. Emily Johnson",
    type: "Dermatology",
    status: "completed",
    duration: "45 min",
  },
];

const medications: Medication[] = [
  {
    id: 1,
    name: "Lisinopril",
    dosage: "10mg",
    frequency: "Daily",
    remaining: 15,
    refillDate: "2025-08-20",
  },
  {
    id: 2,
    name: "Metformin",
    dosage: "500mg",
    frequency: "Twice daily",
    remaining: 30,
    refillDate: "2025-08-25",
  },
  {
    id: 3,
    name: "Vitamin D3",
    dosage: "2000 IU",
    frequency: "Daily",
    remaining: 5,
    refillDate: "2025-08-15",
  },
];

const healthMetrics: HealthMetric[] = [
  {
    title: "Blood Pressure",
    value: "120/80",
    unit: "mmHg",
    status: "normal",
    lastUpdated: "2025-08-05",
  },
  {
    title: "Heart Rate",
    value: "72",
    unit: "bpm",
    status: "normal",
    lastUpdated: "2025-08-05",
  },
  {
    title: "Weight",
    value: "155",
    unit: "lbs",
    status: "normal",
    lastUpdated: "2025-08-03",
  },
  {
    title: "Blood Sugar",
    value: "95",
    unit: "mg/dL",
    status: "normal",
    lastUpdated: "2025-08-04",
  },
];

const PatientDashboard = () => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const theme = useTheme();

  const getStatusChipColor = (status: string) => {
    switch (status) {
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

  const getHealthStatusColor = (status: string) => {
    switch (status) {
      case "normal":
        return theme.palette.success.main;
      case "warning":
        return theme.palette.warning.main;
      case "critical":
        return theme.palette.error.main;
      default:
        return theme.palette.grey[500];
    }
  };

  const getAppointmentIcon = (type: string) => {
    switch (type) {
      case "video":
        return <VideoCall color="primary" />;
      case "phone":
        return <Phone color="primary" />;
      default:
        return <MedicalServices color="primary" />;
    }
  };

  return (
    <Box sx={{ mt: 10, px: 3, maxWidth: "1400px", mx: "auto" }}>
      <Navbar />

      {/* Header */}
      <Box
        mb={4}
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        flexWrap="wrap"
        gap={2}
      >
        <Box>
          <Typography variant="h4" fontWeight={600}>
            Welcome back, Alex
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Here's your health summary for{" "}
            {new Date().toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </Typography>
        </Box>
        <Box display="flex" gap={2} flexWrap="wrap">
          <Badge badgeContent={3} color="error">
            <CustomButton
              variant="outlined"
              startIcon={<Notifications />}
              label="Notifications"
            />
          </Badge>
          <CustomButton
            startIcon={<MedicalServices />}
            label="Book Appointment"
          />
        </Box>
      </Box>

      {/* Alerts */}
      <Box mb={3}>
        <Alert severity="info" sx={{ mb: 2 }}>
          <Typography variant="body2">
            <strong>Reminder:</strong> Your appointment with Dr. Sarah Wilson is
            today at 2:00 PM.
            <CustomButton
              variant="text"
              size="small"
              label="View Details"
              sx={{ ml: 1 }}
            />
          </Typography>
        </Alert>
        <Alert severity="warning">
          <Typography variant="body2">
            <strong>Prescription Alert:</strong> Your Vitamin D3 is running low
            (5 pills remaining).
            <CustomButton
              variant="text"
              size="small"
              label="Request Refill"
              sx={{ ml: 1 }}
            />
          </Typography>
        </Alert>
      </Box>

      {/* Stats */}
      <Grid container spacing={3}>
        {statsData.map((stat, index) => (
          <Grid size={{ xs: 12, sm: 6, md: 3 }} key={index}>
            <Card elevation={2} sx={{ height: "100%" }}>
              <CardContent>
                <Box display="flex" justifyContent="space-between">
                  <Box flex={1}>
                    <Typography variant="body2" color="text.secondary">
                      {stat.title}
                    </Typography>
                    <Typography variant="h4" fontWeight={700} sx={{ my: 1 }}>
                      {stat.value}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {stat.subtitle}
                    </Typography>
                    {stat.trend && (
                      <Typography
                        variant="caption"
                        color="success.main"
                        display="flex"
                        alignItems="center"
                        mt={1}
                      >
                        <TrendingUp fontSize="small" sx={{ mr: 0.5 }} />{" "}
                        {stat.trend}
                      </Typography>
                    )}
                  </Box>
                  <Box
                    sx={{
                      p: 1.5,
                      borderRadius: "12px",
                      backgroundColor: `${theme.palette[stat.bgcolor].main}1A`,
                    }}
                  >
                    {stat.icon}
                  </Box>
                </Box>
                {stat.action && (
                  <Box mt={2}>
                    <CustomButton
                      variant="text"
                      size="small"
                      label={stat.action}
                      sx={{ color: theme.palette[stat.bgcolor].main }}
                    />
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Main Content */}
      <Grid container spacing={3} sx={{ mt: 1 }}>
        {/* Left Column */}
        <Grid size={{ xs: 12, lg: 8 }}>
          <Card sx={{ height: "100%" }}>
            <CardHeader title="Appointments" />
            <CardContent>
              {appointmentHistory.slice(0, 4).map((appt) => (
                <Paper
                  key={appt.id}
                  sx={{
                    p: 2,
                    mb: 2,
                    bgcolor: "#f8f9fa",
                    border: "1px solid #e9ecef",
                  }}
                >
                  <Box
                    display="flex"
                    justifyContent="space-between"
                    flexWrap="wrap"
                    gap={2}
                  >
                    <Box display="flex" gap={2} flex={1} minWidth={0}>
                      {getAppointmentIcon(appt.appointmentType || "in-person")}
                      <Avatar>
                        {appt.doctor
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </Avatar>
                      <Box flex={1} minWidth={0}>
                        <Typography fontWeight={600} noWrap>
                          {appt.type}
                        </Typography>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          noWrap
                        >
                          {appt.doctor}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          <AccessTime fontSize="small" sx={{ mr: 0.5 }} />
                          {appt.time} • {appt.duration}{" "}
                          {appt.location && ` • ${appt.location}`}
                        </Typography>
                      </Box>
                    </Box>
                    <Box display="flex" alignItems="center" gap={1}>
                      <Chip
                        label={appt.status}
                        color={getStatusChipColor(appt.status)}
                        size="small"
                        variant="outlined"
                      />
                      {appt.status === "upcoming" && (
                        <>
                          <CustomButton
                            variant="outlined"
                            size="small"
                            label="Join"
                            startIcon={
                              appt.appointmentType === "video" ? (
                                <VideoCall />
                              ) : (
                                <MedicalServices />
                              )
                            }
                          />
                          <CustomButton
                            variant="text"
                            size="small"
                            label="Reschedule"
                          />
                        </>
                      )}
                      {appt.status === "completed" && (
                        <CustomButton
                          variant="outlined"
                          size="small"
                          label="Download"
                          startIcon={<Download />}
                        />
                      )}
                    </Box>
                  </Box>
                </Paper>
              ))}
            </CardContent>
          </Card>
        </Grid>

        {/* Right Column */}
        <Grid size={{ xs: 12, lg: 84 }}>
          <Box display="flex" flexDirection="column" gap={3}>
            {/* Quick Actions */}
            <Card>
              <CardHeader title="Quick Actions" />
              <CardContent>
                <Box display="flex" flexDirection="column" gap={1.5}>
                  <CustomButton
                    variant="outlined"
                    startIcon={<VideoCall />}
                    label="Start Telemedicine"
                    fullWidth
                  />
                  <CustomButton
                    variant="outlined"
                    startIcon={<Message />}
                    label="Message Doctor"
                    fullWidth
                  />
                  <CustomButton
                    variant="outlined"
                    startIcon={<LocalPharmacy />}
                    label="Request Prescription Refill"
                    fullWidth
                  />
                  <CustomButton
                    variant="outlined"
                    startIcon={<ReceiptLong />}
                    label="View & Pay Bills"
                    fullWidth
                  />
                </Box>
              </CardContent>
            </Card>

            {/* Calendar */}
            <Card>
              <CardHeader title="Calendar" />
              <CardContent>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <StaticDatePicker
                    value={selectedDate}
                    onChange={(date) => setSelectedDate(date)}
                  />
                </LocalizationProvider>
              </CardContent>
            </Card>
          </Box>
        </Grid>

        {/* Health Metrics */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card sx={{ height: "100%" }}>
            <CardHeader title="Health Metrics" />
            <CardContent>
              {healthMetrics.map((metric, index) => (
                <Box key={index} mb={2}>
                  <Box display="flex" justifyContent="space-between" mb={1}>
                    <Typography variant="body2" fontWeight={500}>
                      {metric.title}
                    </Typography>
                    <Box display="flex" gap={1}>
                      <Typography fontWeight={600}>
                        {metric.value} {metric.unit}
                      </Typography>
                      <CheckCircle
                        fontSize="small"
                        sx={{ color: getHealthStatusColor(metric.status) }}
                      />
                    </Box>
                  </Box>
                  <Typography variant="caption" color="text.secondary">
                    Last updated:{" "}
                    {new Date(metric.lastUpdated).toLocaleDateString()}
                  </Typography>
                  {index < healthMetrics.length - 1 && (
                    <Divider sx={{ mt: 2 }} />
                  )}
                </Box>
              ))}
            </CardContent>
          </Card>
        </Grid>

        {/* Medications */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card sx={{ height: "100%" }}>
            <CardHeader title="Current Medications" />
            <CardContent>
              <List dense>
                {medications.map((med) => (
                  <ListItem key={med.id} sx={{ px: 0 }}>
                    <ListItemIcon>
                      <LocalPharmacy color="primary" />
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Box display="flex" justifyContent="space-between">
                          <Typography fontWeight={600}>
                            {med.name} {med.dosage}
                          </Typography>
                          <Chip
                            label={`${med.remaining} left`}
                            size="small"
                            color={med.remaining <= 7 ? "error" : "default"}
                            variant="outlined"
                          />
                        </Box>
                      }
                      secondary={
                        <>
                          <Typography variant="caption">
                            {med.frequency} • Refill due:{" "}
                            {new Date(med.refillDate).toLocaleDateString()}
                          </Typography>
                          {med.remaining <= 7 && (
                            <LinearProgress
                              variant="determinate"
                              value={(med.remaining / 30) * 100}
                              color="error"
                              sx={{ height: 4, borderRadius: 2, mt: 1 }}
                            />
                          )}
                        </>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default PatientDashboard;
