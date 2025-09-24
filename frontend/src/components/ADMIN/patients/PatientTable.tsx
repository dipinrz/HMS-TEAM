import {Table,TableBody,TableCell,TableContainer,TableHead,TableRow,TableSortLabel,Avatar,Typography,
  Box,Chip,IconButton,Tooltip,Badge,Button,Paper,Divider} from "@mui/material";
import { Delete as DeleteIcon } from "@mui/icons-material";

interface PatientUser {
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string | null;
  created_at: string;
}

export interface Patient {
  patient_id: number;
  blood_group: string | null;
  user: PatientUser;
}

interface PatientTableProps {
  patients: Patient[];
  isLoading: boolean;
  onDeleteClick: (id: number) => void;
  onDownloadPDF: () => void;
}

const headCells = [
  { id: "patientId", numeric: true, label: "ID" },
  { id: "name", numeric: false, label: "Patient" },
  { id: "email", numeric: false, label: "Email" },
  { id: "bloodGroup", numeric: false, label: "Blood Group" },
  { id: "phoneNumber", numeric: false, label: "Phone" },
  { id: "createdAt", numeric: false, label: "Joined Date" },
  { id: "actions", numeric: false, label: "Actions" },
];

const PatientTable = ({
  patients,
  onDeleteClick,
  onDownloadPDF,
}: PatientTableProps) => {
  return (
    <Paper
      sx={{
        borderRadius: 4,
        boxShadow: "0px 8px 40px rgba(0, 0, 0, 0.08)",
        overflow: "hidden",
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
          <TableHead
            sx={{
              "& .MuiTableCell-head": {
                backgroundColor: "rgba(202, 225, 247, 0.99)",
                borderBottom: "2px solid rgba(25, 118, 210, 0.1)",
              },
            }}
          >
            <TableRow>
              {headCells.map((headCell) => (
                <TableCell
                  key={headCell.id}
                  align={headCell.numeric ? "right" : "left"}
                  sx={{
                    backgroundColor: "#f5f5f5",
                    fontWeight: "bold",
                    fontSize: "0.95rem",
                    color: "#1565c0",
                    py: 2,
                    whiteSpace: "nowrap",
                  }}
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
            {patients.length > 0 ? (
              patients.map((patient, index) => (
                <TableRow
                  key={patient.patient_id}
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
                        {`${patient.user.first_name} ${patient.user.last_name}`
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
                      {patient.user.email}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={patient.blood_group || "N/A"}
                      size="medium"
                      sx={{
                        fontWeight: "bold",
                        fontSize: "0.8rem",
                        borderRadius: 2,
                        boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                        backgroundColor: patient.blood_group 
                          ? "rgba(239, 68, 68, 0.1)" 
                          : "rgba(156, 163, 175, 0.1)",
                        color: patient.blood_group ? "#dc2626" : "#6b7280",
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Typography
                      sx={{
                        color: patient.user.phone_number ? "inherit" : "#dc2626",
                        fontWeight: patient.user.phone_number ? "inherit" : 600,
                        fontStyle: patient.user.phone_number ? "normal" : "italic",
                      }}
                    >
                      {patient.user.phone_number || "N/A"}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography>
                      {new Date(patient.user.created_at).toLocaleDateString()}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Box display="flex" gap={1}>
                      <Tooltip title="Delete Patient" arrow>
                        <IconButton
                          size="small"
                          onClick={() => onDeleteClick(patient.patient_id)}
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
                <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                  <Typography variant="body1" color="text.secondary">
                    No patients found matching your search
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Divider sx={{ borderColor: "rgba(0, 0, 0, 0.05)" }} />

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          px: 3,
          py: 2,
          backgroundColor: "#f9fafb",
        }}
      >
        <Typography
          variant="subtitle1"
          sx={{ fontWeight: "bold", color: "#1f2937" }}
        >
          Total Patients: {patients.length}
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={onDownloadPDF}
          sx={{
            textTransform: "none",
            borderRadius: 2,
            boxShadow: "none",
            "&:hover": {
              boxShadow: 2,
            },
          }}
        >
          Download PDF
        </Button>
      </Box>
    </Paper>
  );
};

export default PatientTable;