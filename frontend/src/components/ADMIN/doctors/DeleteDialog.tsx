import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from "@mui/material";

interface DeleteDialogProps {
  openDeleteDialog: boolean;
  handleCloseDeleteDialog: () => void;
  handleDeleteDoctor: () => void;
}

export const DeleteDialog = ({
  openDeleteDialog,
  handleCloseDeleteDialog,
  handleDeleteDoctor,
}: DeleteDialogProps) => {
  return (
    <Dialog open={openDeleteDialog} onClose={handleCloseDeleteDialog}>
      <DialogTitle>Confirm Delete</DialogTitle>
      <DialogContent>
        Are you sure you want to delete this doctor?
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCloseDeleteDialog} color="primary">
          Cancel
        </Button>
        <Button onClick={handleDeleteDoctor} color="error" variant="contained">
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
};