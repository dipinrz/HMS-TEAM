import { Box, Button, TextField, InputAdornment } from "@mui/material";
import { Search as SearchIcon } from "lucide-react";

interface Props {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onAddClick: () => void;
}

export default function DepartmentToolbar({ searchTerm, onSearchChange, onAddClick }: Props) {
  return (
    <Box display="flex" gap={2} mb={3}>
      <TextField
        variant="outlined"
        placeholder="Search department by name or description..."
        size="medium"
        fullWidth
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon color="gray" />
            </InputAdornment>
          ),
          sx: {
            borderRadius: 3,
            backgroundColor: "white",
            "& .MuiOutlinedInput-root": {
              "&:hover fieldset": { borderColor: "#1976d2" },
            },
          },
        }}
        sx={{
          "& .MuiOutlinedInput-root": {
            transition: "all 0.3s ease",
            "&:hover": {
              transform: "translateY(-1px)",
              boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
            },
          },
        }}
      />

      <Button
        variant="contained"
        size="large"
        sx={{
          borderRadius: 3,
          textTransform: "none",
          px: 4,
          py: 1.5,
          backgroundColor: "#46923c",
          color: "#fff",
          "&:hover": {
            backgroundColor: "#3b8123",
            transform: "translateY(-1px)",
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          },
          transition: "all 0.3s ease",
          width: 300,
          fontWeight: 600,
          letterSpacing: 0.5,
        }}
        onClick={onAddClick}
      >
        ADD DEPARTMENTS
      </Button>
    </Box>
  );
}
