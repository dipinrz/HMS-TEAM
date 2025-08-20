import React, { useEffect, useState, lazy, Suspense } from "react";
import {
  Box,
  Grid,
  Avatar,
  Typography,
  Stack,
  Divider,
  Chip,
} from "@mui/material";
import CustomButton from "../../ui/CustomButton";
import { Card, CardContent, CardHeader } from "../../ui/CustomCards";
import { toast } from "react-toastify";
import { fetchTodaysAppoinments } from "../../../services/adminAPi";
import { useNavigate } from "react-router-dom";

const UserPlus = lazy(() =>
  import("lucide-react").then((m) => ({ default: m.UserPlus }))
);
const Stethoscope = lazy(() =>
  import("lucide-react").then((m) => ({ default: m.Stethoscope }))
);
const Building2 = lazy(() =>
  import("lucide-react").then((m) => ({ default: m.Building2 }))
);
const CreditCard = lazy(() =>
  import("lucide-react").then((m) => ({ default: m.CreditCard }))
);
const Activity = lazy(() =>
  import("lucide-react").then((m) => ({ default: m.Activity }))
);

const getStatusStyle = (status: string) => {
  switch (status.toLowerCase()) {
    case "scheduled":
      return {
        bgcolor: "#e3f2fd",
        color: "#1565c0",
      };
    case "cancelled":
      return {
        bgcolor: "#ffebee",
        color: "#c62828",
      };
    case "completed":
      return {
        bgcolor: "#ede7f6",
        color: "#6a1b9a",
      };
    default:
      return {
        bgcolor: "#eceff1",
        color: "#37474f",
      };
  }
};

