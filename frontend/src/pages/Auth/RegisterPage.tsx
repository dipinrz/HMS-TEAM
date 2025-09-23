"use client";

import React, { useState } from "react";
import {
  Box,
  Typography,
  Link as MuiLink,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import {
  Favorite,
  MonitorHeart,
  Healing,
  VolunteerActivism,
} from "@mui/icons-material";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader } from "../../components/ui/CustomCards";

import EmailOtp from "./EmailOtp";
import RegisterForm from "./RegisterForm";

const RegisterPage: React.FC = () => {
  const theme = useTheme();
  const isLargeScreen = useMediaQuery(theme.breakpoints.up("lg"));

  const [isOtpVerify, setIsOtpVerify] = useState(false);
  const [verifiedEmail, setVerifiedEmail] = useState<string>("");

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
              opacity: 0.2,
            }}
          />
          <MonitorHeart
            sx={{
              position: "absolute",
              bottom: 10,
              right: 30,
              fontSize: 40,
              opacity: 0.2,
            }}
          />
          <Healing
            sx={{
              position: "absolute",
              top: 10,
              right: 30,
              fontSize: 40,
              opacity: 0.2,
            }}
          />
          <VolunteerActivism
            sx={{
              position: "absolute",
              bottom: 10,
              left: 30,
              fontSize: 40,
              opacity: 0.2,
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
            {isOtpVerify ? (
              <CardHeader
                sx={{ textAlign: "center" }}
                title="Create Account"
                subheader="Fill in the details to register"
              />
            ) : (
              <CardHeader
                sx={{ textAlign: "center" }}
                title="Email Verification"
                subheader="Verify You email here"
              />
            )}

            <CardContent sx={{ minHeight: 300, minWidth: 400 }}>
              {!isOtpVerify ? (
                <EmailOtp
                  setIsOtpVerify={setIsOtpVerify}
                  setVerifiedEmail={setVerifiedEmail}
                />
              ) : (
                <RegisterForm email={verifiedEmail} />
              )}

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
