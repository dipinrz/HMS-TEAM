// src/components/DashboardCharts.tsx
import React from 'react';
import {
  Grid,
} from '@mui/material';
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
} from 'recharts';
import { Card, CardContent, CardHeader } from '../ui/CustomCards';

const revenueData = [
  { month: 'Jan', revenue: 35000, patients: 200 },
  { month: 'Feb', revenue: 38000, patients: 220 },
  { month: 'Mar', revenue: 42000, patients: 250 },
  { month: 'Apr', revenue: 39000, patients: 230 },
  { month: 'May', revenue: 45000, patients: 280 },
  { month: 'Jun', revenue: 48000, patients: 300 },
];

const departmentData = [
  { name: 'Cardiology', value: 30, color: '#2563eb' },
  { name: 'Neurology', value: 25, color: '#059669' },
  { name: 'Orthopedics', value: 20, color: '#dc2626' },
  { name: 'Pediatrics', value: 15, color: '#7c3aed' },
  { name: 'Emergency', value: 10, color: '#ea580c' },
];

const DashboardCharts: React.FC = () => {
  return (
    <Grid container spacing={3}>
      {/* Revenue Chart */}
      <Grid size={{xs:12,lg:6}}  >
        <Card sx={{width:'100%',borderRadius:'2rem'}} elevation={3}>
          <CardHeader
            title="Revenue & Patient Growth"
            subheader="Monthly revenue and patient statistics"
          />
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="revenue" fill="#2563eb" radius={4} barSize={50} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </Grid>

      {/* Department Pie Chart */}
      <Grid size={{xs:12,lg:6}}>
        <Card sx={{width:'100%' ,borderRadius:'2rem'}} elevation={3}>
          <CardHeader
            title="Department Utilization"
            subheader="Patient distribution across departments"
          />
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={departmentData}
                  cx="50%"
                  cy="50%"
                  outerRadius={120}
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}%`}
                >
                  {departmentData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

export default DashboardCharts;
