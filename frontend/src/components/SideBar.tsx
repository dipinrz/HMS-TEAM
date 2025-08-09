import React from 'react';
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
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  LocalHospital as HospitalIcon,
  Medication as MedicationIcon,
  CalendarToday as CalendarIcon,
  Description as PrescriptionIcon,
  MedicalServices as DoctorIcon,
} from '@mui/icons-material';
import { Link, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';

const drawerWidth = 240;

type SidebarProps = {
  mobileOpen: boolean;
  handleDrawerToggle: () => void;
};

type UserRole = 'admin' | 'doctor' | 'patient';

const Sidebar: React.FC<SidebarProps> = ({ mobileOpen, handleDrawerToggle }) => {
  const { user } = useAuthStore();
  const location = useLocation();
  const isMobile = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'));

  const commonLinks = [
    { path: '/dashboard', name: 'Dashboard', icon: <DashboardIcon /> },
  ];

  const roleLinks = {
    admin: [
      { path: '/admin/users', name: 'Users', icon: <PeopleIcon /> },
      { path: '/admin/departments', name: 'Departments', icon: <HospitalIcon /> },
      { path: '/admin/medicines', name: 'Medicines', icon: <MedicationIcon /> },
      { path: '/admin/doctors', name: 'Doctors', icon: <DoctorIcon /> },
    ],
    doctor: [
      { path: '/doctor/appointments', name: 'Appointments', icon: <CalendarIcon /> },
      { path: '/doctor/prescriptions', name: 'Prescriptions', icon: <PrescriptionIcon /> },
    ],
    patient: [
      { path: '/patient/appointments', name: 'Appointments', icon: <CalendarIcon /> },
      { path: '/patient/doctors', name: 'Doctors', icon: <DoctorIcon /> },
    ],
  };

  const allLinks = [...commonLinks, ...(roleLinks[user?.role as UserRole] || [])];

  const drawer = (
    <div>
      <Toolbar />
      <Divider />
      <List>
        {allLinks.map((link) => (
          <ListItem key={link.path} disablePadding>
            <ListItemButton
              component={Link}
              to={link.path}
              selected={location.pathname.startsWith(link.path)}
              onClick={isMobile ? handleDrawerToggle : undefined}
            >
              <ListItemIcon sx={{ color: 'inherit' }}>
                {link.icon}
              </ListItemIcon>
              <ListItemText primary={link.name} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </div>
  );

  return (
    <Box
      component="nav"
      sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
      aria-label="navigation sidebar"
    >
      <Drawer
        variant={isMobile ? 'temporary' : 'permanent'}
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true,
        }}
        sx={{
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: drawerWidth,
          },
        }}
      >
        {drawer}
      </Drawer>
    </Box>
  );
};

export default Sidebar;