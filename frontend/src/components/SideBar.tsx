import React, { useEffect, useState } from "react";
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
  Paper,
  Chip,
  Button,
  
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
   Description   as MedicalReportIcon,     
   ReceiptLong as PaymentIcon
} from "@mui/icons-material";
import { Link, useLocation } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import { LogOutIcon, Stethoscope, User } from "lucide-react";
import { useDoctorStore } from "../store/doctorStore";


const drawerWidth = 280;

type SidebarProps = {
  mobileOpen: boolean;
  handleDrawerToggle: () => void;
};

type UserRole = "admin" | "doctor" | "patient";

const Sidebar: React.FC<SidebarProps> = ({
  mobileOpen,
  handleDrawerToggle,
}) => {
  const { user, logout } = useAuthStore();
  const {fetchHeadDoctor,isHeadDoctor}=useDoctorStore()
  const location = useLocation();
  const isMobile = useMediaQuery((theme: Theme) =>
    theme.breakpoints.down("sm")
  );
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    fetchHeadDoctor();
    return () => clearInterval(timer);
  }, []);

  const getLinksForRole = (role: UserRole) => {
    const basePath = `/${role}`;

    const commonLinks = [
      {
        path: `${basePath}/dashboard`,
        name: "Dashboard",
        icon: <DashboardIcon />,
      },
    ];

    const roleSpecificLinks = {
      admin: [
        { path: "/admin/users", name: "Patients", icon: <PeopleIcon /> },
        {
          path: "/admin/departments",
          name: "Departments",
          icon: <HospitalIcon />,
        },
        {
          path: "/admin/medicines",
          name: "Medicines",
          icon: <MedicationIcon />,
        },
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
        {
          path: "/doctor/patients",
          name: "Patients",
          icon: <User/>
        },
      ],
      patient: [
        {
          path: "/patient/book-appointments",
          name: "Book Appointments",
          icon: <CalendarIcon />,
        },
        { path: "/patient/doctors", name: "Doctors", icon: <DoctorIcon /> },
        { path: "/patient/medical-record", name: "Medical Records", icon: <MedicalReportIcon/> },
        { path: "/patient/appointments", name: "Appointments", icon: <DoctorIcon /> },
        { path: "/patient/payment-history", name: "Payments", icon: <PaymentIcon /> },
      ],
    };

    if (isHeadDoctor) {
      roleSpecificLinks.doctor.push({
      path: "/doctor/doctors",
      name: "Doctors",
      icon: <Stethoscope/>, // Replace with actual icon
      });
    }
    return [...commonLinks, ...(roleSpecificLinks[role] || [])];

  };

  
  const allLinks = getLinksForRole(user?.role as UserRole);

  const handleLogout = () => {
    logout();
  };

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
    <Box
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        mt: { xs: "10vh", lg: 0 },
      }}
    >
      <Toolbar />

      <Box sx={{ p: 3, pb: 2, flexShrink: 0 }}>
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
            {user?.first_name.toUpperCase()} {user?.last_name.toUpperCase()}
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

      <Divider sx={{ mx: 2, mb: 1, flexShrink: 0 }} />

      <Box
        sx={{
          flex: 1,
          px: 2,
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Typography
        variant="body2"
        color="text.secondary"
        component = 'div'
        sx={{ mt: 0.5, fontSize: { xs: "0.8rem", sm: "0.9rem" } }}
      >
        <Box style={{textAlign:"center"}}>{currentTime.toLocaleDateString("en-US", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        })}</Box>{" "}
         <Box style={{textAlign:"center"}}>{currentTime.toLocaleTimeString("en-US")}</Box>
      </Typography>
      <br />

        <Box
          sx={{
            flex: 1,
            overflow: "auto",
            // Hide scrollbar but keep scroll functionality
            "&::-webkit-scrollbar": {
              display: "none",
            },
            scrollbarWidth: "none", // Firefox
            msOverflowStyle: "none", // IE/Edge
          }}
        >
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
                      color: "white",
                      background: isSelected
                        ? getRoleColor(user?.role || "admin")
                        : "linear-gradient(135deg, #020aa5ff 0%, #0a036bff 100%)",
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
                        bgcolor: isSelected
                          ? getRoleColor(user?.role || "admin")
                          : "rgba(2, 10, 165, 0.8)",
                        transform: "translateX(2px)",
                        filter: "brightness(1.1)",
                      },
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        color: "white",
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
                        color: "white",
                      }}
                    />
                  </ListItemButton>
                </ListItem>
              );
            })}
          </List>
        </Box>
      </Box>

      <Box sx={{ px: 2, py: 1.5, mt: "auto" }}>
        <Button
          fullWidth
          startIcon={<LogOutIcon />}
          onClick={handleLogout}
          sx={{
            justifyContent: "flex-start",
            color: "#ff6b6b",
            backgroundColor: "rgba(255, 107, 107, 0.1)",
            borderRadius: 2,
            px: 3,
            py: 1.5,
            textTransform: "none",
            fontWeight: 500,
            transition: "all 0.3s ease",
            "&:hover": {
              backgroundColor: "rgba(255, 107, 107, 0.2)",
              transform: "translateX(2px)",
            },
          }}
        >
          Logout
        </Button>
      </Box>
    </Box>
  );

  return (
    <Box
      component="nav"
      sx={{
        width: { sm: drawerWidth },
        flexShrink: { sm: 0 },
        zIndex: (theme) => theme.zIndex.drawer,
      }}
      aria-label="navigation sidebar"
    >
      <Drawer
        variant={isMobile ? "temporary" : "permanent"}
        open={isMobile ? mobileOpen : true}
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
            zIndex: (theme) => theme.zIndex.drawer,
            ...(isMobile
              ? {
                  // Mobile drawer
                  height: "100vh",
                  position: "fixed",
                  top: 0,
                  left: 0,
                }
              : {
                  // Desktop drawer
                  position: "fixed",
                  height: "100vh",
                  top: 0,
                  left: 0,
                }),
          },
        }}
      >
        {drawer}
      </Drawer>
    </Box>
  );
};

export default Sidebar;
