import React from "react";
import { Box,Table,TableBody,TableCell,TableContainer,TableHead,TableRow,Avatar,
  Typography,TablePagination,CircularProgress,Paper,Divider,Badge,} from "@mui/material";

export interface Payment {
  payment_id: string;
  transaction_id: string;
  payment_method: string;
  verified: boolean;
  payment_date: string;
  amount_paid: string;
  patient: {
    first_name: string;
    last_name: string;
    email: string;
    phone_number: number;
    address: string;
  };
  bill: {
    bill_id: number;
    billing_date: string;
    total_amount: string;
    patient: {
      first_name: string;
      last_name: string;
      email: string;
      phone_number: number;
      address: string;
    };
  };
  razorpay_order_id: string;
}

interface PaymentsTableProps {
  payments: Payment[];
  loading: boolean;
  page: number;
  rowsPerPage: number;
  searchTerm: string;
  setPage: (value: number) => void;
  setRowsPerPage: (value: number) => void;
  handleRowClick: (payment: Payment) => void;
}

const PaymentsTable: React.FC<PaymentsTableProps> = ({payments,
  loading,
  page,
  rowsPerPage,
  searchTerm,
  setPage,
  setRowsPerPage,
  handleRowClick,
}) => {
  const filteredPayments = payments.filter((payment) => {
    const search = searchTerm.toLowerCase();
    return (
      payment.bill.patient.first_name.toLowerCase().includes(search) ||
      payment.bill.patient.last_name.toLowerCase().includes(search) ||
      payment.transaction_id.toLowerCase().includes(search) ||
      payment.bill.bill_id.toString().includes(search)
    );
  });

  const emptyRows =
    page > 0
      ? Math.max(0, (1 + page) * rowsPerPage - filteredPayments.length)
      : 0;

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

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
        <TableContainer>
          <Table sx={{ minWidth: 900, tableLayout: "fixed" }}>
            <TableHead>
              <TableRow
                sx={{
                  backgroundColor: "rgba(25, 118, 210, 0.08)",
                  "& .MuiTableCell-head": {
                    borderBottom: "2px solid rgba(25, 118, 210, 0.1)",
                  },
                }}
              >
                <TableCell sx={{ fontWeight: "bold", color: "#1565c0" }}>
                  Sl.No
                </TableCell>
                <TableCell sx={{ fontWeight: "bold", color: "#1565c0" }}>
                  Bill ID
                </TableCell>
                <TableCell sx={{ fontWeight: "bold", color: "#1565c0" }}>
                  Patient
                </TableCell>
                <TableCell sx={{ fontWeight: "bold", color: "#1565c0" }}>
                  Transaction ID
                </TableCell>
                <TableCell
                  sx={{ fontWeight: "bold", color: "#1565c0" }}
                  align="right"
                >
                  Amount Paid
                </TableCell>
                <TableCell sx={{ fontWeight: "bold", color: "#1565c0" }}>
                  Payment Date
                </TableCell>
              </TableRow>
            </TableHead>

            {loading ? (
              <TableBody>
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    <CircularProgress />
                  </TableCell>
                </TableRow>
              </TableBody>
            ) : (
              <TableBody>
                {(rowsPerPage > 0
                  ? filteredPayments.slice(
                      page * rowsPerPage,
                      page * rowsPerPage + rowsPerPage
                    )
                  : filteredPayments
                ).map((payment, index) => (
                  <TableRow
                    key={payment.payment_id}
                    sx={{
                      cursor: "pointer",
                      "&:hover": {
                        backgroundColor: "rgba(25, 118, 210, 0.04)",
                        transform: "scale(1.001)",
                        transition: "all 0.2s ease",
                      },
                      transition: "all 0.2s ease",
                    }}
                    onClick={() => handleRowClick(payment)}
                  >
                    <TableCell>
                      <Badge
                        badgeContent={page * rowsPerPage + index + 1}
                        color="primary"
                      >
                        {" "}
                        <Box sx={{ width: 20 }} />
                      </Badge>
                    </TableCell>
                    <TableCell>{payment.bill.bill_id}</TableCell>
                    <TableCell>
                      <Box display="flex" alignItems="center" gap={2}>
                        <Avatar
                          sx={{
                            width: 40,
                            height: 40,
                            fontWeight: "bold",
                            bgcolor: "#1976d2",
                            color: "#fff",
                          }}
                        >
                          {payment.bill.patient.first_name[0]}
                        </Avatar>
                        <Box>
                          <Typography
                            variant="body1"
                            fontWeight="600"
                            color="#2c3e50"
                          >
                            {payment.bill.patient.first_name}{" "}
                            {payment.bill.patient.last_name}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {payment.bill.patient.email}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>{payment.transaction_id}</TableCell>
                    <TableCell align="right">₹{payment.amount_paid}</TableCell>
                    <TableCell>{formatDate(payment.payment_date)}</TableCell>
                  </TableRow>
                ))}
                {emptyRows > 0 && (
                  <TableRow style={{ height: 53 * emptyRows }}>
                    <TableCell colSpan={6} />
                  </TableRow>
                )}
              </TableBody>
            )}
          </Table>
        </TableContainer>
      </Box>

      <Divider />

      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={filteredPayments.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={(_, newPage) => setPage(newPage)}
        onRowsPerPageChange={(e) => {
          setRowsPerPage(parseInt(e.target.value, 10));
          setPage(0);
        }}
      />
    </Paper>
  );
};

export default PaymentsTable;
