import { useEffect, useState } from "react"
import { useDoctorStore } from "../../store/doctorStore"
import { createPrescription } from "../../services/doctorAPI";

import { Box, Button, Grid, IconButton, MenuItem, Paper, TextField, Typography } from "@mui/material";
import { DeleteIcon } from "lucide-react";
import { AddCircleOutline } from "@mui/icons-material";
import { useParams } from "react-router-dom";
import CustomInput from "../../components/ui/CustomInput";

const AddPrescription = () => {
    const {medicines,fetchMedicines}=useDoctorStore()
    const { appointmentId } = useParams<{ appointmentId: string }>();
    const [formData, setFormData] = useState({
        appointment_id:Number(appointmentId),
        diagnosis: "",
        medications: [
      { medicine_id: "", dosage: "", frequency: "", duration: "" },
    ],
    });
    useEffect(()=>{
        fetchMedicines();
    },[])

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
    try {
      await createPrescription(formData);
      alert("Prescription created successfully!");
      setFormData({
        appointment_id: Number(appointmentId),
        diagnosis: "",
        medications: [
          { medicine_id: "", dosage: "", frequency: "", duration: "" },
        ],
      });
    } catch (error) {
      console.error("Error creating prescription", error);
    }
  };
  return (
     <Box p={2}>
      
      <Typography variant="h4" fontWeight={600} mb={4}>
        Add Prescription
      </Typography>

      <Paper sx={{ p: 3 }}>
        <Grid container spacing={2}>
    
          <Grid size={{xs:12}} >
            <CustomInput
              fullWidth
              label="Diagnosis"
              name="diagnosis"
              value={formData.diagnosis}
              onChange={handleChange}
            />
          </Grid>

          {/* Medications */}
         <Grid size={{xs:12}} >
            <Typography variant="h6" mb={1}>
              Medications
            </Typography>
            {formData.medications.map((med, index) => (
              <Grid
                container
                spacing={2}
                key={index}
                alignItems="center"
                sx={{ mb: 1 }}
              >
                <Grid size={{xs:3}} >
                  <TextField
                    select
                    fullWidth
                    label="Medicine"
                    value={med.medicine_id}
                    onChange={(e) =>
                      handleMedChange(index, "medicine_id", e.target.value)
                    }
                  >
                    {medicines.map((m) => (
                      <MenuItem key={m.medicine_id} value={m.medicine_id}>
                        {m.medicine_name}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
                <Grid size={{xs:2}} >
                  <TextField
                    fullWidth
                    label="Dosage"
                    value={med.dosage}
                    onChange={(e) =>
                      handleMedChange(index, "dosage", e.target.value)
                    }
                  />
                </Grid>
                <Grid size={{xs:2}} >
                  <TextField
                    fullWidth
                    label="Frequency"
                    value={med.frequency}
                    onChange={(e) =>
                      handleMedChange(index, "frequency", e.target.value)
                    }
                  />
                </Grid>
                <Grid size={{xs:2}} >
                  <TextField
                    fullWidth
                    label="Duration"
                    value={med.duration}
                    onChange={(e) =>
                      handleMedChange(index, "duration", e.target.value)
                    }
                  />
                </Grid>
                <Grid size={{xs:1}} >
                  <IconButton
                    color="error"
                    onClick={() => removeMedicationRow(index)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Grid>
              </Grid>
            ))}

            <Button
              startIcon={<AddCircleOutline />}
              onClick={addMedicationRow}
              sx={{ mt: 1 }}
            >
              Add Medicine
            </Button>
          </Grid>

          {/* Submit */}
          <Grid size={{xs:12}} >
            <Button variant="contained" onClick={handleSubmit}>
              Save Prescription
            </Button>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  )
}

export default AddPrescription