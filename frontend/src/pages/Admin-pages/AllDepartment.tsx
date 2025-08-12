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
} from "@mui/material";
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";
import { useEffect, useState } from "react";
import CustomButton from "../../components/ui/CustomButton";
import { toast } from "react-toastify";
import { fetchAllDepartments } from "../../services/adminAPi";

const headCells = [
  { id: "id", numeric: true, label: "Sl.No" },
  { id: "name", numeric: false, label: "Department Name" },
  { id: "description", numeric: false, label: "Description" },
  { id: "consultationFee", numeric: true, label: "Consultation Fee" },
  { id: "headDoctor", numeric: false, label: "Head Doctor" },
  { id: "actions", numeric: false, label: "Actions" },
];



const AdminDepartmentsPage = () => {
  const [departments, setDepartments] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedDeptId, setSelectedDeptId] = useState<number | null>(null);

  const loadDepartments = async () => {
    try {
      setIsLoading(true);
      const response = await fetchAllDepartments();
      setDepartments(response.data.data.departments)
    } catch (error) {
      toast.error("Couldn't fetch all departments");
      console.error("Error fetching departments:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadDepartments();
  }, []);

  const handleOpenDeleteDialog = (id: number) => {
    setSelectedDeptId(id);
    setOpenDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
    setSelectedDeptId(null);
  };

  const handleDeleteDepartment = () => {

    toast.success("Department deleted successfully");
    handleCloseDeleteDialog();
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
      <Box sx={{ position: "relative", zIndex: 1 }}>
        <Typography
          textAlign={"center"}
          variant="h4"
          fontWeight="bold"
          sx={{ mb: 3, color: "#1e293b" }}
        >
          Department Management
        </Typography>

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
                  {departments?.map((dept:any, index) => (
                    <TableRow
                      key={dept?.department_id}
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

                      <TableCell>{dept?.name}</TableCell>

                      <TableCell>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          noWrap
                          sx={{ maxWidth: 250 }}
                        >
                          {dept?.description}
                        </Typography>
                      </TableCell>

                      <TableCell>₹{dept?.consultation_fee}</TableCell>


                      <TableCell>{dept?.head_doctor?.user.first_name}</TableCell>

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
                              onClick={() => handleOpenDeleteDialog(dept.id)}
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
