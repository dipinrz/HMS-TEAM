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
} from "@mui/material";
import { fetchAllAppointmentsAPI } from "../../services/adminAPi";

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
          overflow: "hidden",
        }}
      >
        <Table sx={{ minWidth: 650 }} aria-label="appointments table">
          <TableHead sx={{ bgcolor: "primary.light" }}>
            <TableRow>
              <TableCell
                sx={{
                  fontWeight: "bold",
                  color: "common.white",
                }}
              >
                SL.NO
              </TableCell>
              <TableCell
                sx={{
                  fontWeight: "bold",
                  color: "common.white",
                }}
              >
                Date & Time
              </TableCell>
              <TableCell
                sx={{
                  fontWeight: "bold",
                  color: "common.white",
                }}
              >
                Patient
              </TableCell>
              <TableCell
                sx={{
                  fontWeight: "bold",
                  color: "common.white",
                }}
              >
                Doctor
              </TableCell>
              <TableCell
                sx={{
                  fontWeight: "bold",
                  color: "common.white",
                }}
              >
                Department
              </TableCell>
              <TableCell
                sx={{
                  fontWeight: "bold",
                  color: "common.white",
                }}
              >
                Fee
              </TableCell>
              <TableCell
                sx={{
                  fontWeight: "bold",
                  color: "common.white",
                }}
              >
                Reason
              </TableCell>
              <TableCell
                sx={{
                  fontWeight: "bold",
                  color: "common.white",
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
                <TableCell sx={{ fontWeight: "medium" }}>
                  {formatDate(appointment.appointment_date)}
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
                <TableCell>
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
