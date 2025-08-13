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
  Delete as DeleteIcon,
  Search as SearchIcon,
} from "@mui/icons-material";
import CustomButton from "../../components/ui/CustomButton";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";
import { deletePatient, getAllPatients } from "../../services/adminAPi";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const headCells = [
  { id: "userId", numeric: true, label: "Sl.No" },
  { id: "name", numeric: false, label: "Patient" },
  { id: "email", numeric: false, label: "Email" },
  { id: "bloodGroup", numeric: false, label: "Blood Group" },
  { id: "phoneNumber", numeric: false, label: "Phone" },
  { id: "createdAt", numeric: false, label: "Joined Date" },
  { id: "actions", numeric: false, label: "Actions" },
];

const AdminPatientsPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [allPatients, setAllPatients] = useState([]);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedPatientId, setSelectedPatientId] = useState<number | null>(
    null
  );

  useEffect(() => {
    fetchAllPatients();
  }, []);

  const downloadPatientsPDF = () => {
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.setTextColor(40);
    doc.text("Patient List", 14, 15);

    const tableColumn = [
      "#",
      "Patient Name",
      "Email",
      "Blood Group",
      "Phone",
      "Joined Date",
    ];

    const tableRows = allPatients.map((patient: any, index: number) => [
      index + 1,
      `${patient.user.first_name} ${patient.user.last_name}`,
      patient.user.email,
      patient.blood_group,
      patient.user.phone_number || "N/A",
      new Date(patient.user.created_at).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      }),
    ]);

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 25,
      theme: "striped",
      styles: { fontSize: 10, cellPadding: 3 },
      headStyles: {
        fillColor: [25, 118, 210],
        textColor: 255,
        fontSize: 11,
      },
      alternateRowStyles: { fillColor: [240, 240, 240] },
      columnStyles: {
        0: { cellWidth: 15, halign: "center" },
        1: { cellWidth: 40 },
        2: { cellWidth: 45 },
        3: { cellWidth: 20, halign: "center" },
        4: { cellWidth: 30 },
        5: { cellWidth: 30 },
      },
    });

    doc.save("patients.pdf");
  };

  const handleOpenDeleteDialog = (id: number) => {
    setSelectedPatientId(id);
    setOpenDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
    setSelectedPatientId(null);
  };

  const fetchAllPatients = async () => {
    try {
      setIsLoading(true);
      const response = await getAllPatients();
      console.log(response)
      setAllPatients(response.data.patients);
    } catch (error) {
      toast.error("Could fetch patients");
      console.log("Error in fetching patients:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeletePatient = async () => {
    if (selectedPatientId === null) return;

    try {
      await deletePatient(selectedPatientId);
      toast.success("Patient deleted successfully");
      fetchAllPatients();
      handleCloseDeleteDialog();
    } catch (error: any) {
      toast.error("Couldn't delete patient");
      console.log("Error in deleting patient", error);
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
      <Box sx={{ position: "relative", zIndex: 1 }}>
        <Typography
          textAlign={"center"}
          variant="h4"
          fontWeight="bold"
          sx={{ mb: 3, color: "#1e293b" }}
        >
          Patient Management
        </Typography>
        {/* Search and Filter */}
        <Box display="flex" gap={2} mb={3}>
          <TextField
            variant="outlined"
            placeholder="Search patients by name, email, or phone..."
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
                  {allPatients.map((patient: any, index) => (
                    <TableRow
                      key={patient.patient_id}
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
                            {`${patient.user.first_name} ${patient.user.last_name}`
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </Avatar>
                          <Box>
                            <Typography
                              variant="body1"
                              fontWeight="600"
                              color="#2c3e50"
                            >
                              {patient.user.first_name} {patient.user.last_name}
                            </Typography>
                            <Typography
                              variant="caption"
                              color="text.secondary"
                            >
                              ID: {patient.patient_id}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>

                      <TableCell>
                        <Typography variant="body2" color="text.secondary">
                          {patient.user.email}
                        </Typography>
                      </TableCell>

                      <TableCell>
                        <Chip
                          label={
                            patient.blood_group ? (
                              patient.blood_group
                            ) : (
                              <div style={{ color: "red", fontWeight: "bold" }}>
                                N/A
                              </div>
                            )
                          }
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
                          {patient.user.phone_number ? (
                            patient.user.phone_number
                          ) : (
                            <div style={{ color: "red", fontWeight: "bold" }}>
                              N/A
                            </div>
                          )}
                        </Typography>
                      </TableCell>

                      <TableCell>
                        <Typography variant="body2" color="text.secondary">
                          {new Date(patient.user.created_at).toLocaleDateString(
                            "en-US",
                            {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            }
                          )}
                        </Typography>
                      </TableCell>

                      <TableCell>
                        <Box display="flex" gap={1}>
                          <Tooltip title="Delete Patient" arrow>
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
                                handleOpenDeleteDialog(patient.patient_id)
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
              Total Patients: {allPatients.length}
            </Typography>
            <Box>
              <CustomButton
                variant="contained"
                size="small"
                label="Download PDF"
                sx={{ mr: 1, borderRadius: 2 }}
                onClick={downloadPatientsPDF}
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
            onClick={handleDeletePatient}
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

export default AdminPatientsPage;