const AppointmentsAndActions: React.FC = () => {
  const [todayAppointments, setTodaysAppointmnets] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    loadTodayAppoinments();
  }, []);

  const loadTodayAppoinments = async () => {
    try {
      const response = await fetchTodaysAppoinments();
      setTodaysAppointmnets(response.data.data.appointments);
    } catch (error) {
      toast.error("Couldn't fetch todays appoinments");
      console.log("Error in fetching todays appoinments", error);
    }
  };

  const transformAppointmentData = (appointments: any[]) => {
    return appointments.map((appointment) => ({
      id: appointment.appointment_id,
      patient: `${appointment.patient.first_name} ${appointment.patient.last_name}`,
      doctor: `Dr. ${appointment.doctor.first_name} ${appointment.doctor.last_name}`,
      department: appointment.department.name,
      time: new Date(appointment.appointment_date).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      status:
        appointment.status.charAt(0).toUpperCase() +
        appointment.status.slice(1),
    }));
  };

  return (
    <Box sx={{ width: "100%", mt: 5 }}>
      <Grid container spacing={3} alignItems="stretch">
        <Grid size={{ xs: 12, lg: 8 }}>
          <Card
            animated={false}
            sx={{
              border: "none",
              boxShadow: "0px 2px 6px rgba(0, 0, 0, 0.08)",
              borderRadius: "2rem",
              width: "100%",
              height: "100%",
              bgcolor: "background.paper",
            }}
          >
            <CardHeader
              title={
                <Typography variant="h6" fontWeight={700} color="primary.main">
                  Today's Appointments
                </Typography>
              }
              subheader={
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{
                    borderBottom: "2px solid",
                    borderColor: "primary.main",
                    pb: 1,
                  }}
                >
                  Recent appointment bookings and status updates
                </Typography>
              }
            />
            <CardContent>
              <Stack spacing={2}>
                {todayAppointments.length > 0 ? (
                  transformAppointmentData(todayAppointments).map(
                    (appointment) => (
                      <Box
                        key={appointment.id}
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          p: 2,
                          bgcolor: "grey.50",
                          borderRadius: 2,
                          transition: "all 0.2s ease",
                          "&:hover": {
                            bgcolor: "grey.100",
                            boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                            transform: "translateY(-2px)",
                          },
                        }}
                      >
                        <Box
                          sx={{ display: "flex", alignItems: "center", gap: 2 }}
                        >
                          <Avatar
                            sx={{
                              bgcolor: "primary.main",
                              color: "white",
                              fontWeight: 600,
                            }}
                          >
                            {appointment.patient
                              .split(" ")
                              .map((n: string) => n[0])
                              .join("")}
                          </Avatar>
                          <Box>
                            <Typography fontWeight={600} color="text.primary">
                              {appointment.patient}
                            </Typography>
                            <Typography
                              variant="body2"
                              color="text.secondary"
                              sx={{ fontStyle: "italic" }}
                            >
                              {appointment.doctor} • {appointment.department}
                            </Typography>
                          </Box>
                        </Box>

                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
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
                            size="small"
                            sx={{
                              fontWeight: 600,
                              minWidth: 90,
                              justifyContent: "center",
                              borderRadius: "12px",
                              textTransform: "capitalize",
                              ...getStatusStyle(appointment.status),
                            }}
                          />
                        </Box>
                      </Box>
                    )
                  )
                ) : (
                  <Stack alignItems="center" py={5} spacing={2}>
                    <Activity size={40} color="gray" />
                    <Typography variant="body1" color="text.secondary">
                      No appointments scheduled for today
                    </Typography>
                  </Stack>
                )}
              </Stack>

              <Divider sx={{ my: 3 }} />
              <CustomButton
                fullWidth
                onClick={() => {
                  navigate("/admin/appointments");
                }}
                variant="outlined"
                label="View All Appointments"
                sx={{
                  fontWeight: 600,
                  borderRadius: 2,
                  py: 1.5,
                }}
              />
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, lg: 4 }}>
          <Card
            animated={false}
            sx={{
              border: "none",
              boxShadow: "0px 1px 2px rgba(0, 0, 0, 0.05)",
              borderRadius: "2rem",
              width: "100%",
              height: "100%",
            }}
          >
            <CardHeader
              title="Quick Actions"
              subheader="Frequently used administrative tasks"
            />
            <CardContent>
              <Stack spacing={3}>
                <CustomButton
                  fullWidth
                  variant="contained"
                  startIcon={
                    <Suspense fallback={null}>
                      <UserPlus size={18} />
                    </Suspense>
                  }
                  sx={{
                    background:
                      "linear-gradient(135deg, #020aa5ff 0%, #0a036bff 100%)",
                    "&:hover": {
                      background:
                        "linear-gradient(135deg, #0a036bff 0%, #020aa5ff 100%)",
                    },
                    py: 1.5,
                    borderRadius: 2,
                    textTransform: "none",
                    fontWeight: 500,
                    justifyContent: "center",
                  }}
                  label="Add New Patient"
                />
                <CustomButton
                  fullWidth
                  variant="contained"
                  startIcon={
                    <Suspense fallback={null}>
                      <Stethoscope size={18} />
                    </Suspense>
                  }
                  sx={{
                    background:
                      "linear-gradient(135deg, #020aa5ff 0%, #0a036bff 100%)",
                    "&:hover": {
                      background:
                        "linear-gradient(135deg, #0a036bff 0%, #020aa5ff 100%)",
                    },
                    py: 1.5,
                    borderRadius: 2,
                    textTransform: "none",
                    fontWeight: 500,
                    justifyContent: "center",
                  }}
                  label="Register Doctor"
                />
                <CustomButton
                  fullWidth
                  variant="contained"
                  startIcon={
                    <Suspense fallback={null}>
                      <Building2 size={18} />
                    </Suspense>
                  }
                  sx={{
                    background:
                      "linear-gradient(135deg, #020aa5ff 0%, #0a036bff 100%)",
                    "&:hover": {
                      background:
                        "linear-gradient(135deg, #0a036bff 0%, #020aa5ff 100%)",
                    },
                    py: 1.5,
                    borderRadius: 2,
                    textTransform: "none",
                    fontWeight: 500,
                    justifyContent: "center",
                  }}
                  label="Manage Departments"
                />
                <CustomButton
                  fullWidth
                  variant="contained"
                  startIcon={
                    <Suspense fallback={null}>
                      <CreditCard size={18} />
                    </Suspense>
                  }
                  sx={{
                    py: 1.5,
                    borderRadius: 2,
                    textTransform: "none",
                    fontWeight: 500,
                    justifyContent: "center",
                    background:
                      "linear-gradient(135deg, #020aa5ff 0%, #0a036bff 100%)",
                    "&:hover": {
                      background:
                        "linear-gradient(135deg, #0a036bff 0%, #020aa5ff 100%)",
                    },
                  }}
                  label="Process Billing"
                />

                <CustomButton
                  fullWidth
                  variant="contained"
                  startIcon={
                    <Suspense fallback={null}>
                      <Activity size={18} />
                    </Suspense>
                  }
                  sx={{
                    background:
                      "linear-gradient(135deg, #020aa5ff 0%, #0a036bff 100%)",
                    "&:hover": {
                      background:
                        "linear-gradient(135deg, #0a036bff 0%, #020aa5ff 100%)",
                    },
                    py: 1.5,
                    borderRadius: 2,
                    textTransform: "none",
                    fontWeight: 500,
                    justifyContent: "center",
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
