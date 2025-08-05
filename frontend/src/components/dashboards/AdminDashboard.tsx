import { Stack, Typography, Box, Avatar, Grid } from "@mui/material";
import CustomButton from "../ui/CustomButton";
import { CalendarCheck, UserRoundPlus } from "lucide-react";
import {
  TrendingUp,
  TrendingDown,
  Users,
  Calendar,
  DollarSign,
  Stethoscope,
} from "lucide-react";
import { Card, CardContent } from "../ui/CustomCards";
import { CardHeader, Button, Divider, Chip } from "@mui/material";
import {
  PersonAdd as UserPlus,
  Business as Building2,
  CreditCard,
  BarChart as Activity,
} from "@mui/icons-material";

const metrics = [
  {
    title: "Total Patients",
    value: "1,234",
    change: "+12%",
    trend: "up",
    icon: Users,
    color: "#3B82F6",
  },
  {
    title: "Today's Appointments",
    value: "23",
    change: "+5%",
    trend: "up",
    icon: Calendar,
    color: "#10B981",
  },
  {
    title: "Monthly Revenue",
    value: "$45,231",
    change: "+18%",
    trend: "up",
    icon: DollarSign,
    color: "#8B5CF6",
  },
  {
    title: "Active Doctors",
    value: "45",
    change: "+2%",
    trend: "up",
    icon: Stethoscope,
    color: "#F97316",
  },
];

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
  },
  // Add more...
];

const getStatusColor = (status: string) => {
  switch (status) {
    case "Confirmed":
      return "success";
    case "Pending":
      return "warning";
    case "Cancelled":
      return "error";
    default:
      return "default";
  }
};

