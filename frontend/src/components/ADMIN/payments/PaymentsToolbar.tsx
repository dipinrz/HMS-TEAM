import React from "react";
import { Box, TextField, InputAdornment, Typography } from "@mui/material";
import { Search as SearchIcon } from "@mui/icons-material";

interface PaymentsToolbarProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
}

const PaymentsToolbar: React.FC<PaymentsToolbarProps> = ({ searchTerm, setSearchTerm }) => {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mb: 2 }}>
      <Typography
        variant="h4"
        fontWeight="bold"
        textAlign="center"
        sx={{
          px: 3,
          py: { xs: 3, sm: 2 },
          pt: { xs: 6, sm: 4, md: 3 },
          width: "100%",
          display: "block",
          boxSizing: "border-box",
        }}
      >
        Payments
      </Typography>

      <TextField
        placeholder="Search by Bill ID, Name or Transaction ID"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon color="action" />
            </InputAdornment>
          ),
          sx: {
            borderRadius: 3,
            backgroundColor: "white",
          },
        }}
        sx={{
          minWidth: 280,
        }}
      />
    </Box>
  );
};

export default PaymentsToolbar;
