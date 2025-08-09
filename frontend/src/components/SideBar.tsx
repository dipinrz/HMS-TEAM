import React from "react";
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Toolbar,
  useMediaQuery,
  type Theme,
  Box,
  Typography,
  Avatar,
  Stack,
  Paper,
  Chip,
} from "@mui/material";
import {
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  LocalHospital as HospitalIcon,
  Medication as MedicationIcon,
  CalendarToday as CalendarIcon,
  Description as PrescriptionIcon,
  MedicalServices as DoctorIcon,
  Person as PersonIcon,
} from "@mui/icons-material";
import { Link, useLocation } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";

const drawerWidth = 280; // Increased width for better spacing

type SidebarProps = {
  mobileOpen: boolean;
  handleDrawerToggle: () => void;
};

type UserRole = "admin" | "doctor" | "patient";

const Sidebar: React.FC<SidebarProps> = ({
  mobileOpen,
  handleDrawerToggle,
}) => {
  const { user } = useAuthStore();
  const location = useLocation();
  const isMobile = useMediaQuery((theme: Theme) =>
    theme.breakpoints.down("sm")
  );

  const commonLinks = [
    { path: "/dashboard", name: "Dashboard", icon: <DashboardIcon /> },
  ];

  const roleLinks = {
    admin: [
      { path: "/admin/users", name: "Users", icon: <PeopleIcon /> },
      {
        path: "/admin/departments",
        name: "Departments",
        icon: <HospitalIcon />,
      },
      { path: "/admin/medicines", name: "Medicines", icon: <MedicationIcon /> },
      { path: "/admin/doctors", name: "Doctors", icon: <DoctorIcon /> },
    ],
    doctor: [
      {
        path: "/doctor/appointments",
        name: "Appointments",
        icon: <CalendarIcon />,
      },
      {
        path: "/doctor/prescriptions",
        name: "Prescriptions",
        icon: <PrescriptionIcon />,
      },
    ],
    patient: [
      {
        path: "/patient/appointments",
        name: "Appointments",
        icon: <CalendarIcon />,
      },
      { path: "/patient/doctors", name: "Doctors", icon: <DoctorIcon /> },
    ],
  };

  const allLinks = [
    ...commonLinks,
    ...(roleLinks[user?.role as UserRole] || []),
  ];

  const getRoleColor = (role: string) => {
    switch (role) {
      case "admin":
        return "#f44336";
      case "doctor":
        return "#2196f3";
      case "patient":
        return "#4caf50";
      default:
        return "#757575";
    }
  };

  const drawer = (
    <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <Toolbar />

      {/* User Profile Section */}
      <Box sx={{ p: 3, pb: 2 }}>
        <Paper
          elevation={0}
          sx={{
            p: 2.5,
            background: "linear-gradient(135deg, #020aa5ff 0%, #0a036bff 100%)",
            color: "white",
            borderRadius: 2,
            textAlign: "center",
          }}
        >
          <Avatar
            sx={{
              width: 56,
              height: 56,
              mx: "auto",
              mb: 1.5,
              bgcolor: "rgba(255,255,255,0.2)",
              border: "2px solid rgba(255,255,255,0.3)",
            }}
          >
            <PersonIcon sx={{ fontSize: 28 }} />
          </Avatar>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
            User Name
          </Typography>
          <Chip
            label={user?.role?.toUpperCase() || "USER"}
            size="small"
            sx={{
              bgcolor: "rgba(255,255,255,0.2)",
              color: "white",
              fontWeight: 600,
              fontSize: "0.75rem",
            }}
          />
        </Paper>
      </Box>

      <Divider sx={{ mx: 2, mb: 1 }} />

      {/* Navigation Links */}
      <Box sx={{ flex: 1, px: 2 }}>
        <Typography
          variant="overline"
          sx={{
            px: 2,
            py: 1,
            display: "block",
            fontWeight: 600,
            color: "text.secondary",
            fontSize: "0.75rem",
            letterSpacing: 1,
          }}
        >
          NAVIGATION
        </Typography>

        <List sx={{ pt: 0 }}>
          {allLinks.map((link) => {
            const isSelected = location.pathname.startsWith(link.path);

            return (
              <ListItem key={link.path} disablePadding sx={{ mb: 2 }}>
                <ListItemButton
                  component={Link}
                  to={link.path}
                  selected={isSelected}
                  onClick={isMobile ? handleDrawerToggle : undefined}
                  sx={{
                    borderRadius: 2,
                    mx: 1,
                    transition: "all 0.3s ease",
                    background:
                      "linear-gradient(135deg, #020aa5ff 0%, #0a036bff 100%)",
                    "&.Mui-selected": {
                      bgcolor: getRoleColor(user?.role || "admin"),
                      color: "white",
                      transform: "translateX(4px)",
                      "&:hover": {
                        bgcolor: getRoleColor(user?.role || "admin"),
                        filter: "brightness(1.1)",
                      },
                      "& .MuiListItemIcon-root": {
                        color: "white",
                      },
                    },
                    "&:hover": {
                      bgcolor: "rgba(0,0,0,0.04)",
                      transform: "translateX(2px)",
                    },
                  }}
                >
                  <ListItemIcon
                    sx={{
                      color: isSelected ? "#e0e7ff" : "white",
                      minWidth: 44,
                      transition: "color 0.3s ease",
                    }}
                  >
                    {link.icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={link.name}
                    primaryTypographyProps={{
                      fontWeight: isSelected ? 600 : 500,
                      fontSize: "0.95rem",
                    }}
                  />
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>
      </Box>

      {/* Footer Section */}
      <Box sx={{ p: 3, pt: 2 }}>
        <Paper
          elevation={0}
          sx={{
            p: 2,
            bgcolor: "grey.50",
            borderRadius: 2,
            border: "1px solid",
            borderColor: "grey.200",
          }}
        >
          <Stack spacing={1}>
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ fontWeight: 500 }}
            >
              Healthcare Management System
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Version 2.0.1
            </Typography>
          </Stack>
        </Paper>
      </Box>
    </Box>
  );

  return (
    <Box
      component="nav"
      sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
      aria-label="navigation sidebar"
    >
      <Drawer
        variant={isMobile ? "temporary" : "permanent"}
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true,
        }}
        sx={{
          "& .MuiDrawer-paper": {
            boxSizing: "border-box",
            width: drawerWidth,
            bgcolor: "background.default",
            borderRight: "1px solid",
            borderColor: "divider",
            backgroundImage: "none",
          },
        }}
      >
        {drawer}
      </Drawer>
    </Box>
  );
};

export default Sidebar;
