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
} from "@mui/material";
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
} from "@mui/icons-material";
import { FilterIcon } from "lucide-react";
import CustomButton from "../../components/ui/CustomButton";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { deleteDoctor, getAllDoctors } from "../../services/adminAPi";

const headCells = [
  { id: "id", numeric: true, label: "ID" },
  { id: "name", numeric: false, label: "Doctor" },
  { id: "email", numeric: false, label: "Email" },
  { id: "specialization", numeric: false, label: "Specialization" },
  { id: "licenseNo", numeric: false, label: "License No" },
  { id: "department", numeric: false, label: "Department" },
  { id: "phone", numeric: false, label: "Phone" },
  { id: "joinedOn", numeric: false, label: "Joined On" },
  { id: "actions", numeric: false, label: "Actions" },
];

const AdminDoctorsPage = () => {
  const [allDoctors, setAllDoctors] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedDoctorId, setSelectedDoctorId] = useState<number | null>(null);

  useEffect(() => {
    fetchAllDoctors();
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
      toast.success("Patient deleted successfully");
      fetchAllDoctors();
      handleCloseDeleteDialog();
    } catch (error: any) {
      toast.error("Couldn't delete doctor");
      console.log("Error in deleting doctor", error);
    }
  };

  const fetchAllDoctors = async () => {
    try {
      setIsLoading(true);
      const response = await getAllDoctors();
      console.log(response.data);
      setAllDoctors(response.data.data);
    } catch (error: any) {
      toast.error("Could not fetch doctors");
      console.log("Error in fetching all doctors", error);
    } finally {
      setIsLoading(false);
    }
  };

  console.log(allDoctors);
  return (
    <Box
      sx={{
        p: 3,
        backgroundColor: "#f8fafc",
        minHeight: "100vh",
        position: "relative",
        overflowX: "hidden",
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
            variant="outlined"
            size="large"
            startIcon={<FilterIcon />}
            sx={{
              borderRadius: 3,
              textTransform: "none",
              px: 4,
              backgroundColor: "white",
              borderColor: "#e0e0e0",
              color: "#666",
              "&:hover": {
                backgroundColor: "#f5f5f5",
                borderColor: "#1976d2",
                transform: "translateY(-1px)",
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
              },
              transition: "all 0.3s ease",
            }}
          >
            Advanced Filters
          </Button>
        </Box>

        <Paper
          sx={{
            borderRadius: 4,
            boxShadow: "0px 8px 40px rgba(0, 0, 0, 0.12)",
            overflow: "hidden",
            background: "rgba(255,255,255,0.98)",
            backdropFilter: "blur(20px)",
          }}
        >
          <TableContainer sx={{ overflowX: "hidden" }}>
            <Table>
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
                  {allDoctors.map((doctor: any, index) => (
                    <TableRow
                      key={doctor.doctor_id}
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
                            {doctor.user.first_name
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
                              {doctor.user.first_name}
                            </Typography>
                            <Typography
                              variant="caption"
                              color="text.secondary"
                            >
                              ID: {doctor.doctor_id}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" color="text.secondary">
                          {doctor.user.email}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={doctor.specialization}
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
                          {doctor.license_number}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" color="text.secondary">
                          {doctor.department.name}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" color="text.secondary">
                          {doctor.user.phone_number
                            ? doctor.user.phone_number
                            : "N/A"}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" color="text.secondary">
                          {doctor.user.created_at}
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
                                  backgroundColor: "rgba(25, 118, 210, 0.15)",
                                  transform: "scale(1.1)",
                                },
                                transition: "all 0.2s ease",
                              }}
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
                                  backgroundColor: "rgba(211, 47, 47, 0.15)",
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
          Are you sure you want to delete this patient?
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
