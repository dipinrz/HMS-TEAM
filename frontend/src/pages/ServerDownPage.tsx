import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Typography,
  Container,
} from '@mui/material';
import {
  Home,
  LocalHospital,
  HealthAndSafety,
} from '@mui/icons-material';
import { styled, keyframes } from '@mui/material/styles';
import { useEffect } from 'react';

// Simple fade-in animation
const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

// Main container
const PageContainer = styled(Box)(({ theme }) => ({
  minHeight: '100vh',
  background: 'linear-gradient(135deg, #f5f9ff 0%, #e6f2ff 100%)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: theme.spacing(2),
  fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
}));

// Content container
const ContentContainer = styled(Box)(() => ({
  textAlign: 'center',
  animation: `${fadeIn} 0.8s ease-out`,
  maxWidth: '600px',
  width: '100%',
}));

// Secondary action button
const SecondaryButton = styled(Button)(({ theme }) => ({
  color: '#1976d2',
  border: '1px solid #1976d2',
  borderRadius: theme.spacing(1),
  padding: theme.spacing(1.5, 3),
  fontWeight: 600,
  textTransform: 'none',
  fontSize: '1rem',
  '&:hover': {
    backgroundColor: 'rgba(25, 118, 210, 0.04)',
    border: '1px solid #1565c0',
  },
}));

export default function ServerDownPage() {
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('authToken');
    localStorage.removeItem('authUser');

  }, []);

  const handleGoHome = () => {
  window.history.replaceState(null, '', '/');
  navigate('/', { replace: true });
};


  return (
    <PageContainer>
      <Container maxWidth="sm">
        <ContentContainer>
          {/* Header Brand */}
          <Box display="flex" alignItems="center" justifyContent="center" gap={1} mb={3}>
            <LocalHospital sx={{ fontSize: 36, color: 'primary.main' }} />
            <Typography
              variant="h4"
              sx={{
                fontWeight: 700,
                color: 'primary.main',
              }}
            >
              HealthCare HMS
            </Typography>
          </Box>

          {/* Main Heading */}
          <Typography
            variant="h3"
            sx={{
              fontWeight: 600,
              color: 'text.primary',
              mb: 2,
            }}
          >
            Service Unavailable
          </Typography>

          {/* Subtitle */}
          <Typography
            variant="h6"
            sx={{
              color: 'text.secondary',
              mb: 3,
              lineHeight: 1.5,
              fontWeight: 400,
            }}
          >
            We're experiencing temporary connectivity issues with our Hospital Management System.
            Our technical team is working to restore service.
          </Typography>

          {/* Apology Message */}
          <Typography
            variant="body1"
            sx={{
              color: 'text.primary',
              mb: 4,
              fontWeight: 500,
              fontSize: '1.1rem',
            }}
          >
            Sorry for the inconvenience.
          </Typography>

          {/* Action Button */}
          <Box mb={4}>
            <SecondaryButton
              size="large"
              startIcon={<Home />}
              onClick={handleGoHome}
            >
              Return Home
            </SecondaryButton>
          </Box>

          {/* Emergency Notice */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 2,
              backgroundColor: 'info.light',
              color: 'info.dark',
              p: 2,
              borderRadius: 1,
              border: '1px solid',
              borderColor: 'info.main',
            }}
          >
            <HealthAndSafety sx={{ fontSize: 24 }} />
            <Box textAlign="left">
              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                We'll be back soon
              </Typography>
              <Typography variant="body2" sx={{ fontSize: '0.875rem' }}>
                Thank you for your patience while we restore service
              </Typography>
            </Box>
          </Box>
        </ContentContainer>
      </Container>
    </PageContainer>
  );
}