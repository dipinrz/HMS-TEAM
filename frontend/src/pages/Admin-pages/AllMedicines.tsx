import React, { useEffect, useState } from "react";
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
} from "@mui/material";
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
} from "@mui/icons-material";
import CustomButton from "../../components/ui/CustomButton";
import { addMedicineAPI, deleteMedicineAPI, getMedicineAPI, updateMedicineAPI } from "../../services/medicineAPI";
import { AddMedicineModal } from "../../components/ui/AddMedicineModal";
import { toast } from "react-toastify";
import { EditMedicineModal } from "../../components/ui/EditMedicineModal";

const headCells = [
  { id: "medicine_id", numeric: true, label: "ID" },
  { id: "name", numeric: false, label: "Medicine" },
  { id: "description", numeric: false, label: "Description" },
  { id: "cost", numeric: false, label: "Cost" },
  { id: "expiry_date", numeric: false, label: "Expiry Date" },
  { id: "actions", numeric: false, label: "Actions" },
];

interface medicineType {
  medicine_id: number;
  medicine_name: string;
  description: string;
  cost: number;
  expiry_date: string;
}

interface MedicineFormData {
  medicine_name: string;
  description: string;
  cost: number;
  expiry_date: string;
}

export const AllMedicines: React.FC = () => {
    const [medicines, setMedicines] = useState<medicineType[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [filteredMedicines, setFilteredMedicines] = useState<medicineType[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [currentMedicine, setCurrentMedicine] = useState<medicineType | null>(null);

  const fetchAllMedicine = async () => {
    try {
      const response = await getMedicineAPI();
      setMedicines(response.data.data);
      setFilteredMedicines(response.data.data);
    } catch (error) {
      console.log("Failed to fetch medicines", error);
    }
  };

  const handleSubmit = async (
    data: Omit<MedicineFormData, "cost"> & { cost: number }
  ) => {
    try {
      await addMedicineAPI(data);
      await fetchAllMedicine();
      setIsOpen(false);
      toast.success('Medicine added')
    } catch (error) {
        toast.error('something went wrong');
        console.error("Failed to add medicine", error);
    }
  };

  useEffect(() => {
    fetchAllMedicine();
  }, []);

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredMedicines(medicines);
    } else {
      const filtered = medicines.filter((medicine) =>
        medicine.medicine_name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredMedicines(filtered);
    }
  }, [searchTerm, medicines]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const deleteMedicine = async (id: number) => {
    try {
        await deleteMedicineAPI(id);
        toast.success('Medicine deleted');
        await fetchAllMedicine();
    } catch (error) {
        toast.error('Failed to delete');
        console.log(error, 'Failed to delete medicine');
    }
  }

    const handleEditClick = (medicine: medicineType) => {
        setCurrentMedicine(medicine);
        setEditModalOpen(true);
    };

    const handleEditSubmit = async (data: MedicineFormData) => {
    try {
        await updateMedicineAPI(currentMedicine!.medicine_id, data);
        fetchAllMedicine();
        setEditModalOpen(false);
    } catch (error) {
        console.error('Failed to update medicine', error);
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
          height: "auto",
          background:
            "linear-gradient(135deg, rgba(25,118,210,0.1) 0%, rgba(255,255,255,0.1) 100%)",
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
          sx={{
            mb: 3,
            color: "#1e293b",
            textShadow: "0 1px 2px rgba(0,0,0,0.1)",
          }}
        >
          Medicine Management
        </Typography>

        <Box display="flex" gap={2} mb={3} alignItems="center">
          <TextField
            variant="outlined"
            placeholder="Search Medicine by name..."
            size="medium"
            fullWidth
            value={searchTerm}
            onChange={handleSearchChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon color="action" />
                </InputAdornment>
              ),
              sx: {
                borderRadius: 3,
                backgroundColor: "white",
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#e2e8f0",
                },
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#cbd5e1",
                },
                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#1976d2",
                  borderWidth: "1px",
                },
              },
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                transition: "all 0.3s ease",
                "&:hover": {
                  transform: "translateY(-1px)",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
                },
                "&.Mui-focused": {
                  boxShadow: "0 4px 12px rgba(25, 118, 210, 0.1)",
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
            ADD MEDICINE
          </Button>
        </Box>
        <AddMedicineModal
          open={isOpen}
          onClose={() => setIsOpen(false)}
          onSubmit={handleSubmit}
        />
        <Paper
          sx={{
            borderRadius: 4,
            boxShadow: "0px 8px 40px rgba(0, 0, 0, 0.08)",
            overflow: "hidden",
            background: "rgba(255,255,255,0.98)",
            mt: 3,
            backdropFilter: "blur(20px)",
            border: "1px solid rgba(0, 0, 0, 0.05)",
          }}
        >
          <TableContainer
            sx={{
              overflowX: "auto",
              maxHeight: "calc(100vh - 300px)",
              "&::-webkit-scrollbar": {
                height: "8px",
                width: "8px",
              },
              "&::-webkit-scrollbar-thumb": {
                backgroundColor: "#cbd5e1",
                borderRadius: "4px",
              },
              "&::-webkit-scrollbar-track": {
                backgroundColor: "#f1f5f9",
              },
            }}
          >
            <Table stickyHeader>
              <TableHead>
                <TableRow
                  sx={{
                    backgroundColor: "rgba(25, 118, 210, 0.08)",
                    "& .MuiTableCell-head": {
                      borderBottom: "2px solid rgba(25, 118, 210, 0.1)",
                    },
                  }}
                >
<<<<<<< Updated upstream
                  {headCells.map((headCell) => (
                    <TableCell
                      key={headCell.id}
                      align={headCell.numeric ? "right" : "left"}
                      sx={{
                        fontWeight: "bold",
                        fontSize: "0.95rem",
                        color: "#1565c0",
                        py: 2,
                        whiteSpace: "nowrap",
                      }}
=======
                    Medicine Management
                </Typography>
                
                

                <Box display="flex" gap={2} mb={3} alignItems="center">
                    <TextField
                        variant="outlined"
                        placeholder="Search Medicine by name..."
                        size="medium"
                        fullWidth
                        value={searchTerm}
                        onChange={handleSearchChange}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon color="action" />
                                </InputAdornment>
                            ),
                            sx: {
                                borderRadius: 3,
                                backgroundColor: "white",
                                "& .MuiOutlinedInput-notchedOutline": {
                                    borderColor: "#e2e8f0",
                                },
                                "&:hover .MuiOutlinedInput-notchedOutline": {
                                    borderColor: "#cbd5e1",
                                },
                                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                                    borderColor: "#1976d2",
                                    borderWidth: "1px",
                                },
                            },
                        }}
                        sx={{
                            "& .MuiOutlinedInput-root": {
                                transition: "all 0.3s ease",
                                "&:hover": {
                                    transform: "translateY(-1px)",
                                    boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
                                },
                                "&.Mui-focused": {
                                    boxShadow: "0 4px 12px rgba(25, 118, 210, 0.1)",
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
                            color: '#fff',
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
>>>>>>> Stashed changes
                    >
                      <TableSortLabel
                        sx={{
                          color: "inherit !important",
                          "&:hover": {
                            color: "#0d47a1 !important",
                          },
                        }}
                      >
                        {headCell.label}
                      </TableSortLabel>
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredMedicines.length > 0 ? (
                  filteredMedicines.map((medicine, index) => (
                    <TableRow
                      key={medicine.medicine_id}
                      sx={{
                        "&:hover": {
                          backgroundColor: "rgba(25, 118, 210, 0.04)",
                        },
                        "&:last-child td": { border: 0 },
                        transition: "all 0.2s ease",
                      }}
                    >
                      <TableCell align="right">
                        <Badge
                          badgeContent={index + 1}
                          color="primary"
                          sx={{
                            "& .MuiBadge-badge": {
                              right: 10,
                              top: 0,
                              fontWeight: 600,
                            },
                          }}
                        >
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
                              backgroundColor: "rgba(25, 118, 210, 0.1)",
                              color: "#1976d2",
                            }}
                          >
                            {medicine.medicine_name
                              .split(" ")
                              .map((n: string) => n[0])
                              .join("")}
                          </Avatar>
                          <Box>
                            <Typography
                              variant="body1"
                              fontWeight="600"
                              color="#2c3e50"
                            >
                              {medicine.medicine_name}
                            </Typography>
                            <Typography
                              variant="caption"
                              color="text.secondary"
                            >
                              ID: {medicine.medicine_id}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{
                            display: "-webkit-box",
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: "vertical",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                        >
                          {medicine.description || "No description"}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={`₹${medicine.cost}`}
                          size="medium"
                          sx={{
                            fontWeight: "bold",
                            fontSize: "0.8rem",
                            borderRadius: 2,
                            boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                            backgroundColor: "rgba(74, 222, 128, 0.1)",
                            color: "#15803d",
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <Typography
                          sx={{
                            color:
                              new Date(medicine.expiry_date) < new Date()
                                ? "#dc2626"
                                : "inherit",
                            fontWeight:
                              new Date(medicine.expiry_date) < new Date()
                                ? 600
                                : "inherit",
                          }}
                        >
                          {medicine?.expiry_date
                            ? new Date(
                                medicine.expiry_date
                              ).toLocaleDateString()
                            : "N/A"}
                        </Typography>
                      </TableCell>

                      <TableCell>
                        <Box display="flex" gap={1}>
                          <Tooltip title="Edit Medicine" arrow>
                                <IconButton
                                    size="small"
                                    onClick={() => handleEditClick(medicine)}
                                    sx={{
                                    color: "#1976d2",
                                    backgroundColor: "rgba(25, 118, 210, 0.08)",
                                    "&:hover": {
                                        backgroundColor: "rgba(25, 118, 210, 0.15)",
                                    },
                                    transition: "all 0.2s ease",
                                    }}
                                >
                                    <EditIcon fontSize="small" />
                                </IconButton>
                            </Tooltip>
                          <Tooltip onClick={() => deleteMedicine(medicine.medicine_id)} title="Delete Medicine" arrow>
                            <IconButton
                              size="small"
                              sx={{
                                color: "#d32f2f",
                                backgroundColor: "rgba(211, 47, 47, 0.08)",
                                "&:hover": {
                                  backgroundColor: "rgba(211, 47, 47, 0.15)",
                                },
                                transition: "all 0.2s ease",
                              }}
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                      <Typography variant="body1" color="text.secondary">
                        No medicines found matching your search
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>\

          <EditMedicineModal
            open={editModalOpen}
            onClose={() => setEditModalOpen(false)}
            onSubmit={handleEditSubmit}
            medicineData={currentMedicine}
            />

          <Divider sx={{ borderColor: "rgba(0, 0, 0, 0.05)" }} />

          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              px: 3,
              py: 2,
              backgroundColor: "rgba(25,118,210,0.02)",
            }}
          >
            <Typography
              variant="body2"
              sx={{ fontWeight: 500, color: "#64748b" }}
            >
              {/* Showing {filteredMedicines.length} of {medicines.length} medicines */}
            </Typography>
            <Box>
              <CustomButton
                variant="outlined"
                size="small"
                label="Download PDF"
                sx={{
                  mr: 1,
                  borderRadius: 2,
                  color: "#1976d2",
                  borderColor: "rgba(25, 118, 210, 0.5)",
                  "&:hover": {
                    borderColor: "#1976d2",
                    backgroundColor: "rgba(25, 118, 210, 0.04)",
                  },
                }}
              />
            </Box>
          </Box>
        </Paper>
      </Box>
    </Box>
  );
};
