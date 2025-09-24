import {Box,Table,TableBody,TableCell,TableContainer,TableHead,TableRow,Typography,Avatar,Chip,
  Tooltip,IconButton,Badge,CircularProgress,Divider,Paper,TableSortLabel,Button} from "@mui/material";
import { Edit as EditIcon, Delete as DeleteIcon } from "@mui/icons-material";

const headCells = [
  { id: "doctor_id", numeric: true, label: "ID" },
  { id: "name", numeric: false, label: "Doctor" },
  { id: "email", numeric: false, label: "Email" },
  { id: "specialization", numeric: false, label: "Specialization" },
  { id: "licenseNo", numeric: false, label: "License No" },
  { id: "department", numeric: false, label: "Department" },
  { id: "joinedOn", numeric: false, label: "Joined On" },
  { id: "actions", numeric: false, label: "Actions" },
];

interface DoctorUser {
  first_name: string;
  last_name: string;
  email: string;
  created_at: string;
}

interface Department {
  department_id: number;
  name: string;
}

export interface Doctor {
  doctor_id: number;
  specialization: string;
  license_number: string;
  department: Department | null;
  user: DoctorUser;
}

interface DoctorsTableProps {
  isLoading: boolean;
  allDoctors: Doctor[];
  searchQuery: string;
  handleEditDoctor: (doctor: Doctor) => void;
  handleOpenDeleteDialog: (id: number) => void;
  downloadPDF: () => void;
}

export const DoctorsTable = ({
  isLoading,
  allDoctors,
  searchQuery,
  handleEditDoctor,
  handleOpenDeleteDialog,
  downloadPDF,
}: DoctorsTableProps) => {
  const filteredDoctors = allDoctors?.filter(
    (doctor) =>
      doctor?.user?.first_name
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      doctor?.user?.last_name
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      doctor?.user?.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doctor?.specialization
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      doctor?.license_number
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      doctor?.department?.name
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase())
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
            {filteredDoctors && filteredDoctors.length > 0 ? (
              filteredDoctors.map((doctor, index) => (
                <TableRow
                  key={doctor.doctor_id}
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
                        {`${doctor.user.first_name} ${doctor.user.last_name}`
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
                          {doctor.user.first_name} {doctor.user.last_name}
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
                        boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                        backgroundColor: "rgba(74, 222, 128, 0.1)",
                        color: "#15803d",
                      }}
                    />
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
                      {doctor.license_number}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography
                      sx={{
                        color: doctor.department?.name ? "inherit" : "#dc2626",
                        fontWeight: doctor.department?.name ? "inherit" : 600,
                        fontStyle: doctor.department?.name ? "normal" : "italic",
                      }}
                    >
                      {doctor.department?.name || "N/A"}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography>
                      {doctor.user.created_at
                        ? new Date(doctor.user.created_at).toLocaleDateString(
                            "en-US",
                            {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            }
                          )
                        : "N/A"}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Box display="flex" gap={1}>
                      <Tooltip title="Edit Doctor" arrow>
                        <IconButton
                          size="small"
                          onClick={() => handleEditDoctor(doctor)}
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
                      <Tooltip title="Delete Doctor" arrow>
                        <IconButton
                          size="small"
                          onClick={() => handleOpenDeleteDialog(doctor.doctor_id)}
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
                <TableCell colSpan={8} align="center" sx={{ py: 4 }}>
                  {isLoading ? (
                    <CircularProgress size={60} sx={{ color: "#1976d2" }} />
                  ) : (
                    <Typography variant="body1" color="text.secondary">
                      No doctors found matching your search
                    </Typography>
                  )}
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
          {/* Showing {filteredDoctors.length} of {allDoctors.length} doctors */}
        </Typography>
        <Box>
          <Button
            variant="contained"
            size="small"
            onClick={downloadPDF}
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
};