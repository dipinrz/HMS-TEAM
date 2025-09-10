import * as React from "react";
import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Typography,
  Badge,
  MenuItem,
  Menu,
  useTheme,
  useMediaQuery,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Divider,
} from "@mui/material";
import AccountCircle from "@mui/icons-material/AccountCircle";
import MenuIcon from "@mui/icons-material/Menu";
import { Bell, Stethoscope } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import { useNavigate } from "react-router-dom";
import { listNotifications } from "../services/allAPI";
import { initSocket } from "../socket/socketClient";

type NavBarPropsType = {
  handleDrawerToggle: () => void;
};
interface Notification {
  id: number;
  senderId: number;
  receiverId: number;
  createdAt: string;
  status: string;
  title: string;
  message: string;
  appointmentId: null | number;
}
export const Navbar: React.FC<NavBarPropsType> = ({ handleDrawerToggle }) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [anchorNotif, setAnchorNotif] = React.useState<null | HTMLElement>(
    null
  );

  const [notifications, setNotifications] = React.useState<Notification[] | []>(
    []
  );
  const [count, setCount] = React.useState<null | number>(null);
  const userRole = "admin";
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const { user } = useAuthStore();
  const navigate = useNavigate();

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleGetProfile = () => {
    if (user?.role === "doctor") {
      navigate("/doctor/getProfile");
    } else if (user?.role === "patient") {
      const id = user?.user_id;
      navigate(`/patient/profile/${id}`);
    }
    setAnchorEl(null);
  };

  const handleNotifMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorNotif(event.currentTarget);
  };
  const handleNotifClose = () => {
    setAnchorNotif(null);
  };

  const fetchNotification = async () => {
    try {
      const response = await listNotifications();
      if (response.data.success) {
        setNotifications(response.data.data);
        const count = response.data.data.filter((notif: Notification) => {
          return notif.status == "unread" ? true : false;
        }).length;
        setCount(count);
      }
    } catch (error) {
      console.log("Error in fetching", error);
    }
  };

  React.useEffect(() => {
    fetchNotification();
    // SOCKET CONNECT EVERY REFRESH
    const user = JSON.parse(localStorage.getItem("authUser")!);
    if (user?.user_id) {
      initSocket(user?.user_id);
    }
    // custom event to refresh notifications when socket pushes new one
    const refreshHandler = () => fetchNotification();
    window.addEventListener("refreshNotifications", refreshHandler);

    return () => {
      window.removeEventListener("refreshNotifications", refreshHandler);
    };
  }, []);

  const drawer = (
    <Box sx={{ width: 250 }}>
      <Box sx={{ p: 2, display: "flex", alignItems: "center" }}>
        <Stethoscope
          style={{ fontSize: "20px", color: "#1976d2", marginRight: "5px" }}
        />
        <Typography variant="h6">HealthCare HMS</Typography>
      </Box>
      <Divider />
      <List>
        {["Dashboard", "Patients", "Doctors", "Appointments", "Reports"].map(
          (text) => (
            <ListItem key={text}>
              <ListItemText primary={text} />
            </ListItem>
          )
        )}
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: "flex" }}>
      <AppBar
        position="fixed"
        sx={{
          backgroundColor: "#fff",
          color: "black",
          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
          borderBottom: "1px solid #f4f3f3ff",
          zIndex: (theme) => theme.zIndex.drawer + 1,
        }}
      >
        <Toolbar
          sx={{
            display: "flex",
            flexDirection: isSmallScreen ? "column" : "row",
            alignItems: "center",
            justifyContent: "space-between",
            py: isSmallScreen ? 1 : 0,
            gap: isSmallScreen ? 1 : 0,
          }}
        >
          {/* Logo and Hamburger */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              order: isSmallScreen ? 1 : 0,
              width: isSmallScreen ? "100%" : "auto",
              justifyContent: isSmallScreen ? "space-between" : "flex-start",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center" }}>
              {isSmallScreen && (
                <IconButton
                  color="inherit"
                  aria-label="open drawer"
                  edge="start"
                  onClick={handleDrawerToggle}
                  sx={{ mr: 1 }}
                >
                  <MenuIcon />
                </IconButton>
              )}
              <Stethoscope
                style={{
                  fontSize: "20px",
                  color: "#1976d2",
                  marginRight: "5px",
                }}
              />
              <Typography
                variant="h6"
                component="div"
                sx={{
                  fontWeight: "bold",
                  fontFamily: '"Domine", serif',
                  fontSize: isSmallScreen ? "1.1rem" : "1.25rem",
                }}
              >
                HealthCare HMS
              </Typography>
            </Box>

            {isSmallScreen && (
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <IconButton
                  size="large"
                  aria-label="show notifications"
                  color="inherit"
                >
                  <Badge badgeContent={6} color="error">
                    <Bell size={20} />
                  </Badge>
                </IconButton>
                <IconButton
                  size="large"
                  aria-label="account of current user"
                  aria-controls="menu-appbar"
                  aria-haspopup="true"
                  onClick={handleMenu}
                  color="inherit"
                >
                  <AccountCircle sx={{ fontSize: 28, color: "primary.main" }} />
                </IconButton>
              </Box>
            )}
          </Box>

          {!isSmallScreen && (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                order: 2,
                ml: "auto",
              }}
            >
              <IconButton
                size="large"
                aria-label="show notifications"
                color="inherit"
                onClick={handleNotifMenu}
              >
                <Badge badgeContent={count} color="error">
                  <Bell size={20} />
                </Badge>
              </IconButton>
              <Menu
                anchorEl={anchorNotif}
                open={Boolean(anchorNotif)}
                onClose={handleNotifClose}
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                transformOrigin={{ vertical: "top", horizontal: "right" }}
              >
                {notifications.length === 0 ? (
                  <MenuItem>No new notifications</MenuItem>
                ) : (
                  notifications.map((notif) => (
                    <MenuItem
                      key={notif.id}
                      style={{
                        backgroundColor:
                          notif.status === "unread"
                            ? "rgba(214, 214, 219, 0.54)"
                            : "white",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                        }}
                      >
                        <div>
                          <strong
                            style={{
                              fontWeight:
                                notif.status === "unread" ? "bold" : "normal",
                            }}
                          >
                            {notif.title}
                            {notif.status === "unread" && (
                              <span
                                style={{
                                  width: "8px",
                                  height: "8px",
                                  borderRadius: "50%",
                                  backgroundColor: "red",
                                  display: "inline-block",
                                  padding:2,
                                  marginLeft:4,
                                }}
                              ></span>
                            )}
                          </strong>
                          <p
                            style={{
                              margin: 0,
                              fontSize: "0.8rem",
                              color:
                                notif.status === "UNREAD" ? "black" : "gray",
                            }}
                          >
                            {notif.message}
                          </p>
                          <span style={{ fontSize: "0.7rem", color: "#888" }}>
                            {new Date(notif.createdAt).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </MenuItem>
                  ))
                )}
              </Menu>

              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  ml: { xs: 0, sm: 2 },
                  p: { xs: 0.5, sm: 1 },
                  borderRadius: 2,
                  transition: "all 0.3s ease",
                  "&:hover": {
                    backgroundColor: "rgba(0, 0, 0, 0.03)",
                  },
                }}
              >
                <IconButton
                  size="medium"
                  aria-label="account of current user"
                  aria-controls="menu-appbar"
                  aria-haspopup="true"
                  onClick={handleMenu}
                  color="inherit"
                  sx={{
                    p: 1,
                    transition: "transform 0.2s ease",
                    "&:hover": {
                      transform: "scale(1.1)",
                      backgroundColor: "rgba(25, 118, 210, 0.1)",
                    },
                  }}
                >
                  <AccountCircle
                    sx={{
                      fontSize: { xs: 28, sm: 32 },
                      color: "primary.main",
                    }}
                  />
                </IconButton>

                <Box
                  sx={{
                    ml: { xs: 0.5, sm: 1.5 },
                    display: { xs: "none", sm: "flex" },
                    flexDirection: "column",
                    alignItems: "flex-start",
                  }}
                >
                  <Typography
                    variant="subtitle1"
                    sx={{
                      fontWeight: 600,
                      lineHeight: 1.3,
                      fontFamily: '"Inter", sans-serif',
                      color: "text.primary",
                      letterSpacing: 0.1,
                    }}
                  >
                    {user?.first_name}
                  </Typography>
                  <Box
                    sx={{
                      mt: 0.5,
                      px: 1.2,
                      py: 0.4,
                      fontSize: "0.65rem",
                      fontWeight: 700,
                      backgroundColor:
                        userRole === "admin"
                          ? "error.main"
                          : userRole === "doctor"
                          ? "success.main"
                          : "primary.main",
                      color: "white",
                      borderRadius: "12px",
                      boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                      textTransform: "uppercase",
                      fontFamily: '"Inter", sans-serif',
                      letterSpacing: 0.5,
                      transition: "all 0.3s ease",
                      "&:hover": {
                        transform: "translateY(-1px)",
                        boxShadow: "0 3px 6px rgba(0,0,0,0.15)",
                      },
                    }}
                  >
                    {user?.role}
                  </Box>
                </Box>
              </Box>
            </Box>
          )}
          <Menu
            id="menu-appbar"
            anchorEl={anchorEl}
            anchorOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            keepMounted
            transformOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            open={Boolean(anchorEl)}
            onClose={handleClose}
            sx={{
              zIndex: theme.zIndex.modal + 1,
            }}
          >
            <MenuItem onClick={() => handleGetProfile()}>Profile</MenuItem>
            <MenuItem onClick={handleClose}>Settings</MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>
      <Box component="nav">
        <Drawer
          variant="temporary"
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: "block", sm: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: 250,
            },
          }}
        >
          {drawer}
        </Drawer>
      </Box>
    </Box>
  );
};

export default Navbar;
