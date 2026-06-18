import React, { useState, useEffect, useCallback } from 'react';
import { Navbar } from '../components/Navbar';
import api from '../services/api';
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Tab,
  Tabs,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
  TextField,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControlLabel,
  Checkbox,
  CircularProgress,
  Alert,
  Snackbar,
  TableSortLabel,
} from '@mui/material';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import StoreIcon from '@mui/icons-material/Store';
import StarRateIcon from '@mui/icons-material/StarRate';
import SupervisorAccountIcon from '@mui/icons-material/SupervisorAccount';
import RateReviewIcon from '@mui/icons-material/RateReview';
import AddIcon from '@mui/icons-material/Add';

interface AdminMetrics {
  totalUsers: number;
  totalStoreOwners: number;
  totalStores: number;
  totalRatings: number;
  averageRating: number;
}

interface UserRow {
  id: number;
  name: string;
  email: string;
  role: 'ADMIN' | 'USER' | 'STORE_OWNER';
  address: string;
  createdAt: string;
}

interface StoreRow {
  id: number;
  name: string;
  email: string;
  address: string;
  ownerId: number;
  ownerName?: string;
  owner?: {
    name: string;
    email: string;
  };
  averageRating: number;
  ratingsCount: number;
}

export const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [metrics, setMetrics] = useState<AdminMetrics | null>(null);
  const [metricsLoading, setMetricsLoading] = useState(true);

  // Users State
  const [users, setUsers] = useState<UserRow[]>([]);
  const [usersCount, setUsersCount] = useState(0);
  const [usersLoading, setUsersLoading] = useState(true);
  const [usersPage, setUsersPage] = useState(0);
  const [usersLimit, setUsersLimit] = useState(10);
  const [userFilters, setUserFilters] = useState({ name: '', email: '', role: '' });
  const [userSort, setUserSort] = useState({ by: 'createdAt', order: 'desc' as 'asc' | 'desc' });

  // Stores State
  const [stores, setStores] = useState<StoreRow[]>([]);
  const [storesCount, setStoresCount] = useState(0);
  const [storesLoading, setStoresLoading] = useState(true);
  const [storesPage, setStoresPage] = useState(0);
  const [storesLimit, setStoresLimit] = useState(10);
  const [storeSearch, setStoreSearch] = useState('');
  const [storeSort, setStoreSort] = useState({ by: 'createdAt', order: 'desc' as 'asc' | 'desc' });

  // Dialog States
  const [userDialogOpen, setUserDialogOpen] = useState(false);
  const [storeDialogOpen, setStoreDialogOpen] = useState(false);
  
  // Create User Form
  const [userForm, setUserForm] = useState({
    name: '',
    email: '',
    password: '',
    address: '',
    role: 'USER' as 'ADMIN' | 'USER' | 'STORE_OWNER',
    createStoreSimultaneously: false,
    storeName: '',
    storeEmail: '',
    storeAddress: '',
  });

  // Create Store Form
  const [storeForm, setStoreForm] = useState({
    name: '',
    email: '',
    address: '',
    ownerId: '',
  });
  
  const [storeOwners, setStoreOwners] = useState<UserRow[]>([]);
  const [loadingOwners, setLoadingOwners] = useState(false);

  // Feedback States
  const [submitting, setSubmitting] = useState(false);
  const [dialogError, setDialogError] = useState<string | null>(null);
  const [dialogValidationErrors, setDialogValidationErrors] = useState<any[]>([]);
  const [toast, setToast] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({
    open: false,
    message: '',
    severity: 'success',
  });

  // Load Admin Metrics
  const fetchMetrics = useCallback(async () => {
    setMetricsLoading(true);
    try {
      const res = await api.get('/dashboard/admin');
      setMetrics(res.data.data);
    } catch (err) {
      console.error('Failed to load metrics', err);
    } finally {
      setMetricsLoading(false);
    }
  }, []);

  // Load Users List
  const fetchUsers = useCallback(async () => {
    setUsersLoading(true);
    try {
      const params = {
        page: usersPage + 1,
        limit: usersLimit,
        name: userFilters.name || undefined,
        email: userFilters.email || undefined,
        role: userFilters.role || undefined,
        sortBy: userSort.by,
        sortOrder: userSort.order,
      };
      const res = await api.get('/users', { params });
      setUsers(res.data.data.users);
      setUsersCount(res.data.data.pagination.total);
    } catch (err) {
      console.error('Failed to load users', err);
    } finally {
      setUsersLoading(false);
    }
  }, [usersPage, usersLimit, userFilters, userSort]);

  // Load Stores List
  const fetchStores = useCallback(async () => {
    setStoresLoading(true);
    try {
      const params = {
        page: storesPage + 1,
        limit: storesLimit,
        search: storeSearch || undefined,
        sortBy: storeSort.by,
        sortOrder: storeSort.order,
      };
      const res = await api.get('/stores', { params });
      setStores(res.data.data.stores);
      setStoresCount(res.data.data.pagination.total);
    } catch (err) {
      console.error('Failed to load stores', err);
    } finally {
      setStoresLoading(false);
    }
  }, [storesPage, storesLimit, storeSearch, storeSort]);

  // Load Store Owners (unassigned store owners for Store Modal)
  const fetchStoreOwners = async () => {
    setLoadingOwners(true);
    try {
      // Get all store owners (paginated but fetch a large block)
      const res = await api.get('/users', { params: { role: 'STORE_OWNER', limit: 100 } });
      setStoreOwners(res.data.data.users);
    } catch (err) {
      console.error('Failed to load store owners', err);
    } finally {
      setLoadingOwners(false);
    }
  };

  useEffect(() => {
    fetchMetrics();
  }, [fetchMetrics]);

  useEffect(() => {
    if (activeTab === 1) fetchUsers();
    if (activeTab === 2) fetchStores();
  }, [activeTab, fetchUsers, fetchStores]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const handleUserSort = (property: string) => {
    const isAsc = userSort.by === property && userSort.order === 'asc';
    setUserSort({ by: property, order: isAsc ? 'desc' : 'asc' });
  };

  const handleStoreSort = (property: string) => {
    const isAsc = storeSort.by === property && storeSort.order === 'asc';
    setStoreSort({ by: property, order: isAsc ? 'desc' : 'asc' });
  };

  // Create User Submit
  const handleUserSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setDialogError(null);
    setDialogValidationErrors([]);
    
    // Front-end validation checks
    if (userForm.name.length < 20 || userForm.name.length > 60) {
      setDialogError('Name must be between 20 and 60 characters.');
      return;
    }
    if (userForm.password.length < 8 || userForm.password.length > 16) {
      setDialogError('Password must be between 8 and 16 characters.');
      return;
    }
    if (!/[A-Z]/.test(userForm.password)) {
      setDialogError('Password must contain at least one uppercase letter.');
      return;
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(userForm.password)) {
      setDialogError('Password must contain at least one special character.');
      return;
    }

    setSubmitting(true);
    try {
      const payload: any = {
        name: userForm.name,
        email: userForm.email,
        password: userForm.password,
        address: userForm.address,
        role: userForm.role,
      };

      if (userForm.role === 'STORE_OWNER' && userForm.createStoreSimultaneously) {
        payload.storeName = userForm.storeName;
        payload.storeEmail = userForm.storeEmail;
        payload.storeAddress = userForm.storeAddress;
      }

      await api.post('/users', payload);
      setToast({ open: true, message: 'User created successfully!', severity: 'success' });
      setUserDialogOpen(false);
      // Reset Form
      setUserForm({
        name: '',
        email: '',
        password: '',
        address: '',
        role: 'USER',
        createStoreSimultaneously: false,
        storeName: '',
        storeEmail: '',
        storeAddress: '',
      });
      fetchUsers();
      fetchMetrics();
    } catch (err: any) {
      setDialogError(err.response?.data?.message || 'Failed to create user.');
      if (err.response?.data?.errors) {
        setDialogValidationErrors(err.response.data.errors);
      }
    } finally {
      setSubmitting(false);
    }
  };

  // Create Store Submit
  const handleStoreSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setDialogError(null);
    setSubmitting(true);

    try {
      const payload = {
        name: storeForm.name,
        email: storeForm.email,
        address: storeForm.address,
        ownerId: parseInt(storeForm.ownerId),
      };
      await api.post('/stores', payload);
      setToast({ open: true, message: 'Store created successfully!', severity: 'success' });
      setStoreDialogOpen(false);
      // Reset Form
      setStoreForm({ name: '', email: '', address: '', ownerId: '' });
      fetchStores();
      fetchMetrics();
    } catch (err: any) {
      setDialogError(err.response?.data?.message || 'Failed to create store.');
    } finally {
      setSubmitting(false);
    }
  };

  const openStoreDialog = () => {
    fetchStoreOwners();
    setStoreDialogOpen(true);
  };

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#0f172a', pb: 6 }}>
      <Navbar />
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 800, color: '#f8fafc', mb: 3 }}>
          Admin Dashboard
        </Typography>

        <Box sx={{ borderBottom: 1, borderColor: 'rgba(255, 255, 255, 0.05)', mb: 4 }}>
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            sx={{
              '& .MuiTab-root': {
                color: '#94a3b8',
                textTransform: 'none',
                fontWeight: 600,
                fontSize: '1rem',
                '&.Mui-selected': { color: '#3b82f6' },
              },
              '& .MuiTabs-indicator': { backgroundColor: '#3b82f6' },
            }}
          >
            <Tab label="Overview" />
            <Tab label="Manage Users" />
            <Tab label="Manage Stores" />
          </Tabs>
        </Box>

        {/* Tab 0: Overview */}
        {activeTab === 0 && (
          <Grid container spacing={3}>
            {metricsLoading ? (
              <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center', mt: 8 }}>
                <CircularProgress color="primary" />
              </Box>
            ) : metrics ? (
              <>
                <Grid item xs={12} sm={6} md={4}>
                  <Card
                    sx={{
                      background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
                      borderRadius: '12px',
                      border: '1px solid rgba(255, 255, 255, 0.05)',
                      color: '#f8fafc',
                    }}
                  >
                    <CardContent sx={{ display: 'flex', alignItems: 'center', p: 3 }}>
                      <Box
                        sx={{
                          p: 2,
                          borderRadius: '10px',
                          backgroundColor: 'rgba(59, 130, 246, 0.1)',
                          color: '#3b82f6',
                          mr: 2.5,
                        }}
                      >
                        <PeopleAltIcon sx={{ fontSize: 32 }} />
                      </Box>
                      <Box>
                        <Typography variant="body2" sx={{ color: '#94a3b8', fontWeight: 600 }}>
                          Total Users
                        </Typography>
                        <Typography variant="h4" sx={{ fontWeight: 800, mt: 0.5 }}>
                          {metrics.totalUsers}
                        </Typography>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>

                <Grid item xs={12} sm={6} md={4}>
                  <Card
                    sx={{
                      background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
                      borderRadius: '12px',
                      border: '1px solid rgba(255, 255, 255, 0.05)',
                      color: '#f8fafc',
                    }}
                  >
                    <CardContent sx={{ display: 'flex', alignItems: 'center', p: 3 }}>
                      <Box
                        sx={{
                          p: 2,
                          borderRadius: '10px',
                          backgroundColor: 'rgba(139, 92, 246, 0.1)',
                          color: '#8b5cf6',
                          mr: 2.5,
                        }}
                      >
                        <SupervisorAccountIcon sx={{ fontSize: 32 }} />
                      </Box>
                      <Box>
                        <Typography variant="body2" sx={{ color: '#94a3b8', fontWeight: 600 }}>
                          Store Owners
                        </Typography>
                        <Typography variant="h4" sx={{ fontWeight: 800, mt: 0.5 }}>
                          {metrics.totalStoreOwners}
                        </Typography>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>

                <Grid item xs={12} sm={6} md={4}>
                  <Card
                    sx={{
                      background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
                      borderRadius: '12px',
                      border: '1px solid rgba(255, 255, 255, 0.05)',
                      color: '#f8fafc',
                    }}
                  >
                    <CardContent sx={{ display: 'flex', alignItems: 'center', p: 3 }}>
                      <Box
                        sx={{
                          p: 2,
                          borderRadius: '10px',
                          backgroundColor: 'rgba(16, 185, 129, 0.1)',
                          color: '#10b981',
                          mr: 2.5,
                        }}
                      >
                        <StoreIcon sx={{ fontSize: 32 }} />
                      </Box>
                      <Box>
                        <Typography variant="body2" sx={{ color: '#94a3b8', fontWeight: 600 }}>
                          Total Stores
                        </Typography>
                        <Typography variant="h4" sx={{ fontWeight: 800, mt: 0.5 }}>
                          {metrics.totalStores}
                        </Typography>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>

                <Grid item xs={12} sm={6} md={6}>
                  <Card
                    sx={{
                      background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
                      borderRadius: '12px',
                      border: '1px solid rgba(255, 255, 255, 0.05)',
                      color: '#f8fafc',
                    }}
                  >
                    <CardContent sx={{ display: 'flex', alignItems: 'center', p: 3 }}>
                      <Box
                        sx={{
                          p: 2,
                          borderRadius: '10px',
                          backgroundColor: 'rgba(245, 158, 11, 0.1)',
                          color: '#f59e0b',
                          mr: 2.5,
                        }}
                      >
                        <RateReviewIcon sx={{ fontSize: 32 }} />
                      </Box>
                      <Box>
                        <Typography variant="body2" sx={{ color: '#94a3b8', fontWeight: 600 }}>
                          Total Ratings
                        </Typography>
                        <Typography variant="h4" sx={{ fontWeight: 800, mt: 0.5 }}>
                          {metrics.totalRatings}
                        </Typography>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>

                <Grid item xs={12} sm={6} md={6}>
                  <Card
                    sx={{
                      background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
                      borderRadius: '12px',
                      border: '1px solid rgba(255, 255, 255, 0.05)',
                      color: '#f8fafc',
                    }}
                  >
                    <CardContent sx={{ display: 'flex', alignItems: 'center', p: 3 }}>
                      <Box
                        sx={{
                          p: 2,
                          borderRadius: '10px',
                          backgroundColor: 'rgba(236, 72, 153, 0.1)',
                          color: '#ec4899',
                          mr: 2.5,
                        }}
                      >
                        <StarRateIcon sx={{ fontSize: 32 }} />
                      </Box>
                      <Box>
                        <Typography variant="body2" sx={{ color: '#94a3b8', fontWeight: 600 }}>
                          Platform Average Rating
                        </Typography>
                        <Typography variant="h4" sx={{ fontWeight: 800, mt: 0.5 }}>
                          {metrics.averageRating} / 5.0
                        </Typography>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              </>
            ) : (
              <Typography sx={{ color: '#94a3b8', pl: 3 }}>No metrics data available.</Typography>
            )}
          </Grid>
        )}

        {/* Tab 1: Manage Users */}
        {activeTab === 1 && (
          <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, gap: 2, flexWrap: 'wrap' }}>
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', flexGrow: 1 }}>
                <TextField
                  size="small"
                  label="Filter by Name"
                  value={userFilters.name}
                  onChange={(e) => {
                    setUserFilters({ ...userFilters, name: e.target.value });
                    setUsersPage(0);
                  }}
                  InputLabelProps={{ style: { color: '#94a3b8' } }}
                  inputProps={{ style: { color: '#f8fafc' } }}
                  sx={{
                    width: '200px',
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.1)' },
                      '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.25)' },
                      '&.Mui-focused fieldset': { borderColor: '#3b82f6' },
                    },
                  }}
                />
                <TextField
                  size="small"
                  label="Filter by Email"
                  value={userFilters.email}
                  onChange={(e) => {
                    setUserFilters({ ...userFilters, email: e.target.value });
                    setUsersPage(0);
                  }}
                  InputLabelProps={{ style: { color: '#94a3b8' } }}
                  inputProps={{ style: { color: '#f8fafc' } }}
                  sx={{
                    width: '200px',
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.1)' },
                      '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.25)' },
                      '&.Mui-focused fieldset': { borderColor: '#3b82f6' },
                    },
                  }}
                />
                <TextField
                  select
                  size="small"
                  label="Role"
                  value={userFilters.role}
                  onChange={(e) => {
                    setUserFilters({ ...userFilters, role: e.target.value });
                    setUsersPage(0);
                  }}
                  InputLabelProps={{ style: { color: '#94a3b8' } }}
                  inputProps={{ style: { color: '#f8fafc' } }}
                  sx={{
                    width: '150px',
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.1)' },
                      '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.25)' },
                      '&.Mui-focused fieldset': { borderColor: '#3b82f6' },
                    },
                  }}
                >
                  <MenuItem value="">All Roles</MenuItem>
                  <MenuItem value="ADMIN">ADMIN</MenuItem>
                  <MenuItem value="STORE_OWNER">STORE_OWNER</MenuItem>
                  <MenuItem value="USER">USER</MenuItem>
                </TextField>
              </Box>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => setUserDialogOpen(true)}
                sx={{
                  background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                  textTransform: 'none',
                  fontWeight: 600,
                  borderRadius: '8px',
                  boxShadow: '0 4px 10px rgba(59, 130, 246, 0.3)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #2563eb 0%, #1e40af 100%)',
                  },
                }}
              >
                Create User
              </Button>
            </Box>

            <TableContainer
              component={Paper}
              sx={{
                backgroundColor: '#1e293b',
                color: '#f8fafc',
                border: '1px solid rgba(255, 255, 255, 0.05)',
                borderRadius: '12px',
              }}
            >
              {usersLoading ? (
                <Box sx={{ p: 6, display: 'flex', justifyContent: 'center' }}>
                  <CircularProgress color="primary" />
                </Box>
              ) : (
                <>
                  <Table>
                    <TableHead sx={{ backgroundColor: 'rgba(255, 255, 255, 0.02)' }}>
                      <TableRow>
                        <TableCell sx={{ color: '#94a3b8', fontWeight: 600, borderColor: 'rgba(255, 255, 255, 0.05)' }}>
                          <TableSortLabel
                            active={userSort.by === 'id'}
                            direction={userSort.by === 'id' ? userSort.order : 'asc'}
                            onClick={() => handleUserSort('id')}
                            sx={{
                              color: '#94a3b8 !important',
                              '& .MuiTableSortLabel-icon': { color: '#94a3b8 !important' },
                            }}
                          >
                            ID
                          </TableSortLabel>
                        </TableCell>
                        <TableCell sx={{ color: '#94a3b8', fontWeight: 600, borderColor: 'rgba(255, 255, 255, 0.05)' }}>
                          <TableSortLabel
                            active={userSort.by === 'name'}
                            direction={userSort.by === 'name' ? userSort.order : 'asc'}
                            onClick={() => handleUserSort('name')}
                            sx={{
                              color: '#94a3b8 !important',
                              '& .MuiTableSortLabel-icon': { color: '#94a3b8 !important' },
                            }}
                          >
                            Name
                          </TableSortLabel>
                        </TableCell>
                        <TableCell sx={{ color: '#94a3b8', fontWeight: 600, borderColor: 'rgba(255, 255, 255, 0.05)' }}>
                          <TableSortLabel
                            active={userSort.by === 'email'}
                            direction={userSort.by === 'email' ? userSort.order : 'asc'}
                            onClick={() => handleUserSort('email')}
                            sx={{
                              color: '#94a3b8 !important',
                              '& .MuiTableSortLabel-icon': { color: '#94a3b8 !important' },
                            }}
                          >
                            Email
                          </TableSortLabel>
                        </TableCell>
                        <TableCell sx={{ color: '#94a3b8', fontWeight: 600, borderColor: 'rgba(255, 255, 255, 0.05)' }}>
                          <TableSortLabel
                            active={userSort.by === 'role'}
                            direction={userSort.by === 'role' ? userSort.order : 'asc'}
                            onClick={() => handleUserSort('role')}
                            sx={{
                              color: '#94a3b8 !important',
                              '& .MuiTableSortLabel-icon': { color: '#94a3b8 !important' },
                            }}
                          >
                            Role
                          </TableSortLabel>
                        </TableCell>
                        <TableCell sx={{ color: '#94a3b8', fontWeight: 600, borderColor: 'rgba(255, 255, 255, 0.05)' }}>Address</TableCell>
                        <TableCell sx={{ color: '#94a3b8', fontWeight: 600, borderColor: 'rgba(255, 255, 255, 0.05)' }}>
                          <TableSortLabel
                            active={userSort.by === 'createdAt'}
                            direction={userSort.by === 'createdAt' ? userSort.order : 'asc'}
                            onClick={() => handleUserSort('createdAt')}
                            sx={{
                              color: '#94a3b8 !important',
                              '& .MuiTableSortLabel-icon': { color: '#94a3b8 !important' },
                            }}
                          >
                            Registered At
                          </TableSortLabel>
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {users.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={6} align="center" sx={{ color: '#94a3b8', py: 4, borderColor: 'rgba(255, 255, 255, 0.05)' }}>
                            No users found.
                          </TableCell>
                        </TableRow>
                      ) : (
                        users.map((row) => (
                          <TableRow key={row.id} sx={{ '&:hover': { backgroundColor: 'rgba(255,255,255,0.01)' } }}>
                            <TableCell sx={{ color: '#f8fafc', borderColor: 'rgba(255, 255, 255, 0.05)' }}>{row.id}</TableCell>
                            <TableCell sx={{ color: '#f8fafc', fontWeight: 600, borderColor: 'rgba(255, 255, 255, 0.05)' }}>{row.name}</TableCell>
                            <TableCell sx={{ color: '#f8fafc', borderColor: 'rgba(255, 255, 255, 0.05)' }}>{row.email}</TableCell>
                            <TableCell sx={{ color: '#f8fafc', borderColor: 'rgba(255, 255, 255, 0.05)' }}>{row.role}</TableCell>
                            <TableCell sx={{ color: '#94a3b8', borderColor: 'rgba(255, 255, 255, 0.05)' }}>{row.address}</TableCell>
                            <TableCell sx={{ color: '#94a3b8', borderColor: 'rgba(255, 255, 255, 0.05)' }}>
                              {new Date(row.createdAt).toLocaleDateString()}
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                  <TablePagination
                    rowsPerPageOptions={[5, 10, 25]}
                    component="div"
                    count={usersCount}
                    rowsPerPage={usersLimit}
                    page={usersPage}
                    onPageChange={(e, newPage) => setUsersPage(newPage)}
                    onRowsPerPageChange={(e) => {
                      setUsersLimit(parseInt(e.target.value, 10));
                      setUsersPage(0);
                    }}
                    sx={{
                      color: '#94a3b8',
                      borderTop: '1px solid rgba(255, 255, 255, 0.05)',
                      '& .MuiTablePagination-actions': { color: '#94a3b8' },
                      '& .MuiTablePagination-select': { color: '#f8fafc' },
                    }}
                  />
                </>
              )}
            </TableContainer>
          </Box>
        )}

        {/* Tab 2: Manage Stores */}
        {activeTab === 2 && (
          <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, gap: 2, flexWrap: 'wrap' }}>
              <TextField
                size="small"
                label="Search Store Name/Address/Email"
                value={storeSearch}
                onChange={(e) => {
                  setStoreSearch(e.target.value);
                  setStoresPage(0);
                }}
                InputLabelProps={{ style: { color: '#94a3b8' } }}
                inputProps={{ style: { color: '#f8fafc' } }}
                sx={{
                  width: '350px',
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.1)' },
                    '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.25)' },
                    '&.Mui-focused fieldset': { borderColor: '#3b82f6' },
                  },
                }}
              />
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={openStoreDialog}
                sx={{
                  background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                  textTransform: 'none',
                  fontWeight: 600,
                  borderRadius: '8px',
                  boxShadow: '0 4px 10px rgba(59, 130, 246, 0.3)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #2563eb 0%, #1e40af 100%)',
                  },
                }}
              >
                Create Store
              </Button>
            </Box>

            <TableContainer
              component={Paper}
              sx={{
                backgroundColor: '#1e293b',
                color: '#f8fafc',
                border: '1px solid rgba(255, 255, 255, 0.05)',
                borderRadius: '12px',
              }}
            >
              {storesLoading ? (
                <Box sx={{ p: 6, display: 'flex', justifyContent: 'center' }}>
                  <CircularProgress color="primary" />
                </Box>
              ) : (
                <>
                  <Table>
                    <TableHead sx={{ backgroundColor: 'rgba(255, 255, 255, 0.02)' }}>
                      <TableRow>
                        <TableCell sx={{ color: '#94a3b8', fontWeight: 600, borderColor: 'rgba(255, 255, 255, 0.05)' }}>
                          <TableSortLabel
                            active={storeSort.by === 'id'}
                            direction={storeSort.by === 'id' ? storeSort.order : 'asc'}
                            onClick={() => handleStoreSort('id')}
                            sx={{
                              color: '#94a3b8 !important',
                              '& .MuiTableSortLabel-icon': { color: '#94a3b8 !important' },
                            }}
                          >
                            ID
                          </TableSortLabel>
                        </TableCell>
                        <TableCell sx={{ color: '#94a3b8', fontWeight: 600, borderColor: 'rgba(255, 255, 255, 0.05)' }}>
                          <TableSortLabel
                            active={storeSort.by === 'name'}
                            direction={storeSort.by === 'name' ? storeSort.order : 'asc'}
                            onClick={() => handleStoreSort('name')}
                            sx={{
                              color: '#94a3b8 !important',
                              '& .MuiTableSortLabel-icon': { color: '#94a3b8 !important' },
                            }}
                          >
                            Store Name
                          </TableSortLabel>
                        </TableCell>
                        <TableCell sx={{ color: '#94a3b8', fontWeight: 600, borderColor: 'rgba(255, 255, 255, 0.05)' }}>
                          <TableSortLabel
                            active={storeSort.by === 'email'}
                            direction={storeSort.by === 'email' ? storeSort.order : 'asc'}
                            onClick={() => handleStoreSort('email')}
                            sx={{
                              color: '#94a3b8 !important',
                              '& .MuiTableSortLabel-icon': { color: '#94a3b8 !important' },
                            }}
                          >
                            Contact Email
                          </TableSortLabel>
                        </TableCell>
                        <TableCell sx={{ color: '#94a3b8', fontWeight: 600, borderColor: 'rgba(255, 255, 255, 0.05)' }}>Store Address</TableCell>
                        <TableCell sx={{ color: '#94a3b8', fontWeight: 600, borderColor: 'rgba(255, 255, 255, 0.05)' }}>Owner Details</TableCell>
                        <TableCell sx={{ color: '#94a3b8', fontWeight: 600, borderColor: 'rgba(255, 255, 255, 0.05)' }}>
                          <TableSortLabel
                            active={storeSort.by === 'averageRating'}
                            direction={storeSort.by === 'averageRating' ? storeSort.order : 'asc'}
                            onClick={() => handleStoreSort('averageRating')}
                            sx={{
                              color: '#94a3b8 !important',
                              '& .MuiTableSortLabel-icon': { color: '#94a3b8 !important' },
                            }}
                          >
                            Avg Rating
                          </TableSortLabel>
                        </TableCell>
                        <TableCell sx={{ color: '#94a3b8', fontWeight: 600, borderColor: 'rgba(255, 255, 255, 0.05)' }}>Total Ratings</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {stores.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={7} align="center" sx={{ color: '#94a3b8', py: 4, borderColor: 'rgba(255, 255, 255, 0.05)' }}>
                            No stores found.
                          </TableCell>
                        </TableRow>
                      ) : (
                        stores.map((row) => (
                          <TableRow key={row.id} sx={{ '&:hover': { backgroundColor: 'rgba(255,255,255,0.01)' } }}>
                            <TableCell sx={{ color: '#f8fafc', borderColor: 'rgba(255, 255, 255, 0.05)' }}>{row.id}</TableCell>
                            <TableCell sx={{ color: '#f8fafc', fontWeight: 600, borderColor: 'rgba(255, 255, 255, 0.05)' }}>{row.name}</TableCell>
                            <TableCell sx={{ color: '#f8fafc', borderColor: 'rgba(255, 255, 255, 0.05)' }}>{row.email}</TableCell>
                            <TableCell sx={{ color: '#94a3b8', borderColor: 'rgba(255, 255, 255, 0.05)' }}>{row.address}</TableCell>
                            <TableCell sx={{ color: '#94a3b8', borderColor: 'rgba(255, 255, 255, 0.05)' }}>
                              <Typography variant="body2" sx={{ color: '#f8fafc', fontWeight: 500 }}>
                                {row.owner?.name || 'N/A'}
                              </Typography>
                              <Typography variant="caption" sx={{ color: '#64748b' }}>
                                ID: {row.ownerId}
                              </Typography>
                            </TableCell>
                            <TableCell sx={{ color: '#f59e0b', fontWeight: 700, borderColor: 'rgba(255, 255, 255, 0.05)' }}>
                              {row.averageRating} ★
                            </TableCell>
                            <TableCell sx={{ color: '#f8fafc', borderColor: 'rgba(255, 255, 255, 0.05)' }}>{row.ratingsCount}</TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                  <TablePagination
                    rowsPerPageOptions={[5, 10, 25]}
                    component="div"
                    count={storesCount}
                    rowsPerPage={storesLimit}
                    page={storesPage}
                    onPageChange={(e, newPage) => setStoresPage(newPage)}
                    onRowsPerPageChange={(e) => {
                      setStoresLimit(parseInt(e.target.value, 10));
                      setStoresPage(0);
                    }}
                    sx={{
                      color: '#94a3b8',
                      borderTop: '1px solid rgba(255, 255, 255, 0.05)',
                      '& .MuiTablePagination-actions': { color: '#94a3b8' },
                      '& .MuiTablePagination-select': { color: '#f8fafc' },
                    }}
                  />
                </>
              )}
            </TableContainer>
          </Box>
        )}

        {/* Dialog: Create User */}
        <Dialog
          open={userDialogOpen}
          onClose={() => setUserDialogOpen(false)}
          fullWidth
          maxWidth="sm"
          PaperProps={{
            style: {
              backgroundColor: '#1e293b',
              color: '#f8fafc',
              borderRadius: '12px',
            },
          }}
        >
          <form onSubmit={handleUserSubmit}>
            <DialogTitle sx={{ fontWeight: 700 }}>Create New User</DialogTitle>
            <DialogContent>
              {dialogError && <Alert severity="error" sx={{ mb: 2, borderRadius: '8px' }}>
                {dialogError}
                {dialogValidationErrors.length > 0 && (
                  <Box component="ul" sx={{ pl: 2, mt: 1, mb: 0 }}>
                    {dialogValidationErrors.map((err, idx) => (
                      <li key={idx}><strong>{err.field}</strong>: {err.message}</li>
                    ))}
                  </Box>
                )}
              </Alert>}
              
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    label="Full Name"
                    required
                    fullWidth
                    value={userForm.name}
                    onChange={(e) => setUserForm({ ...userForm, name: e.target.value })}
                    helperText="Must be between 20 and 60 characters"
                    FormHelperTextProps={{ style: { color: '#64748b' } }}
                    InputLabelProps={{ style: { color: '#94a3b8' } }}
                    inputProps={{ style: { color: '#f8fafc' } }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.1)' },
                        '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.25)' },
                        '&.Mui-focused fieldset': { borderColor: '#3b82f6' },
                      },
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Email Address"
                    type="email"
                    required
                    fullWidth
                    value={userForm.email}
                    onChange={(e) => setUserForm({ ...userForm, email: e.target.value })}
                    InputLabelProps={{ style: { color: '#94a3b8' } }}
                    inputProps={{ style: { color: '#f8fafc' } }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.1)' },
                        '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.25)' },
                        '&.Mui-focused fieldset': { borderColor: '#3b82f6' },
                      },
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Password"
                    type="password"
                    required
                    fullWidth
                    value={userForm.password}
                    onChange={(e) => setUserForm({ ...userForm, password: e.target.value })}
                    helperText="8-16 chars, 1 uppercase, 1 special char"
                    FormHelperTextProps={{ style: { color: '#64748b' } }}
                    InputLabelProps={{ style: { color: '#94a3b8' } }}
                    inputProps={{ style: { color: '#f8fafc' } }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.1)' },
                        '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.25)' },
                        '&.Mui-focused fieldset': { borderColor: '#3b82f6' },
                      },
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    select
                    label="Role"
                    required
                    fullWidth
                    value={userForm.role}
                    onChange={(e) => setUserForm({ ...userForm, role: e.target.value as any })}
                    InputLabelProps={{ style: { color: '#94a3b8' } }}
                    inputProps={{ style: { color: '#f8fafc' } }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.1)' },
                        '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.25)' },
                        '&.Mui-focused fieldset': { borderColor: '#3b82f6' },
                      },
                    }}
                  >
                    <MenuItem value="USER">USER</MenuItem>
                    <MenuItem value="STORE_OWNER">STORE_OWNER</MenuItem>
                    <MenuItem value="ADMIN">ADMIN</MenuItem>
                  </TextField>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Address"
                    required
                    fullWidth
                    value={userForm.address}
                    onChange={(e) => setUserForm({ ...userForm, address: e.target.value })}
                    InputLabelProps={{ style: { color: '#94a3b8' } }}
                    inputProps={{ style: { color: '#f8fafc', maxLength: 400 } }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.1)' },
                        '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.25)' },
                        '&.Mui-focused fieldset': { borderColor: '#3b82f6' },
                      },
                    }}
                  />
                </Grid>

                {userForm.role === 'STORE_OWNER' && (
                  <Grid item xs={12}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={userForm.createStoreSimultaneously}
                          onChange={(e) => setUserForm({ ...userForm, createStoreSimultaneously: e.target.checked })}
                          sx={{ color: '#94a3b8', '&.Mui-checked': { color: '#3b82f6' } }}
                        />
                      }
                      label="Create Associated Store Simultaneously"
                      sx={{ color: '#f8fafc', mb: 1 }}
                    />
                    
                    {userForm.createStoreSimultaneously && (
                      <Card sx={{ p: 2, backgroundColor: '#0f172a', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
                        <Typography variant="subtitle2" sx={{ color: '#3b82f6', fontWeight: 700, mb: 2 }}>
                          Store Details
                        </Typography>
                        <Grid container spacing={2}>
                          <Grid item xs={12} sm={6}>
                            <TextField
                              label="Store Name"
                              required
                              fullWidth
                              value={userForm.storeName}
                              onChange={(e) => setUserForm({ ...userForm, storeName: e.target.value })}
                              InputLabelProps={{ style: { color: '#94a3b8' } }}
                              inputProps={{ style: { color: '#f8fafc' } }}
                            />
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            <TextField
                              label="Store Email"
                              type="email"
                              fullWidth
                              value={userForm.storeEmail}
                              onChange={(e) => setUserForm({ ...userForm, storeEmail: e.target.value })}
                              helperText="Optional, defaults to owner email"
                              FormHelperTextProps={{ style: { color: '#64748b' } }}
                              InputLabelProps={{ style: { color: '#94a3b8' } }}
                              inputProps={{ style: { color: '#f8fafc' } }}
                            />
                          </Grid>
                          <Grid item xs={12}>
                            <TextField
                              label="Store Address"
                              required
                              fullWidth
                              multiline
                              rows={2}
                              value={userForm.storeAddress}
                              onChange={(e) => setUserForm({ ...userForm, storeAddress: e.target.value })}
                              InputLabelProps={{ style: { color: '#94a3b8' } }}
                              inputProps={{ style: { color: '#f8fafc', maxLength: 400 } }}
                            />
                          </Grid>
                        </Grid>
                      </Card>
                    )}
                  </Grid>
                )}
              </Grid>
            </DialogContent>
            <DialogActions sx={{ px: 3, pb: 3 }}>
              <Button onClick={() => setUserDialogOpen(false)} sx={{ color: '#94a3b8', textTransform: 'none' }}>
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                disabled={submitting}
                sx={{
                  background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                  textTransform: 'none',
                  borderRadius: '6px',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #2563eb 0%, #1e40af 100%)',
                  },
                }}
              >
                {submitting ? <CircularProgress size={20} sx={{ color: '#fff' }} /> : 'Create'}
              </Button>
            </DialogActions>
          </form>
        </Dialog>

        {/* Dialog: Create Store */}
        <Dialog
          open={storeDialogOpen}
          onClose={() => setStoreDialogOpen(false)}
          fullWidth
          maxWidth="sm"
          PaperProps={{
            style: {
              backgroundColor: '#1e293b',
              color: '#f8fafc',
              borderRadius: '12px',
            },
          }}
        >
          <form onSubmit={handleStoreSubmit}>
            <DialogTitle sx={{ fontWeight: 700 }}>Create New Store</DialogTitle>
            <DialogContent>
              {dialogError && <Alert severity="error" sx={{ mb: 2, borderRadius: '8px' }}>{dialogError}</Alert>}
              
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    label="Store Name"
                    required
                    fullWidth
                    value={storeForm.name}
                    onChange={(e) => setStoreForm({ ...storeForm, name: e.target.value })}
                    InputLabelProps={{ style: { color: '#94a3b8' } }}
                    inputProps={{ style: { color: '#f8fafc' } }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.1)' },
                        '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.25)' },
                        '&.Mui-focused fieldset': { borderColor: '#3b82f6' },
                      },
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Store Email"
                    type="email"
                    required
                    fullWidth
                    value={storeForm.email}
                    onChange={(e) => setStoreForm({ ...storeForm, email: e.target.value })}
                    InputLabelProps={{ style: { color: '#94a3b8' } }}
                    inputProps={{ style: { color: '#f8fafc' } }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.1)' },
                        '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.25)' },
                        '&.Mui-focused fieldset': { borderColor: '#3b82f6' },
                      },
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Store Address"
                    required
                    fullWidth
                    multiline
                    rows={2}
                    value={storeForm.address}
                    onChange={(e) => setStoreForm({ ...storeForm, address: e.target.value })}
                    InputLabelProps={{ style: { color: '#94a3b8' } }}
                    inputProps={{ style: { color: '#f8fafc', maxLength: 400 } }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.1)' },
                        '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.25)' },
                        '&.Mui-focused fieldset': { borderColor: '#3b82f6' },
                      },
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    select
                    label="Assign Owner (STORE_OWNER)"
                    required
                    fullWidth
                    value={storeForm.ownerId}
                    onChange={(e) => setStoreForm({ ...storeForm, ownerId: e.target.value })}
                    helperText="Select a store owner without a store"
                    FormHelperTextProps={{ style: { color: '#64748b' } }}
                    InputLabelProps={{ style: { color: '#94a3b8' } }}
                    inputProps={{ style: { color: '#f8fafc' } }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.1)' },
                        '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.25)' },
                        '&.Mui-focused fieldset': { borderColor: '#3b82f6' },
                      },
                    }}
                  >
                    {loadingOwners ? (
                      <MenuItem disabled>Loading owners...</MenuItem>
                    ) : storeOwners.length === 0 ? (
                      <MenuItem disabled>No store owners available</MenuItem>
                    ) : (
                      storeOwners.map((owner) => (
                        <MenuItem key={owner.id} value={owner.id.toString()}>
                          {owner.name} (ID: {owner.id} | {owner.email})
                        </MenuItem>
                      ))
                    )}
                  </TextField>
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions sx={{ px: 3, pb: 3 }}>
              <Button onClick={() => setStoreDialogOpen(false)} sx={{ color: '#94a3b8', textTransform: 'none' }}>
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                disabled={submitting}
                sx={{
                  background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                  textTransform: 'none',
                  borderRadius: '6px',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #2563eb 0%, #1e40af 100%)',
                  },
                }}
              >
                {submitting ? <CircularProgress size={20} sx={{ color: '#fff' }} /> : 'Create'}
              </Button>
            </DialogActions>
          </form>
        </Dialog>

        {/* Snackbar Notification */}
        <Snackbar
          open={toast.open}
          autoHideDuration={4000}
          onClose={() => setToast({ ...toast, open: false })}
        >
          <Alert severity={toast.severity} sx={{ width: '100%', borderRadius: '8px' }}>
            {toast.message}
          </Alert>
        </Snackbar>
      </Container>
    </Box>
  );
};
