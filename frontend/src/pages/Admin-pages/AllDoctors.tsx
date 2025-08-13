import {
  Box,
  Button,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  TextField,
  InputAdornment,
  Avatar,
  TableSortLabel,
  Chip,
  Tooltip,
  Divider,
  Badge,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Modal,
  Stack,
  MenuItem,
} from "@mui/material";

import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
} from "@mui/icons-material";
import CustomButton from "../../components/ui/CustomButton";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  deleteDoctor,
  fetchAllDepartments,
  getAllDoctors,
  registerDoctor,
  updateDoctorById,
} from "../../services/adminAPi";

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const headCells = [
  { id: "id", numeric: true, label: "ID" },
  { id: "name", numeric: false, label: "Doctor" },
  { id: "email", numeric: false, label: "Email" },
  { id: "specialization", numeric: false, label: "Specialization" },
  { id: "licenseNo", numeric: false, label: "License No" },
  { id: "department", numeric: false, label: "Department" },
  { id: "joinedOn", numeric: false, label: "Joined On" },
  { id: "actions", numeric: false, label: "Actions" },
];

interface DoctorForm {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  specialization: string;
  qualification: string;
  license_number: string;
  years_of_experience: number;
  department_id: 0;
}

const AdminDoctorsPage = () => {
  const [allDoctors, setAllDoctors] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedDoctorId, setSelectedDoctorId] = useState<number | null>(null);
  const [open, setOpen] = useState(false);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState<any>(null);

  const handleOpenModal = () => setOpen(true);
  const handleCloseModal = () => {
    setOpen(false);
    setIsEditMode(false);
    setSelectedDoctor(null);
    setFormData({
      first_name: "",
      last_name: "",
      email: "",
      password: "",
      specialization: "",
      qualification: "",
      license_number: "",
      years_of_experience: 0,
      department_id: 0,
    });
  };

  const [formData, setFormData] = useState<DoctorForm>({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    specialization: "",
    qualification: "",
    license_number: "",
    years_of_experience: 0,
    department_id: 0,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "years_of_experience" ? Number(value) : value,
    }));
  };

  const downloadPDF = () => {
    const doc = new jsPDF();

    // Title
    doc.setFontSize(16);
    doc.text("Doctors List", 14, 15);

    // Table headers
    const tableColumn = [
      "No.",
      "Name",
      "Email",
      "Specialization",
      "License No.",
      "Department",
      "Created Date",
    ];

    const tableRows = allDoctors.map((doctor: any, index) => [
      index + 1,
      doctor?.user?.first_name || "",
      doctor?.user?.email || "",
      doctor?.specialization || "",
      doctor?.license_number || "",
      doctor?.department?.name || "",
      doctor?.user?.created_at
        ? new Date(doctor.user.created_at).toLocaleDateString()
        : "",
    ]);

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 25,
      styles: {
        fontSize: 10,
        cellPadding: 3,
      },
      headStyles: {
        fillColor: [25, 118, 210],
        textColor: 255,
        fontStyle: "bold",
      },
      alternateRowStyles: {
        fillColor: [240, 240, 240],
      },
    });

    doc.save("doctors.pdf");
  };

  console.log("ALL Doctors==========", allDoctors);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);

      if (isEditMode && selectedDoctor) {
        // update existing doctor
        await updateDoctorById(selectedDoctor.doctor_id, formData);
        toast.success("Doctor updated successfully!");
      } else {
        // create new doctor
        await registerDoctor(formData);
        toast.success("Doctor registered successfully!");
      }

      fetchAllDoctors();
      handleCloseModal();
    } catch (error: any) {
      if (error.response) {
        toast.error(error.response.data.message || "Failed to save doctor");
      } else {
        toast.error("Something went wrong");
      }
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const loadDepartments = async () => {
    try {
      const department = await fetchAllDepartments();
      setDepartments(department.data.data.departments);
    } catch (error) {
      toast.error("Couldn't fetch departments");
      console.log("Error in fetching departments", error);
    }
  };

  useEffect(() => {
    fetchAllDoctors();
    loadDepartments();
  }, []);

  const handleOpenDeleteDialog = (id: number) => {
    setSelectedDoctorId(id);
    setOpenDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
    setSelectedDoctorId(null);
  };

  const handleDeleteDoctor = async () => {
    if (selectedDoctorId === null) return;

    try {
      await deleteDoctor(selectedDoctorId);
      toast.success("Doctor deleted successfully");
      fetchAllDoctors();
      handleCloseDeleteDialog();
    } catch (error: any) {
      toast.error("Couldn't delete doctor");
      console.log("Error in deleting doctor", error);
    }
  };

  const handleEditDoctor = (doctor: any) => {
    setIsEditMode(true);
    setSelectedDoctor(doctor);

    setFormData({
      first_name: doctor.user?.first_name || "",
      last_name: doctor.user?.last_name || "",
      email: doctor.user?.email || "",
      password: "", // leave empty for update unless changing password
      specialization: doctor.specialization || "",
      qualification: doctor.qualification || "",
      license_number: doctor.license_number || "",
      years_of_experience: doctor.years_of_experience || 0,
      department_id: doctor.department?.department_id || 0,
    });

    setOpen(true);
  };

  const fetchAllDoctors = async () => {
    try {
      setIsLoading(true);
      const response = await getAllDoctors();
      setAllDoctors(response.data.data);
    } catch (error: any) {
      toast.error("Could not fetch doctors");
      console.log("Error in fetching all doctors", error);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <Box
      sx={{
        p: 3,
        backgroundColor: "#f8fafc",
        minHeight: "100vh",
        position: "relative",
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "200px",
          background: "rgba(255,255,255,0.1)",
          backdropFilter: "blur(10px)",
          zIndex: 0,
        },
      }}
    >
      <Modal open={open} onClose={handleCloseModal}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 700,
            bgcolor: "#fff",
            borderRadius: 3,
            boxShadow: "0 8px 32px rgba(0,0,0,0.15)",
            overflow: "hidden",
          }}
        >
          {/* Header */}
          <Box
            sx={{
              px: 3,
              py: 2,
              background:
                "linear-gradient(135deg, #020aa5ff 0%, #0a036bff 100%)",
              color: "#fff",
              fontWeight: "bold",
              fontSize: "1.2rem",
            }}
          >
            {isEditMode ? "Edit Doctor" : "Register New Doctor"}
          </Box>

          {/* Body */}
          <Box sx={{ p: 3, bgcolor: "#f5f7fa" }}>
            <Stack
              spacing={3}
              sx={{
                "& .MuiTextField-root": {
                  backgroundColor: "#fff",
                  borderRadius: 1.5,
                },
              }}
            >
              {/* Personal Information */}
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
                  />
                  <TextField
                    name="last_name"
                    label="Last Name"
                    fullWidth
                    size="small"
                    value={formData.last_name}
                    onChange={handleChange}
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
                />
                <TextField
                  name="password"
                  label="Password"
                  type="password"
                  fullWidth
                  size="small"
                  value={formData.password}
                  onChange={handleChange}
                />
              </Stack>

              {/* Professional Information */}
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
                <Stack direction="row" spacing={2}>
                  <TextField
                    select
                    name="department_id"
                    label="Department"
                    fullWidth
                    size="small"
                    value={formData.department_id}
                    onChange={handleChange}
                  >
                    {departments.map((dept: any) => (
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
                  />
                  <TextField
                    name="years_of_experience"
                    label="Years of Experience"
                    type="number"
                    fullWidth
                    size="small"
                    value={formData.years_of_experience}
                    onChange={handleChange}
                  />
                </Stack>
                <TextField
                  name="license_number"
                  label="License Number"
                  fullWidth
                  size="small"
                  value={formData.license_number}
                  onChange={handleChange}
                />
              </Stack>
            </Stack>
          </Box>

          {/* Actions */}
          <Box
            sx={{
              px: 3,
              py: 2,
              bgcolor: "#f5f7fa",
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
              variant="contained"
              onClick={handleSubmit}
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
              {loading ? "Submitting..." : isEditMode ? "Update" : "Submit"}
            </Button>
          </Box>
        </Box>
      </Modal>

      <Box sx={{ position: "relative", zIndex: 1 }}>
        <Typography
          textAlign={"center"}
          variant="h4"
          fontWeight="bold"
          sx={{ mb: 3, color: "#1e293b" }}
        >
          Doctor Management
        </Typography>

        <Box display="flex" gap={2} mb={3}>
          <TextField
            variant="outlined"
            placeholder="Search doctors by name, email, or phone..."
            size="medium"
            fullWidth
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon color="action" />
                </InputAdornment>
              ),
              sx: {
                borderRadius: 3,
                backgroundColor: "white",
                "& .MuiOutlinedInput-root": {
                  "&:hover fieldset": {
                    borderColor: "#1976d2",
                  },
                },
              },
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                transition: "all 0.3s ease",
                "&:hover": {
                  transform: "translateY(-1px)",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                },
              },
            }}
          />

          <Button
            variant="contained"
            size="large"
            sx={{
              borderRadius: 3,
              textTransform: "none",
              px: 4,
              py: 1.5,
              backgroundColor: "#46923c",
              color: "#fff",
              "&:hover": {
                backgroundColor: "#3b8123",
                transform: "translateY(-1px)",
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
              },
              transition: "all 0.3s ease",
              width: 300,
              fontWeight: 600,
              letterSpacing: 0.5,
            }}
            onClick={handleOpenModal}
          >
            ADD DOCTOR
          </Button>
        </Box>

        <Paper
          sx={{
            borderRadius: 4,
            boxShadow: "0px 8px 40px rgba(0, 0, 0, 0.12)",
            background: "rgba(255,255,255,0.98)",
            backdropFilter: "blur(20px)",
            overflow: "hidden",
          }}
        >
          <Box sx={{ width: "100%", overflowX: "auto" }}>
            <TableContainer sx={{ overflow: "hidden" }}>
              <Table
                sx={{
                  minWidth: 1200,
                  tableLayout: "fixed",
                }}
              >
                <TableHead>
                  <TableRow
                    sx={{
                      backgroundColor: "rgba(25, 118, 210, 0.08)",
                      "& .MuiTableCell-head": {
                        borderBottom: "2px solid rgba(25, 118, 210, 0.1)",
                      },
                    }}
                  >
                    {headCells.map((headCell) => (
                      <TableCell
                        key={headCell.id}
                        align="left"
                        sx={{
                          fontWeight: "bold",
                          fontSize: "0.95rem",
                          color: "#1565c0",
                          py: 2,
                          width:
                            headCell.id === "actions"
                              ? "120px"
                              : headCell.id === "email"
                              ? "220px"
                              : headCell.id === "name"
                              ? "200px"
                              : headCell.id === "specialization"
                              ? "180px"
                              : "auto",
                        }}
                      >
                        <TableSortLabel sx={{ color: "#1565c0 !important" }}>
                          {headCell.label}
                        </TableSortLabel>
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                {isLoading ? (
                  <Box
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    height="200px"
                  >
                    <CircularProgress />
                  </Box>
                ) : (
                  <TableBody>
                    {allDoctors
                      ?.filter(
                        (doctor: any) =>
                          doctor?.user?.first_name
                            ?.toLowerCase()
                            .includes(searchQuery.toLowerCase()) ||
                          doctor?.user?.last_name
                            ?.toLowerCase()
                            .includes(searchQuery.toLowerCase()) ||
                          doctor?.user?.email
                            ?.toLowerCase()
                            .includes(searchQuery.toLowerCase()) ||
                          doctor?.specialization
                            ?.toLowerCase()
                            .includes(searchQuery.toLowerCase()) ||
                          doctor?.license_number
                            ?.toLowerCase()
                            .includes(searchQuery.toLowerCase()) ||
                          doctor?.department?.name
                            ?.toLowerCase()
                            .includes(searchQuery.toLowerCase())
                      )
                      .map((doctor: any, index) => (
                        <TableRow
                          key={doctor?.doctor_id}
                          sx={{
                            "&:hover": {
                              backgroundColor: "rgba(25, 118, 210, 0.04)",
                              transform: "scale(1.001)",
                              transition: "all 0.2s ease",
                            },
                            "&:last-child td": { border: 0 },
                            transition: "all 0.2s ease",
                          }}
                        >
                          <TableCell align="left">
                            <Badge badgeContent={index + 1} color="primary">
                              <Box sx={{ width: 20 }} />
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Box display="flex" alignItems="center" gap={2}>
                              <Avatar
                                sx={{
                                  width: 44,
                                  height: 44,
                                  fontWeight: "bold",
                                  fontSize: "0.9rem",
                                }}
                              >
                                {doctor?.user?.first_name
                                  .split(" ")
                                  .map((n: any) => n[0])
                                  .join("")}
                              </Avatar>
                              <Box>
                                <Typography
                                  variant="body1"
                                  fontWeight="600"
                                  color="#2c3e50"
                                >
                                  {doctor?.user?.first_name}
                                </Typography>
                                <Typography
                                  variant="caption"
                                  color="text.secondary"
                                >
                                  ID: {doctor?.doctor_id}
                                </Typography>
                              </Box>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2" color="text.secondary">
                              {doctor?.user?.email}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={doctor?.specialization}
                              size="medium"
                              sx={{
                                fontWeight: "bold",
                                fontSize: "0.8rem",
                                borderRadius: 2,
                                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                              }}
                            />
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2" color="text.secondary">
                              {doctor?.license_number}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2" color="text.secondary">
                              {doctor?.department?.name}
                            </Typography>
                          </TableCell>

                          <TableCell>
                            <Typography variant="body2" color="text.secondary">
                              {doctor?.user?.created_at
                                ? new Date(
                                    doctor.user.created_at
                                  ).toLocaleDateString()
                                : ""}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Box display="flex" gap={1}>
                              <Tooltip title="Edit Doctor" arrow>
                                <IconButton
                                  size="small"
                                  sx={{
                                    color: "#1976d2",
                                    backgroundColor: "rgba(25, 118, 210, 0.08)",
                                    "&:hover": {
                                      backgroundColor:
                                        "rgba(25, 118, 210, 0.15)",
                                      transform: "scale(1.1)",
                                    },
                                    transition: "all 0.2s ease",
                                  }}
                                  onClick={() => handleEditDoctor(doctor)}
                                >
                                  <EditIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Delete Doctor" arrow>
                                <IconButton
                                  size="small"
                                  sx={{
                                    color: "#d32f2f",
                                    backgroundColor: "rgba(211, 47, 47, 0.08)",
                                    "&:hover": {
                                      backgroundColor:
                                        "rgba(211, 47, 47, 0.15)",
                                      transform: "scale(1.1)",
                                    },
                                    transition: "all 0.2s ease",
                                  }}
                                  onClick={() =>
                                    handleOpenDeleteDialog(doctor.doctor_id)
                                  }
                                >
                                  <DeleteIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                            </Box>
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                )}
              </Table>
            </TableContainer>
          </Box>

          <Divider />

          <Box
            sx={{
              display: "flex",
              justifyContent: "space-evenly",
              alignItems: "center",
              px: 3,
              py: 2,
              backgroundColor: "rgba(25,118,210,0.02)",
            }}
          >
            <Typography variant="body2" sx={{ fontWeight: 500 }}>
              Total Doctors: {allDoctors.length}
            </Typography>
            <Box>
              <CustomButton
                variant="contained"
                onClick={downloadPDF}
                size="small"
                sx={{ mr: 1, borderRadius: 2 }}
                label=" Download PDF"
              />
            </Box>
          </Box>
        </Paper>
      </Box>
      <Dialog open={openDeleteDialog} onClose={handleCloseDeleteDialog}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          Are you sure you want to delete this doctor?
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog} color="primary">
            Cancel
          </Button>
          <Button
            onClick={handleDeleteDoctor}
            color="error"
            variant="contained"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdminDoctorsPage;
