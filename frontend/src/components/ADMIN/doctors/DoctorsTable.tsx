import { Box,Table,TableBody,TableCell,TableContainer,TableHead,TableRow,Typography,Avatar,
  Chip,Tooltip,IconButton,Badge,CircularProgress,Divider,Paper} from "@mui/material";
import { Edit as EditIcon, Delete as DeleteIcon } from "@mui/icons-material";
import CustomButton from "../../ui/CustomButton";

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

interface DoctorsTableProps {
  isLoading: boolean;
  allDoctors: any[];
  searchQuery: string;
  handleEditDoctor: (doctor: any) => void;
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
    (doctor: any) =>
      doctor?.user?.first_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doctor?.user?.last_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doctor?.user?.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doctor?.specialization?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doctor?.license_number?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doctor?.department?.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
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
        <TableContainer sx={{ overflow: "auto" }}>
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
                          {doctor?.department?.name ? (
                            doctor.department.name
                          ) : (
                            <div style={{ color: "red", fontWeight: "bold" }}>
                              N/A
                            </div>
                          )}
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
                                  backgroundColor: "rgba(25, 118, 210, 0.15)",
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
      </Box>

      <Divider />

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
        <Typography variant="subtitle1" fontWeight="bold">
          Total Doctors: {filteredDoctors?.length}
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
  );
};