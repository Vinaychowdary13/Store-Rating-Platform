import React from 'react';
import { Box, Typography, Button, Container } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

export const NotFound: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        background: 'radial-gradient(circle at center, #1e293b 0%, #0f172a 100%)',
        color: '#f8fafc',
      }}
    >
      <Container maxWidth="sm" sx={{ textAlign: 'center' }}>
        <ErrorOutlineIcon sx={{ fontSize: 80, color: '#f59e0b', mb: 3 }} />
        <Typography variant="h1" sx={{ fontSize: '6rem', fontWeight: 800, mb: 1, color: '#f59e0b' }}>
          404
        </Typography>
        <Typography variant="h4" sx={{ fontWeight: 600, mb: 2 }}>
          Page Not Found
        </Typography>
        <Typography variant="body1" sx={{ color: '#94a3b8', mb: 4 }}>
          The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
        </Typography>
        <Button
          variant="contained"
          onClick={() => navigate('/')}
          sx={{
            background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
            textTransform: 'none',
            fontSize: '1rem',
            padding: '10px 24px',
            borderRadius: '8px',
            boxShadow: '0 4px 14px rgba(59, 130, 246, 0.4)',
            '&:hover': {
              background: 'linear-gradient(135deg, #2563eb 0%, #1e40af 100%)',
            },
          }}
        >
          Go Back Home
        </Button>
      </Container>
    </Box>
  );
};
