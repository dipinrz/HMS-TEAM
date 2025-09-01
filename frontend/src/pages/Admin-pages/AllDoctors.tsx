import { Box, Modal } from "@mui/material";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  deleteDoctor,
  fetchAllDepartments,
  getAllDoctors,
  registerDoctor,
  updateDoctorById,
} from "../../services/adminAPi";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { DoctorsToolbar } from "../../components/ADMIN/doctors/DoctorsToolbar";
import { DoctorsTable } from "../../components/ADMIN/doctors/DoctorsTable";
import DoctorsModal from "../../components/ADMIN/doctors/DoctorsModal";
import { DeleteDialog } from "../../components/ADMIN/doctors/DeleteDialog";

interface DoctorForm {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  specialization: string;
  qualification: string;
  license_number: string;
  years_of_experience: number;
  department_id: number;
}

interface Department {
  department_id: number;
  name: string;
  description: string;
  consultation_fee: number;
}

interface User {
  first_name: string;
  last_name: string;
  email: string;
  created_at?: string;
}

interface Doctor {
  doctor_id: number;
  user: User;
  specialization: string;
  qualification: string;
  license_number: string;
  years_of_experience: number;
  department?: Department;
}

const AdminDoctorsPage = () => {
  const [allDoctors, setAllDoctors] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedDoctorId, setSelectedDoctorId] = useState<number | null>(null);
  const [open, setOpen] = useState(false);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);

  const [formData, setFormData] = useState<DoctorForm>({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    specialization: "",
    qualification: "",
    license_number: "",
    years_of_experience: 0,
    department_id: 0,
  });

  const handleOpenModal = () => setOpen(true);
  const handleCloseModal = () => {
    setOpen(false);
    setIsEditMode(false);
    setSelectedDoctor(null);
    setFormData({
      first_name: "",
      last_name: "",
      email: "",
      password: "",
      specialization: "ortho",
      qualification: "",
      license_number: "",
      years_of_experience: 0,
      department_id: 0,
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "years_of_experience" ? Number(value) : value,
    }));
  };

  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);

    const pageWidth = doc.internal.pageSize.getWidth();
    doc.text("Doctors List", pageWidth / 2, 20, { align: "center" });

    const tableColumn = [
      "No.",
      "Name",
      "Email",
      "Spec",
      "License No.",
      "Dept",
      "Created Date",
    ];

    const tableRows = allDoctors.map((doctor: any, index) => [
      index + 1,
      doctor?.user?.first_name || "",
      doctor?.user?.email || "",
      doctor?.specialization || "",
      doctor?.license_number || "",
      doctor?.department?.name || "",
      doctor?.user?.created_at
        ? new Date(doctor.user.created_at).toLocaleDateString()
        : "",
    ]);

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 25,
      styles: {
        fontSize: 10,
        cellPadding: 3,
      },
      headStyles: {
        fillColor: [25, 118, 210],
        textColor: 255,
        fontStyle: "bold",
      },
      alternateRowStyles: {
        fillColor: [240, 240, 240],
      },
    });

    doc.save("doctors.pdf");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);

      if (isEditMode && selectedDoctor) {
        await updateDoctorById(selectedDoctor.doctor_id, formData);
        toast.success("Doctor updated successfully!");
      } else {
        await registerDoctor(formData);
        toast.success("Doctor registered successfully!");
      }

      fetchAllDoctors();
      handleCloseModal();
    } catch (error) {
      if (error) {
        toast.error("Failed to save doctor");
      } else {
        toast.error("Something went wrong");
      }
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const loadDepartments = async () => {
    try {
      const department = await fetchAllDepartments();
      setDepartments(department.data.data.departments);
    } catch (error) {
      toast.error("Couldn't fetch departments");
      console.log("Error in fetching departments", error);
    }
  };

  useEffect(() => {
    fetchAllDoctors();
    loadDepartments();
  }, []);

  const handleOpenDeleteDialog = (id: number) => {
    setSelectedDoctorId(id);
    setOpenDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
    setSelectedDoctorId(null);
  };

  const handleDeleteDoctor = async () => {
    if (selectedDoctorId === null) return;

    try {
      await deleteDoctor(selectedDoctorId);
      toast.success("Doctor deleted successfully");
      fetchAllDoctors();
      handleCloseDeleteDialog();
    } catch (error) {
      toast.error("Couldn't delete doctor");
      console.log("Error in deleting doctor", error);
    }
  };

  const handleEditDoctor = (doctor: any) => {
    setIsEditMode(true);
    setSelectedDoctor(doctor);

    setFormData({
      first_name: doctor.user?.first_name || "",
      last_name: doctor.user?.last_name || "",
      email: doctor.user?.email || "",
      password: "",
      specialization: doctor.specialization || "",
      qualification: doctor.qualification || "",
      license_number: doctor.license_number || "",
      years_of_experience: doctor.years_of_experience || 0,
      department_id: doctor.department?.department_id || 0,
    });

    setOpen(true);
  };

  const fetchAllDoctors = async () => {
    try {
      setIsLoading(true);
      const response = await getAllDoctors();
      setAllDoctors(response.data.data);
    } catch (error) {
      toast.error("Could not fetch doctors");
      console.log("Error in fetching all doctors", error);
    } finally {
      setIsLoading(false);
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
        <DoctorsToolbar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          handleOpenModal={handleOpenModal}
        />

        <DoctorsTable
          isLoading={isLoading}
          allDoctors={allDoctors}
          searchQuery={searchQuery}
          handleEditDoctor={handleEditDoctor}
          handleOpenDeleteDialog={handleOpenDeleteDialog}
          downloadPDF={downloadPDF}
        />
      </Box>

      <Modal open={open} onClose={handleCloseModal}>
        <DoctorsModal
          open={open}
          handleCloseModal={handleCloseModal}
          isEditMode={isEditMode}
          formData={formData}
          handleChange={handleChange}
          handleSubmit={handleSubmit}
          loading={loading}
          departments={departments}
        />
      </Modal>

      <DeleteDialog
        openDeleteDialog={openDeleteDialog}
        handleCloseDeleteDialog={handleCloseDeleteDialog}
        handleDeleteDoctor={handleDeleteDoctor}
      />
    </Box>
  );
};

export default AdminDoctorsPage;
