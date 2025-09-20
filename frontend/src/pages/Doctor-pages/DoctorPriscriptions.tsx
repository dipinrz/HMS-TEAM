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
import { TroubleshootOutlined } from "@mui/icons-material";


// interface Prescription {
//   id: number;
//   patientName: string;
//   patientAvatar?: string;
//   medicine: string;
//   dosage: string;
//   date: string;
//   status: "active" | "completed" | "expired";
// }


const getStatusColor = (status:string) => {
  switch (status) {
    case "completed":
      return "success";
    case "progress":
      return "primary";
    case "cancelled":
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
              <Grid
                size={{ xs: 12, sm: 12, md: 12, lg: 6 }}
                key={prescription.prescription_id}
                onClick={() =>
                  handleGetReport(prescription.appointment.patient.user_id)
                }
                sx={{ cursor: "pointer" }}
              >
                <Card
                  elevation={6}
                  sx={{
                    borderRadius: 4,
                    transition: "all 0.3s ease",
                    "&:hover": {
                      transform: "translateY(-8px)",
                      boxShadow: "0 14px 34px rgba(0,0,0,0.12)",
                    },
                    height: "100%",
                    width:"100%",
                    bgcolor: "background.paper",
                  }}
                >
                  <CardContent sx={{ p: 3 }}>
                    {/* Header */}
                    <Box display="flex" alignItems="center" justifyContent="space-between" gap={2} mb={3}>
                      <Box display="flex" gap={2}>
                        <Avatar
                          sx={{
                            bgcolor: "primary.main",
                            color: "white",
                            fontWeight: "bold",
                            width: 48,
                            height: 48,
                            fontSize: 18,
                          }}
                        >
                          {prescription.appointment.patient.first_name.charAt(0).toUpperCase()}
                        </Avatar>
                        <Box>
                          <Typography fontWeight={700} variant="h6">
                            {prescription.appointment.patient.first_name}
                          </Typography>
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            noWrap
                            maxWidth={180}
                          >
                            {prescription.diagnosis}
                          </Typography>
                        </Box>
                      </Box>
                      <Box display="flex" alignItems="center" gap={1}>
                          <CalendarTodayIcon color="primary" fontSize="small" />
                          <Typography variant="body2" fontWeight={500}>
                            <strong>Date:</strong>{" "}
                            {format(new Date(prescription.prescribed_date), "dd/MM/yyyy")}
                          </Typography>
                        </Box>
                    </Box>

                    <Divider sx={{ mb: 2 }} />

                    {/* Prescription Details */}
                    <Grid container spacing={1.5}>
                      <Grid size={{xs:12,sm:6}}>
                        <Box display="flex" alignItems="center" gap={1}>
                          <EventNoteIcon color="info" fontSize="small" />
                          <Typography variant="body2">
                            <strong>ID:</strong>{" "}
                            {prescription.appointment.appointment_id}
                          </Typography>
                        </Box>
                      </Grid>
                      <Grid size={{xs:12,sm:6}}>
                        <Box display="flex" alignItems="center" gap={1}>
                          <EventNoteIcon color="info" fontSize="small" />
                          <Typography variant="body2" color={getStatusColor(prescription.appointment.status)}>
                            <strong>Status:</strong>{" "}
                            {prescription.appointment.status}
                          </Typography>
                        </Box>
                      </Grid>
                      <Grid size={{xs:12}}>
                        <Box display="flex" alignItems="center" gap={1}>
                          <InfoOutlinedIcon color="action" fontSize="small" />
                          <Typography variant="body2">
                            <strong>Reason:</strong>{" "}
                            {prescription.appointment.reason_for_visit}
                          </Typography>
                        </Box>
                      </Grid>
                      <Grid size={{xs:12}}>
                        <Box display="flex" alignItems="center" gap={1}>
                          <TroubleshootOutlined color="info" fontSize="small" />
                          <Typography variant="body2">
                            <strong>Diagnosis:</strong>{" "}
                            {prescription.diagnosis}
                          </Typography>
                        </Box>
                      </Grid>
                      <Grid size={{xs:12}}>
                        
                      </Grid>
                    </Grid>

                    {/* Medication List */}
                    <Divider sx={{ my: 2 }} />
                    <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                      Medications
                    </Typography>
                    <Box
                      display="flex"
                      flexDirection="column"
                      gap={1.5}
                      sx={{
                        p: 1.5,
                        bgcolor: "grey.50",
                        borderRadius: 2,
                      }}
                    >
                      {prescription.medications.map((medication) => (
                        <Box
                          key={medication.medication_id}
                          sx={{
                            p: 1.5,
                            borderRadius: 2,
                            bgcolor: "white",
                            boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
                          }}
                        >
                          <Typography variant="body2">
                            <strong>ID:</strong> {medication.medication_id}
                          </Typography>
                          <Typography variant="body2">
                            <strong>Name:</strong> {medication.medicine.medicine_name}
                          </Typography>
                          <Typography variant="body2">
                            <strong>Dosage:</strong> {medication.dosage}
                          </Typography>
                          <Typography variant="body2">
                            <strong>Duration:</strong> {medication.duration}
                          </Typography>
                          <Typography variant="body2">
                            <strong>Frequency:</strong> {medication.frequency}
                          </Typography>
                        </Box>
                      ))}
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
