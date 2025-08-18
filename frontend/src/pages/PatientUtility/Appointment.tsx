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
import { fetchAllDepartments, getAllDoctors } from "../../services/adminAPi";
import { addAppoinment } from "../../services/patientAPI";

interface Doctor {
  doctor_id: string;
  specialization: string;
  availability?: string[];
  user: User;
  department: Department;
}
interface User {
  first_name: string;
  is_active: boolean;
  user_id: string;
}
interface Department {
  department_id: string;
  name: string;
  consultation_fee: number;
}

export interface FormData {
  doctor_id: string;
  department_id: string;
  appointment_date: string;
  reason_for_visit: string;
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
  doctor_id: "",
  department_id: "",
  appointment_date: "",
  reason_for_visit: "",
  notes: "",
};

const timeSlots = [
  { label: "09:00 - 09:30 AM", value: "09:00" },
  { label: "09:30 - 10:00 AM", value: "09:30" },
  { label: "10:00 - 10:30 AM", value: "10:00" },
  { label: "10:30 - 11:00 AM", value: "10:30" },
  { label: "11:00 - 11:30 AM", value: "11:00" },
  { label: "11:30 - 12:00 PM", value: "11:30" },
  { label: "12:00 - 12:30 PM", value: "12:00" },
  { label: "12:30 - 01:00 PM", value: "12:30" },
  { label: "01:00 - 01:30 PM", value: "13:00" },
  { label: "01:30 - 02:00 PM", value: "13:30" },
  { label: "02:00 - 02:30 PM", value: "14:00" },
  { label: "02:30 - 03:00 PM", value: "14:30" },
  { label: "03:00 - 03:30 PM", value: "15:00" },
  { label: "03:30 - 04:00 PM", value: "15:30" },
  { label: "04:00 - 04:30 PM", value: "16:00" },
  { label: "04:30 - 05:00 PM", value: "16:30" },
  { label: "05:00 - 05:30 PM", value: "17:00" },
  { label: "05:30 - 06:00 PM", value: "17:30" },
];

