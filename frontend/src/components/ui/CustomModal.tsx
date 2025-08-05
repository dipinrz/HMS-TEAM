import React, { type ReactNode } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  useTheme,
  Typography,
  Box,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

interface CustomModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  content: ReactNode;
  actions?: ReactNode;
  maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
}

const CustomModal: React.FC<CustomModalProps> = ({
  open,
  onClose,
  title,
  content,
  actions,
  maxWidth = 'sm',
}) => {
  const theme = useTheme();

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth={maxWidth}
      fullWidth
      PaperProps={{
        elevation: 8,
        sx: {
          borderRadius: 3,
          backgroundColor: theme.palette.background.paper,
          boxShadow: `0 10px 30px rgba(0,0,0,0.1)`,
          textAlign: 'center',
        },
      }}
    >
      {title && (
        <DialogTitle
          sx={{
            p: 3,
            pb: 2,
          }}
        >
          <Box
            display="flex"
            alignItems="center"
            justifyContent="center"
            position="relative"
          >
            <Typography
              variant="h6"
              fontWeight={600}
              sx={{ width: '100%' }}
            >
              {title}
            </Typography>
            <IconButton
              onClick={onClose}
              sx={{
                position: 'absolute',
                right: 0,
                color: theme.palette.grey[600],
                '&:hover': {
                  backgroundColor: theme.palette.action.hover,
                },
              }}
            >
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
      )}

      <DialogContent
        sx={{
          px: 4,
          py: 2,
          color: theme.palette.text.primary,
        }}
      >
        {typeof content === 'string' ? (
          <Typography variant="body1" sx={{ lineHeight: 1.6 }}>
            {content}
          </Typography>
        ) : (
          content
        )}
      </DialogContent>

      {actions && (
        <DialogActions
          sx={{
            px: 3,
            py: 2,
            justifyContent: 'center',
            backgroundColor: theme.palette.background.default,
          }}
        >
          {actions}
        </DialogActions>
      )}
    </Dialog>
  );
};

export default CustomModal;
