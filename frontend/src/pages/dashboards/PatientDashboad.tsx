import {
  Avatar,
  Box,
  Chip,
  Grid,
  Typography,
  useTheme,
  Alert,
  LinearProgress,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Badge,
  Paper,
} from "@mui/material";
import Navbar from "../../components/NavBar";
import { Card, CardContent, CardHeader } from "../../components/ui/CustomCards";
import {
  CalendarToday,
  Description,
  ReceiptLong,
  MedicalServices,
  AccessTime,
  Notifications,
  FavoriteRounded,
  TrendingUp,
  Warning,
  LocalPharmacy,
  Phone,
  VideoCall,
  Message,
} from "@mui/icons-material";
import CustomButton from "../../components/ui/CustomButton";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider, StaticDatePicker } from "@mui/x-date-pickers";
import { useState } from "react";
import { useAuthStore } from "../../store/useAuthStore";
import { useNavigate } from "react-router-dom";

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
  {
    id: 5,
    time: "15 Jul 2025 - 9:00 AM",
    doctor: "Dr. Robert Brown",
    type: "Orthopedic Consultation",
    status: "completed",
    duration: "60 min",
  },
  {
    id: 6,
    time: "05 Jul 2025 - 3:30 PM",
    doctor: "Dr. Lisa Davis",
    type: "Annual Physical",
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
  {
    id: 4,
    name: "Aspirin",
    dosage: "81mg",
    frequency: "Daily",
    remaining: 20,
    refillDate: "2025-08-30",
  },
];

