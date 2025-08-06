import React from 'react';
import {Box, Grid,Typography,Avatar} from '@mui/material';
import {
  TrendingUp,
  TrendingDown,
  Users,
  Calendar,
  DollarSign,
  Stethoscope,
} from "lucide-react";
import { Card, CardContent } from '../ui/CustomCards';

const metrics = [
  {
    title: "Total Patients",
    value: "1,234",
    change: "+12%",
    trend: "up",
    icon: Users,
    color: "#3B82F6",
  },
  {
    title: "Today's Appointments",
    value: "23",
    change: "+5%",
    trend: "up",
    icon: Calendar,
    color: "#10B981",
  },
  {
    title: "Monthly Revenue",
    value: "$45,231",
    change: "+18%",
    trend: "up",
    icon: DollarSign,
    color: "#8B5CF6",
  },
  {
    title: "Active Doctors",
    value: "45",
    change: "+2%",
    trend: "up",
    icon: Stethoscope,
    color: "#F97316",
  },
];

const DashboardMetrics: React.FC = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}
    >
      <Grid container spacing={5} sx={{ width: '100%' }}>
        {metrics.map((metric, index) => {
          const Icon = metric.icon;
          const isUp = metric.trend === 'up';

          return (
            <Grid size={{xs:12,sm:6,md:4,lg:3}}  key={index}>
              <Card sx={{ width: '100%' }}>
                <CardContent>
                  <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    <Box>
                      <Typography variant="subtitle2" color="text.secondary">
                        {metric.title}
                      </Typography>
                      <Typography variant="h5" fontWeight="bold" mt={0.5}>
                        {metric.value}
                      </Typography>
                      <Box display="flex" alignItems="center" mt={1}>
                        {isUp ? (
                          <TrendingUp
                            size={16}
                            color="#280df5ff"
                            style={{ marginRight: 4 }}
                          />
                        ) : (
                          <TrendingDown
                            size={16}
                            color="#ea0808ff"
                            style={{ marginRight: 4 }}
                          />
                        )}
                        <Typography
                          variant="body2"
                          color={isUp ? 'success.main' : 'error.main'}
                        >
                          {metric.change}
                        </Typography>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          ml={0.5}
                        >
                          from last month
                        </Typography>
                      </Box>
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
