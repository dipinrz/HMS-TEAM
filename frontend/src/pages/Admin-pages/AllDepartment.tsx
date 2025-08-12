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
  Tooltip,
  Divider,
  Badge,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  InputAdornment,
  Modal,
  Stack,
} from "@mui/material";
import { Edit as EditIcon, Delete as DeleteIcon } from "@mui/icons-material";
import { useEffect, useState } from "react";
import CustomButton from "../../components/ui/CustomButton";
import { toast } from "react-toastify";
import {
  addDept,
  deleteDept,
  fetchAllDepartments,
  getAllDoctors,
} from "../../services/adminAPi";
import { SearchIcon } from "lucide-react";

const headCells = [
  { id: "id", numeric: true, label: "Sl.No" },
  { id: "name", numeric: false, label: "Department Name" },
  { id: "description", numeric: false, label: "Description" },
  { id: "consultationFee", numeric: true, label: "Consultation Fee" },
  { id: "headDoctor", numeric: false, label: "Head Doctor" },
  { id: "actions", numeric: false, label: "Actions" },
];

interface dept_data {
  name: string;
  description: string;
  consultation_fee: number;
  head_doctor: number;
}

const AdminDepartmentsPage = () => {
  const [departments, setDepartments] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedDeptId, setSelectedDeptId] = useState<number | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [allDoctors, setAllDoctors] = useState([]);
  const handleOpenModal = () => setIsOpen(true);
  const handleCloseModal = () => setIsOpen(false);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const [formData, setFormData] = useState<dept_data>({
    name: "",
    description: "",
    consultation_fee: 0,
    head_doctor: 0,
  });

  useEffect(() => {
    loadDepartments();
    fetchAllDoctors();
  }, []);

  const loadDepartments = async () => {
    try {
      setIsLoading(true);
      const response = await fetchAllDepartments();
      setDepartments(response.data.data.departments);
      console.log(
        "DEPARTMENTS PAGE=================",
        response.data.data.departments
      );
    } catch (error) {
      toast.error("Couldn't fetch all departments");
      console.error("Error fetching departments:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAllDoctors = async () => {
    try {
      const response = await getAllDoctors();
      console.log("All doctors for admin dept page", response.data.data);
      setAllDoctors(response.data.data);
    } catch (error) {
      toast.error("Couldn't fetch all doctors");
      console.log("Error in fetching all doctors", error);
    }
  };

  const handleOpenDeleteDialog = (id: number) => {
    setSelectedDeptId(id);
    setOpenDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
    setSelectedDeptId(null);
  };

  const handleDeleteDepartment = async () => {
    if (!selectedDeptId) return;

    try {
      await deleteDept(selectedDeptId);
      toast.success("Department deleted successfully");
      handleCloseDeleteDialog();
      loadDepartments();
    } catch (error) {
      toast.error("Failed to delete department");
      console.error("Error deleting department:", error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({
      ...prev,
      [name]:
        name === "consultation_fee" || name === "head_doctorId"
          ? Number(value)
          : value,
    }));
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      await addDept(formData);
      toast.success("Department added successfully");
      loadDepartments;
      setIsOpen(false);
      setFormData({
        name: "",
        description: "",
        consultation_fee: 0,
        head_doctor: 0,
      });
      loadDepartments(); // Refresh table
    } catch (error) {
      console.error(error);
      toast.error("Failed to add department");
    } finally {
      setLoading(false);
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
      <Modal open={isOpen} onClose={handleCloseModal}>
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
            ADD NEW DEPARTMENT
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
              <Stack spacing={2}>
                <Typography
                  variant="subtitle1"
                  sx={{
                    fontWeight: 700,
                    color: "#011d39ff",
                    borderBottom: "2px solid #e3f2fd",
                    pb: 0.5,
                  }}
                >
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
                  />
                  <TextField
                    name="description"
                    label="Description"
                    fullWidth
                    size="small"
                    value={formData.description}
                    onChange={handleChange}
                  />
                </Stack>
                <TextField
                  name="consultation_fee"
                  label="Consultation Fee"
                  fullWidth
                  size="small"
                  value={formData.consultation_fee}
                  onChange={handleChange}
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
                >
                  <option value={0}>Select Head Doctor</option>
                  {allDoctors.map((doc: any) => (
                    <option key={doc.doctor_id} value={doc.doctor_id}>
                      {doc.user.first_name} {doc.user.last_name}
                    </option>
                  ))}
                </TextField>
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
              {loading ? "Submitting..." : "Submit"}
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
          Department Management
        </Typography>

        <Box display="flex" gap={2} mb={3}>
          <TextField
            variant="outlined"
            placeholder="Search department by name or description..."
            size="medium"
            fullWidth
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
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
            onClick={() => setIsOpen(true)}
          >
            ADD DEPARTMENTS
          </Button>
        </Box>

        {/* Data Table */}
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
                      {headCell.label}
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
                  {departments
                    ?.filter(
                      (dept: any) =>
                        dept.name
                          .toLowerCase()
                          .includes(searchTerm.toLowerCase()) ||
                        dept.description
                          .toLowerCase()
                          .includes(searchTerm.toLowerCase())
                    )
                    .map((dept: any, index) => (
                      <TableRow
                        key={dept.department_id}
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

                        <TableCell>{dept.name}</TableCell>

                        <TableCell>
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            noWrap
                            sx={{ maxWidth: 250 }}
                          >
                            {dept.description}
                          </Typography>
                        </TableCell>

                        <TableCell>₹{dept.consultation_fee}</TableCell>

                        <TableCell>
                          {dept?.head_doctor?.user?.first_name}{" "}
                          {dept?.head_doctor?.user?.last_name}
                        </TableCell>

                        <TableCell>
                          <Box display="flex" gap={1}>
                            <Tooltip title="Edit Department" arrow>
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
                            <Tooltip title="Delete Department" arrow>
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
                                  handleOpenDeleteDialog(dept.department_id)
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
              Total Departments: 10
            </Typography>
            <Box>
              <CustomButton
                variant="contained"
                size="small"
                label="Download PDF"
                sx={{ mr: 1, borderRadius: 2 }}
                onClick={() => toast.info("Download PDF not implemented yet")}
              />
            </Box>
          </Box>
        </Paper>
      </Box>

      <Dialog open={openDeleteDialog} onClose={handleCloseDeleteDialog}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          Are you sure you want to delete this department?
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog} color="primary">
            Cancel
          </Button>
          <Button
            onClick={handleDeleteDepartment}
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

export default AdminDepartmentsPage;
