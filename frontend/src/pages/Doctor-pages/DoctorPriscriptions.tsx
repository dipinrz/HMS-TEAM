import {
  Box,
  Typography,
  Grid,
  CardContent,
  Avatar,
  Divider,
} from "@mui/material";
import { format } from "date-fns";
import { useDoctorStore } from "../../store/doctorStore";
import { useEffect } from "react";
import { Card } from "../../components/ui/CustomCards";
import { useNavigate } from "react-router-dom";


interface Prescription {
  id: number;
  patientName: string;
  patientAvatar?: string;
  medicine: string;
  dosage: string;
  date: string;
  status: "active" | "completed" | "expired";
}


const getStatusColor = (status: Prescription["status"]) => {
  switch (status) {
    case "active":
      return "success";
    case "completed":
      return "primary";
    case "expired":
      return "error";
    default:
      return "default";
  }
};

const DoctorPriscriptions = () => {
  const { prescriptons, fetchPrescriptions, loading, error } = useDoctorStore();
  const navigate = useNavigate();

  useEffect(() => {
    fetchPrescriptions();
  }, [fetchPrescriptions]);

  const handleGetReport = (id: number) => {
    navigate(`/doctor/report/${id}`)
  }
  return (
    <Box p={3}>
      <Typography variant="h4" fontWeight={600} mb={4} >
        All Prescriptions
      </Typography>

      {loading && <Typography>Loading prescriptions...</Typography>}
      {error && <Typography color="error">{error}</Typography>}

      <Grid container spacing={3}>
        {[...prescriptons]
          .sort(
            (a, b) =>
              new Date(b.prescribed_date).getTime() -
              new Date(a.prescribed_date).getTime()
          )
          .map((prescription) => (
            <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} onClick={() => handleGetReport(prescription.appointment.patient.user_id)} key={prescription.prescription_id}>
              <Card
                elevation={4}
                sx={{
                  borderRadius: 2,
                  transition: "transform 0.2s ease, box-shadow 0.2s ease",
                  "&:hover": {
                    transform: "translateY(-4px)",
                    boxShadow: "0 8px 24px rgba(0,0,0,0.1)",
                    width: "100%"
                  },
                }}
              >
                <CardContent>
                  {/* Header */}
                  <Box display="flex" alignItems="center" gap={2} mb={2}>
                    <Avatar
                      sx={{
                        bgcolor: "primary.main",
                        color: "white",
                        fontWeight: "bold",
                      }}
                    >
                      {prescription.appointment.patient.first_name.charAt(0)}
                    </Avatar>
                    <Box>
                      <Typography fontWeight={600}>
                        {prescription.appointment.patient.first_name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {prescription.diagnosis}
                      </Typography>
                    </Box>
                  </Box>

                  <Divider sx={{ my: 2 }} />

                  {/* Body */}
                  <Typography variant="body2" gutterBottom>
                    <strong>Appointment Id:</strong> {prescription.appointment.appointment_id}
                  </Typography>
                  <Typography variant="body2" gutterBottom>
                    <strong>Reason:</strong> {prescription.appointment.reason_for_visit}
                  </Typography>

                  <Typography variant="body2">
                    <strong>Date:</strong>{" "}
                    {format(new Date(prescription.prescribed_date), "dd-MM-yyyy")}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
      </Grid>
    </Box>
  );
};

export default DoctorPriscriptions;