const PatientDashboard = () => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const theme = useTheme();
  const { user } = useAuthStore();
  const navigate = useNavigate();

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

  const alerts = [
    {
      type: "info",
      message: "Your appointment with Dr. Sarah Wilson is today at 2:00 PM.",
      actionLabel: "View Details",
      onAction: () => console.log("Viewing appointment details"),
    },
    {
      type: "warning",
      message: "Your Vitamin D3 is running low (5 pills remaining).",
      actionLabel: "Request Refill",
      onAction: () => console.log("Requesting refill"),
    },
  ];

  return (
    <Box sx={{ mt: 10, maxWidth: "90%", mx: "auto" }}>
      <Navbar />

      {/* Header */}
      <Box
        // mb={4}
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        flexWrap="wrap"
        gap={1}
      >
        <Box>
          <Typography variant="h4" fontWeight={600}>
            Welcome back, {user?.first_name}
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
            onClick={() => {
              navigate("/bookAppointment");
            }}
            startIcon={<MedicalServices />}
            label="Book Appointment"
          />
        </Box>
      </Box>

      {/* Alerts */}
      <Box mb={3}>
        {alerts.length > 0 &&
          alerts.map((alert, index) => (
            <Alert
              key={index}
              severity={alert.type as "info" | "warning" | "error" | "success"}
              sx={{ mb: 2 }}
            >
              <Typography variant="body2">
                <strong>
                  {alert.type === "info" ? "Reminder:" : "Prescription Alert:"}
                </strong>{" "}
                {alert.message}
                <CustomButton
                  variant="text"
                  size="small"
                  label={alert.actionLabel}
                  sx={{ ml: 1 }}
                  onClick={alert.onAction}
                />
              </Typography>
            </Alert>
          ))}
      </Box>

      {/* Stats */}
      <Grid container spacing={2}>
        {statsData.map((stat, index) => (
          <Grid size={{ xs: 12, sm: 6, md: 3 }} key={index}>
            <Card
              elevation={2}
              hoverVariant="rotate"
              sx={{ height: "90%", width: "95%" }}
            >
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
      <Grid container spacing={4} sx={{ mt: 1 }} alignItems="stretch">
        {/* Left Column - Appointments */}
        <Grid size={{ xs: 12, lg: 3.5 }}>
          <Card sx={{ height: 600 }}>
            <CardHeader title="Appointments" />
            <CardContent sx={{ height: "calc(100% - 80px)", pb: 1 }}>
              <Box
                sx={{
                  height: "100%",
                  overflowY: "auto",
                  pr: 1,
                  "&::-webkit-scrollbar": {
                    width: "6px",
                  },
                  "&::-webkit-scrollbar-track": {
                    background: "#f1f1f1",
                    borderRadius: "10px",
                  },
                  "&::-webkit-scrollbar-thumb": {
                    background: "#c1c1c1",
                    borderRadius: "10px",
                  },
                  "&::-webkit-scrollbar-thumb:hover": {
                    background: "#a8a8a8",
                  },
                }}
              >
                <Box display="flex" flexDirection="column" gap={2}>
                  {appointmentHistory.map((appt) => (
                    <Paper
                      key={appt.id}
                      sx={{
                        p: 2,
                        bgcolor: "#f8f9fa",
                        border: "1px solid #e9ecef",
                        borderRadius: 2,
                      }}
                    >
                      <Box
                        display="flex"
                        justifyContent="space-between"
                        alignItems="flex-start"
                        gap={2}
                      >
                        {/* Left Section */}
                        <Box display="flex" gap={2} flex={1} minWidth={0}>
                          {getAppointmentIcon(
                            appt.appointmentType || "in-person"
                          )}
                          <Avatar sx={{ width: 32, height: 32 }}>
                            {appt.doctor
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </Avatar>
                          <Box flex={1} minWidth={0}>
                            <Typography
                              variant="body2"
                              fontWeight={600}
                              sx={{
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                              }}
                            >
                              {appt.type}
                            </Typography>
                            <Typography
                              variant="caption"
                              color="text.secondary"
                              sx={{
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                                display: "block",
                              }}
                            >
                              {appt.doctor}
                            </Typography>
                            <Typography
                              variant="caption"
                              color="text.secondary"
                              display="flex"
                              alignItems="center"
                              sx={{ mt: 0.5 }}
                            >
                              <AccessTime fontSize="inherit" sx={{ mr: 0.5 }} />
                              {appt.time.split(" - ")[1]} • {appt.duration}
                            </Typography>
                          </Box>
                        </Box>

                        {/* Right Section - Status and Actions */}
                        <Box
                          display="flex"
                          flexDirection="column"
                          alignItems="flex-end"
                          gap={1}
                        >
                          <Chip
                            label={appt.status}
                            color={getStatusChipColor(appt.status)}
                            size="small"
                            variant="outlined"
                          />
                          {appt.status === "upcoming" && (
                            <CustomButton
                              onClick={() => {
                                navigate(`/appointmentDetail/:${appt.id}`);
                              }}
                              variant="outlined"
                              size="small"
                              label="View"
                            />
                          )}
                          {appt.status === "completed" && (
                            <CustomButton
                              onClick={() => {
                                navigate(`/appointmentDetail/:${appt.id}`);
                              }}
                              variant="outlined"
                              size="small"
                              label="View"
                            />
                          )}
                        </Box>
                      </Box>
                    </Paper>
                  ))}
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Middle Column */}
        <Grid
          size={{ xs: 12, lg: 4 }}
          container
          spacing={2}
          sx={{ height: "fit-content" }}
        >
          <Grid
            size={12}
            sx={{ display: "flex", flexDirection: "column", gap: 2 }}
          >
            <Card sx={{ height: 290, width: "100%", flex: 1 }}>
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
          </Grid>
          <Grid size={12}>
            <Card sx={{ height: 300, width: "100%", flex: 1 }}>
              <CardHeader title="Current Medications" />
              <CardContent sx={{ height: "calc(100% - 80px)", pb: 1 }}>
                <Box
                  sx={{
                    height: "100%",
                    overflowY: "auto",
                    pr: 1,
                    "&::-webkit-scrollbar": {
                      width: "6px",
                    },
                    "&::-webkit-scrollbar-track": {
                      background: "#f1f1f1",
                      borderRadius: "10px",
                    },
                    "&::-webkit-scrollbar-thumb": {
                      background: "#c1c1c1",
                      borderRadius: "10px",
                    },
                    "&::-webkit-scrollbar-thumb:hover": {
                      background: "#a8a8a8",
                    },
                  }}
                >
                  <List dense sx={{ pt: 0 }}>
                    {medications.map((med) => (
                      <ListItem key={med.id} sx={{ px: 0, pb: 1 }}>
                        <ListItemIcon sx={{ minWidth: 40 }}>
                          <LocalPharmacy color="primary" />
                        </ListItemIcon>
                        <ListItemText
                          primary={
                            <Box
                              display="flex"
                              justifyContent="space-between"
                              alignItems="center"
                            >
                              <Typography variant="body2" fontWeight={600}>
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
                              <Typography variant="caption" display="block">
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
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Right Column - Calendar */}
        <Grid size={{ lg: 4.5, xs: 12 }}>
          <Card
            sx={{
              height: {
                lg: "100%",
                xs: "auto",
              },
              width: "100%",
            }}
          >
            <CardHeader title="Calendar" />
            <CardContent
              sx={{
                height: "calc(100% - 80px)",
                display: "flex",
                justifyContent: "center",
                alignItems: "flex-start",
                pt: 1,
              }}
            >
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <StaticDatePicker
                  value={selectedDate}
                  onChange={(date) => setSelectedDate(date)}
                  sx={{
                    "& .MuiPickersCalendarHeader-root": {
                      paddingLeft: 1,
                      paddingRight: 1,
                    },
                    "& .MuiDayCalendar-root": {
                      width: "100%",
                    },
                  }}
                />
              </LocalizationProvider>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default PatientDashboard;
