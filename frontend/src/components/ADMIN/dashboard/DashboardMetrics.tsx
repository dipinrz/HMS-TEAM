import React, { useEffect, useMemo, useState } from "react";
import { Box, Grid, Typography, Avatar } from "@mui/material";
import { Users, Calendar, DollarSign, Stethoscope } from "lucide-react";
import { Card, CardContent } from "../../ui/CustomCards";
import { useAdminStore } from "../../../store/adminStore";
import { toast } from "react-toastify";
import { getMonthlyRevenue } from "../../../services/adminAPi";

const DashboardMetrics: React.FC = () => {
  const {
    patients,
    doctors,
    appointments,
    fetchPatients,
    fetchDoctors,
    fetchAppointments,
  } = useAdminStore();

  const [monthRevenue, setMonthRevenue] = useState<number>(0);
  const [monthName, setMonthName] = useState<string>("");

  useEffect(() => {
    fetchPatients();
    fetchDoctors();
    fetchAppointments();
    fetchMonthlyData();
  }, []);

  const fetchMonthlyData = async () => {
    try {
      const res = await getMonthlyRevenue();
      console.log("Monthly data-----", res.data.data);

      const currentMonth = new Date();
      const currentMonthKey = `${currentMonth.getFullYear()}-${String(
        currentMonth.getMonth() + 1
      ).padStart(2, "0")}`;

      const currentMonthData = res.data.data.find(
        (item: { month: string; total_amount: number }) =>
          item.month === currentMonthKey
      );

      if (currentMonthData) {
        setMonthRevenue(currentMonthData.total_amount);
        setMonthName(formatMonth(currentMonthKey)); 
      } else {
        setMonthRevenue(0);
        setMonthName(formatMonth(currentMonthKey));
      }
    } catch (error) {
      toast.error("Cannot fetch monthly revenue");
      console.error("Error fetching monthly revenue", error);
    }
  };

  const formatMonth = (monthString: string): string => {
    const [year, month] = monthString.split("-");
    const date = new Date(Number(year), Number(month) - 1);
    return date.toLocaleString("en-US", { month: "long", year: "numeric" });
  };

  const metrics = useMemo(
    () => [
      {
        title: "Total Patients",
        value: patients.length.toString(),
        trend: "up",
        icon: Users,
        color: "#3B82F6",
      },
      {
        title: "Total Appointments",
        value: appointments.length.toString(),
        trend: "up",
        icon: Calendar,
        color: "#10B981",
      },
      {
        title: `${monthName} Revenue`,
        value: `₹${monthRevenue.toLocaleString()}`,
        trend: "up",
        icon: DollarSign,
        color: "#8B5CF6",
      },
      {
        title: "Active Doctors",
        value: doctors.length.toString(),
        trend: "up",
        icon: Stethoscope,
        color: "#F97316",
      },
    ],
    [patients, doctors, appointments, monthRevenue, monthName]
  );

  return (
    <Box
      sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}
    >
      <Grid container spacing={5} sx={{ width: "100%" }}>
        {metrics.map((metric, index) => {
          const Icon = metric.icon;

          return (
            <Grid size={{xs:12,sm:6,md:4,lg:3}} key={index}>
              <Card sx={{ width: "100%" }} animated={false}>
                <CardContent>
                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Box>
                      <Typography variant="subtitle2" color="text.secondary">
                        {metric.title}
                      </Typography>
                      <Typography
                        textAlign={"center"}
                        variant="h5"
                        fontWeight="bold"
                        mt={0.5}
                      >
                        {metric.value}
                      </Typography>
                    </Box>
                    <Avatar
                      sx={{
                        bgcolor: `${metric.color}20`,
                        width: 40,
                        height: 40,
                      }}
                    >
                      <Icon size={20} color={metric.color} />
                    </Avatar>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
};

export default DashboardMetrics;
