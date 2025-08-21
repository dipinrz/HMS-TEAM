import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Chip,
  Box,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { fetchAllAppointmentsAPI } from "../../../services/adminAPi";

interface Doctor {
  first_name: string;
  last_name: string;
}

interface Patient {
  first_name: string;
  last_name: string;
}

interface Department {
  name: string;
  consultation_fee: string;
}

interface Appointment {
  appointment_id: number;
  appointment_date: string;
  status: string;
  reason_for_visit: string;
  doctor: Doctor;
  patient: Patient;
  department: Department;
}

const AdminAppointment: React.FC = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const fetchAllAppointments = async () => {
    try {
      const response = await fetchAllAppointmentsAPI();
      setAppointments(response.data.data.appointments);
    } catch (error) {
      console.error("Error fetching appointments:", error);
    }
  };

  useEffect(() => {
    fetchAllAppointments();
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "scheduled":
        return "primary";
      case "completed":
        return "success";
      case "cancelled":
        return "error";
      default:
        return "default";
    }
  };

  return (
    <Box
      sx={{
        p: 3,
        ml: { sm: "30px" },
        width: { sm: "calc(100% - 30px)" },
      }}
    >
      <Typography
        variant="h4"
        textAlign={"center"}
        fontWeight="bold"
        sx={{
          mb: 3,
          fontWeight: "bold",
          color: "#1e293b",
        }}
      >
        Appointments
      </Typography>

      <TableContainer
        component={Paper}
        sx={{
          boxShadow: 3,
          borderRadius: 2,
          overflowX: "auto",
        }}
      >
        <Table
          sx={{ minWidth: { xs: 500, sm: 650 } }}
          aria-label="appointments table"
        >
          <TableHead
            sx={{
              backgroundColor: "rgba(25, 118, 210, 0.08)",
              "& .MuiTableCell-head": {
                borderBottom: "2px solid rgba(25, 118, 210, 0.1)",
              },
            }}
          >
            <TableRow>
              <TableCell
                sx={{
                  fontWeight: "bold",
                  color: "#1565c0",
                }}
              >
                SL.NO
              </TableCell>
              <TableCell
                sx={{
                  fontWeight: "bold",
                  color: "#1565c0",
                }}
              >
                Date & Time
              </TableCell>
              <TableCell
                sx={{
                  fontWeight: "bold",
                  color: "#1565c0",
                }}
              >
                Patient
              </TableCell>
              <TableCell
                sx={{
                  fontWeight: "bold",
                  color: "#1565c0",
                }}
              >
                Doctor
              </TableCell>
              <TableCell
                sx={{
                  fontWeight: "bold",
                  color: "#1565c0",
                }}
              >
                Department
              </TableCell>
              <TableCell
                sx={{
                  fontWeight: "bold",
                  color: "#1565c0",
                }}
              >
                Fee
              </TableCell>
              <TableCell
                sx={{
                  display: { xs: "none", sm: "table-cell" },
                  fontWeight: "bold",
                  color: "#1565c0",
                }}
              >
                Reason
              </TableCell>
              <TableCell
                sx={{
                  fontWeight: "bold",
                  color: "#1565c0",
                }}
              >
                Status
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {appointments.map((appointment, index) => (
              <TableRow
                key={appointment.appointment_id}
                sx={{
                  "&:nth-of-type(even)": { bgcolor: "action.hover" },
                  "&:hover": { bgcolor: "action.selected" },
                }}
              >
                <TableCell>{index + 1}</TableCell>
                <TableCell sx={{ fontWeight: "medium", whiteSpace: "nowrap" }}>
                  {isMobile ? (
                    <Box>
                      <Typography variant="body2">
                        {new Date(
                          appointment.appointment_date
                        ).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                        })}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {new Date(
                          appointment.appointment_date
                        ).toLocaleTimeString("en-US", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </Typography>
                    </Box>
                  ) : (
                    formatDate(appointment.appointment_date)
                  )}
                </TableCell>

                <TableCell>
                  {`${appointment.patient.first_name} ${appointment.patient.last_name}`}
                </TableCell>
                <TableCell>
                  {`${appointment.doctor.first_name} ${appointment.doctor.last_name}`}
                </TableCell>
                <TableCell>{appointment.department.name}</TableCell>
                <TableCell>
                  ₹{appointment.department.consultation_fee}
                </TableCell>
                <TableCell sx={{ display: { xs: "none", sm: "table-cell" } }}>
                  {appointment.reason_for_visit
                    ? appointment.reason_for_visit
                    : "N/A"}
                </TableCell>
                <TableCell>
                  <Chip
                    label={appointment.status}
                    color={getStatusColor(appointment.status)}
                    size="small"
                    sx={{
                      fontWeight: "bold",
                      textTransform: "capitalize",
                      minWidth: 90,
                    }}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default AdminAppointment;
