import React, { useState } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Button, FormControl, FormLabel, InputAdornment,
  Box
} from "@mui/material";

interface MedicineFormData {
  medicine_name: string;
  description: string;
  cost: string;
  expiry_date: string;
}

interface AddMedicineModalProps {
  open: boolean;
  onClose: () => void; 
  onSubmit: (data: Omit<MedicineFormData, 'cost'> & { cost: number }) => void;
}


export const AddMedicineModal: React.FC<AddMedicineModalProps> = ({ open, onClose, onSubmit }) => {
  const [newMedicine, setNewMedicine] = useState<MedicineFormData>({
    medicine_name: '',
    description: '',
    cost: '',
    expiry_date: ''
  });
  const [errors, setErrors] = useState({
    medicine_name: '',
    cost: '',
    description: '',
    expiry_date: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewMedicine(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    let valid = true;
    const newErrors = {
      medicine_name: '',
      description: '',
      cost: '',
      expiry_date: ''
    };

    if (!newMedicine.medicine_name.trim()) {
      newErrors.medicine_name = 'Medicine name is required';
      valid = false;
    }
    if (!newMedicine.description.trim()) {
      newErrors.description = 'Description is required';
      valid = false;
    }

    if (!newMedicine.cost) {
      newErrors.cost = 'Cost is required';
      valid = false;
    } else if (isNaN(Number(newMedicine.cost))) {
      newErrors.cost = 'Cost must be a number';
      valid = false;
    }

    if (!newMedicine.expiry_date) {
      newErrors.expiry_date = 'Expiry date is required';
      valid = false;
    } else if (new Date(newMedicine.expiry_date) < new Date()) {
      newErrors.expiry_date = 'Expiry date cannot be in the past';
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleCancel = () => {
    // Reset form and close modal
    setNewMedicine({
      medicine_name: '',
      description: '',
      cost: '',
      expiry_date: ''
    });
    setErrors({
      medicine_name: '',
      description: '',
      cost: '',
      expiry_date: ''
    });
    onClose();
  };

  const handleSubmitAndClose = () => {
    if (!validateForm()) return;

    onSubmit({
      ...newMedicine,
      cost: parseFloat(newMedicine.cost)
    });
    
    // Reset form
    setNewMedicine({
      medicine_name: '',
      description: '',
      cost: '',
      expiry_date: ''
    });
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleCancel} 
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 4,
          p: 2,
        }
      }}
    >
      <DialogTitle sx={{ 
        fontSize: '1.5rem',
        fontWeight: 'bold',
        color: '#1976d2',
        textAlign: 'center',
        py: 3
      }}>
        Add New Medicine
      </DialogTitle>
      <DialogContent>
        <Box component="form" sx={{ mt: 2 }}>
          <FormControl fullWidth sx={{ mb: 3 }}>
            <FormLabel sx={{ mb: 1, fontWeight: '600', color: 'text.primary' }}>
              Medicine Name*
            </FormLabel>
            <TextField
              name="medicine_name"
              value={newMedicine.medicine_name}
              onChange={handleInputChange}
              placeholder="Enter medicine name"
              fullWidth
              error={!!errors.medicine_name}
              helperText={errors.medicine_name}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                }
              }}
            />
          </FormControl>

          <FormControl fullWidth sx={{ mb: 3 }}>
            <FormLabel sx={{ mb: 1, fontWeight: '600', color: 'text.primary' }}>
              Description*
            </FormLabel>
            <TextField
              name="description"
              value={newMedicine.description}
              onChange={handleInputChange}
              placeholder="Enter description"
              fullWidth
              error={!!errors.description}
              helperText={errors.description}
              multiline
              rows={3}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                }
              }}
            />
          </FormControl>

          <FormControl fullWidth sx={{ mb: 3 }}>
            <FormLabel sx={{ mb: 1, fontWeight: '600', color: 'text.primary' }}>
              Cost*
            </FormLabel>
            <TextField
              name="cost"
              type="number"
              value={newMedicine.cost}
              onChange={handleInputChange}
              placeholder="Enter cost"
              fullWidth
              error={!!errors.cost}
              helperText={errors.cost}
              InputProps={{
                startAdornment: <InputAdornment position="start">$</InputAdornment>,
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                }
              }}
            />
          </FormControl>

          <FormControl fullWidth sx={{ mb: 2 }}>
            <FormLabel sx={{ mb: 1, fontWeight: '600', color: 'text.primary' }}>
              Expiry Date*
            </FormLabel>
            <TextField
              name="expiry_date"
              type="date"
              value={newMedicine.expiry_date}
              onChange={handleInputChange}
              fullWidth
              error={!!errors.expiry_date}
              helperText={errors.expiry_date}
              InputLabelProps={{
                shrink: true,
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                }
              }}
            />
          </FormControl>
        </Box>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button
            onClick={handleCancel}
          variant="outlined"
          sx={{
            borderRadius: 2,
            px: 3,
            py: 1,
            textTransform: 'none',
            color: '#64748b',
            borderColor: '#e2e8f0',
            '&:hover': {
              borderColor: '#cbd5e1',
              backgroundColor: 'rgba(203, 213, 225, 0.1)'
            }
          }}
        >
          Cancel
        </Button>
        <Button
          onClick={handleSubmitAndClose}
          variant="contained"
          sx={{
            borderRadius: 2,
            px: 3,
            py: 1,
            textTransform: 'none',
            backgroundColor: '#1976d2',
            '&:hover': {
              backgroundColor: '#1565c0'
            }
          }}
        >
          Add Medicine
        </Button>
      </DialogActions>
    </Dialog>
  );
};