const AdminDashboard = () => {
  return (
    <Box>
      <Box
        sx={{ marginTop: "100px" }}
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={4}
      >
        <Box sx={{ textAlign: { xs: "center", sm: "left" }, mb: 4 }}>
          <Typography
            variant="h4"
            fontWeight={600}
            color="text.primary"
            sx={{
              fontSize: {
                xs: "1.75rem",
                sm: "2.125rem",
              },
            }}
          >
            Admin Dashboard
          </Typography>

          <Typography
            variant="body1"
            color="text.secondary"
            sx={{
              mt: 0.5,
              fontSize: {
                xs: "0.875rem",
                sm: "1rem",
              },
            }}
          >
            Comprehensive healthcare system overview and management
          </Typography>
        </Box>

        <Stack direction="row" spacing={2}>
          <CustomButton
            sx={{
              color: "black",
              borderRadius: "12px",
              border: "1px solid lightgrey",
            }}
            label="Add User"
            variant="outlined"
            startIcon={<UserRoundPlus fontSize="small" />}
          />
          <CustomButton
            sx={{
              backgroundColor: "#3c2cebff",
              borderRadius: "8px",
              padding: "4px 12px",
              textTransform: "none",
            }}
            label="View All Appointments"
            variant="contained"
            color="primary"
            startIcon={<CalendarCheck fontSize="small" />}
          />
        </Stack>
      </Box>

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Grid container spacing={5} sx={{ width: "100%" }}>
          {metrics.map((metric, index) => {
            const Icon = metric.icon;
            const isUp = metric.trend === "up";

            return (
              <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={index}>
                <Card sx={{ width: "100%" }} animated hoverVariant="lift">
                  <CardContent>
                    <Box
                      display="flex"
                      justifyContent="space-between"
                      alignItems="center"
                    >
                      <Box>
                        <Typography variant="subtitle2" color="text.secondary">
                          {metric.title}
                        </Typography>
                        <Typography variant="h5" fontWeight="bold" mt={0.5}>
                          {metric.value}
                        </Typography>
                        <Box display="flex" alignItems="center" mt={1}>
                          {isUp ? (
                            <TrendingUp
                              size={16}
                              color={"#280df5ff"}
                              style={{ marginRight: 4 }}
                            />
                          ) : (
                            <TrendingDown
                              size={16}
                              color={"#ea0808ff"}
                              style={{ marginRight: 4 }}
                            />
                          )}
                          <Typography
                            variant="body2"
                            color={isUp ? "success.main" : "error.main"}
                          >
                            {metric.change}
                          </Typography>
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            ml={0.5}
                          >
                            from last month
                          </Typography>
                        </Box>
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

      <Box sx={{ width: "100%", mt:5}}>
        <Grid container spacing={3} >
          {/* Appointments Section */}
          <Grid size={{xs:12,lg:8}}  sx={{ width: '100%'}} display={'flex'}>
            <Card
              sx={{
                border: "none",
                boxShadow: "0px 1px 2px rgba(0, 0, 0, 0.05)",
                borderRadius: 2,
                width:"100%"
              }}
            >
              <CardHeader
                title="Today's Appointments"
                subheader="Recent appointment bookings and status updates"
                titleTypographyProps={{
                  variant: "h6",
                  fontWeight: 600,
                  color: "text.primary",
                }}
                subheaderTypographyProps={{
                  variant: "body2",
                  color: "text.secondary",
                }}
              />
              <CardContent>
                <Stack spacing={2}>
                  {recentAppointments.map((appointment) => (
                    <Box
                      key={appointment.id}
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        p: 2,
                        bgcolor: "grey.50",
                        borderRadius: 2,
                      }}
                    >
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 2 }}
                      >
                        <Avatar>
                          {appointment.patient
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
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
                          color={getStatusColor(appointment.status)}
                          size="small"
                          sx={{
                            fontWeight: 500,
                            minWidth: 80,
                            justifyContent: "center",
                          }}
                        />
                      </Box>
                    </Box>
                  ))}
                </Stack>

                <Divider sx={{ my: 3 }} />

                <Button
                  variant="outlined"
                  fullWidth
                  sx={{
                    py: 1.5,
                    borderRadius: 2,
                    textTransform: "none",
                    fontWeight: 500,
                  }}
                >
                  View All Appointments
                </Button>
              </CardContent>
            </Card>
          </Grid>

          {/* Quick Actions */}
          <Grid size={{xs:12,lg:4}}>
            <Card
              sx={{
                border: "none",
                boxShadow: "0px 1px 2px rgba(0, 0, 0, 0.05)",
                borderRadius: 2,
                width:"100%"
              }}
            >
              <CardHeader
                title="Quick Actions"
                subheader="Frequently used administrative tasks"
                titleTypographyProps={{
                  variant: "h6",
                  fontWeight: 600,
                  color: "text.primary",
                }}
                subheaderTypographyProps={{
                  variant: "body2",
                  color: "text.secondary",
                }}
              />
              <CardContent>
                <Stack spacing={2}>
                  <Button
                    fullWidth
                    variant="contained"
                    startIcon={<UserPlus />}
                    sx={{
                      bgcolor: "primary.main",
                      py: 1.5,
                      borderRadius: 2,
                      textTransform: "none",
                      fontWeight: 500,
                      justifyContent: "flex-start",
                      "&:hover": { bgcolor: "primary.dark" },
                    }}
                  >
                    Add New Patient
                  </Button>
                  <Button
                    fullWidth
                    variant="outlined"
                    startIcon={<Stethoscope />}
                    sx={{
                      py: 1.5,
                      borderRadius: 2,
                      textTransform: "none",
                      fontWeight: 500,
                      justifyContent: "flex-start",
                    }}
                  >
                    Register Doctor
                  </Button>
                  <Button
                    fullWidth
                    variant="outlined"
                    startIcon={<Building2 />}
                    sx={{
                      py: 1.5,
                      borderRadius: 2,
                      textTransform: "none",
                      fontWeight: 500,
                      justifyContent: "flex-start",
                    }}
                  >
                    Manage Departments
                  </Button>
                  <Button
                    fullWidth
                    variant="outlined"
                    startIcon={<CreditCard />}
                    sx={{
                      py: 1.5,
                      borderRadius: 2,
                      textTransform: "none",
                      fontWeight: 500,
                      justifyContent: "flex-start",
                    }}
                  >
                    Process Billing
                  </Button>
                  <Button
                    fullWidth
                    variant="outlined"
                    startIcon={<Activity />}
                    sx={{
                      py: 1.5,
                      borderRadius: 2,
                      textTransform: "none",
                      fontWeight: 500,
                      justifyContent: "flex-start",
                    }}
                  >
                    System Reports
                  </Button>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default AdminDashboard;
