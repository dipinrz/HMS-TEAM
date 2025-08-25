import React from "react";
import { Dialog,DialogContent, Typography, Box, Grid, Paper, Divider, Button, Chip } from "@mui/material";
import type { Payment } from "../payments/PaymentsTable";

interface PaymentModalProps {
  open: boolean;
  onClose: () => void;
  payment: Payment | null;
}

const PaymentModal: React.FC<PaymentModalProps> = ({ open, onClose, payment }) => {
  if (!payment) return null;

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
       <DialogContent dividers sx={{ backgroundColor: "#fafafa", px: 3, py: 3 }}>
        <Box>
          <Paper elevation={0} sx={{ mb: 3, p: 3, borderRadius: 3, background: "linear-gradient(135deg, #f5f7fa 0%, #e4e8f0 100%)", border: "1px solid", borderColor: "grey.200", position: "relative", overflow: "hidden", "&:before": { content: '""', position: "absolute", top: 0, right: 0, width: "100%", height: "4px", background: payment.verified ? "linear-gradient(90deg, #51cf66 0%, #94d82d 100%)" : "linear-gradient(90deg, #ff6b6b 0%, #ff8787 100%)" } }}>
            <Typography variant="h6" fontWeight="700" gutterBottom>
              Payment Summary
            </Typography>

            <Grid container spacing={2}>
              <Grid size={{ xs: 6 }}>
                <Typography variant="body2" color="text.secondary">Amount Paid</Typography>
                <Typography variant="h6" fontWeight="700" color="primary.main">₹{payment.amount_paid}</Typography>
              </Grid>

              <Grid size={{ xs: 6 }}>
                <Typography variant="body2" color="text.secondary">Status</Typography>
                <Chip label={payment.verified ? "Verified" : "Pending"} size="small" sx={{ fontWeight: "600", backgroundColor: payment.verified ? "rgba(46, 125, 50, 0.1)" : "rgba(211, 47, 47, 0.1)", color: payment.verified ? "#2e7d32" : "#d32f2f" }} />
              </Grid>

              <Grid size={{ xs: 6 }}>
                <Typography variant="body2" color="text.secondary">Payment Date</Typography>
                <Typography variant="body1" fontWeight="500">{formatDate(payment.payment_date)}</Typography>
              </Grid>

              <Grid size={{ xs: 6 }}>
                <Typography variant="body2" color="text.secondary">Method</Typography>
                <Typography variant="body1" fontWeight="500">{payment.payment_method.toUpperCase()}</Typography>
              </Grid>
            </Grid>
          </Paper>

          <Box sx={{ mt: 2 }}>
            <Typography variant="h6" fontWeight="700" gutterBottom>Patient & Billing Details</Typography>
            <Divider sx={{ mb: 2 }} />

            <Grid container spacing={3}>
              <Grid size={{ xs: 12, md: 6 }}>
                <Typography variant="subtitle2" color="text.secondary">Patient Name</Typography>
                <Typography variant="body1" fontWeight="500">{payment.bill.patient.first_name} {payment.bill.patient.last_name}</Typography>

                <Typography variant="subtitle2" color="text.secondary" sx={{ mt: 1 }}>Email</Typography>
                <Typography variant="body1">{payment.bill.patient.email}</Typography>

                <Typography variant="subtitle2" color="text.secondary" sx={{ mt: 1 }}>Phone</Typography>
                <Typography variant="body1">{payment.bill.patient.phone_number}</Typography>
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <Typography variant="subtitle2" color="text.secondary">Bill ID</Typography>
                <Typography variant="body1" fontWeight="500">{payment.bill.bill_id}</Typography>

                <Typography variant="subtitle2" color="text.secondary" sx={{ mt: 1 }}>Billing Date</Typography>
                <Typography variant="body1">{formatDate(payment.bill.billing_date)}</Typography>

                <Typography variant="subtitle2" color="text.secondary" sx={{ mt: 1 }}>Total Amount</Typography>
                <Typography variant="body1" fontWeight="500">₹{payment.bill.total_amount}</Typography>
              </Grid>
            </Grid>
          </Box>

          <Box sx={{ mt: 4 }}>
            <Typography variant="h6" fontWeight="700" gutterBottom>Payment Details</Typography>
            <Divider sx={{ mb: 2 }} />

            <Grid container spacing={2}>
              <Grid size={{ xs: 12, md: 6 }}>
                <Typography variant="subtitle2" color="text.secondary">Transaction ID</Typography>
                <Typography variant="body1" fontWeight="500">{payment.transaction_id || "N/A"}</Typography>
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <Typography variant="subtitle2" color="text.secondary">Razorpay Order ID</Typography>
                <Typography variant="body1" fontWeight="500">{payment.razorpay_order_id || "N/A"}</Typography>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </DialogContent>

      <Box sx={{ px: 3, py: 2, display: "flex", justifyContent: "flex-end", gap: 2, borderTop: "1px solid", borderColor: "grey.200" }}>
        <Button variant="outlined" onClick={onClose} sx={{ borderRadius: 2, textTransform: "none", px: 3, fontWeight: "600" }}>Close</Button>
      </Box>
    </Dialog>
  );
};

export default PaymentModal;
