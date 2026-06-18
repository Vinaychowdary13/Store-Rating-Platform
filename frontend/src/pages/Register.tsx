import React, { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Alert,
  CircularProgress,
  Container,
  FormHelperText,
} from '@mui/material';
import PersonAddOutlinedIcon from '@mui/icons-material/PersonAddOutlined';

export const Register: React.FC = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [address, setAddress] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<any[]>([]);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const validateLocal = (): string | null => {
    if (name.length < 20 || name.length > 60) {
      return 'Full Name must be between 20 and 60 characters.';
    }
    if (password.length < 8 || password.length > 16) {
      return 'Password must be between 8 and 16 characters.';
    }
    if (!/[A-Z]/.test(password)) {
      return 'Password must contain at least one uppercase letter.';
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      return 'Password must contain at least one special character.';
    }
    if (!address.trim()) {
      return 'Address is required.';
    }
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setValidationErrors([]);
    
    // Client-side validation check
    const localErr = validateLocal();
    if (localErr) {
      setError(localErr);
      return;
    }

    setLoading(true);

    try {
      await register({
        name,
        email,
        password,
        address,
      });
      setSuccess(true);
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err: any) {
      const errMsg = err.response?.data?.message || 'Registration failed. Please check details.';
      setError(errMsg);
      if (err.response?.data?.errors) {
        setValidationErrors(err.response.data.errors);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)',
        py: 4,
      }}
    >
      <Container maxWidth="xs">
        <Card
          sx={{
            background: 'rgba(30, 41, 59, 0.7)',
            backdropFilter: 'blur(16px)',
            borderRadius: '16px',
            border: '1px solid rgba(255, 255, 255, 0.05)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
            color: '#f8fafc',
          }}
        >
          <CardContent sx={{ p: 4 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
              <Box
                sx={{
                  width: 48,
                  height: 48,
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mb: 1.5,
                  boxShadow: '0 4px 10px rgba(16, 185, 129, 0.3)',
                }}
              >
                <PersonAddOutlinedIcon sx={{ color: '#fff' }} />
              </Box>
              <Typography variant="h5" sx={{ fontWeight: 700, letterSpacing: '0.5px' }}>
                Create Account
              </Typography>
              <Typography variant="body2" sx={{ color: '#94a3b8', mt: 0.5 }}>
                Register as a standard user
              </Typography>
            </Box>

            {success && (
              <Alert severity="success" sx={{ mb: 2.5, borderRadius: '8px' }}>
                Account created! Redirecting to login...
              </Alert>
            )}

            {error && (
              <Alert severity="error" sx={{ mb: 2.5, borderRadius: '8px' }}>
                {error}
                {validationErrors.length > 0 && (
                  <Box component="ul" sx={{ pl: 2, mt: 1, mb: 0 }}>
                    {validationErrors.map((err, index) => (
                      <li key={index}>
                        <strong>{err.field}</strong>: {err.message}
                      </li>
                    ))}
                  </Box>
                )}
              </Alert>
            )}

            <form onSubmit={handleSubmit}>
              <TextField
                margin="dense"
                required
                fullWidth
                id="name"
                label="Full Name"
                name="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                InputLabelProps={{ style: { color: '#94a3b8' } }}
                inputProps={{ style: { color: '#f8fafc' } }}
                helperText="Must be between 20 and 60 characters"
                FormHelperTextProps={{ style: { color: '#64748b' } }}
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
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                InputLabelProps={{ style: { color: '#94a3b8' } }}
                inputProps={{ style: { color: '#f8fafc' } }}
                helperText="8-16 chars, 1 uppercase, 1 special char"
                FormHelperTextProps={{ style: { color: '#64748b' } }}
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
                required
                fullWidth
                id="address"
                label="Address"
                name="address"
                multiline
                rows={2}
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                InputLabelProps={{ style: { color: '#94a3b8' } }}
                inputProps={{ style: { color: '#f8fafc' }, maxLength: 400 }}
                helperText="Maximum 400 characters"
                FormHelperTextProps={{ style: { color: '#64748b' } }}
                sx={{
                  mb: 3,
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.1)' },
                    '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.25)' },
                    '&.Mui-focused fieldset': { borderColor: '#3b82f6' },
                  },
                }}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                disabled={loading}
                sx={{
                  py: 1.25,
                  borderRadius: '8px',
                  background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                  textTransform: 'none',
                  fontSize: '1rem',
                  fontWeight: 600,
                  boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
                  },
                }}
              >
                {loading ? <CircularProgress size={24} sx={{ color: '#fff' }} /> : 'Register'}
              </Button>
            </form>

            <Box sx={{ mt: 3, textAlign: 'center' }}>
              <Typography variant="body2" sx={{ color: '#94a3b8' }}>
                Already have an account?{' '}
                <Typography
                  component={RouterLink}
                  to="/login"
                  variant="body2"
                  sx={{
                    color: '#60a5fa',
                    textDecoration: 'none',
                    fontWeight: 600,
                    '&:hover': { textDecoration: 'underline' },
                  }}
                >
                  Sign In
                </Typography>
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
};
