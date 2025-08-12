import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  Box,
  Container,
  Paper,
  Typography,
  TextField,
  MenuItem,
  Button,
  Grid,
  Alert,
  AlertTitle,
  IconButton,
  Collapse,
  CircularProgress,
  Chip,
  InputAdornment,
  Card,
  CardContent,
  useTheme,
  Backdrop,
} from "@mui/material";
import {
  CalendarMonth,
  Person,
  Business,
  AccessTime,
  Description,
  Close,
  Refresh,
  Send,
  AttachMoney,
} from "@mui/icons-material";

interface Doctor {
  id: string;
  name: string;
  specialization: string;
  availability?: string[];
}

interface Department {
  id: string;
  name: string;
  consultation_fee: number;
}

interface FormData {
  doctor: string;
  department: string;
  date: string;
  reason: string;
  notes: string;
}

interface ApiError {
  response?: {
    data?: {
      message?: string;
    };
  };
}

const INITIAL_FORM_STATE: FormData = {
  doctor: "",
  department: "",
  date: "",
  reason: "",
  notes: "",
};

// Mock data - replace with actual API calls
const mockDepartments: Department[] = [
  { id: "1", name: "Neurology", consultation_fee: 150 },
  { id: "2", name: "Cardiology", consultation_fee: 200 },
  { id: "3", name: "Orthopedics", consultation_fee: 175 },
  { id: "4", name: "General Medicine", consultation_fee: 100 },
  { id: "5", name: "Pediatrics", consultation_fee: 125 },
];

const mockDoctors: Doctor[] = [
  { id: "1", name: "Dr. Sarah Johnson", specialization: "Neurology" },
  { id: "2", name: "Dr. Michael Chen", specialization: "Neurology" },
  { id: "3", name: "Dr. Emily Rodriguez", specialization: "Cardiology" },
  { id: "4", name: "Dr. David Wilson", specialization: "Cardiology" },
  { id: "5", name: "Dr. Lisa Thompson", specialization: "Orthopedics" },
  { id: "6", name: "Dr. James Brown", specialization: "Orthopedics" },
  { id: "7", name: "Dr. Anna Davis", specialization: "General Medicine" },
  { id: "8", name: "Dr. Robert Miller", specialization: "Pediatrics" },
];

