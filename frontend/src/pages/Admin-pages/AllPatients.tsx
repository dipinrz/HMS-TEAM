import { Box, Paper, Typography} from "@mui/material";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { deletePatient, getAllPatients } from "../../services/adminAPi";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import PatientToolbar from "../../components/ADMIN/patients/PatientToolbar";
import PatientTable from "../../components/ADMIN/patients/PatientTable";
import PatientDeleteDialog from "../../components/ADMIN/patients/PatientDeleteDialog";

interface User {
  first_name: string;
  last_name: string;
  email: string;
  phone_number?: string;
  created_at: string;
}

interface Patient {
  patient_id: number;
  blood_group?: string;
  user: User;
}

const AdminPatientsPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [allPatients, setAllPatients] = useState<Patient[]>([]);
  const [filteredPatients, setFilteredPatients] = useState<any[]>([]);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedPatientId, setSelectedPatientId] = useState<number | null>(
    null
  );

  useEffect(() => {
    fetchAllPatients();
  }, []);

  const fetchAllPatients = async () => {
    try {
      setIsLoading(true);
      const response = await getAllPatients();
      setAllPatients(response.data.patients);
      setFilteredPatients(response.data.patients); 
    } catch {
      toast.error("Couldn't fetch patients");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearchChange = (searchValue: string) => {
    const lowerValue = searchValue.toLowerCase();
    const filtered = allPatients.filter(
      (p) =>
        `${p.user.first_name} ${p.user.last_name}`
          .toLowerCase()
          .includes(lowerValue) ||
        p.user.email.toLowerCase().includes(lowerValue) ||
        (p.user.phone_number?.toLowerCase() || "").includes(lowerValue)
    );
    setFilteredPatients(filtered);
  };

  const handleDeletePatient = async () => {
    if (!selectedPatientId) return;
    try {
      await deletePatient(selectedPatientId);
      toast.success("Patient deleted successfully");
      fetchAllPatients();
    } catch {
      toast.error("Couldn't delete patient");
    } finally {
      setOpenDeleteDialog(false);
      setSelectedPatientId(null);
    }
  };

  const handleOpenDeleteDialog = (id: number) => {
    setSelectedPatientId(id);
    setOpenDeleteDialog(true);
  };

  const downloadPatientsPDF = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    doc.text("Patient List", pageWidth / 2, 15, { align: "center" });
    autoTable(doc, {
      startY: 25,
      head: [
        ["#", "Patient Name", "Email", "Blood Group", "Phone", "Joined Date"],
      ],
      body: filteredPatients.map((p, i) => [
        i + 1,
        `${p.user.first_name} ${p.user.last_name}`,
        p.user.email,
        p.blood_group || "N/A",
        p.user.phone_number || "N/A",
        new Date(p.user.created_at).toLocaleDateString(),
      ]),
    });
    doc.save("patients.pdf");
  };

  return (
    <Box
      sx={{
        p: 3,
        backgroundColor: "#f8fafc", 
        minHeight: "100vh",
        pt: { xs: 10, sm: 8, md: 6 }, 
      }}
    >
      <Typography
        variant="h4"
        fontWeight="bold"
        textAlign="center"
        mb={3} 
      >
        Patient Management
      </Typography>

      <PatientToolbar
        onSearchChange={handleSearchChange}
        onDownloadPDF={downloadPatientsPDF}
      />

      <Paper sx={{ borderRadius: 4, overflow: "hidden" }}>
        {/* <PatientTable
          patients={filteredPatients}
          isLoading={isLoading}
          onDeleteClick={handleOpenDeleteDialog}
        /> */}

        <PatientTable
          patients={filteredPatients}
          isLoading={isLoading}
          onDeleteClick={handleOpenDeleteDialog}
          onDownloadPDF={downloadPatientsPDF}
        />
      </Paper>

      <PatientDeleteDialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
        onConfirm={handleDeletePatient}
      />
    </Box>
  );
};

export default AdminPatientsPage;
