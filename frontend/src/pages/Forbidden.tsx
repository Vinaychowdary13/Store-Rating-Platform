import React from 'react';
import { Box, Typography, Button, Container } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import BlockIcon from '@mui/icons-material/Block';

export const Forbidden: React.FC = () => {
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
        <BlockIcon sx={{ fontSize: 80, color: '#f43f5e', mb: 3 }} />
        <Typography variant="h1" sx={{ fontSize: '6rem', fontWeight: 800, mb: 1, color: '#f43f5e' }}>
          403
        </Typography>
        <Typography variant="h4" sx={{ fontWeight: 600, mb: 2 }}>
          Access Denied
        </Typography>
        <Typography variant="body1" sx={{ color: '#94a3b8', mb: 4 }}>
          You do not have permission to view this resource. Please verify your account privileges or log in with a different role.
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
          Return to Safety
        </Button>
      </Container>
    </Box>
  );
};
