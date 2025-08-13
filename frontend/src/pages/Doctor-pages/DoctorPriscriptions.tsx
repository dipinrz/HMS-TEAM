import {
  Box,
  Typography,
  Grid,
  CardContent,
  Avatar,
  Chip,
  Divider,
} from "@mui/material";
import { format } from "date-fns";
import { useDoctorStore } from "../../store/doctorStore";
import { useEffect, useState } from "react";
import { Card } from "../../components/ui/CustomCards";


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
    const {prescriptons,fetchPrescriptions,loading,error}=useDoctorStore();
    useEffect(()=>{
        fetchPrescriptions();
    },[fetchPrescriptions]);
  return (
    <Box p={2}>
      <Typography variant="h4" fontWeight={600} mb={4}>
        All Prescriptions
      </Typography>
    {loading && <Typography>Loading prescriptions...</Typography>}
      {error && <Typography color="error">{error}</Typography>}
      <Grid container spacing={3}>
        {[...prescriptons].sort((a,b)=>new Date(b.prescribed_date).getTime()-new Date(a.prescribed_date).getTime()).map((prescription) => (
          <Grid size={{xs:12, md:3}}  key={prescription.prescription_id}>
            <Card elevation={3} sx={{ p: 2}}>
              <CardContent>
                <Box display="flex" alignItems="center" gap={2}>
                  <Avatar>{prescription.appointment.patient.first_name.charAt(0)}</Avatar>
                  <Box>
                    <Typography fontWeight={600}>
                      {prescription.appointment.patient.first_name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {prescription.diagnosis}
                    </Typography>
                  </Box>
                </Box>

                <Divider sx={{ my: 1.5 }} />

                <Typography variant="body2">
                  <strong>Reason</strong> {prescription.appointment.reason_for_visit}
                </Typography>
                <Typography variant="body2" sx={{ mt: 0.5 }}>
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
