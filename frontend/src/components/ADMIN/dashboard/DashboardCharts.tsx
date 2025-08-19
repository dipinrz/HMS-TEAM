import React, { useEffect, useMemo, useState } from "react";
import { Grid, useMediaQuery, useTheme } from "@mui/material";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { Card, CardContent, CardHeader } from "../../ui/CustomCards";
import {
  fetchDepartmentwiseAppointmentAPI,
  getMonthlyRevenue,
} from "../../../services/adminAPi";
import { toast } from "react-toastify";

const revenueData = [
  { month: "Jan", revenue: 35000, patients: 200 },
  { month: "Feb", revenue: 38000, patients: 220 },
  { month: "Mar", revenue: 42000, patients: 250 },
  { month: "Apr", revenue: 39000, patients: 230 },
  { month: "May", revenue: 45000, patients: 280 },
  { month: "Jun", revenue: 48000, patients: 300 },
];

const departmentColors = [
  "#2563eb",
  "#059669",
  "#dc2626",
  "#7c3aed",
  "#ea580c",
  "#f59e0b",
  "#06b6d4",
  "#84cc16",
];

interface Department {
  department_id: number;
  department_name: string;
  appointment_count: number;
}

const formatRevenueData = (data: any[]) => {
  return data.map((item) => {
    const date = new Date(item.month + "-01"); 
    const monthName = date.toLocaleString("default", { month: "short" }); 
    const year = date.getFullYear();

    return {
      month: `${monthName} ${year}`,
      revenue: item.total_amount,
    };
  });
};

const MemoizedBarChart = React.memo(({ data }: { data: any[] }) => (
  <ResponsiveContainer width="100%" height={300}>
    <BarChart data={data}>
      <defs>
        <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#020aa5ff" />
          <stop offset="100%" stopColor="#0a036bff" />
        </linearGradient>
      </defs>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="month" />
<YAxis 
        domain={[0, 20000]} 
        ticks={[5000, 10000, 15000, 20000]} 
        tickFormatter={(value) => `₹${value.toLocaleString()}`} 
      />      <Tooltip 
        cursor={{ fill: 'transparent' }} 
        content={({ active, payload }) => {
          if (active && payload && payload.length) {
            return (
              <div style={{
                background: '#fff',
                border: '1px solid #ddd',
                padding: '10px',
                borderRadius: '4px',
                boxShadow: '0 0 10px rgba(0,0,0,0.1)'
              }}>
                <p>{`${payload[0].payload.month}`}</p>
                <p>{`Revenue: $${payload[0].value?.toLocaleString()}`}</p>
              </div>
            );
          }
          return null;
        }}
      />
      <Bar
        dataKey="revenue"
        fill="url(#revenueGradient)"
        radius={4}
        barSize={50}
      />
    </BarChart>
  </ResponsiveContainer>
));

const DashboardCharts: React.FC = () => {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [totalAppointments, setTotalAppointments] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);

  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const [monthlyRevenue, setMonthlyRevenue] = useState([]);

  useEffect(() => {
  fetchMonthlyRevenue();
}, []); 

  const formattedRevenueData = useMemo(
    () => formatRevenueData(monthlyRevenue),
    [monthlyRevenue]
  );

  const transformDepartmentData = (
    departments: Department[],
    total: number
  ) => {
    return departments
      .filter((dept) => dept.appointment_count > 0)
      .map((dept, index) => ({
        name:
          dept.department_name.charAt(0).toUpperCase() +
          dept.department_name.slice(1).toLowerCase(),
        value:
          total > 0 ? Math.round((dept.appointment_count / total) * 100) : 0,
        count: dept.appointment_count,
        color: departmentColors[index % departmentColors.length],
      }));
  };

  const fetchDepartmentwiseAppointment = async () => {
    try {
      setLoading(true);
      const response = await fetchDepartmentwiseAppointmentAPI();
      setDepartments(response.data.data.departments);
      setTotalAppointments(response.data.data.total_appointments);
    } catch (error) {
      console.error("Error fetching department data:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMonthlyRevenue = async () => {
    try {
      const response = await getMonthlyRevenue();
      console.log("Monthly revenue------", response.data.data);
      setMonthlyRevenue(response.data.data);
    } catch (error) {
      toast.error("Couldn't fetch monthly revenue");
      console.log("Error in fetching revenue", error);
    }
  };

  useEffect(() => {
    fetchDepartmentwiseAppointment();
  }, []);

  const chartData = transformDepartmentData(departments, totalAppointments);

  return (
    <Grid container spacing={3}>
      <Grid size={{ xs: 12, lg: 6 }}>
        <Card
          sx={{ width: "100%", borderRadius: "2rem" }}
          elevation={3}
          animated={false}
        >
          <CardHeader
            title="Revenue & Patient Growth"
            subheader="Monthly revenue and patient statistics"
          />
           <CardContent>
            {formattedRevenueData.length > 0 ? (
              <MemoizedBarChart data={formattedRevenueData} />
            ) : (
              <div
                style={{
                  height: 300,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                No revenue data available
              </div>
            )}
          </CardContent>
        </Card>
      </Grid>

      <Grid size={{ xs: 12, lg: 6 }}>
        <Card
          sx={{ width: "100%", borderRadius: "2rem" }}
          elevation={3}
          animated={false}
        >
          <CardHeader
            title="Department Utilization"
            subheader={`Patient distribution across departments (Total: ${totalAppointments})`}
          />
          <CardContent>
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    outerRadius={120}
                    dataKey="value"
                    label={false}
                    isAnimationActive={false}
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value, name, props) => [
                      `${props.payload.count} appointments (${value}%)`,
                      "Department",
                    ]}
                  />
                  <Legend
                    layout={isSmallScreen ? "horizontal" : "vertical"}
                    align={isSmallScreen ? "center" : "right"}
                    verticalAlign={isSmallScreen ? "bottom" : "middle"}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : loading ? (
              <div
                style={{
                  height: 300,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                Loading...
              </div>
            ) : (
              <div
                style={{
                  height: 300,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                No appointment data available
              </div>
            )}
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

export default DashboardCharts;