const TestBookAppointment: React.FC = () => {
  const theme = useTheme();

  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);

  const [formData, setFormData] = useState<FormData>(INITIAL_FORM_STATE);

  const [selectedDate, setSelectedDate] = useState(""); // for date picker
  const [selectedTime, setSelectedTime] = useState(""); // for time picker

  const [feedback, setFeedback] = useState<{
    type: "error" | "success";
    message: string;
  } | null>(null);

  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  // Selected department details from formData.department
  const selectedDepartment = useMemo(() => {
    if ( !Array.isArray(departments) || !formData.department_id ) return null;
    return (
      departments.find((d) => d.department_id === formData.department_id) ||
      null
    );
  }, [departments, formData.department_id]);

  // Memoized filtered doctors based on selected department
  const filteredDoctors = useMemo(() => {
    if (!Array.isArray(doctors)) return [];
    if (!formData.department_id) return doctors;

    return doctors.filter(
      (doctor) =>
        Number(doctor.department?.department_id) ===
        Number(formData.department_id)
    );
  }, [doctors, formData.department_id]);

  // Clear feedback after 5 seconds
  useEffect(() => {
    if (feedback) {
      const timer = setTimeout(() => setFeedback(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [feedback]);

  // Fetch initial data
  const fetchInitialData = useCallback(async () => {
    try {
      setInitialLoading(true);

      // fetching all departments
      const response = await fetchAllDepartments();
      const deptResponse = response.data;

      // Validate response structure
      if (!deptResponse?.success || !deptResponse.data?.departments) {
        throw new Error(deptResponse?.message || "Failed to fetch departments");
      }

      // Extract array
      const departmentsList = deptResponse.data.departments;

      setDepartments(departmentsList);

      // Fetch all doctors dynamically
      const doctorsDataReponse = await getAllDoctors();
      const doctorsData = doctorsDataReponse.data?.data;

      setDoctors(doctorsData);

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
        if (field === "department_id" && prev.department_id !== value) {
          updated.doctor_id = "";
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
    if (!formData.doctor_id) return "Please select a doctor.";
    if (!formData.department_id) return "Please select a department.";
    if (!formData.appointment_date) return "Please select an appointment date.";
    if (!formData.reason_for_visit.trim())
      return "Please provide a reason for your visit.";
    if (formData.reason_for_visit.trim().length < 10)
      return "Reason must be at least 10 characters long.";

    // Check if date is tomorrow or later
    const selectedDateTime = new Date(formData.appointment_date);
    const today = new Date();
    today.setHours(0, 0, 0, 0); // today at 00:00
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1); // tomorrow at 00:00

    if (selectedDateTime < tomorrow)
      return "Please select a date starting from tomorrow.";

    // Check if time is between 09:00 and 18:00
    const selectedHour = selectedDateTime.getHours();
    const selectedMinutes = selectedDateTime.getMinutes();

    if (
      selectedHour < 9 ||
      selectedHour > 18 ||
      (selectedHour === 18 && selectedMinutes > 0)
    )
      return "Appointment time must be between 9:00 AM and 6:00 PM";

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

      const response = await addAppoinment(formData);
      const data = response.data;

      if (data.success) {
        setFeedback({
          type: "success",
          message:
            "Appointment booked successfully! You will receive a confirmation email shortly.",
        });
        console.log("Submitting the data", formData);

        // Reset form
        setFormData(INITIAL_FORM_STATE);
        setSelectedDate("");
        setSelectedTime("");
      } else {
        setFeedback({type:"error",message:""})
      }
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
            // background: "linear-gradient(to bottom right, #4772e1ff, #1b1857ff)",
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
            background: "linear-gradient(to bottom right, #4772e1ff, #1b1857ff)",

              // background: "linear-gradient(135deg, #1976d2 0%, #1565c0 100%)",
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
                    value={formData.department_id}
                    onChange={(e) => {
                      updateFormData("department_id", e.target.value);
                    }}
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
                      <MenuItem
                        key={dept.department_id}
                        value={dept.department_id}
                      >
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
                    value={formData.doctor_id}
                    onChange={(e) =>
                      updateFormData("doctor_id", e.target.value)
                    }
                    disabled={loading || !formData.department_id}
                    required
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Person color="action" />
                        </InputAdornment>
                      ),
                    }}
                    helperText={
                      !formData.department_id
                        ? "Select department first"
                        : formData.department_id && filteredDoctors.length === 0
                        ? "No doctors available for selected department"
                        : ""
                    }
                  >
                    <MenuItem value="">
                      <em>
                        {!formData.department_id
                          ? "Select department first"
                          : "Choose a doctor"}
                      </em>
                    </MenuItem>
                    {filteredDoctors.map((doctor) => (
                      <MenuItem key={doctor.doctor_id} value={doctor.doctor_id}>
                        {doctor.user.first_name} - {doctor.specialization}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>

                <Grid container spacing={2}>
                  {/* Date Selection */}

                  <Grid size={{ xs: 12, md: 6 }}>
                    <TextField
                      fullWidth
                      type="date"
                      label="Appointment Date"
                      value={selectedDate}
                      onChange={(e) => {
                        setSelectedDate(e.target.value);

                        if (selectedTime) {
                          setFormData({
                            ...formData,
                            appointment_date: new Date(
                              `${e.target.value}T${selectedTime}:00`
                            ).toISOString(),
                          });
                        }
                      }}
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
                  {/* Time Picker */}
                  <Grid size={{ xs: 12, md: 6 }}>
                    <TextField
                      select
                      fullWidth
                      label="Appointment Time slot"
                      value={selectedTime}
                      onChange={(e) => {
                        setSelectedTime(e.target.value);
                        if (selectedDate) {
                          setFormData({
                            ...formData,
                            appointment_date: new Date(
                              `${selectedDate}T${e.target.value}:00`
                            ).toString(),
                          });
                        }
                      }}
                      required
                      helperText="Select a time slot"
                      SelectProps={{
                        MenuProps: {
                          PaperProps: {
                            style: {
                              maxHeight: 200, // Set max height (adjust as needed)
                              overflowY: "auto", // Enable vertical scrolling
                            },
                          },
                          TransitionProps: { timeout: 0 }, // Disable animation (optional)
                          disableAutoFocusItem: true, // Prevent focus on hover
                        },
                      }}
                    >
                      <MenuItem value="">
                        <em>Choose a time slot</em>
                      </MenuItem>
                      {timeSlots.map((slot) => (
                        <MenuItem key={slot.value} value={slot.value}>
                          {slot.label}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>
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
                    value={formData.reason_for_visit}
                    onChange={(e) =>
                      updateFormData("reason_for_visit", e.target.value)
                    }
                    disabled={loading}
                    required
                    inputProps={{ maxLength: 500 }}
                    error={
                      formData.reason_for_visit.length > 0 &&
                      formData.reason_for_visit.length < 10
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
                          {formData.reason_for_visit.length < 10 &&
                          formData.reason_for_visit.length > 0
                            ? `Need ${
                                10 - formData.reason_for_visit.length
                              } more characters`
                            : "Minimum 10 characters required"}
                        </span>
                        <span>{formData.reason_for_visit.length}/500</span>
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
