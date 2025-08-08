"use client";

import React, { useState } from "react";
import {
  Box,
  Typography,
  IconButton,
  InputAdornment,
  Link as MuiLink,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import {
  Visibility,
  VisibilityOff,
  Favorite,
  Security,
  Group,
  MonitorHeart,
  Healing,
  VolunteerActivism,
} from "@mui/icons-material";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader } from "../../components/ui/CustomCards";
import CustomInput from "../../components/ui/CustomInput";
import { useAuthStore } from "../../store/useAuthStore";
import { useNavigate } from "react-router-dom";
import CustomButton from "../../components/ui/CustomButton";
import { toast } from "react-toastify";

const LoginPage: React.FC = () => {
  const theme = useTheme();
  const isLargeScreen = useMediaQuery(theme.breakpoints.up("lg"));

  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useAuthStore();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    console.log(`${name} changed to:`, value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const userData = await login(formData);
      setFormData({ email: "", password: "" });
      console.log("Login response:", userData);
      toast.success("Login successful!");
      if (userData?.role === "admin") {
        navigate("/admin");
      } else if (userData?.role === "doctor") {
        navigate("/doctor");
      } else if (userData?.role === "patient") {
        navigate("/patient");
      } else {
        navigate("/");
      }
    } catch (err) {
      toast.error("Invalid email or password");
      console.error("Login error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box
      minHeight="100vh"
      display="flex"
      flexDirection={{ xs: "column", lg: "row" }}
      bgcolor="linear-gradient(to right, #171f8fff, #ffffff)"
    >
      {isLargeScreen && (
        <Box
          width="50%"
          position="relative"
          display="flex"
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
          sx={{
            background:
              "linear-gradient(to bottom right, #4772e1ff, #1b1857ff)",
            color: "#fff",
            overflow: "hidden",
            px: 6,
          }}
        >
          {/* Floating Icons */}
          <Favorite
            sx={{
              position: "absolute",
              top: 10,
              left: 30,
              fontSize: 40,
              color: "white",
              opacity: 0.2,
              animation: "pulse 2s infinite",
            }}
          />

          <MonitorHeart
            sx={{
              position: "absolute",
              bottom: 10,
              right: 30,
              fontSize: 40,
              color: "white",
              opacity: 0.2,
              animation: "pulse 2s infinite 0.7s",
            }}
          />

          <Healing
            sx={{
              position: "absolute",
              top: 10,
              right: 30,
              fontSize: 40,
              color: "white",
              opacity: 0.2,
              animation: "pulse 2s infinite 0.5s",
            }}
          />

          <VolunteerActivism
            sx={{
              position: "absolute",
              bottom: 10,
              left: 30,
              fontSize: 40,
              color: "white",
              opacity: 0.2,
              animation: "pulse 2s infinite 1.4s",
            }}
          />

          <Box textAlign="center" zIndex={2}>
            <Box
              width={80}
              height={80}
              mb={2}
              mx="auto"
              borderRadius={2}
              display="flex"
              justifyContent="center"
              alignItems="center"
              bgcolor="rgba(255,255,255,0.2)"
              sx={{ backdropFilter: "blur(4px)" }}
            >
              <Favorite fontSize="large" />
            </Box>
            <Typography variant="h4" fontWeight={600}>
              HealthCare HMS
            </Typography>
            <Typography variant="subtitle1" color="blue.100" gutterBottom>
              Healthcare Management System
            </Typography>
            <Box
              display={"flex"}
              alignItems={"center"}
              justifyContent={"center"}
            >
              <Box mt={4}>
                <Box display="flex" alignItems="center" mb={2}>
                  <Security sx={{ mr: 1 }} />
                  <Typography>Secure Patient Data Management</Typography>
                </Box>
                <Box display="flex" alignItems="center" mb={2}>
                  <Group sx={{ mr: 1 }} />
                  <Typography>Staff & Resource Coordination</Typography>
                </Box>
                <Box display="flex" alignItems="center" mb={2}>
                  <MonitorHeart sx={{ mr: 1 }} />
                  <Typography>Real-time Health Monitoring</Typography>
                </Box>
              </Box>
            </Box>

            <Box
              mt={4}
              p={2}
              bgcolor="rgba(255,255,255,0.1)"
              borderRadius={2}
              sx={{ backdropFilter: "blur(4px)" }}
            >
              <Typography
                fontSize={25}
                fontFamily="Noticia Text, serif"
                fontStyle="italic"
                color="blue.100"
              >
                "In every challenge, there is a reason to keep going. Doctors
                guide, patients fight — both are heroes."
              </Typography>
            </Box>
          </Box>
        </Box>
      )}

      {/* Right Form Panel */}
      <Box
        width={{ xs: "100%", lg: "50%" }}
        display="flex"
        alignItems="center"
        justifyContent="center"
        p={4}
      >
        <Box width="100%" maxWidth={450}>
          {!isLargeScreen && (
            <Box textAlign="center" mb={4}>
              <Box
                width={64}
                height={64}
                bgcolor="primary.main"
                borderRadius={2}
                mx="auto"
                mb={1}
                display="flex"
                justifyContent="center"
                alignItems="center"
              >
                <Favorite sx={{ color: "#fff", fontSize: 32 }} />
              </Box>
              <Typography variant="h5" fontWeight={600}>
                MedCare HMS
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Healthcare Management System
              </Typography>
            </Box>
          )}

          <Card
            elevation={0}
            animated={false}
            sx={{
              backdropFilter: "blur(6px)",
              bgcolor: "rgba(248, 248, 248, 0.8)",
              borderRadius: 4,
              px: 6,
              boxShadow: `0 2px 16px rgba(71, 114, 225, 0.2),   
                          0 4px 19px rgba(27, 24, 87, 0.1)`,
            }}
          >
            <CardHeader
              sx={{ textAlign: "center" }}
              title="Welcome Back"
              subheader="Sign in to access your healthcare dashboard"
            />
            <CardContent>
              <form onSubmit={handleSubmit}>
                <CustomInput
                  label="Email Address"
                  name="email"
                  onChange={handleChange}
                  value={formData.email}
                  required
                />

                <CustomInput
                  label="Password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={handleChange}
                  required
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowPassword(!showPassword)}
                          edge="end"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />

                <CustomButton
                  type="submit"
                  fullWidth
                  disabled={isLoading}
                  variant="contained"
                  label={isLoading ? "Signing In..." : "Sign In to Dashboard"}
                  sx={{
                    mt: 3,
                    height: 44,
                    borderRadius: "12px",
                    background:
                      "linear-gradient(to bottom right, #4772e1ff, #1b1857ff)",
                    boxShadow: 3,
                    color: "#fff",
                    "&:hover": {
                      background:
                        "linear-gradient(to top left, #04064dff, #424bd1ff)",
                    },
                  }}
                />
              </form>

              <Typography variant="body2" textAlign="center" mt={3}>
                Need access to the system?{" "}
                <MuiLink component={Link} to="/signup">
                  Request Account
                </MuiLink>
              </Typography>

              <Box
                mt={3}
                p={2}
                bgcolor="blue.50"
                borderRadius={2}
                border="1px solid #cbd5e0"
              >
                <Box display="flex" alignItems="center">
                  <Typography
                    variant="caption"
                    fontWeight={500}
                    color="error"
                    textAlign={"center"}
                  >
                    Your data is protected with enterprise-grade security
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>

          <Box textAlign="center" mt={4} fontSize={12} color="gray.500">
            <Typography variant="caption">
              © 2025 HealthCare HMS. All rights reserved.
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default LoginPage;
