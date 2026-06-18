import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Alert,
  CircularProgress,
  Typography,
} from '@mui/material';
import api from '../services/api';

interface ChangePasswordDialogProps {
  open: boolean;
  onClose: () => void;
}

export const ChangePasswordDialog: React.FC<ChangePasswordDialogProps> = ({ open, onClose }) => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    // Front-end password validation
    if (newPassword.length < 8 || newPassword.length > 16) {
      setError('New password must be between 8 and 16 characters.');
      return;
    }
    if (!/[A-Z]/.test(newPassword)) {
      setError('New password must contain at least one uppercase letter.');
      return;
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(newPassword)) {
      setError('New password must contain at least one special character.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('New password and confirm password do not match.');
      return;
    }

    setLoading(true);

    try {
      await api.patch('/users/password', {
        currentPassword,
        newPassword,
      });

      setSuccess('Password changed successfully!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => {
        onClose();
        setSuccess(null);
      }, 1500);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to change password. Please check your current password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      PaperProps={{
        style: {
          backgroundColor: '#1e293b',
          color: '#f8fafc',
          borderRadius: '12px',
          width: '400px',
        },
      }}
    >
      <form onSubmit={handleSubmit}>
        <DialogTitle sx={{ fontWeight: 700 }}>Change Password</DialogTitle>
        <DialogContent>
          {error && <Alert severity="error" sx={{ mb: 2, borderRadius: '8px' }}>{error}</Alert>}
          {success && <Alert severity="success" sx={{ mb: 2, borderRadius: '8px' }}>{success}</Alert>}
          
          <TextField
            margin="dense"
            label="Current Password"
            type="password"
            fullWidth
            required
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            InputLabelProps={{ style: { color: '#94a3b8' } }}
            inputProps={{ style: { color: '#f8fafc' } }}
            sx={{
              mb: 2,
              '& .MuiOutlinedInput-root': {
                '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.1)' },
                '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.25)' },
                '&.Mui-focused fieldset': { borderColor: '#3b82f6' },
              },
            }}
          />
          <TextField
            margin="dense"
            label="New Password"
            type="password"
            fullWidth
            required
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            InputLabelProps={{ style: { color: '#94a3b8' } }}
            inputProps={{ style: { color: '#f8fafc' } }}
            sx={{
              mb: 2,
              '& .MuiOutlinedInput-root': {
                '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.1)' },
                '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.25)' },
                '&.Mui-focused fieldset': { borderColor: '#3b82f6' },
              },
            }}
          />
          <TextField
            margin="dense"
            label="Confirm New Password"
            type="password"
            fullWidth
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            InputLabelProps={{ style: { color: '#94a3b8' } }}
            inputProps={{ style: { color: '#f8fafc' } }}
            sx={{
              mb: 1,
              '& .MuiOutlinedInput-root': {
                '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.1)' },
                '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.25)' },
                '&.Mui-focused fieldset': { borderColor: '#3b82f6' },
              },
            }}
          />
          <Typography variant="caption" sx={{ color: '#64748b' }}>
            Password must be 8-16 characters, containing at least one uppercase letter and one special character.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button onClick={onClose} sx={{ color: '#94a3b8', textTransform: 'none' }}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={loading}
            sx={{
              background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
              textTransform: 'none',
              borderRadius: '6px',
              boxShadow: '0 4px 10px rgba(59, 130, 246, 0.3)',
              '&:hover': {
                background: 'linear-gradient(135deg, #2563eb 0%, #1e40af 100%)',
              },
            }}
          >
            {loading ? <CircularProgress size={20} sx={{ color: '#fff' }} /> : 'Update Password'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};
