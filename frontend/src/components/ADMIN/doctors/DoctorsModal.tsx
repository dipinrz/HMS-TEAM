import {
  Box,
  Button,
  Stack,
  TextField,
  Typography,
  MenuItem,
  CircularProgress,
} from "@mui/material";
import React from "react";

interface DoctorForm {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  specialization: string;
  qualification: string;
  license_number: string;
  years_of_experience: number;
  department_id: number;
}

interface DoctorsModalProps {
  open: boolean;
  handleCloseModal: () => void;
  isEditMode: boolean;
  formData: DoctorForm;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (e: React.FormEvent) => void;
  loading: boolean;
  departments: DepartmentData[];
}

interface DepartmentData {
  department_id: number;
  name: string;
  description: string;
  consultation_fee: number;
  head_doctor: number;
}

const DoctorsModal = ({
  handleCloseModal,
  isEditMode,
  formData,
  handleChange,
  handleSubmit,
  loading,
  departments,
}: DoctorsModalProps) => {
  const [errors, setErrors] = React.useState<
    Partial<Record<keyof DoctorForm, string>>
  >({});

  const validateForm = () => {
    const newErrors: Partial<Record<keyof DoctorForm, string>> = {};

    if (!formData.first_name) newErrors.first_name = "First name is required";
    if (!formData.last_name) newErrors.last_name = "Last name is required";
    if (!formData.email) newErrors.email = "Email is required";
    if (!formData.password && !isEditMode)
      newErrors.password = "Password is required";
    if (!formData.department_id)
  newErrors.department_id = "Department is required";
    if (!formData.specialization)
      newErrors.specialization = "Specialization is required";
    if (!formData.qualification)
      newErrors.qualification = "Qualification is required";
    if (!formData.years_of_experience)
      newErrors.years_of_experience = "Experience is required";
    if (!formData.license_number)
      newErrors.license_number = "License number is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    handleSubmit(e);
  };

  return (
    <Box
      sx={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        width: { xs: "90%", sm: 600, md: 700 },
        bgcolor: "#fff",
        borderRadius: 3,
        boxShadow: "0 8px 32px rgba(0,0,0,0.15)",
        overflow: "hidden",
      }}
    >
      <Box
        sx={{
          px: 3,
          py: 2,
          background: "linear-gradient(135deg, #020aa5ff 0%, #0a036bff 100%)",
          color: "#fff",
          fontWeight: "bold",
          fontSize: "1.2rem",
        }}
      >
        {isEditMode ? "Edit Doctor" : "Register New Doctor"}
      </Box>

      <Box sx={{ p: 3, bgcolor: "#f5f7fa" }}>
        <form onSubmit={onSubmit}>
          <Stack
            spacing={3}
            sx={{
              "& .MuiTextField-root": {
                backgroundColor: "#fff",
                borderRadius: 1.5,
              },
            }}
          >
            {/* Personal Info */}
            <Stack spacing={2}>
              <Typography
                variant="subtitle1"
                sx={{
                  fontWeight: 700,
                  color: "#1976d2",
                  borderBottom: "2px solid #e3f2fd",
                  pb: 0.5,
                }}
              >
                Personal Information
              </Typography>
              <Stack direction="row" spacing={2}>
                <TextField
                  name="first_name"
                  label="First Name"
                  fullWidth
                  size="small"
                  value={formData.first_name}
                  onChange={handleChange}
                  error={!!errors.first_name}
                  helperText={errors.first_name}
                />
                <TextField
                  name="last_name"
                  label="Last Name"
                  fullWidth
                  size="small"
                  value={formData.last_name}
                  onChange={handleChange}
                  error={!!errors.last_name}
                  helperText={errors.last_name}
                />
              </Stack>
              <TextField
                name="email"
                label="Email"
                type="email"
                fullWidth
                size="small"
                value={formData.email}
                onChange={handleChange}
                disabled={isEditMode}
                error={!!errors.email}
                helperText={errors.email}
              />

              {!isEditMode && (
                <TextField
                  name="password"
                  label="Password"
                  type="password"
                  fullWidth
                  size="small"
                  value={formData.password}
                  onChange={handleChange}
                  error={!!errors.password}
                  helperText={errors.password}
                />
              )}
            </Stack>

            {/* Professional Info */}
            <Stack spacing={2}>
              <Typography
                variant="subtitle1"
                sx={{
                  fontWeight: 700,
                  color: "#1976d2",
                  borderBottom: "2px solid #e3f2fd",
                  pb: 0.5,
                }}
              >
                Professional Information
              </Typography>
              {/* When editing: show Department + Specialization */}
              {/* {isEditMode ? (
                <Stack direction="row" spacing={2}>
                  <TextField
                    select
                    name="department_id"
                    label="Department"
                    fullWidth
                    size="small"
                    value={formData.department_id}
                    onChange={handleChange}
                    error={!!errors.department_id}
                    helperText={errors.department_id}
                  >
                    {departments.map((dept) => (
                      <MenuItem
                        key={dept.department_id}
                        value={dept.department_id}
                      >
                        {dept.name}
                      </MenuItem>
                    ))}
                  </TextField>
                  <TextField
                    name="specialization"
                    label="Specialization"
                    fullWidth
                    size="small"
                    value={formData.specialization}
                    onChange={handleChange}
                    error={!!errors.specialization}
                    helperText={errors.specialization}
                  />
                </Stack>
              ) : (
                // When creating: show only Specialization
                <TextField
                  name="specialization"
                  label="Specialization"
                  fullWidth
                  size="small"
                  value={formData.specialization}
                  onChange={handleChange}
                  error={!!errors.specialization}
                  helperText={errors.specialization}
                />
              )} */}
              <Stack direction="row" spacing={2}>
  <TextField
    select
    name="department_id"
    label="Department"
    fullWidth
    size="small"
    value={formData.department_id}
    onChange={handleChange}
    error={!!errors.department_id}
    helperText={errors.department_id}
  >
    {departments.map((dept) => (
      <MenuItem
        key={dept.department_id}
        value={dept.department_id}
      >
        {dept.name}
      </MenuItem>
    ))}
  </TextField>
  <TextField
    name="specialization"
    label="Specialization"
    fullWidth
    size="small"
    value={formData.specialization}
    onChange={handleChange}
    error={!!errors.specialization}
    helperText={errors.specialization}
  />
</Stack>



              <Stack direction="row" spacing={2}>
                <TextField
                  name="qualification"
                  label="Qualification"
                  fullWidth
                  size="small"
                  value={formData.qualification}
                  onChange={handleChange}
                  error={!!errors.qualification}
                  helperText={errors.qualification}
                />
                <TextField
                  name="years_of_experience"
                  label="Years of Experience"
                  type="number"
                  fullWidth
                  size="small"
                  value={formData.years_of_experience}
                  onChange={handleChange}
                  error={!!errors.years_of_experience}
                  helperText={errors.years_of_experience}
                />
              </Stack>
              <TextField
                name="license_number"
                label="License Number"
                fullWidth
                size="small"
                value={formData.license_number}
                onChange={handleChange}
                error={!!errors.license_number}
                helperText={errors.license_number}
              />
            </Stack>
          </Stack>

          {/* Footer Buttons */}
          <Box
            sx={{
              mt: 3,
              display: "flex",
              justifyContent: "flex-end",
              gap: 2,
            }}
          >
            <Button
              variant="outlined"
              color="error"
              onClick={handleCloseModal}
              disabled={loading}
              sx={{ borderRadius: 2 }}
            >
              Close
            </Button>
            <Button
              type="submit"
              onClick={handleSubmit}
              variant="contained"
              disabled={loading}
              sx={{
                borderRadius: 2,
                px: 3,
                background:
                  "linear-gradient(135deg, #020aa5ff 0%, #0a036bff 100%)",
                "&:hover": {
                  background:
                    "linear-gradient(135deg, #020aa5ff 0%, #000000ff 100%)",
                },
              }}
            >
              {loading ? (
                <CircularProgress size={24} color="inherit" />
              ) : isEditMode ? (
                "Update"
              ) : (
                "Submit"
              )}
            </Button>
          </Box>
        </form>
      </Box>
    </Box>
  );
};

export default DoctorsModal;
