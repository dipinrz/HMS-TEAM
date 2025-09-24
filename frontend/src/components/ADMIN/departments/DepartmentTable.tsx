import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Badge,
  Typography,
  IconButton,
  Button,
  Divider,
  TableSortLabel,
  Avatar,
  Chip,
} from "@mui/material";
import { Edit as EditIcon, Delete as DeleteIcon } from "@mui/icons-material";

const headCells = [
  { id: "department_id", numeric: true, label: "ID" },
  { id: "name", numeric: false, label: "Department" },
  { id: "description", numeric: false, label: "Description" },
  { id: "consultationFee", numeric: false, label: "Consultation Fee" },
  { id: "headDoctor", numeric: false, label: "Head Doctor" },
  { id: "actions", numeric: false, label: "Actions" },
];

interface Props {
  departments: Department[];
  searchTerm: string;
  onEdit: (dept: Department) => void;
  onDelete: (id: number) => void;
  onDownloadPDF: () => void;
}

interface DoctorUser {
  first_name: string;
  last_name: string;
}

interface Doctor {
  doctor_id: number;
  user: DoctorUser;
}

export interface Department {
  department_id: number;
  name: string;
  description: string;
  consultation_fee: number;
  head_doctor: Doctor | null;
}

export default function DepartmentTable({
  departments,
  searchTerm,
  onEdit,
  onDelete,
  onDownloadPDF,
}: Props) {
  const filtered = departments.filter(
    (dept) =>
      dept.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dept.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
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
            {filtered.length > 0 ? (
              filtered.map((dept, index) => (
                <TableRow
                  key={dept.department_id}
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
                        {dept.name
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
                          {dept.name}
                        </Typography>
                        <Typography
                          variant="caption"
                          color="text.secondary"
                        >
                          ID: {dept.department_id}
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
                      {dept.description || "No description"}
                    </Typography>
                  </TableCell>
                  
                  <TableCell>
                    <Chip
                      label={`₹${dept.consultation_fee}`}
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
                        color: dept.head_doctor?.user ? "inherit" : "#dc2626",
                        fontWeight: dept.head_doctor?.user ? "inherit" : 600,
                        fontStyle: dept.head_doctor?.user ? "normal" : "italic",
                      }}
                    >
                      {dept.head_doctor?.user?.first_name &&
                      dept.head_doctor?.user?.last_name
                        ? `${dept.head_doctor.user.first_name} ${dept.head_doctor.user.last_name}`
                        : "N/A"}
                    </Typography>
                  </TableCell>
                  
                  <TableCell>
                    <Box display="flex" gap={1}>
                      <Tooltip title="Edit Department" arrow>
                        <IconButton
                          size="small"
                          onClick={() => onEdit(dept)}
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
                      <Tooltip title="Delete Department" arrow>
                        <IconButton
                          size="small"
                          onClick={() => onDelete(dept.department_id)}
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
                    No departments found matching your search
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
          backgroundColor: "rgba(25,118,210,0.02)",
        }}
      >
        <Typography
          variant="body2"
          sx={{ fontWeight: 500, color: "#64748b" }}
        >
          {/* Showing {filtered.length} of {departments.length} departments */}
        </Typography>
        <Box>
          <Button
            variant="contained"
            size="small"
            onClick={onDownloadPDF}
            sx={{
              mr: 1,
              borderRadius: 2,
              color: "#eaedf7ff",
              borderColor: "rgba(25, 118, 210, 0.5)",
              "&:hover": {
                borderColor: "#1976d2",
                backgroundColor: "rgba(1, 1, 139, 0.88)",
              },
            }}
          >
            Download PDF
          </Button>
        </Box>
      </Box>
    </Paper>
  );
}