import {Box,Button,IconButton,Paper,Table,TableBody,TableCell,TableContainer,TableHead,
  TableRow,  Typography,TextField,InputAdornment,Avatar,TableSortLabel,
  Chip,Tooltip,Divider,Badge,} from "@mui/material";
import {Edit as EditIcon,Delete as DeleteIcon,Search as SearchIcon,
} from "@mui/icons-material";
import { FilterIcon } from "lucide-react";
import CustomButton from "../../components/ui/CustomButton";

const dummyPatients = [
  {
    userId: 1,
    name: "John Doe",
    email: "john.doe@example.com",
    bloodGroup: "A+",
    phoneNumber: "+91 9876543210",
    createdAt: "2025-01-10",
    status: "active",
  },
  {
    userId: 2,
    name: "Jane Smith",
    email: "jane.smith@example.com",
    bloodGroup: "B-",
    phoneNumber: "+91 9988776655",
    createdAt: "2025-02-15",
    status: "active",
  },
  {
    userId: 3,
    name: "Robert Johnson",
    email: "robert.johnson@example.com",
    bloodGroup: "O+",
    phoneNumber: "+91 9123456780",
    createdAt: "2025-03-20",
    status: "inactive",
  },
  {
    userId: 4,
    name: "Emily Davis",
    email: "emily.davis@example.com",
    bloodGroup: "AB+",
    phoneNumber: "+91 9456781230",
    createdAt: "2025-04-05",
    status: "active",
  },
  {
    userId: 5,
    name: "Michael Wilson",
    email: "michael.wilson@example.com",
    bloodGroup: "A-",
    phoneNumber: "+91 9789456123",
    createdAt: "2025-05-12",
    status: "active",
  },
];

const headCells = [
  { id: "userId", numeric: true, label: "ID" },
  { id: "name", numeric: false, label: "Patient" },
  { id: "email", numeric: false, label: "Email" },
  { id: "bloodGroup", numeric: false, label: "Blood Group" },
  { id: "phoneNumber", numeric: false, label: "Phone" },
  { id: "createdAt", numeric: false, label: "Joined Date" },
  { id: "actions", numeric: false, label: "Actions" },
];

const AdminPatientsPage = () => {
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
        textAlign={'center'}
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
                      align={headCell.numeric ? "right" : "left"}
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
              <TableBody>
                {dummyPatients.map((patient, __) => (
                  <TableRow
                    key={patient.userId}
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
                    <TableCell align="right">
                      <Badge
                        badgeContent={patient.userId}
                        color="primary"
                        sx={{
                          "& .MuiBadge-badge": {
                            right: -3,
                            top: 13,
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
                          }}
                        >
                          {patient.name
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
                            {patient.name}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            ID: {patient.userId}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" color="text.secondary">
                        {patient.email}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={patient.bloodGroup}
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
                        {patient.phoneNumber}
                      </Typography>
                    </TableCell>

                    <TableCell>
                      <Typography variant="body2" color="text.secondary">
                        {new Date(patient.createdAt).toLocaleDateString(
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
                        <Tooltip title="Edit Patient" arrow>
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
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
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
              Total Patients: {dummyPatients.length}
            </Typography>
            <Box>
              <CustomButton
                variant="contained"
                size="small"
                label="Download PDF"
                sx={{ mr: 1, borderRadius: 2 }}
              />

            </Box>
          </Box>
        </Paper>
      </Box>
    </Box>
  );
};

export default AdminPatientsPage;
