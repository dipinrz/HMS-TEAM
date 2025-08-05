"use client"

import { useState } from "react"
import {
  Container,
  Typography,
  Button,
  Stack,
  Box,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  type SelectChangeEvent,
} from "@mui/material"
import { ThemeProvider, createTheme } from "@mui/material/styles"
import CssBaseline from "@mui/material/CssBaseline"
import CustomSnackbar from "../src/components/ui/SnackBar"

const theme = createTheme({
  palette: {
    mode: "light",
  },
})

type SnackbarSeverity = "success" | "error" | "info" | "warning"

export default function SnackbarDemo() {
  const [snackbarOpen, setSnackbarOpen] = useState(false)
  const [snackbarMessage, setSnackbarMessage] = useState("")
  const [snackbarSeverity, setSnackbarSeverity] = useState<SnackbarSeverity>("success")

  const handleOpenSnackbar = (message: string, severity: SnackbarSeverity) => {
    setSnackbarMessage(message)
    setSnackbarSeverity(severity)
    setSnackbarOpen(true)
  }

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false)
  }

  const handleSeverityChange = (event: SelectChangeEvent) => {
    setSnackbarSeverity(event.target.value as SnackbarSeverity)
  }

  const messages = {
    success: "Operation completed successfully!",
    error: "An error occurred while processing your request.",
    info: "Here is some important information for you.",
    warning: "Please be aware of this potential issue.",
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom align="center">
          Custom Snackbar Component Demo
        </Typography>

        <Typography variant="body1" paragraph align="center" color="text.secondary">
          A reusable Snackbar component built with Material UI v5, React, and TypeScript.
        </Typography>

        <Paper elevation={2} sx={{ p: 4, mt: 4 }}>
          <Typography variant="h5" gutterBottom>
            Try Different Snackbar Types
          </Typography>

          <Box sx={{ mb: 3 }}>
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Select Severity</InputLabel>
              <Select value={snackbarSeverity} label="Select Severity" onChange={handleSeverityChange}>
                <MenuItem value="success">Success</MenuItem>
                <MenuItem value="error">Error</MenuItem>
                <MenuItem value="info">Info</MenuItem>
                <MenuItem value="warning">Warning</MenuItem>
              </Select>
            </FormControl>
          </Box>

          <Stack direction="row" spacing={2} flexWrap="wrap" useFlexGap>
            <Button variant="contained" color="success" onClick={() => handleOpenSnackbar(messages.success, "success")}>
              Show Success
            </Button>

            <Button variant="contained" color="error" onClick={() => handleOpenSnackbar(messages.error, "error")}>
              Show Error
            </Button>

            <Button variant="contained" color="info" onClick={() => handleOpenSnackbar(messages.info, "info")}>
              Show Info
            </Button>

            <Button variant="contained" color="warning" onClick={() => handleOpenSnackbar(messages.warning, "warning")}>
              Show Warning
            </Button>

            <Button variant="outlined" onClick={() => handleOpenSnackbar(messages[snackbarSeverity], snackbarSeverity)}>
              Show Selected Type
            </Button>
          </Stack>

          <Box sx={{ mt: 4 }}>
            <Typography variant="h6" gutterBottom>
              Component Features:
            </Typography>
            <Typography component="div" variant="body2" color="text.secondary">
              <ul>
                <li>✅ TypeScript support with proper prop types</li>
                <li>✅ Material UI v5 Snackbar and Alert components</li>
                <li>✅ Customizable severity levels (success, error, info, warning)</li>
                <li>✅ Auto-hide duration (default: 3000ms)</li>
                <li>✅ Bottom-center positioning by default</li>
                <li>✅ Optional custom anchor origin positioning</li>
                <li>✅ Proper close handling (manual and auto)</li>
                <li>✅ Accessible with close button</li>
              </ul>
            </Typography>
          </Box>
        </Paper>

        <CustomSnackbar
          open={snackbarOpen}
          message={snackbarMessage}
          severity={snackbarSeverity}
          onClose={handleCloseSnackbar}
          autoHideDuration={3000}
        />
      </Container>
    </ThemeProvider>
  )
}


