import { useEffect, useState } from "react";
import { Box, Typography, CircularProgress } from "@mui/material";
import { toast } from "react-toastify";
import {
  fetchAllDepartments,
  getAllDoctors,
  addDept,
  updateDepartmentById,
  deleteDept,
} from "../../services/adminAPi";

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import DepartmentToolbar from "../../components/ADMIN/departments/DepartmentToolBar";
import DepartmentTable from "../../components/ADMIN/departments/DepartmentTable";
import DepartmentModal from "../../components/ADMIN/departments/DepartmentModal";
import DepartmentDeleteDialog from "../../components/ADMIN/departments/DepartmentDeleteDialog";

interface Doctor {
  doctor_id: number;
  user: {
    first_name: string;
    last_name: string;
  };
}

interface Department {
  department_id: number;
  name: string;
  description: string;
  consultation_fee: number;
  head_doctor?: Doctor | null;
}

const AdminDepartmentsPage = () => {
  const [departments, setDepartments] = useState([]);
  const [allDoctors, setAllDoctors] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editDeptId, setEditDeptId] = useState<number | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedDeptId, setSelectedDeptId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    consultation_fee: 0,
    head_doctor: 0,
  });

  useEffect(() => {
    loadDepartments();
    loadDoctors();
  }, []);

  const loadDepartments = async () => {
    try {
      setIsLoading(true);
      const res = await fetchAllDepartments();
      setDepartments(res.data.data.departments);
    } catch {
      toast.error("Couldn't fetch departments");
    } finally {
      setIsLoading(false);
    }
  };

  const loadDoctors = async () => {
    try {
      const res = await getAllDoctors();
      setAllDoctors(res.data.data);
    } catch {
      toast.error("Couldn't fetch doctors");
    }
  };

  const handleAddClick = () => {
    setIsEditMode(false);
    setFormData({
      name: "",
      description: "",
      consultation_fee: 0,
      head_doctor: 0,
    });
    setIsModalOpen(true);
  };

  const handleEditClick = (dept: Department) => {
    setIsEditMode(true);
    setEditDeptId(dept.department_id);
    setFormData({
      name: dept.name,
      description: dept.description,
      consultation_fee: dept.consultation_fee,
      head_doctor: dept.head_doctor?.doctor_id || 0,
    });
    setIsModalOpen(true);
  };

  const handleDeleteClick = (id: number) => {
    setSelectedDeptId(id);
    setDeleteDialogOpen(true);
  };

const handleSubmit = async () => {
  try {
    if (isEditMode && editDeptId) {
      
      const res= await updateDepartmentById(editDeptId, formData);
      if(res.success){
      toast.success("Department updated");
      }
      else{
        toast.error(res.error)
      }
    } else {
      await addDept(formData);
      toast.success("Department added");
    }

    loadDepartments();
    setIsModalOpen(false);
  } catch (error: any) {
   
    toast.error(error.data.message);
  }
};


  const handleDelete = async () => {
    if (!selectedDeptId) return;
    try {
      await deleteDept(selectedDeptId);
      toast.success("Department deleted");
      loadDepartments();
    } catch {
      toast.error("Delete failed");
    } finally {
      setDeleteDialogOpen(false);
    }
  };

  const downloadDepartmentsPDF = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    doc.text("Department List", pageWidth / 2, 20, { align: "center" });
    autoTable(doc, {
      head: [
        [
          "Sl.No",
          "Department Name",
          "Description",
          "Consultation Fee",
          "Head Doctor",
        ],
      ],
      body: departments.map((d: Department, i) => [
        i + 1,
        d.name,
        d.description,
        `${d.consultation_fee} Rs`,
        d?.head_doctor?.user
          ? `${d.head_doctor.user.first_name} ${d.head_doctor.user.last_name}`
          : "N/A",
      ]),
      startY: 30,
    });
    doc.save("departments.pdf");
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
        mt={3}
      >
        Department Management
      </Typography>

      <DepartmentToolbar
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        onAddClick={handleAddClick}
      />

      {isLoading ? (
        <CircularProgress />
      ) : (
        <DepartmentTable
          departments={departments}
          searchTerm={searchTerm}
          onEdit={handleEditClick}
          onDelete={handleDeleteClick}
          onDownloadPDF={downloadDepartmentsPDF}
        />
      )}

      <DepartmentModal
        open={isModalOpen}
        isEditMode={isEditMode}
        formData={formData}
        doctors={allDoctors}
        onClose={() => setIsModalOpen(false)}
        onChange={setFormData}
        onSubmit={handleSubmit}
      />

      <DepartmentDeleteDialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleDelete}
      />
    </Box>
  );
};

export default AdminDepartmentsPage;
