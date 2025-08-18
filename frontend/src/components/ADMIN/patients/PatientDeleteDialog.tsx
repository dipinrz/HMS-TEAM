import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from "@mui/material";

interface PatientDeleteDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const PatientDeleteDialog = ({ open, onClose, onConfirm }: PatientDeleteDialogProps) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Confirm Delete</DialogTitle>
      <DialogContent>
        Are you sure you want to delete this patient?
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={onConfirm} color="error" variant="contained">
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PatientDeleteDialog;
