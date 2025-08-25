import React, { useState, useEffect } from "react";
import { Paper } from "@mui/material";
import PaymentsToolbar from "../../components/ADMIN/payments/PaymentsToolbar";
import PaymentsTable from "../../components/ADMIN/payments/PaymentsTable";
import type { Payment } from "../../components/ADMIN/payments/PaymentsTable";
import PaymentModal from "../../components/ADMIN/payments/PaymentsModal";
import { getAllPayments } from "../../services/adminAPi";
import { toast } from "react-toastify";
const AdminPaymentsTable: React.FC = () => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [openModal, setOpenModal] = useState(false);

  const fetchPayments = async () => {
    try {
      setLoading(true);
      const res = await getAllPayments();
      setPayments(res.data.paymentData);
    } catch (error) {
      toast.error("Cannot fetch payments");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  const handleRowClick = (payment: Payment) => {
    setSelectedPayment(payment);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setSelectedPayment(null);
    setOpenModal(false);
  };

  return (
    <Paper sx={{boxShadow: "0px 8px 40px rgba(0, 0, 0, 0.12)", p: 2,backgroundColor: "#f8fafc", height:'100vh'}}>
      <PaymentsToolbar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

      <PaymentsTable
        payments={payments}
        loading={loading}
        page={page}
        rowsPerPage={rowsPerPage}
        searchTerm={searchTerm}
        setPage={setPage}
        setRowsPerPage={setRowsPerPage}
        handleRowClick={handleRowClick}
      />

      <PaymentModal open={openModal} onClose={handleCloseModal} payment={selectedPayment} />
    </Paper>
  );
};

export default AdminPaymentsTable;
