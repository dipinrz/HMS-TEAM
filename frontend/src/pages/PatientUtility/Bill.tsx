import { useEffect, useState } from "react";
import { viewAllBills } from "../../services/patientApi";
import {
    Box,
    Card,
    CardContent,
    Typography,
    Chip,
    Stack,
    Button,
    Divider,
    Paper,
    Grow,
    useTheme,
    useMediaQuery,
    Grid,
} from "@mui/material";
import { CheckCircleIcon, Filter, ReceiptIcon } from "lucide-react";
import DownloadIcon from "@mui/icons-material/Download";
import PaymentButton from "../../components/PaymentButton";
import CustomModal from "../../components/ui/CustomModal";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export interface Bill {
    bill_id: number;
    total_amount: number;
    tax_amount: number;
    payment_status: string;
    billing_date: string;
    bill_amount: number;

    appointment: {
        appointment_id: number;
        appointment_date: string;
        status: string;
        reason_for_visit: string;
        notes: string;
    };

    billitem: {
        bill_item_id: number;
        fee_type: string;
        amount: string;
        medication: {
            medication_id: number;
            dosage: string;
            frequency: number;
            duration: number;
            instructions: string | null;
            medicine: {
                medicine_id: number;
                medicine_name: string;
                description: string;
                cost: string;
                expiry_date: string;
            };
        } | null;
    }[];
}

