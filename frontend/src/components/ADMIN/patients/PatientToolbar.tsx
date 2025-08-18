import { Box, TextField, InputAdornment } from "@mui/material";
import { Search as SearchIcon } from "@mui/icons-material";

interface PatientToolbarProps {
  onSearchChange: (value: string) => void;
  onDownloadPDF: () => void;
}

const PatientToolbar = ({
  onSearchChange,
}: PatientToolbarProps) => {
  return (
    <Box mb={3}>
      <TextField
        variant="outlined"
        placeholder="Search patients by name, email, or phone..."
        size="medium"
        fullWidth
        onChange={(e) => onSearchChange(e.target.value)} 
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
      />
    </Box>
  );
};

export default PatientToolbar;
