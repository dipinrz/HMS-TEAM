import { useEffect } from "react";
import { useDoctorStore } from "../../store/doctorStore";
import {
  Card,
  CardContent,
  Typography,
  Grid,
  CircularProgress,
  Avatar,
  Box,
  Chip,
  Stack,
  Divider
} from "@mui/material";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import EmailIcon from "@mui/icons-material/Email";
import SchoolIcon from "@mui/icons-material/School";
import WorkIcon from "@mui/icons-material/Work";
import MedicalServicesIcon from "@mui/icons-material/MedicalServices";
import { getInitials } from "../../utility/DoctorUtility";

const ListOfDoctors = () => {
  const { doctors, fetchHeadDoctor, loading, error } = useDoctorStore();

  useEffect(() => {
    fetchHeadDoctor();
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" mt={5}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Typography color="error" align="center" mt={5}>
        Failed to load doctors.
      </Typography>
    );
  }

  return (
    <Box p={4}>
      <Typography variant="h4" gutterBottom fontWeight={600}>
        Doctors
      </Typography>

      <Grid container spacing={3}>
        {doctors.map((doctor) => (
          <Grid size={{xs:12,sm:6, md:4}}  key={doctor.doctor_id}>
            <Card elevation={4}>
              <CardContent>
                <Box display="flex" alignItems="center" mb={2}>
                  <Avatar sx={{ bgcolor: "#1976d2", mr: 2 }}>
                    {getInitials(doctor.user.first_name, doctor.user.last_name)}
                  </Avatar>
                  <Box>
                    <Typography variant="h6">
                      {doctor.user.first_name} {doctor.user.last_name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {doctor.user.email}
                    </Typography>
                  </Box>
                </Box>

                <Divider sx={{ mb: 2 }} />

                <Stack spacing={1}>
                  <Box display="flex" alignItems="center" justifyContent="space-between">
                    <Box display="flex">
                      <SchoolIcon color="primary" sx={{ mr: 1 }} />
                      <Typography variant="body2" fontWeight={500} sx={{ minWidth: 120 }}>
                        Qualification:
                      </Typography>
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                      {doctor.qualification}
                    </Typography>
                  </Box>

                  <Box display="flex" alignItems="center" justifyContent="space-between">
                    <Box display="flex">
                    <WorkIcon color="primary" sx={{ mr: 1 }} />
                    <Typography variant="body2" fontWeight={500} sx={{ minWidth: 120 }}>
                      Experience:
                    </Typography>
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                      {doctor.years_of_experience} years
                    </Typography>
                  </Box>

                  <Box display="flex" alignItems="center" justifyContent="space-between">
                    <Box display="flex">
                    <MedicalServicesIcon color="primary" sx={{ mr: 1 }} />
                    <Typography variant="body2" fontWeight={500} sx={{ minWidth: 120 }}>
                      Specialization:
                    </Typography>
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                      {doctor.specialization}
                    </Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default ListOfDoctors;