function Bill() {
    const [bills, setBills] = useState<Bill[]>([]);
    const [filter, setFilter] = useState<"unpaid" | "paid" | "all">("unpaid");
    const [open, setOpen] = useState(false);
    const [selectedBill, setSelectedBill] = useState<Bill | null>(null);

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

    const statusOptions = ["unpaid", "paid", "all"];

    const handleOpen = (bill: Bill) => {
        setSelectedBill(bill);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setSelectedBill(null);
    };

    const viewBills = async () => {
        try {
            const res = await viewAllBills();
            setBills(res.data.bills);
        } catch (error) {
            console.error("Error fetching bills:", error);
        }
    };

    useEffect(() => {
        viewBills();
    }, []);

    const filteredBills = bills?.filter((bill) => {
        if (filter === "unpaid") return bill.payment_status === "unpaid";
        if (filter === "paid") return bill.payment_status === "paid";
        return true;
    });

    const handlePaymentSuccess = (billId: number) => {
        setBills((prev) =>
            prev.map((bill) =>
                bill.bill_id === billId ? { ...bill, payment_status: "paid" } : bill
            )
        );
    };

    const handleDownload = () => {
        if (!selectedBill) return;

        const bill = selectedBill;
        const doc = new jsPDF();

        // 🔹 HEADER (Hospital Info)
        doc.setFontSize(20);
        doc.setFont("helvetica", "bold");
        doc.text(" HMS", 14, 20);
        doc.setFontSize(10);
        doc.setFont("helvetica", "normal");

        // Divider line
        doc.setDrawColor(0);
        doc.line(14, 35, 195, 35);

        // 🔹 BILL INFO
        doc.setFontSize(12);
        doc.setFont("helvetica", "bold");
        doc.text("Bill Details", 14, 45);
        doc.setFont("helvetica", "normal");
        doc.text(`Bill ID: ${bill.bill_id}`, 14, 52);
        doc.text(`Billing Date: ${new Date(bill.billing_date).toLocaleDateString()}`, 14, 59);
        doc.text(`Payment Status: ${bill.payment_status.toUpperCase()}`, 14, 66);

        // 🔹 APPOINTMENT INFO
        doc.setFontSize(12);
        doc.setFont("helvetica", "bold");
        doc.text("Appointment Details", 105, 45);
        doc.setFont("helvetica", "normal");
        doc.text(
            `Date: ${new Date(bill.appointment.appointment_date).toLocaleDateString()}`,
            105,
            52
        );
        doc.text(`Reason: ${bill.appointment.reason_for_visit}`, 105, 59);
        doc.text(`Status: ${bill.appointment.status}`, 105, 66);

        // Divider line
        doc.line(14, 72, 195, 72);

        // 🔹 BILL ITEMS TABLE
        autoTable(doc, {
            startY: 80,
            head: [["sno", "Fee Type", "Medication", "Amount "]],
            body: bill.billitem.map((item, index) => [
                index + 1,
                item.fee_type,
                item.medication ? item.medication.medicine.medicine_name : "N/A",
                item.amount,
            ]),
            theme: "grid",
            headStyles: { fillColor: [41, 128, 185], textColor: 255, halign: "center" },
            bodyStyles: { halign: "center" },
        });

        // 🔹 TOTALS SECTION
        let finalY = (doc as any).lastAutoTable.finalY || 90;
        doc.setFontSize(12);
        doc.setFont("helvetica", "normal");
        doc.text(`Bill Amount: ${bill.bill_amount}`, 140, finalY + 10);
        doc.text(`Tax: ${bill.tax_amount}`, 140, finalY + 17);
        doc.setFont("helvetica", "bold");
        doc.text(`TOTAL: ${bill.total_amount}`, 140, finalY + 26);

        // Divider line
        doc.line(14, finalY + 32, 195, finalY + 32);

        // 🔹 FOOTER
        doc.setFontSize(11);
        doc.setFont("helvetica", "italic");
        doc.text(
            "Thank you for trusting our Hospital!",
            14,
            finalY + 45
        );

        // Save PDF
        doc.save(`Receipt_${bill.bill_id}.pdf`);
    };

    return (
        <Box sx={{ width: "100%", p: 2 }}>
            {/* 🔹 Filter Chips Section (instead of Tabs) */}
            <Grow in timeout={800}>
                <Paper
                    elevation={0}
                    sx={{
                        mb: 4,
                        p: 3,
                        borderRadius: 3,
                        background: theme.palette.background.paper,
                        border: `1px solid ${theme.palette.divider}`,
                    }}
                >
                    <Stack
                        direction={isMobile ? "column" : "row"}
                        alignItems="center"
                        spacing={2}
                    >
                        <Typography
                            variant="subtitle1"
                            fontWeight="bold"
                            sx={{ display: "flex", alignItems: "center" }}
                        >
                            <Filter size={20} style={{ marginRight: 8 }} /> Filter by:
                        </Typography>
                        <Stack direction="row" flexWrap="wrap" gap={1}>
                            {statusOptions.map((status) => (
                                <Chip
                                    key={status}
                                    label={status.charAt(0).toUpperCase() + status.slice(1)}
                                    variant={filter === status ? "filled" : "outlined"}
                                    color={filter === status ? "primary" : "default"}
                                    onClick={() => setFilter(status as any)}
                                    sx={{
                                        borderRadius: 2,
                                        px: 1,
                                        transition: "all 0.2s",
                                        "&:hover": {
                                            transform: "translateY(-2px)",
                                            boxShadow: theme.shadows[2],
                                        },
                                    }}
                                />
                            ))}
                        </Stack>
                    </Stack>
                </Paper>
            </Grow>

            {/* 🔹 Bill Cards */}
            <Stack spacing={2}>
                {filteredBills.length === null || filteredBills === undefined ? (
                    <Paper
                        elevation={0}
                        sx={{
                            p: 4,
                            textAlign: 'center',
                            borderRadius: 3,
                            background: 'linear-gradient(135deg, #f5f7fa 0%, #e4e8f0 100%)',
                            border: '1px dashed',
                            borderColor: 'grey.300'
                        }}
                    >
                        <Typography variant="h6" color="text.secondary" gutterBottom>
                            No bills found
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            There are no {filter} bills available at the moment.
                        </Typography>
                    </Paper>
                ) : (
                    filteredBills.map((bill) => (
                        <Card
                            key={bill.bill_id}
                            elevation={0}
                            onClick={() => handleOpen(bill)}
                            sx={{
                                borderRadius: 3,
                                p: 0,
                                background: bill.payment_status === "unpaid"
                                    ? 'linear-gradient(to right, #fff8f0 0%, #fffcf7 100%)'
                                    : 'linear-gradient(to right, #f0fff4 0%, #f7fffb 100%)',
                                border: '1px solid',
                                borderColor: bill.payment_status === "unpaid" ? 'rgba(255, 152, 0, 0.2)' : 'rgba(76, 175, 80, 0.2)',
                                cursor: "pointer",
                                transition: "all 0.3s ease-in-out",
                                overflow: 'hidden',
                                position: 'relative',
                                "&:hover": {
                                    transform: "translateY(-4px)",
                                    boxShadow: bill.payment_status === "unpaid"
                                        ? '0 8px 24px rgba(255, 152, 0, 0.15)'
                                        : '0 8px 24px rgba(76, 175, 80, 0.15)'
                                },
                            }}
                        >
                            {/* Status indicator bar */}
                            <Box
                                sx={{
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    height: '100%',
                                    width: 4,
                                    bgcolor: bill.payment_status === "unpaid" ? 'warning.main' : 'success.main'
                                }}
                            />

                            <CardContent sx={{ p: 3, pl: 4 }}>
                                <Grid container spacing={2} alignItems="center" >
                                    <Grid size={{ xs: 12, md: 6 }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                                            <Box
                                                sx={{
                                                    width: 40,
                                                    height: 40,
                                                    borderRadius: 2,
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    bgcolor: bill.payment_status === "unpaid" ? 'warning.light' : 'success.light',
                                                    mr: 2
                                                }}
                                            >
                                                <ReceiptIcon
                                                    fontSize="small"

                                                />
                                            </Box>
                                            <Box>
                                                <Typography variant="h6" fontWeight="600" noWrap>
                                                    {bill.appointment?.reason_for_visit || "Bill Details"}
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary">
                                                    Bill #{bill.bill_id}
                                                </Typography>
                                            </Box>
                                        </Box>

                                    </Grid>

                                    <Grid size={{ xs: 12, md: 6 }}>
                                        <Box sx={{
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "flex-end", // pushes left/right
                                            width: "100%",

                                        }}>
                                            {/* <Chip
                                                label={bill.payment_status.toUpperCase()}
                                                color={bill.payment_status === "paid" ? "success" : "warning"}
                                                variant="filled"
                                                size="small"
                                                sx={{
                                                    fontWeight: "700",
                                                    borderRadius: 1,
                                                }}
                                            /> */}

                                            <Typography variant="h6" fontWeight="700" color="primary.main" textAlign={"right"}>
                                                ₹{bill.total_amount}
                                            </Typography>
                                        </Box>
                                    </Grid>
                                </Grid>

                                <Divider sx={{ my: 2.5 }} />

                                <Grid container spacing={2} alignItems="center">
                                    <Grid size={{ xs: 12, sm: 6 }}>
                                        <Typography variant="body2" color="text.secondary">
                                            <Box component="span" fontWeight="500">Billing Date:</Box>{' '}
                                            {new Date(bill.billing_date).toLocaleDateString('en-IN', {
                                                day: 'numeric',
                                                month: 'short',
                                                year: 'numeric'
                                            })}
                                        </Typography>
                                    </Grid>

                                    <Grid size={{ xs: 12, sm: 6 }}>
                                        <Box sx={{
                                            display: 'flex',
                                            justifyContent: { xs: 'flex-start', sm: 'flex-end' }
                                        }}>
                                            {bill.payment_status === "unpaid" ? (
                                                <PaymentButton
                                                    billAmount={bill.total_amount}
                                                    billId={bill.bill_id}


                                                    onPaymentSuccess={() => handlePaymentSuccess(bill.bill_id)}

                                                />
                                            ) : (
                                                <Box sx={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    color: 'success.main',
                                                    fontWeight: '500'
                                                }}>
                                                    <CheckCircleIcon />
                                                    Payment Completed
                                                </Box>
                                            )}
                                        </Box>
                                    </Grid>
                                </Grid>
                            </CardContent>
                        </Card>
                    ))
                )}
            </Stack>

            {/* 🔹 Bill Modal */}
            <CustomModal
                open={open}
                onClose={handleClose}
                title={`Bill #${selectedBill?.bill_id}`}

                content={
                    selectedBill && (
                        <Box sx={{ p: { xs: 1, sm: 2 } }}>
                            {/* Billing Summary Card */}
                            <Paper
                                elevation={0}
                                sx={{
                                    mb: 3,
                                    p: 3,
                                    borderRadius: 3,
                                    background: 'linear-gradient(135deg, #f5f7fa 0%, #e4e8f0 100%)',
                                    border: '1px solid',
                                    borderColor: 'grey.200',
                                    position: 'relative',
                                    overflow: 'hidden',
                                    '&:before': {
                                        content: '""',
                                        position: 'absolute',
                                        top: 0,
                                        right: 0,
                                        width: '100%',
                                        height: '4px',
                                        background: selectedBill.payment_status === 'unpaid' ?
                                            'linear-gradient(90deg, #ff6b6b 0%, #ff8787 100%)' :
                                            'linear-gradient(90deg, #51cf66 0%, #94d82d 100%)'
                                    }
                                }}
                            >
                                <Typography
                                    variant="h6"
                                    fontWeight="700"
                                    gutterBottom
                                    sx={{
                                        color: 'text.primary',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 1
                                    }}
                                >
                                    {/* <ReceiptLongIco fontSize="small" /> */}
                                    Billing Summary
                                </Typography>

                                <Grid container spacing={2} sx={{ mt: 0.5 }}>
                                    <Grid size={{ xs: 6 }}>
                                        <Typography variant="body2" color="text.secondary">
                                            Total Amount
                                        </Typography>
                                        <Typography variant="h6" fontWeight="700" color="primary.main">
                                            ₹{selectedBill.total_amount}
                                        </Typography>
                                    </Grid>
                                    <Grid size={{ xs: 6 }}>
                                        <Typography variant="body2" color="text.secondary">
                                            Tax Amount
                                        </Typography>
                                        <Typography variant="body1" fontWeight="500">
                                            ₹{selectedBill.tax_amount}
                                        </Typography>
                                    </Grid>
                                    <Grid size={{ xs: 6 }}>
                                        <Typography variant="body2" color="text.secondary">
                                            Status
                                        </Typography>
                                        <Chip
                                            label={selectedBill.payment_status}
                                            size="small"
                                            sx={{
                                                fontWeight: '600',
                                                backgroundColor: selectedBill.payment_status === 'unpaid' ?
                                                    'rgba(211, 47, 47, 0.1)' : 'rgba(46, 125, 50, 0.1)',
                                                color: selectedBill.payment_status === 'unpaid' ?
                                                    '#d32f2f' : '#2e7d32'
                                            }}
                                        />
                                    </Grid>
                                    <Grid size={{ xs: 12 }}>
                                        <Divider sx={{ my: 1 }} />
                                        <Typography variant="body2" color="text.secondary">
                                            Visit Reason
                                        </Typography>
                                        <Typography variant="body1" fontWeight="500">
                                            {selectedBill.appointment?.reason_for_visit || "N/A"}
                                        </Typography>
                                    </Grid>
                                </Grid>
                            </Paper>

                            {/* Bill Items Section */}
                            <Box sx={{ mt: 3 }}>
                                <Typography
                                    variant="h6"
                                    fontWeight="700"
                                    gutterBottom
                                    sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 1
                                    }}
                                >
                                    {/* <L fontSize="small" /> */}
                                    Bill Items
                                </Typography>
                                <Divider sx={{ mb: 2 }} />

                                {selectedBill.billitem.length > 0 ? (
                                    <Stack spacing={1}>
                                        {selectedBill.billitem.map((item) => (
                                            <Paper
                                                key={item.bill_item_id}
                                                elevation={0}
                                                sx={{
                                                    p: 2,
                                                    borderRadius: 2,
                                                    border: '1px solid',
                                                    borderColor: 'grey.100',
                                                    transition: 'all 0.2s ease',
                                                    '&:hover': {
                                                        boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                                                        transform: 'translateY(-1px)'
                                                    }
                                                }}
                                            >
                                                <Box sx={{
                                                    display: 'flex',
                                                    justifyContent: 'space-between',
                                                    alignItems: 'flex-start'
                                                }}>
                                                    <Box>
                                                        <Typography variant="body1" fontWeight="500">
                                                            {item.fee_type}
                                                        </Typography>
                                                        {item.medication && (
                                                            <Typography
                                                                variant="body2"
                                                                color="primary.main"
                                                                sx={{
                                                                    mt: 0.5,
                                                                    fontStyle: 'italic'
                                                                }}
                                                            >
                                                                Medicine: {item.medication.medicine.medicine_name}
                                                            </Typography>
                                                        )}
                                                    </Box>
                                                    <Typography variant="body1" fontWeight="700" color="primary.main">
                                                        ₹{item.amount}
                                                    </Typography>
                                                </Box>
                                            </Paper>
                                        ))}
                                    </Stack>
                                ) : (
                                    <Paper
                                        elevation={0}
                                        sx={{
                                            p: 3,
                                            borderRadius: 2,
                                            textAlign: 'center',
                                            bgcolor: 'grey.50'
                                        }}
                                    >
                                        <Typography variant="body2" color="text.secondary">
                                            No bill items found.
                                        </Typography>
                                    </Paper>
                                )}
                            </Box>

                            {/* Action Buttons */}
                            <Box sx={{
                                mt: 4,
                                display: 'flex',
                                flexDirection: { xs: 'column', sm: 'row' },
                                justifyContent: 'center',
                                gap: 2
                            }}>
                                <Button
                                    variant="outlined"
                                    startIcon={<DownloadIcon />}
                                    sx={{
                                        borderRadius: 2,
                                        textTransform: 'none',
                                        px: 3,
                                        py: 1,
                                        fontWeight: '600',
                                        borderWidth: '2px',
                                        '&:hover': {
                                            borderWidth: '2px'
                                        }
                                    }}
                                    onClick={handleDownload}

                                >
                                    Download Receipt
                                </Button>

                                {/* {selectedBill?.payment_status === "unpaid" && (
                                    <PaymentButton
                                        billAmount={selectedBill.total_amount}
                                        billId={selectedBill.bill_id}
                                        onPaymentSuccess={() =>
                                            handlePaymentSuccess(selectedBill.bill_id)
                                        }
                                    /
                                )} */}
                            </Box>
                        </Box>
                    )
                }
            />
        </Box >
    );
}

export default Bill;
