import {
  Box,
  Typography,
  Paper,
  Chip,
  Divider,
  IconButton,
  Stack,
  Card,
  Grid,
  CardContent,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import {
  ArrowBack,
  CalendarToday,
  Person,
  MedicalServices,
  LocalHospital,
  Healing,
} from "@mui/icons-material";
import {
  DetailRow,
  type AppointmentType,
  type Medication,
  type Prescription,
} from "./MedicalRecord";

const medicalColors = {
  primaryBlue: "#1976d2",
  deepBlue: "#1565c0",
  teal: "#00897b",
  forestGreen: "#2e7d32",
  slateGray: "#455a64",
  charcoal: "#37474f",
  lightBlue: "#e3f2fd",
  lightTeal: "#e0f2f1",
  lightGreen: "#e8f5e8",
  borderGray: "#cfd8dc",
  backgroundGray: "#fafafa",
};

const StyledCard = styled(Card)(() => ({
  transition: "all 0.3s ease-in-out",
  background: `linear-gradient(135deg, ${medicalColors.lightBlue} 0%, #ffffff 100%)`,
  borderRadius: "12px",
}));

const PrescriptionCard = styled(Card)(({ theme }) => ({
  background: `linear-gradient(135deg, ${medicalColors.lightGreen} 0%, #ffffff 100%)`,
  border: `1px solid ${medicalColors.borderGray}`,
  borderRadius: "10px",
  marginBottom: theme.spacing(2),
}));

type Props = {
  appointment: AppointmentType;
  goback: () => void;
};

const AppointmentDetail = ({ appointment, goback }: Props) => {
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
        mt: { xs: 2, sm: 0 },
        height: "100%",
        background: medicalColors.backgroundGray,
        border: `1px solid ${medicalColors.borderGray}`,
      }}
    >
      <Box
        sx={{
          background: `linear-gradient(135deg, ${medicalColors.primaryBlue} 0%, ${medicalColors.deepBlue} 100%)`,
          p: 2,
          borderRadius: "12px",
          color: "white",
          display: "flex",
          alignItems: "center",
          mb: 3,
        }}
      >
        <IconButton onClick={goback} sx={{ color: "white" }}>
          <ArrowBack />
        </IconButton>
        <Box sx={{ display: "flex", gap: 1, flexWrap: { xs: "wrap" } }}>
          <Typography
            variant="h4"
            component="h1"
            sx={{ flexGrow: 1, fontWeight: 600, pl: 4 }}
          >
            Appointment Details
          </Typography>
          <Chip
            label={appointment.status.toUpperCase()}
            color={getStatusColor(appointment.status)}
            variant="filled"
            size="medium"
            sx={{
              fontWeight: "bold",
              color: "white",
              wordBreak: "break-word",
              mt: 1,
              ml: { xs: 4 },
              height: { xs: 20, sm: 28 },
              fontSize: { xs: 15, sm: 12 },
            }}
          />
        </Box>
      </Box>
      <Divider sx={{ mb: 3, borderColor: medicalColors.borderGray }} />
      <StyledCard
        key={appointment.appointment_id}
        sx={{
          mb: 4,
        }}
      >
        <CardContent sx={{ p: 3 }}>
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 6 }}>
              <Stack spacing={2}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <CalendarToday
                    sx={{ color: medicalColors.deepBlue, fontSize: "28px" }}
                  />
                  <Typography
                    variant="h6"
                    sx={{ color: medicalColors.charcoal, fontWeight: 600 }}
                  >
                    Appointment
                  </Typography>
                </Box>

                <DetailRow
                  label="Date & Time"
                  value={formatDate(appointment.appointment_date)}
                />
                <DetailRow
                  label="Reason"
                  value={appointment.reason_for_visit}
                />
                {appointment.notes ? (
                  <span>Notes: {appointment.notes}</span>
                ) : (
                  <em>No notes available</em>
                )}
              </Stack>
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <Stack spacing={2}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Person
                    sx={{ color: medicalColors.teal, fontSize: "28px" }}
                    fontSize="small"
                  />
                  <Typography
                    variant="h5"
                    sx={{ color: medicalColors.charcoal, fontWeight: 600 }}
                  >
                    Medical Professional
                  </Typography>
                </Box>
                <DetailRow
                  label="Doctor"
                  value={`${appointment.doctor.first_name} ${appointment.doctor.last_name}`}
                />
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <LocalHospital
                    sx={{ color: medicalColors.forestGreen, fontSize: "28px" }}
                  />
                  <Typography
                    variant="h6"
                    sx={{ color: medicalColors.charcoal, fontWeight: 600 }}
                  >
                    Department
                  </Typography>
                </Box>
                <DetailRow
                  label="Department"
                  value={appointment.department.name}
                />
                <DetailRow
                  label="Consultation Fee"
                  value={`$${appointment.department.consultation_fee}`}
                />
              </Stack>
            </Grid>
          </Grid>
        </CardContent>
      </StyledCard>

      <Divider sx={{ my: 2, borderColor: medicalColors.borderGray }} />
      {/* Prescription */}
      <Box>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            mb: 1,
            p: 3,
            background: `linear-gradient(135deg, ${medicalColors.lightTeal} 0%, #ffffff 100%)`,
            borderRadius: "10px",
            border: `1px solid ${medicalColors.borderGray}`,
          }}
        >
          <MedicalServices
            sx={{ color: medicalColors.teal, fontSize: "32px" }}
            fontSize="small"
          />
          <Typography variant="h5">Prescriptions</Typography>
        </Box>

        {appointment.prescriptions && appointment.prescriptions.length > 0 ? (
          <Stack sx={{ mt: 2 }}>
            {appointment.prescriptions.map((presc: Prescription) => (
              <PrescriptionCard key={presc.prescription_id}>
                <CardContent>
                  {/* Prescription Header */}
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      mb: 1,
                      pb: 1,
                      borderBottom: `2px solid ${medicalColors.borderGray}`,
                    }}
                  >
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <Healing
                        sx={{
                          color: medicalColors.forestGreen,
                          fontSize: "28px",
                        }}
                      />
                      <Box>
                        <Typography
                          variant="h6"
                          sx={{
                            color: medicalColors.charcoal,
                            fontWeight: 600,
                          }}
                        >
                          {presc.diagnosis}
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{
                            color: medicalColors.slateGray,
                            fontWeight: "600",
                          }}
                        >
                          Diagnosis
                        </Typography>
                      </Box>
                    </Box>
                    <Box textAlign="right"></Box>
                    <Typography
                      variant="caption"
                      sx={{ color: medicalColors.slateGray, fontWeight: "600" }}
                    >
                      Prescribed:{" "}
                      {new Date(presc.prescribed_date).toLocaleDateString()}
                    </Typography>
                  </Box>

                  {/* Medications List */}
                  <Stack spacing={2}>
                    {presc.medications.map((medicat: Medication) => (
                      <Box
                        key={medicat.medication_id}
                        sx={{
                          p: 2,
                          backgroundColor: medicalColors.lightBlue,
                          borderRadius: "8px",
                          border: `1px solid ${medicalColors.borderGray}`,
                        }}
                      >
                        <Grid container spacing={2}>
                          <Grid size={{ xs: 12, sm: 6 }}>
                            <DetailRow
                              label="Medicine"
                              value={medicat.medicine.medicine_name}
                              fontWeight="600"
                            />
                          </Grid>
                          <Grid size={{ xs: 12, sm: 6 }}>
                            <DetailRow
                              label="Expires"
                              value={new Date(
                                medicat.medicine.expiry_date
                              ).toLocaleDateString()}
                            />
                          </Grid>
                          <Grid size={{ xs: 4, sm: 4 }}>
                            <DetailRow
                              label="Dose"
                              value={medicat.dosage}
                              fontWeight="600"
                            />
                          </Grid>
                          <Grid size={{ xs: 5, sm: 4 }}>
                            <DetailRow
                              label="Frequency"
                              value={`${medicat.frequency}`}
                              fontWeight="600"
                            />
                          </Grid>
                          <Grid size={{ xs: 4, sm: 4 }}>
                            <DetailRow
                              label="Duration"
                              value={`${medicat.duration}`}
                              fontWeight="600"
                            />
                          </Grid>
                        </Grid>
                      </Box>
                    ))}
                  </Stack>
                </CardContent>
              </PrescriptionCard>
            ))}
          </Stack>
        ) : (
          <Paper
            sx={{
              p: 3,
              textAlign: "center",
              background: medicalColors.lightBlue,
              borderRadius: "10px",
              border: `1px solid ${medicalColors.borderGray}`,
            }}
          >
            <Typography variant="body1" sx={{ color: medicalColors.slateGray }}>
              No prescriptions found for this appointment
            </Typography>
          </Paper>
        )}
      </Box>
    </Paper>
  );
};

export default AppointmentDetail;
