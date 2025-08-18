import { Box, Button, Modal, Stack, TextField, Typography } from "@mui/material";
import { useState } from "react";

interface Props {
  open: boolean;
  isEditMode: boolean;
  formData: any;
  doctors: any[];
  onClose: () => void;
  onChange: (data: any) => void;
  onSubmit: () => void;
}

export default function DepartmentModal({
  open,
  isEditMode,
  formData,
  doctors,
  onClose,
  onChange,
  onSubmit,
}: Props) {
  const [errors, setErrors] = useState<any>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    onChange({
      ...formData,
      [name]:
        name === "consultation_fee" || name === "head_doctor"
          ? Number(value)
          : value,
    });
    setErrors((prev: any) => ({ ...prev, [name]: "" })); // clear error on change
  };

  const handleSubmit = () => {
    const newErrors: any = {};
    if (!formData.name?.trim()) newErrors.name = "Name is missing";
    if (!formData.description?.trim())
      newErrors.description = "Description is missing";
    if (!formData.consultation_fee)
      newErrors.consultation_fee = "Consultation fee is missing";
    if (!formData.head_doctor || formData.head_doctor === 0)
      newErrors.head_doctor = "Head doctor is missing";

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      onSubmit();
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 700,
          bgcolor: "#fff",
          borderRadius: 3,
        }}
      >
        {/* Header */}
        <Box
          sx={{
            px: 3,
            py: 2,
            background: "linear-gradient(135deg, #020aa5ff 0%, #0a036bff 100%)",
            color: "#fff",
            fontWeight: 600,
          }}
        >
          {isEditMode ? "EDIT DEPARTMENT" : "ADD NEW DEPARTMENT"}
        </Box>

        {/* Form */}
        <Box sx={{ p: 3, bgcolor: "#f5f7fa" }}>
          <Stack spacing={2}>
            <Typography fontWeight={700} color="#011d39ff">
              DEPARTMENT DETAILS
            </Typography>

            <Stack direction="row" spacing={2}>
              <TextField
                name="name"
                label="Department Name"
                fullWidth
                size="small"
                value={formData.name}
                onChange={handleChange}
                error={!!errors.name}
                helperText={errors.name}
              />
              <TextField
                name="description"
                label="Description"
                fullWidth
                size="small"
                value={formData.description}
                onChange={handleChange}
                error={!!errors.description}
                helperText={errors.description}
              />
            </Stack>

            <TextField
              name="consultation_fee"
              label="Consultation Fee"
              fullWidth
              size="small"
              value={formData.consultation_fee}
              onChange={handleChange}
              error={!!errors.consultation_fee}
              helperText={errors.consultation_fee}
            />

            <TextField
              select
              name="head_doctor"
              label="HOD"
              fullWidth
              size="small"
              value={formData.head_doctor}
              onChange={handleChange}
              SelectProps={{ native: true }}
              error={!!errors.head_doctor}
              helperText={errors.head_doctor}
            >
              <option value={0}>Select Head Doctor</option>
              {doctors.map((doc: any) => (
                <option key={doc.doctor_id} value={doc.doctor_id}>
                  {doc.user.first_name} {doc.user.last_name}
                </option>
              ))}
            </TextField>
          </Stack>
        </Box>

        {/* Actions */}
        <Box sx={{ p: 2, display: "flex", justifyContent: "flex-end", gap: 2 }}>
          <Button variant="outlined" color="error" onClick={onClose}>
            Close
          </Button>
          <Button variant="contained" onClick={handleSubmit}>
            {isEditMode ? "Update" : "Submit"}
          </Button>
        </Box>
      </Box>
    </Modal>
  );
}