const TestBookAppointment: React.FC = () => {
  const theme = useTheme();
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [formData, setFormData] = useState<FormData>(INITIAL_FORM_STATE);
  const [feedback, setFeedback] = useState<{
    type: "error" | "success";
    message: string;
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  // Memoized filtered doctors based on selected department
  const filteredDoctors = useMemo(() => {
    if (!formData.department || !Array.isArray(doctors)) return [];

    const selectedDept = departments.find((d) => d.id === formData.department);
    if (!selectedDept) return doctors;

    return doctors.filter(
      (doctor) => doctor.specialization === selectedDept.name
    );
  }, [doctors, departments, formData.department]);

  // Selected department details
  const selectedDepartment = useMemo(() => {
    if (!Array.isArray(departments) || !formData.department) return null;
    return departments.find((d) => d.id === formData.department) || null;
  }, [departments, formData.department]);

  // Clear feedback after 5 seconds
  useEffect(() => {
    if (feedback) {
      const timer = setTimeout(() => setFeedback(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [feedback]);

  // Fetch initial data (simulated with mock data)
  const fetchInitialData = useCallback(async () => {
    try {
      setInitialLoading(true);
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setDoctors(mockDoctors);
      setDepartments(mockDepartments);
      setFeedback(null);
    } catch (err) {
      setFeedback({
        type: "error",
        message: `Failed to load doctors or departments. Please refresh the page. ERROR - ${err}`,
      });
    } finally {
      setInitialLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchInitialData();
  }, [fetchInitialData]);

  // Form field update handler
  const updateFormData = useCallback(
    (field: keyof FormData, value: string) => {
      setFormData((prev) => {
        const updated = { ...prev, [field]: value };

        // Clear doctor selection if department changes
        if (field === "department" && prev.department !== value) {
          updated.doctor = "";
        }

        return updated;
      });

      // Clear feedback when user starts typing/selecting
      if (feedback) setFeedback(null);
    },
    [feedback]
  );

  // Form validation
  const validateForm = useCallback((): string | null => {
    if (!formData.doctor) return "Please select a doctor.";
    if (!formData.department) return "Please select a department.";
    if (!formData.date) return "Please select an appointment date.";
    if (!formData.reason.trim())
      return "Please provide a reason for your visit.";
    if (formData.reason.trim().length < 10)
      return "Reason must be at least 10 characters long.";

    // Check if date is not in the past
    const selectedDate = new Date(formData.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (selectedDate < today) return "Please select a future date.";

    return null;
  }, [formData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationError = validateForm();
    if (validationError) {
      setFeedback({ type: "error", message: validationError });
      return;
    }

    try {
      setLoading(true);
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      setFeedback({
        type: "success",
        message:
          "Appointment booked successfully! You will receive a confirmation email shortly.",
      });

      // Reset form
      setFormData(INITIAL_FORM_STATE);
    } catch (err) {
      const apiError = err as ApiError;
      const errorMessage =
        apiError.response?.data?.message ||
        "Failed to book appointment. Please try again.";
      setFeedback({ type: "error", message: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFormData(INITIAL_FORM_STATE);
    setFeedback(null);
  };

  // Get minimum date for date input (today)
  const getMinDate = () => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  };

  if (initialLoading) {
    return (
      <Backdrop
        open={true}
        sx={{ color: "#fff", zIndex: theme.zIndex.drawer + 1 }}
      >
        <Box display="flex" flexDirection="column" alignItems="center">
          <CircularProgress color="inherit" size={60} />
          <Typography variant="h6" sx={{ mt: 2 }}>
            Loading appointment booking form...
          </Typography>
        </Box>
      </Backdrop>
    );
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)",
        py: 4,
        // pt: 8,
      }}
    >
      <Container maxWidth="lg">
        <Paper
          elevation={8}
          sx={{
            borderRadius: 4,
            overflow: "hidden",
            boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
          }}
        >
          {/* Header */}
          <Box
            sx={{
              background: "linear-gradient(135deg, #1976d2 0%, #1565c0 100%)",
              color: "white",
              px: 4,
              py: 3,
            }}
          >
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
            >
              <Box display="flex" alignItems="center" gap={2}>
                <CalendarMonth sx={{ fontSize: 32 }} />
                <Typography variant="h4" fontWeight="bold">
                  Book an Appointment
                </Typography>
              </Box>
            </Box>
          </Box>

          <Box p={4}>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
              Fill out the form below to schedule your appointment. All fields
              marked with * are required.
            </Typography>

            {/* Feedback Alert */}
            <Collapse in={!!feedback}>
              <Alert
                severity={feedback?.type || "info"}
                sx={{ mb: 3 }}
                action={
                  <IconButton
                    size="small"
                    onClick={() => setFeedback(null)}
                    color="inherit"
                  >
                    <Close fontSize="small" />
                  </IconButton>
                }
              >
                <AlertTitle>
                  {feedback?.type === "error" ? "Error" : "Success"}
                </AlertTitle>
                {feedback?.message}
              </Alert>
            </Collapse>

            <Box component="form" onSubmit={handleSubmit}>
              <Grid container spacing={3}>
                {/* Department Selection */}
                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField
                    select
                    fullWidth
                    label="Select Department"
                    value={formData.department}
                    onChange={(e) =>
                      updateFormData("department", e.target.value)
                    }
                    disabled={loading}
                    required
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Business color="action" />
                        </InputAdornment>
                      ),
                    }}
                    helperText={
                      departments.length === 0 ? "No departments available" : ""
                    }
                  >
                    <MenuItem value="">
                      <em>Choose a department</em>
                    </MenuItem>
                    {departments.map((dept) => (
                      <MenuItem key={dept.id} value={dept.id}>
                        {dept.name} - ${dept.consultation_fee}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>

                {/* Doctor Selection */}
                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField
                    select
                    fullWidth
                    label="Select Doctor"
                    value={formData.doctor}
                    onChange={(e) => updateFormData("doctor", e.target.value)}
                    disabled={loading || !formData.department}
                    required
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Person color="action" />
                        </InputAdornment>
                      ),
                    }}
                    helperText={
                      !formData.department
                        ? "Select department first"
                        : formData.department && filteredDoctors.length === 0
                        ? "No doctors available for selected department"
                        : ""
                    }
                  >
                    <MenuItem value="">
                      <em>
                        {!formData.department
                          ? "Select department first"
                          : "Choose a doctor"}
                      </em>
                    </MenuItem>
                    {filteredDoctors.map((doctor) => (
                      <MenuItem key={doctor.id} value={doctor.id}>
                        {doctor.name} - {doctor.specialization}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>

                {/* Date Selection */}
                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField
                    fullWidth
                    type="date"
                    label="Appointment Date"
                    value={formData.date}
                    onChange={(e) => updateFormData("date", e.target.value)}
                    disabled={loading}
                    required
                    InputLabelProps={{ shrink: true }}
                    inputProps={{ min: getMinDate() }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <AccessTime color="action" />
                        </InputAdornment>
                      ),
                    }}
                    helperText="Select a future date"
                  />
                </Grid>

                {/* Consultation Fee Display */}
                {selectedDepartment && (
                  <Grid size={{ xs: 12, md: 6 }}>
                    <Card
                      sx={{
                        bgcolor: "primary.50",
                        border: "1px solid",
                        borderColor: "primary.200",
                      }}
                    >
                      <CardContent sx={{ py: 2 }}>
                        <Box display="flex" alignItems="center" gap={1} mb={1}>
                          <AttachMoney color="primary" />
                          <Typography variant="subtitle2" color="primary">
                            Consultation Fee
                          </Typography>
                        </Box>
                        <Chip
                          label={`$${selectedDepartment.consultation_fee}`}
                          color="primary"
                          // size="large"
                          sx={{ fontWeight: "bold", fontSize: "1rem" }}
                        />
                      </CardContent>
                    </Card>
                  </Grid>
                )}

                {/* Reason for Visit */}
                <Grid size={{ xs: 12 }}>
                  <TextField
                    fullWidth
                    multiline
                    rows={4}
                    label="Reason for Visit"
                    value={formData.reason}
                    onChange={(e) => updateFormData("reason", e.target.value)}
                    disabled={loading}
                    required
                    inputProps={{ maxLength: 500 }}
                    error={
                      formData.reason.length > 0 && formData.reason.length < 10
                    }
                    InputProps={{
                      startAdornment: (
                        <InputAdornment
                          position="start"
                          sx={{ alignSelf: "flex-start", mt: 1 }}
                        >
                          <Description color="action" />
                        </InputAdornment>
                      ),
                    }}
                    FormHelperTextProps={{ component: "div" }} // ✅ Fix here
                    helperText={
                      <Box display="flex" justifyContent="space-between">
                        <span>
                          {formData.reason.length < 10 &&
                          formData.reason.length > 0
                            ? `Need ${
                                10 - formData.reason.length
                              } more characters`
                            : "Minimum 10 characters required"}
                        </span>
                        <span>{formData.reason.length}/500</span>
                      </Box>
                    }
                    placeholder="Please describe your symptoms or reason for the appointment..."
                  />
                </Grid>

                {/* Additional Notes */}
                <Grid size={{ xs: 12 }}>
                  <TextField
                    fullWidth
                    multiline
                    rows={3}
                    label="Additional Notes (optional)"
                    value={formData.notes}
                    onChange={(e) => updateFormData("notes", e.target.value)}
                    disabled={loading}
                    inputProps={{ maxLength: 1000 }}
                    helperText={
                      <Box
                        component="span"
                        display="flex"
                        justifyContent="flex-end"
                      >
                        <span>{formData.notes.length}/1000</span>
                      </Box>
                    }
                    placeholder="Any additional information you'd like to share..."
                  />
                </Grid>

                {/* Submit Buttons */}
                <Grid size={{ xs: 12 }}>
                  <Box
                    display="flex"
                    gap={2}
                    pt={2}
                    flexDirection={{ xs: "column", sm: "row" }}
                  >
                    <Button
                      type="submit"
                      variant="contained"
                      size="large"
                      disabled={loading}
                      startIcon={
                        loading ? <CircularProgress size={20} /> : <Send />
                      }
                      sx={{
                        flex: 1,
                        py: 1.5,
                        background:
                          "linear-gradient(135deg, #1976d2 0%, #1565c0 100%)",
                        "&:hover": {
                          background:
                            "linear-gradient(135deg, #1565c0 0%, #0d47a1 100%)",
                        },
                      }}
                    >
                      {loading ? "Booking..." : "Book Appointment"}
                    </Button>
                    <Button
                      type="button"
                      variant="outlined"
                      size="large"
                      onClick={handleReset}
                      disabled={loading}
                      startIcon={<Refresh />}
                      sx={{ minWidth: { sm: "150px" } }}
                    >
                      Reset Form
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            </Box>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default TestBookAppointment;
