import { useEffect, useMemo, useState } from "react";
import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Typography,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Paper,
  TableContainer,
  Chip,
  Grid,
  Card,
  CardContent,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import {
  TrendingUp,
  AccountBalanceWallet,
  CreditCard,
  Payment,
  AccountBalance,
} from "@mui/icons-material";

import { getPatientPaymentHistory } from "../../services/patientApi";

interface PaymentHistory {
  payment_id: number;
  email: string;
  contact: number;
  amount_paid: string;
  payment_method: string;
  transaction_id: string;
  verified: boolean;
  payment_date: string;
}

const PaymentHistory = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [paymentHistory, setPaymentHistory] = useState<PaymentHistory[]>([]);

  const [selectMonth, setSelectedMonth] = useState<number | string>("");
  const [selectYear, setSelectedYear] = useState<number | string>("");

  const years = useMemo(() => {
    return [
      ...new Set(
        paymentHistory.map((pay) => new Date(pay.payment_date).getFullYear())
      ),
    ];
  }, [paymentHistory]);

  const filteredby = paymentHistory.filter((pay) => {
    const date = new Date(pay.payment_date);

    const year = date.getFullYear();
    const month = date.getMonth();

    const matchedYear = selectYear === "" || year == selectYear ? true : false;
    const matchedMonth =
      selectMonth === "" || month == selectMonth ? true : false;

    return matchedMonth && matchedYear;
  });

  // Calculate summary statistics
  const totalPayments = filteredby.length;

  const totalAmount = filteredby.reduce((sum, payment) => {
    return payment.verified ? sum + parseFloat(payment.amount_paid) : sum;
  }, 0);

  const successfulPayments = filteredby.filter(
    (payment) => payment.verified
  ).length;

  const getPaymentMethodIcon = (method: string) => {
    switch (method) {
      case "wallet":
        return <AccountBalanceWallet fontSize="small" />;
      case "creditcard":
        return <CreditCard fontSize="small" />;
      default:
        return <Payment fontSize="small" />;
    }
  };

  const cardData = [
    {
      title: "Total Payments",
      value: totalPayments,
      gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      icon: <TrendingUp sx={{ fontSize: 34, color: "red" }} />,
    },
    {
      title: "Total Amount",
      value: `₹${totalAmount.toFixed(2)}`,
      gradient: "linear-gradient(135deg, #11998e 0%, #38ef7d 100%)",
      icon: <AccountBalance sx={{ fontSize: 34, color: "green" }} />,
    },
    {
      title: "Successful Payments",
      value: successfulPayments,
      gradient: "linear-gradient(135deg, #ff6b6b 0%, #ff8e53 100%)",
      icon: <Payment sx={{ fontSize: 34, color: "blue" }} />,
    },
  ];
  const fetching = async () => {
    try {
      const response = await getPatientPaymentHistory();
      setPaymentHistory(response.data.payment_history);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    fetching();
  }, []);
  return (
    <>
      <Box
        sx={{
          border: "1px solid  #ddd",
          borderRadius: "2",
          p: isMobile ? 1 : 3,
        }}
      >
        <Typography
          variant="h4"
          fontWeight="bold"
          gutterBottom
          sx={{
            color: " #020aa5ff ",
          }}
        >
          Payment History
        </Typography>

        <Grid container spacing={2} sx={{ mb: 3 }}>
          {cardData.map((card) => (
            <Grid size={{ xs: 12, sm: 4 }}>
              <Card
                elevation={3}
                sx={{
                  background: "",
                  color: "grey",
                  minHeight: 160,
                }}
              >
                <CardContent sx={{ position: "relative", p: 3 }}>
                  <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="flex-start"
                  >
                    <Box>
                      <Typography
                        variant="h6"
                        gutterBottom
                        sx={{ opacity: 0.9, fontWeight: 500 }}
                      >
                        {card.title}
                      </Typography>
                      <Typography
                        variant="h4"
                        sx={{ fontWeight: 500, color: "black" }}
                      >
                        {card.value}
                      </Typography>
                    </Box>
                    <Box
                      sx={{
                        backgroundColor: "rgba(255,255,255,0.2)",
                        borderRadius: "50%",
                        width: 50,
                        height: 50,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      {card.icon}
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
        <Box
          sx={{
            p: 3,
            mb: 3,
            borderRadius: 2,
            backgroundColor: "#f5f5f5",
            display: "flex",
            flexDirection: isMobile ? "column" : "row",
            gap: 2,
          }}
        >
          <FormControl sx={{ minWidth: isMobile ? "100%" : 150 }}>
            <InputLabel>Select Year</InputLabel>
            <Select
              label="Select Year"
              value={selectYear}
              onChange={(e) => setSelectedYear(e.target.value)}
            >
              <MenuItem value="">All Years</MenuItem>
              {years.map((year) => (
                <MenuItem key={year} value={year}>
                  {year}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl sx={{ minWidth: isMobile ? "100%" : 150 }}>
            <InputLabel>Select month</InputLabel>
            <Select
              label="Select month"
              value={selectMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
            >
              <MenuItem value="">All Months</MenuItem>
              {months.map((month, index) => (
                <MenuItem key={month} value={index}>
                  {month}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
        <TableContainer
          component={Paper}
          elevation={3}
          sx={{ p: 3, borderRadius: 2, overflow: "hidden" }}
        >
          {paymentHistory.length == 0 ? (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: "#f5f5f5",
                borderRadius: 2,
                border: "1px dashed #cbd5e1",
                p: 3,
                mt: 2,
              }}
            >
              <Typography
                variant="h6"
                color="text.secondary"
                sx={{ fontStyle: "italic", fontWeight: 500 }}
                textAlign="center"
              >
                No data available
              </Typography>
            </Box>
          ) : (
            <Table>
              <TableHead
                sx={{
                  background:
                    "linear-gradient(135deg, #020aa5ff 0%, #0a036bff 100%)",
                }}
              >
                <TableRow>
                  <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                    Date & Time
                  </TableCell>
                  <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                    Amount
                  </TableCell>
                  <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                    Payment Method
                  </TableCell>
                  <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                    Transaction ID
                  </TableCell>
                  <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                    Status
                  </TableCell>
                </TableRow>
              </TableHead>

              {filteredby.length == 0 ? (
                <TableBody>
                  <TableRow>
                    <TableCell colSpan={5}>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          backgroundColor: "#f5f5f5",
                          borderRadius: 2,
                          border: "1px dashed #cbd5e1",
                          p: 3,
                          mt: 2,
                        }}
                      >
                        <Typography
                          variant="h6"
                          color="text.secondary"
                          sx={{ fontStyle: "italic", fontWeight: 500 }}
                          textAlign="center"
                        >
                          No data available
                        </Typography>
                      </Box>
                    </TableCell>
                  </TableRow>
                </TableBody>
              ) : (
                <TableBody>
                  {filteredby.map((payment, index) => (
                    <TableRow
                      key={payment.payment_id}
                      sx={{
                        backgroundColor:
                          index % 2 === 0 ? "rgba(0, 0, 0, 0.02)" : "white",
                        "&:hover": {
                          backgroundColor: "rgba(0, 0, 0, 0.04)",
                        },
                      }}
                    >
                      <TableCell>
                        <Typography variant="body2" fontWeight="medium">
                          {formatDate(payment.payment_date)}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" fontWeight="bold">
                          ₹{payment.amount_paid}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Box display="flex" alignItems="center" gap={1}>
                          {getPaymentMethodIcon(payment.payment_method)}
                          <Typography variant="body2">
                            {payment.payment_method.toUpperCase()}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography
                          variant="body2"
                          sx={{
                            fontFamily: "monospace",
                            fontSize: isMobile ? "0.7rem" : "0.875rem",
                          }}
                        >
                          {payment.transaction_id}
                        </Typography>
                      </TableCell>

                      <TableCell>
                        <Chip
                          label={payment.verified ? "Verified" : "Failed"}
                          size="small"
                          sx={{
                            color: payment.verified ? "green" : "red",
                          }}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              )}
            </Table>
          )}
        </TableContainer>
      </Box>
    </>
  );
};

export const formatDate = (date: string) => {
  return new Date(date).toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};
export const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
export default PaymentHistory;
