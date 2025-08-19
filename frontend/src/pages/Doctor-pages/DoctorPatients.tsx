import { useEffect } from "react";
import { useDoctorStore } from "../../store/doctorStore";
import {
  Alert,
  Avatar,
  Box,
  CircularProgress,
  Container,
  Grid,
  Typography,
} from "@mui/material";
import { Card, CardContent } from "../../components/ui/CustomCards";
import { getInitials } from "../../utility/DoctorUtility";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";

const DoctorPatients = () => {
  const { patients, fetchPatients, error, loading } = useDoctorStore();
  const navigate = useNavigate();

  useEffect(() => {
    fetchPatients();
  }, []);

  const handleClick = (id: number) => {
    navigate(`/doctor/report/${id}`);
  };

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" fontWeight={600} gutterBottom>
        My Patients
      </Typography>

      {loading ? (
        <Box display="flex" justifyContent="center" mt={4}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Alert severity="error">{error}</Alert>
      ) : patients.length === 0 ? (
        <Box textAlign="center" mt={4}>
          <Typography variant="h6" color="text.secondary">
            No patients found.
          </Typography>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {patients.map((patient) => (
            <Grid size={{xs:12,md:6}}  key={patient.user_id} onClick={() => handleClick(patient.user_id)} sx={{ cursor: "pointer" }}>
              <Card
                elevation={2}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  width:'100%',
                  p: 2,
                  borderRadius: 3,
                  transition: "0.3s",
                  "&:hover": {
                    transform: "translateY(-4px)",
                    boxShadow: "0px 8px 20px rgba(0,0,0,0.05)",
                    backgroundColor: "#fafafa",
                  },
                }}
              >
                <Avatar
                  sx={{
                    width: 64,
                    height: 64,
                    bgcolor: "primary.main",
                    fontSize: 20,
                    fontWeight: 600,
                    mr: 3,
                  }}
                >
                  {getInitials(patient.first_name, patient.last_name)}
                </Avatar>

                <CardContent sx={{ p: 0, flex: 1 }}>
                  <Typography variant="h6" fontWeight={600}>
                    {patient.first_name} {patient.last_name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" mb={0.5}>
                    {patient.email}
                  </Typography>

                  <Box display="flex" gap={2} flexWrap="wrap">
                    <Typography variant="body2">
                      <strong>Gender:</strong> {patient.gender || "N/A"}
                    </Typography>
                    <Typography variant="body2">
                      <strong>DOB:</strong>{" "}
                      {patient.date_of_birth
                        ? format(new Date(patient.date_of_birth), "dd MMM yyyy")
                        : "N/A"}
                    </Typography>

                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
};

export default DoctorPatients;
