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
} from "@mui/material";
import { Edit as EditIcon, Delete as DeleteIcon } from "@mui/icons-material";

const headCells = [
  { id: "id", label: "Sl.No" },
  { id: "name", label: "Department Name" },
  { id: "description", label: "Description" },
  { id: "consultationFee", label: "Consultation Fee" },
  { id: "headDoctor", label: "Head Doctor" },
  { id: "actions", label: "Actions" },
];

interface Props {
  departments: any[];
  searchTerm: string;
  onEdit: (dept: any) => void;
  onDelete: (id: number) => void;
  onDownloadPDF: () => void;
}

export default function DepartmentTable({
  departments,
  searchTerm,
  onEdit,
  onDelete,
  onDownloadPDF,
}: Props) {
  const filtered = departments.filter(
    (dept: any) =>
      dept.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dept.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Paper sx={{ borderRadius: 4, overflow: "hidden" }}>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: "rgba(25, 118, 210, 0.08)" }}>
              {headCells.map((head) => (
                <TableCell
                  key={head.id}
                  sx={{ fontWeight: "bold", color: "#1565c0" }}
                >
                  {head.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>

          <TableBody>
            {filtered.map((dept: any, index: number) => (
              <TableRow
                key={dept.department_id}
                sx={{
                  "&:hover": { backgroundColor: "rgba(25, 118, 210, 0.04)" },
                  transition: "all 0.2s ease",
                }}
              >
                <TableCell>
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
                  {dept?.head_doctor?.user?.first_name &&
                  dept?.head_doctor?.user?.last_name ? (
                    `${dept.head_doctor.user.first_name} ${dept.head_doctor.user.last_name}`
                  ) : (
                    <div style={{ color: "red", fontWeight: "bold" }}>N/A</div>
                  )}
                </TableCell>

                <TableCell>
                  <Box display="flex" gap={1}>
                    <Tooltip title="Edit Department">
                      <IconButton
                        size="small"
                        sx={{
                          color: "#1976d2",
                          backgroundColor: "rgba(25, 118, 210, 0.08)",
                        }}
                        onClick={() => onEdit(dept)}
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete Department">
                      <IconButton
                        size="small"
                        sx={{
                          color: "#d32f2f",
                          backgroundColor: "rgba(211, 47, 47, 0.08)",
                        }}
                        onClick={() => onDelete(dept.department_id)}
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
          justifyContent: "space-between",
          p: 2,
          backgroundColor: "#f9f9f9",
          borderBottom: "1px solid #ddd",
        }}
      >
        <Typography variant="subtitle1" fontWeight="bold">Total Departments : {filtered.length}</Typography>
        <Button
          variant="contained"
          sx={{
            borderRadius: 3,
            textTransform: "none",
            px: 3,
            backgroundColor: "#1565c0",
            "&:hover": { backgroundColor: "#0d47a1" },
          }}
          onClick={onDownloadPDF}
        >
          Download PDF
        </Button>
      </Box>
    </Paper>
  );
}
