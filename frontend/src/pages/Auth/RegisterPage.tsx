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
  MenuItem,
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
import { Link, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader } from "../../components/ui/CustomCards";
import CustomInput from "../../components/ui/CustomInput";
import CustomButton from "../../components/ui/CustomButton";
import { useAuthStore } from "../../store/useAuthStore";
import { toast } from "react-toastify";

const RegisterPage: React.FC = () => {
  const theme = useTheme();
  const isLargeScreen = useMediaQuery(theme.breakpoints.up("lg"));

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const { register } = useAuthStore();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setIsLoading(true);
    try {
      await register(formData);
      toast.success("Account created successfully!");
      navigate("/patient");
    } catch (err: any) {
      toast.error(err?.message || "Registration failed");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box
      minHeight="100vh"
      display="flex"
      flexDirection={{ xs: "column", lg: "row" }}
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
            background: "linear-gradient(to bottom right, #4772e1ff, #1b1857ff)",
            color: "#fff",
            overflow: "hidden",
            px: 6,
          }}
        >
          {/* Floating Icons */}
          <Favorite sx={{ position: "absolute", top: 10, left: 30, fontSize: 40, opacity: 0.2 }} />
          <MonitorHeart sx={{ position: "absolute", bottom: 10, right: 30, fontSize: 40, opacity: 0.2 }} />
          <Healing sx={{ position: "absolute", top: 10, right: 30, fontSize: 40, opacity: 0.2 }} />
          <VolunteerActivism sx={{ position: "absolute", bottom: 10, left: 30, fontSize: 40, opacity: 0.2 }} />

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
            <Typography variant="subtitle1" gutterBottom>
              Join our Healthcare Management System
            </Typography>
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
        <Box width="100%" maxWidth={500}>
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
            </Box>
          )}

          <Card
            elevation={0}
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
              title="Create Account"
              subheader="Fill in the details to register"
            />
            <CardContent>
              <form onSubmit={handleSubmit}>
                <CustomInput
                  label="First Name"
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleChange}
                  required
                />

                <CustomInput
                  label="Last Name"
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleChange}
                  required
                />

                <CustomInput
                  label="Email Address"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
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

                <CustomInput
                  label="Confirm Password"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          edge="end"
                        >
                          {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
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
                  label={isLoading ? "Creating Account..." : "Register"}
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
                Already have an account?{" "}
                <MuiLink component={Link} to="/ ">
                  Sign In
                </MuiLink>
              </Typography>
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

export default RegisterPage;
