import { useEffect, useState } from "react"
import { useDoctorStore } from "../../store/doctorStore"
import { createPrescription, updatePrescritptionStatus } from "../../services/doctorAPI";

import { Box, Button, Divider, Grid, IconButton, MenuItem, Paper, Stack, TextField, Typography } from "@mui/material";
import { CheckCircle, DeleteIcon } from "lucide-react";
import { AddCircleOutline, SaveAlt } from "@mui/icons-material";
import { useParams } from "react-router-dom";
import CustomInput from "../../components/ui/CustomInput";
import { toast } from "react-toastify";

const AddPrescription = () => {
  const { medicines, fetchMedicines } = useDoctorStore()
  const params = useParams();
  console.log("useParams:", params);
  const { appointmentId } = useParams<{ appointmentId: string }>();
  console.log("id++++", appointmentId)
  const [formData, setFormData] = useState({
    appointment_id: Number(appointmentId),
    diagnosis: "",
    medications: [
      { medicine_id: "", dosage: "", frequency: "", duration: "" },
    ],
  });
  useEffect(() => {
    fetchMedicines();
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const handleMedChange = (index: number, field: string, value: string) => {
    const updated = [...formData.medications];
    updated[index][field as keyof typeof updated[0]] = value;
    setFormData({ ...formData, medications: updated });
  };

  const addMedicationRow = () => {
    setFormData({
      ...formData,
      medications: [
        ...formData.medications,
        { medicine_id: "", dosage: "", frequency: "", duration: "" },
      ],
    });
  };
  const removeMedicationRow = (index: number) => {
    const updated = [...formData.medications];
    updated.splice(index, 1);
    setFormData({ ...formData, medications: updated });
  };

  const handleSubmit = async () => {

  const errors: string[] = [];

  if (!formData.diagnosis.trim()) {
    errors.push('Diagnosis is required');
  }

  formData.medications.forEach((med, index) => {
    if (!med.medicine_id) errors.push(`Medicine is required!`);
    if (!med.dosage) errors.push(`Dosage is required!`);
    if (!med.frequency) errors.push(`Frequency is required!`);
    if (!med.duration) errors.push(`Duration is required!`);
  });

  if (errors.length > 0) {
    toast.error(errors.join('\n'))
     // Or show errors in UI
    return;
  }
    try {
      await createPrescription(formData);
      toast.success('Prescription created')
      setFormData({
        appointment_id: Number(appointmentId),
        diagnosis: "",
        medications: [
          { medicine_id: "", dosage: "", frequency: "", duration: "" },
        ],
      });
    } catch (error) {
      console.error("Error creating prescription", error);
      toast.error('Faild Add prescription')
    }
  };
  const handleStatusCompleted = async () => {
    try {
      await updatePrescritptionStatus({ appointment_id: Number(appointmentId) })
      toast.success('Completed');
    } catch (error: any) {
      console.log(error);
      toast.error("Faild to completed");
    }
  }
  return (
    <Box p={{ xs: 2, md: 4 }}>
      <Typography variant="h4" fontWeight={700} mb={3}>
        Add Prescription
      </Typography>

      <Paper elevation={3} sx={{ p: 4, borderRadius: 3, bgcolor: '#fdfdff' }}>
        <Grid container spacing={3}>
          {/* Diagnosis */}
          <Grid size={{xs:12}}>
            <Typography variant="h6" fontWeight={600} mb={1}>
              Diagnosis
            </Typography>
            <TextField
              fullWidth
              name="diagnosis"
              required
              label="Enter diagnosis"
              value={formData.diagnosis}
              onChange={handleChange}
              variant="outlined"
            />
          </Grid>

          {/* Medications Section Header */}
          <Grid size={{xs:12}}>
            <Typography variant="h6" fontWeight={600} mb={1}>
              Medications
            </Typography>
            <Divider sx={{ mb: 2 }} />
          </Grid>

          {/* Medication Rows */}
          {formData.medications.map((med, index) => (
            <Grid
              container
              size={{xs:12}}
              spacing={2}
              key={index}
              sx={{
                mb: 2,
                p: 2,
                borderRadius: 2,
                bgcolor: '#f4f7fe',
                boxShadow: 1,
              }}
            >
              <Grid size={{xs:12,md:3}}>
                <TextField
                  select
                  fullWidth
                  label="Medicine"
                  value={med.medicine_id}
                  onChange={(e) =>
                    handleMedChange(index, 'medicine_id', e.target.value)
                  }
                >
                  {medicines.map((m) => (
                    <MenuItem key={m.medicine_id} value={m.medicine_id}>
                      {m.medicine_name}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid size={{xs:6, md:2}} >
                <TextField
                  fullWidth
                  label="Dosage"
                  value={med.dosage}
                  onChange={(e) =>
                    handleMedChange(index, 'dosage', e.target.value)
                  }
                />
              </Grid>
              <Grid size={{xs:6, md:2}}>
                <TextField
                  fullWidth
                  label="Frequency"
                  value={med.frequency}
                  onChange={(e) =>
                    handleMedChange(index, 'frequency', e.target.value)
                  }
                />
              </Grid>
              <Grid size={{xs:6, md:2}}>
                <TextField
                  fullWidth
                  label="Duration"
                  value={med.duration}
                  onChange={(e) =>
                    handleMedChange(index, 'duration', e.target.value)
                  }
                />
              </Grid>
              <Grid size={{xs:6, md:1}}>
                <IconButton
                  color="error"
                  onClick={() => removeMedicationRow(index)}
                >
                  <DeleteIcon />
                </IconButton>
              </Grid>
            </Grid>
          ))}

          {/* Add Medicine Button */}
          <Grid size={{xs:12}}>
            <Button
              startIcon={<AddCircleOutline />}
              variant="outlined"
              onClick={addMedicationRow}
              sx={{ textTransform: 'none' }}
            >
              Add Medicine
            </Button>
          </Grid>

          {/* Action Buttons */}
          <Grid size={{xs:12}}>
            <Stack direction="row" spacing={2}>
              <Button
                variant="contained"
                color="primary"
                startIcon={<SaveAlt />}
                onClick={handleSubmit}
              >
                Save Prescription
              </Button>
              <Button
                variant="contained"
                color="success"
                startIcon={<CheckCircle />}
                onClick={handleStatusCompleted}
              >
                Mark as Completed
              </Button>
            </Stack>
          </Grid>
        </Grid>
      </Paper>
    </Box>

  )
}

export default AddPrescription