import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDoctorStore } from "../../store/doctorStore";
import {
  Alert,
  Avatar,
  Box,
  Chip,
  CircularProgress,
  Container,
  Divider,
  Grid,
  Paper,
  Typography,
} from "@mui/material";
import { Card, CardContent } from "../../components/ui/CustomCards";
import { format } from "date-fns";
import { getStatusColor } from "../../utility/DoctorUtility";

const PatientReport = () => {
  const { report, fetchReport, loading, error } = useDoctorStore();
  const { id } = useParams<{ id: string }>();
  const patientId = Number(id);

  useEffect(() => {
    if (patientId) {
      fetchReport(patientId);
    }
  }, [patientId]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={5}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container sx={{ mt: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  const patient = report?.medical_report?.patient;

  if (!patient) {
    return (
      <Container sx={{ mt: 4 }}>
        <Alert severity="warning">Patient report not available.</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {/* Patient Info */}
      <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
        <Box display="flex" alignItems="center" gap={2}>
          <Avatar sx={{ bgcolor: "primary.main", color: "white", fontWeight: "bold" }}>
            {patient.first_name?.charAt(0)}
          </Avatar>
          <Box>
            <Typography variant="h5" fontWeight={600}>
              {patient.first_name} {patient.last_name}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {patient.email}
            </Typography>
          </Box>
        </Box>

        <Grid container spacing={2} mt={2}>
          <Grid size={{xs:12, sm:6}} >
            <Typography variant="body2">
              <strong>Phone:</strong> {patient.phone_number || "N/A"}
            </Typography>
            <Typography variant="body2">
              <strong>Gender:</strong> {patient.gender || "N/A"}
            </Typography>
          </Grid>
          <Grid size={{xs:12, sm:6}} >
            <Typography variant="body2">
              <strong>Address:</strong> {patient.address || "N/A"}
            </Typography>
            <Typography variant="body2">
              <strong>Date of Birth:</strong>{" "}
              {patient.date_of_birth
                ? format(new Date(patient.date_of_birth), "dd MMM yyyy")
                : "N/A"}
            </Typography>
          </Grid>
        </Grid>
      </Paper>

      {/* Medical Notes */}
      <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" fontWeight={600} gutterBottom>
          Medical Notes
        </Typography>
        <Typography variant="body1">
          {report?.medical_report.notes || "No notes provided."}
        </Typography>
      </Paper>

      {/* Appointments */}
      <Typography variant="h5" fontWeight={600} mb={2}>
        Appointments
      </Typography>

      <Grid container spacing={3}>
        {report?.appointments
          .sort(
            (a, b) =>
              new Date(b.appointment_date).getTime() -
              new Date(a.appointment_date).getTime()
          )
          .map((appointment) => (
            <Grid size={{xs:12, sm:6}} key={appointment.appointment_id}>
              <Card elevation={4} sx={{ borderRadius: 2 }}>
                <CardContent>
                  <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                    flexWrap="wrap"
                    mb={1}
                  >
                    <Typography variant="h6" fontWeight={600}>
                      {appointment.reason_for_visit || "No reason specified"}
                    </Typography>
                    <Chip
                      label={appointment.status}
                      size="small"
                      color={getStatusColor(appointment.status)}
                      sx={{ textTransform: "capitalize" }}
                    />
                  </Box>

                  <Typography variant="body2" mb={1}>
                    <strong>Date:</strong>{" "}
                    {format(new Date(appointment.appointment_date), "dd MMM yyyy")}
                  </Typography>

                  <Divider sx={{ my: 1.5 }} />

                  {/* Prescriptions */}
                  {appointment.prescriptions.length > 0 ? (
                    <Box>
                      <Typography fontWeight={600} mb={1}>
                        Prescriptions:
                      </Typography>
                      {appointment.prescriptions.map((prescription) => (
                        <Paper
                          key={prescription.prescription_id}
                          elevation={1}
                          sx={{
                            p: 2,
                            mb: 1,
                            borderLeft: "4px solid #1976d2",
                            backgroundColor: "#f5faff",
                          }}
                        >
                          <Typography variant="body2">
                            <strong>Diagnosis:</strong> {prescription.diagnosis}
                          </Typography>
                          <Typography variant="body2">
                            <strong>Prescribed On:</strong>{" "}
                            {format(new Date(prescription.prescribed_date), "dd MMM yyyy")}
                          </Typography>
                        </Paper>
                      ))}
                    </Box>
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                      No prescriptions for this appointment.
                    </Typography>
                  )}
                </CardContent>
              </Card>
            </Grid>
          ))}
      </Grid>
    </Container>
  );
};

export default PatientReport;
