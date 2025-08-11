import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Box,
  Typography,
  Paper,
  Chip,
  Divider,
  List,
  ListItem,
  ListItemText,
  CircularProgress,
  Alert,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { CalendarToday, Person, MedicalServices } from "@mui/icons-material";

// Mock data types based on your entity
interface User {
  user_id: number;
  name: string;
  email: string;
}

interface Department {
  department_id: number;
  name: string;
}

interface MedicalReport {
  medical_report_id: number;
  diagnosis: string;
  treatment: string;
}

interface Appointment {
  appointment_id: number;
  patient: User;
  doctor: User;
  department: Department;
  appointment_date: string;
  medical_report_id: MedicalReport;
  status: "scheduled" | "completed" | "cancelled";
  reason_for_visit: string;
  notes: string;
}

// Mock data - replace with API call in real implementation
const mockAppointments: Appointment[] = [
  {
    appointment_id: 1,
    patient: {
      user_id: 101,
      name: "John Doe",
      email: "john@example.com",
    },
    doctor: {
      user_id: 201,
      name: "Dr. Sarah Smith",
      email: "sarah.smith@hospital.com",
    },
    department: {
      department_id: 301,
      name: "Cardiology",
    },
    appointment_date: "2023-06-15T14:30:00",
    medical_report_id: {
      medical_report_id: 401,
      diagnosis: "Hypertension",
      treatment: "Prescribed medication and lifestyle changes",
    },
    status: "completed",
    reason_for_visit: "Routine checkup for high blood pressure",
    notes: "Patient advised to reduce salt intake and exercise regularly",
  },
  {
    appointment_id: 2,
    patient: {
      user_id: 102,
      name: "Jane Smith",
      email: "jane@example.com",
    },
    doctor: {
      user_id: 202,
      name: "Dr. Michael Johnson",
      email: "michael.johnson@hospital.com",
    },
    department: {
      department_id: 302,
      name: "Neurology",
    },
    appointment_date: "2023-06-20T10:15:00",
    medical_report_id: {
      medical_report_id: 402,
      diagnosis: "Migraine",
      treatment: "Prescribed pain relief medication",
    },
    status: "scheduled",
    reason_for_visit: "Persistent headaches",
    notes: "Patient to keep a headache diary for next visit",
  },
];

const DetailItem = styled(ListItem)(({ theme }) => ({
  paddingLeft: 0,
  paddingRight: 0,
  "& .MuiListItemText-primary": {
    fontWeight: 500,
    color: theme.palette.text.secondary,
  },
  "& .MuiListItemText-secondary": {
    fontWeight: 400,
    color: theme.palette.text.primary,
  },
}));

const AppointmentDetail: React.FC = () => {
  const { appointmentId } = useParams<{ appointmentId: string }>();
  const [appointment, setAppointment] = useState<Appointment | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAppointment = () => {
      try {
        // Simulate API call
        setTimeout(() => {
          const foundAppointment = mockAppointments.find(
            (appt) => appt.appointment_id === Number(1)
          );

          if (foundAppointment) {
            setAppointment(foundAppointment);
          } else {
            setError("Appointment not found");
          }
          setLoading(false);
        }, 800); // Simulate network delay
      } catch (err) {
        setError(`Failed to fetch appointment details, Error: ${err}`);
        setLoading(false);
      }
    };

    fetchAppointment();
  }, [appointmentId]);

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="200px"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box mt={3}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  if (!appointment) {
    return (
      <Box mt={3}>
        <Alert severity="warning">No appointment data available</Alert>
      </Box>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "success";
      case "cancelled":
        return "error";
      case "scheduled":
        return "info";
      default:
        return "default";
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <Paper
      elevation={3}
      sx={{
        p: 3,
        mb: 3,
        mt: {
          lg: 8,
          xs: 15,
        },
        height: "100%",
      }}
    >
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
      >
        <Typography variant="h4" component="h1">
          Appointment Details
        </Typography>
        <Chip
          label={appointment.status.toUpperCase()}
          color={getStatusColor(appointment.status)}
          variant="outlined"
          size="medium"
        />
      </Box>

      <Divider sx={{ my: 2 }} />

      <Box display="flex" flexDirection={{ xs: "column", md: "row" }} gap={4}>
        <Box flex={1}>
          <Typography
            variant="h6"
            gutterBottom
            sx={{ display: "flex", alignItems: "center", gap: 1 }}
          >
            <CalendarToday fontSize="small" /> Appointment Information
          </Typography>

          <List>
            <DetailItem>
              <ListItemText
                primary="Date & Time"
                secondary={formatDate(appointment.appointment_date)}
              />
            </DetailItem>
            <DetailItem>
              <ListItemText
                primary="Department"
                secondary={appointment.department.name}
              />
            </DetailItem>
            <DetailItem>
              <ListItemText
                primary="Reason for Visit"
                secondary={appointment.reason_for_visit || "Not specified"}
              />
            </DetailItem>
            <DetailItem>
              <ListItemText
                primary="Notes"
                secondary={appointment.notes || "No additional notes"}
              />
            </DetailItem>
          </List>
        </Box>

        <Box flex={1}>
          <Typography
            variant="h6"
            gutterBottom
            sx={{ display: "flex", alignItems: "center", gap: 1 }}
          >
            <Person fontSize="small" /> Patient Information
          </Typography>

          <List>
            <DetailItem>
              <ListItemText
                primary="Patient Name"
                secondary={appointment.patient.name}
              />
            </DetailItem>
            <DetailItem>
              <ListItemText
                primary="Email"
                secondary={appointment.patient.email}
              />
            </DetailItem>
          </List>

          <Typography
            variant="h6"
            gutterBottom
            sx={{ mt: 3, display: "flex", alignItems: "center", gap: 1 }}
          >
            <MedicalServices fontSize="small" /> Medical Information
          </Typography>

          <List>
            <DetailItem>
              <ListItemText
                primary="Diagnosis"
                secondary={
                  appointment.medical_report_id.diagnosis || "Not specified"
                }
              />
            </DetailItem>
            <DetailItem>
              <ListItemText
                primary="Treatment"
                secondary={
                  appointment.medical_report_id.treatment || "Not specified"
                }
              />
            </DetailItem>
          </List>

          <Typography
            variant="h6"
            gutterBottom
            sx={{ mt: 3, display: "flex", alignItems: "center", gap: 1 }}
          >
            <Person fontSize="small" /> Doctor Information
          </Typography>

          <List>
            <DetailItem>
              <ListItemText
                primary="Doctor Name"
                secondary={appointment.doctor.name}
              />
            </DetailItem>
            <DetailItem>
              <ListItemText
                primary="Email"
                secondary={appointment.doctor.email}
              />
            </DetailItem>
          </List>
        </Box>
      </Box>
    </Paper>
  );
};

export default AppointmentDetail;
