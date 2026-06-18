import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Chip,
  IconButton,
  Tooltip,
} from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import KeyIcon from '@mui/icons-material/Key';
import StorefrontIcon from '@mui/icons-material/Storefront';
import { ChangePasswordDialog } from './ChangePasswordDialog';

export const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [passwordOpen, setPasswordOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getRoleColor = (role?: string) => {
    switch (role) {
      case 'ADMIN':
        return '#f43f5e';
      case 'STORE_OWNER':
        return '#8b5cf6';
      default:
        return '#10b981';
    }
  };

  return (
    <>
      <AppBar
        position="sticky"
        sx={{
          background: 'rgba(15, 23, 42, 0.8)',
          backdropFilter: 'blur(12px)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
          boxShadow: 'none',
        }}
      >
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Box
            sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}
            onClick={() => {
              if (user?.role === 'ADMIN') navigate('/admin');
              else if (user?.role === 'STORE_OWNER') navigate('/owner');
              else navigate('/');
            }}
          >
            <StorefrontIcon sx={{ color: '#3b82f6', mr: 1.5, fontSize: 28 }} />
            <Typography
              variant="h6"
              sx={{
                fontWeight: 800,
                letterSpacing: '0.5px',
                background: 'linear-gradient(135deg, #3b82f6 0%, #60a5fa 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              RateStore
            </Typography>
          </Box>

          {user && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                <Typography variant="body2" sx={{ fontWeight: 600, color: '#f8fafc' }}>
                  {user.name.length > 25 ? `${user.name.substring(0, 22)}...` : user.name}
                </Typography>
                <Typography variant="caption" sx={{ color: '#94a3b8' }}>
                  {user.email}
                </Typography>
              </Box>
              
              <Chip
                label={user.role}
                size="small"
                sx={{
                  backgroundColor: 'rgba(255, 255, 255, 0.03)',
                  color: getRoleColor(user.role),
                  border: `1px solid ${getRoleColor(user.role)}40`,
                  fontWeight: 700,
                  fontSize: '0.75rem',
                  borderRadius: '6px',
                }}
              />

              <Box sx={{ display: 'flex', gap: 0.5 }}>
                <Tooltip title="Change Password">
                  <IconButton
                    onClick={() => setPasswordOpen(true)}
                    size="small"
                    sx={{
                      color: '#94a3b8',
                      backgroundColor: 'rgba(255, 255, 255, 0.02)',
                      border: '1px solid rgba(255, 255, 255, 0.05)',
                      borderRadius: '8px',
                      p: 1,
                      '&:hover': {
                        color: '#f8fafc',
                        backgroundColor: 'rgba(255, 255, 255, 0.08)',
                      },
                    }}
                  >
                    <KeyIcon fontSize="small" />
                  </IconButton>
                </Tooltip>

                <Tooltip title="Log Out">
                  <IconButton
                    onClick={handleLogout}
                    size="small"
                    sx={{
                      color: '#f43f5e',
                      backgroundColor: 'rgba(244, 63, 94, 0.05)',
                      border: '1px solid rgba(244, 63, 94, 0.15)',
                      borderRadius: '8px',
                      p: 1,
                      '&:hover': {
                        color: '#fff',
                        backgroundColor: 'rgba(244, 63, 94, 0.8)',
                      },
                    }}
                  >
                    <LogoutIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Box>
            </Box>
          )}
        </Toolbar>
      </AppBar>

      <ChangePasswordDialog open={passwordOpen} onClose={() => setPasswordOpen(false)} />
    </>
  );
};
