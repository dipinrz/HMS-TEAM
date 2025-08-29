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
import EventNoteIcon from "@mui/icons-material/EventNote";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";

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
      <Typography variant="h4" fontWeight={700} mb={4}>
        All Prescriptions
      </Typography>

      {loading && <Typography>Loading prescriptions...</Typography>}
      {error && <Typography color="error">{error}</Typography>}
      {!loading && !error && prescriptons.length === 0 ? (
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          mt={5}
          sx={{ color: "text.secondary" }}
        >
          <EventNoteIcon sx={{ fontSize: 60, color: "primary.main", mb: 2 }} />
          <Typography variant="h5" fontWeight={600} gutterBottom>
            No Prescriptions Available
          </Typography>
          <Typography variant="body1" textAlign="center" maxWidth={400}>
            You currently have no prescriptions listed.
          </Typography>
        </Box>

      ) : (
        <Grid container spacing={3}>
          {[...prescriptons]
            .sort(
              (a, b) =>
                new Date(b.prescribed_date).getTime() -
                new Date(a.prescribed_date).getTime()
            )
            .map((prescription) => (
              <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }}

                key={prescription.prescription_id}
                onClick={() =>
                  handleGetReport(prescription.appointment.patient.user_id)
                }
                sx={{ cursor: "pointer" }}
              >
                <Card
                  elevation={4}
                  sx={{
                    borderRadius: 3,
                    transition: "transform 0.3s ease, box-shadow 0.3s ease",
                    "&:hover": {
                      transform: "translateY(-6px)",
                      boxShadow: "0 12px 30px rgba(0,0,0,0.1)",
                    },
                    height: "100%",
                    width: '100%',
                    bgcolor: "#fdfdfd",
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
                        {prescription.appointment.patient.first_name
                          .charAt(0)
                          .toUpperCase()}
                      </Avatar>
                      <Box>
                        <Typography fontWeight={600}>
                          {prescription.appointment.patient.first_name}
                        </Typography>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          noWrap
                          maxWidth={150}
                        >
                          {prescription.diagnosis}
                        </Typography>
                      </Box>
                    </Box>

                    <Divider sx={{ mb: 2 }} />

                    {/* Body Details */}
                    <Box display="flex" alignItems="center" gap={1} mb={1}>
                      <EventNoteIcon color="info" fontSize="small" />
                      <Typography variant="body2">
                        <strong>ID:</strong>{" "}
                        {prescription.appointment.appointment_id}
                      </Typography>
                    </Box>

                    <Box display="flex" alignItems="center" gap={1} mb={1}>
                      <InfoOutlinedIcon color="action" fontSize="small" />
                      <Typography variant="body2">
                        <strong>Reason:</strong>{" "}
                        {prescription.appointment.reason_for_visit}
                      </Typography>
                    </Box>

                    <Box display="flex" alignItems="center" gap={1}>
                      <CalendarTodayIcon color="primary" fontSize="small" />
                      <Typography variant="body2">
                        <strong>Date:</strong>{" "}
                        {format(new Date(prescription.prescribed_date), "dd/MM/yyyy")}
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
        </Grid>
      )}
    </Box>
  );
};

export default DoctorPriscriptions;
