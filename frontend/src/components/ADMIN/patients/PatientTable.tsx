import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  Avatar,
  Typography,
  Box,
  Chip,
  IconButton,
  Tooltip,
  Badge,
  CircularProgress,
} from "@mui/material";
import { Delete as DeleteIcon } from "@mui/icons-material";

interface PatientTableProps {
  patients: any[];
  isLoading: boolean;
  onDeleteClick: (id: number) => void;
}

const headCells = [
  { id: "userId", label: "Sl.No" },
  { id: "name", label: "Patient" },
  { id: "email", label: "Email" },
  { id: "bloodGroup", label: "Blood Group" },
  { id: "phoneNumber", label: "Phone" },
  { id: "createdAt", label: "Joined Date" },
  { id: "actions", label: "Actions" },
];

const PatientTable = ({
  patients,
  isLoading,
  onDeleteClick,
}: PatientTableProps) => {
  return (
    <TableContainer sx={{ overflowX: "auto" }}>
      <Table sx={{ minWidth: 650 }}>
        <TableHead>
          <TableRow sx={{ backgroundColor: "rgba(25, 118, 210, 0.08)" }}>
            {headCells.map((headCell) => (
              <TableCell
                key={headCell.id}
                sx={{ fontWeight: "bold", color: "#1565c0" }}
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
            {patients.map((patient: any, index) => (
              <TableRow key={patient.patient_id}>
                <TableCell>
                  <Badge badgeContent={index + 1} color="primary">
                    <Box sx={{ width: 20 }} />
                  </Badge>
                </TableCell>
                <TableCell>
                  <Box display="flex" alignItems="center" gap={2}>
                    <Avatar>
                      {`${patient.user.first_name} ${patient.user.last_name}`
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </Avatar>
                    <Box>
                      <Typography fontWeight="600">
                        {patient.user.first_name} {patient.user.last_name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        ID: {patient.patient_id}
                      </Typography>
                    </Box>
                  </Box>
                </TableCell>
                <TableCell>{patient.user.email}</TableCell>
                <TableCell>
                  <Chip label={patient.blood_group || <div style={{color:"red"}}><em>N/A</em></div>} />
                </TableCell>
                <TableCell>{patient.user.phone_number || <div style={{color:"red"}}><em>N/A</em></div>}</TableCell>
                <TableCell>
                  {new Date(patient.user.created_at).toLocaleDateString(
                    "en-US",
                    {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    }
                  )}
                </TableCell>
                <TableCell>
                  <Tooltip title="Delete Patient">
                    <IconButton
                      onClick={() => onDeleteClick(patient.patient_id)}
                    >
                      <DeleteIcon fontSize="small" color="error" />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        )}
      </Table>
    </TableContainer>
  );
};

export default PatientTable;
