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
  TextField,
  MenuItem,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
  TableSortLabel,
  Rating as MuiRating,
} from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import RateReviewIcon from '@mui/icons-material/RateReview';
import SearchIcon from '@mui/icons-material/Search';

interface StoreDetails {
  id: number;
  name: string;
  email: string;
  address: string;
  averageRating: number;
  ratingsCount: number;
}

interface RatingLog {
  id: number;
  rating: number;
  createdAt: string;
  updatedAt: string;
  userName: string;
  userEmail: string;
  userAddress: string;
}

export const OwnerDashboard: React.FC = () => {
  const [store, setStore] = useState<StoreDetails | null>(null);
  const [ratings, setRatings] = useState<RatingLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [tableLoading, setTableLoading] = useState(false);

  // Pagination & Filtering
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(10);
  const [totalCount, setTotalCount] = useState(0);

  // Fetch Owner Dashboard Data
  const fetchData = useCallback(async (isInitial = false) => {
    if (isInitial) setLoading(true);
    else setTableLoading(true);

    try {
      const params = {
        page: page + 1,
        limit,
        search: search || undefined,
        sortBy,
        sortOrder,
      };

      const res = await api.get('/dashboard/owner', { params });
      setStore(res.data.data.store);
      setRatings(res.data.data.ratings);
      setTotalCount(res.data.data.pagination.total);
    } catch (err) {
      console.error('Failed to fetch store owner metrics', err);
    } finally {
      setLoading(false);
      setTableLoading(false);
    }
  }, [page, limit, search, sortBy, sortOrder]);

  useEffect(() => {
    fetchData(true);
  }, [fetchData]);

  const handleSort = (property: string) => {
    const isAsc = sortBy === property && sortOrder === 'asc';
    setSortOrder(isAsc ? 'desc' : 'asc');
    setSortBy(property);
    setPage(0);
  };

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#0f172a', pb: 6 }}>
      <Navbar />
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <CircularProgress color="primary" />
          </Box>
        ) : store ? (
          <>
            {/* Store Header Banner */}
            <Card
              sx={{
                background: 'linear-gradient(135deg, #1e1b4b 0%, #1e293b 100%)',
                borderRadius: '16px',
                border: '1px solid rgba(255, 255, 255, 0.05)',
                color: '#f8fafc',
                mb: 4,
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
              }}
            >
              <CardContent sx={{ p: { xs: 3, md: 4 } }}>
                <Grid container spacing={3} alignItems="center">
                  <Grid item xs={12} md={8}>
                    <Typography variant="caption" sx={{ color: '#8b5cf6', fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase' }}>
                      My Store Performance
                    </Typography>
                    <Typography variant="h3" sx={{ fontWeight: 800, mt: 1, mb: 1.5, letterSpacing: '-0.5px' }}>
                      {store.name}
                    </Typography>
                    <Typography variant="body1" sx={{ color: '#cbd5e1', mb: 1 }}>
                      <strong>Contact:</strong> {store.email}
                    </Typography>
                    <Typography variant="body1" sx={{ color: '#94a3b8' }}>
                      <strong>Address:</strong> {store.address}
                    </Typography>
                  </Grid>
                  
                  {/* Stats Block */}
                  <Grid item xs={12} md={4} sx={{ display: 'flex', gap: 3, justifyContent: { xs: 'flex-start', md: 'flex-end' } }}>
                    <Box sx={{ textAlign: 'center', p: 2, minWidth: '110px', backgroundColor: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.05)', borderRadius: '12px' }}>
                      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', color: '#f59e0b', mb: 0.5 }}>
                        <StarIcon sx={{ fontSize: 24, mr: 0.5 }} />
                        <Typography variant="h4" sx={{ fontWeight: 800 }}>
                          {store.averageRating.toFixed(1)}
                        </Typography>
                      </Box>
                      <Typography variant="caption" sx={{ color: '#94a3b8', fontWeight: 600 }}>
                        Avg Rating
                      </Typography>
                    </Box>

                    <Box sx={{ textAlign: 'center', p: 2, minWidth: '110px', backgroundColor: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.05)', borderRadius: '12px' }}>
                      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', color: '#3b82f6', mb: 0.5 }}>
                        <RateReviewIcon sx={{ fontSize: 24, mr: 0.5 }} />
                        <Typography variant="h4" sx={{ fontWeight: 800 }}>
                          {store.ratingsCount}
                        </Typography>
                      </Box>
                      <Typography variant="caption" sx={{ color: '#94a3b8', fontWeight: 600 }}>
                        Total Ratings
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>

            {/* Ratings Log Table Section */}
            <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
              <Typography variant="h5" sx={{ fontWeight: 800, color: '#f8fafc' }}>
                Customer Feedback Logs
              </Typography>
              
              <TextField
                size="small"
                placeholder="Search raters name/email..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(0);
                }}
                InputProps={{
                  startAdornment: <SearchIcon sx={{ color: '#94a3b8', mr: 1 }} />,
                  style: { color: '#f8fafc' },
                }}
                sx={{
                  width: '280px',
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.1)' },
                    '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.25)' },
                    '&.Mui-focused fieldset': { borderColor: '#8b5cf6' },
                  },
                }}
              />
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
              {tableLoading ? (
                <Box sx={{ p: 6, display: 'flex', justifyContent: 'center' }}>
                  <CircularProgress color="secondary" />
                </Box>
              ) : (
                <>
                  <Table>
                    <TableHead sx={{ backgroundColor: 'rgba(255, 255, 255, 0.02)' }}>
                      <TableRow>
                        <TableCell sx={{ color: '#94a3b8', fontWeight: 600, borderColor: 'rgba(255, 255, 255, 0.05)' }}>
                          <TableSortLabel
                            active={sortBy === 'userName'}
                            direction={sortBy === 'userName' ? sortOrder : 'asc'}
                            onClick={() => handleSort('userName')}
                            sx={{
                              color: '#94a3b8 !important',
                              '& .MuiTableSortLabel-icon': { color: '#94a3b8 !important' },
                            }}
                          >
                            Customer Name
                          </TableSortLabel>
                        </TableCell>
                        <TableCell sx={{ color: '#94a3b8', fontWeight: 600, borderColor: 'rgba(255, 255, 255, 0.05)' }}>
                          <TableSortLabel
                            active={sortBy === 'userEmail'}
                            direction={sortBy === 'userEmail' ? sortOrder : 'asc'}
                            onClick={() => handleSort('userEmail')}
                            sx={{
                              color: '#94a3b8 !important',
                              '& .MuiTableSortLabel-icon': { color: '#94a3b8 !important' },
                            }}
                          >
                            Email
                          </TableSortLabel>
                        </TableCell>
                        <TableCell sx={{ color: '#94a3b8', fontWeight: 600, borderColor: 'rgba(255, 255, 255, 0.05)' }}>Address</TableCell>
                        <TableCell sx={{ color: '#94a3b8', fontWeight: 600, borderColor: 'rgba(255, 255, 255, 0.05)' }}>
                          <TableSortLabel
                            active={sortBy === 'rating'}
                            direction={sortBy === 'rating' ? sortOrder : 'asc'}
                            onClick={() => handleSort('rating')}
                            sx={{
                              color: '#94a3b8 !important',
                              '& .MuiTableSortLabel-icon': { color: '#94a3b8 !important' },
                            }}
                          >
                            Rating Left
                          </TableSortLabel>
                        </TableCell>
                        <TableCell sx={{ color: '#94a3b8', fontWeight: 600, borderColor: 'rgba(255, 255, 255, 0.05)' }}>
                          <TableSortLabel
                            active={sortBy === 'createdAt'}
                            direction={sortBy === 'createdAt' ? sortOrder : 'asc'}
                            onClick={() => handleSort('createdAt')}
                            sx={{
                              color: '#94a3b8 !important',
                              '& .MuiTableSortLabel-icon': { color: '#94a3b8 !important' },
                            }}
                          >
                            Submitted Date
                          </TableSortLabel>
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {ratings.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={5} align="center" sx={{ color: '#94a3b8', py: 4, borderColor: 'rgba(255, 255, 255, 0.05)' }}>
                            No feedback ratings recorded yet.
                          </TableCell>
                        </TableRow>
                      ) : (
                        ratings.map((log) => (
                          <TableRow key={log.id} sx={{ '&:hover': { backgroundColor: 'rgba(255,255,255,0.01)' } }}>
                            <TableCell sx={{ color: '#f8fafc', fontWeight: 600, borderColor: 'rgba(255, 255, 255, 0.05)' }}>{log.userName}</TableCell>
                            <TableCell sx={{ color: '#f8fafc', borderColor: 'rgba(255, 255, 255, 0.05)' }}>{log.userEmail}</TableCell>
                            <TableCell sx={{ color: '#94a3b8', borderColor: 'rgba(255, 255, 255, 0.05)' }}>{log.userAddress}</TableCell>
                            <TableCell sx={{ borderColor: 'rgba(255, 255, 255, 0.05)' }}>
                              <MuiRating
                                value={log.rating}
                                readOnly
                                size="small"
                                emptyIcon={<StarIcon style={{ opacity: 0.1, color: '#f8fafc' }} fontSize="inherit" />}
                                sx={{ color: '#f59e0b' }}
                              />
                            </TableCell>
                            <TableCell sx={{ color: '#94a3b8', borderColor: 'rgba(255, 255, 255, 0.05)' }}>
                              {new Date(log.createdAt).toLocaleDateString()} at{' '}
                              {new Date(log.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                  <TablePagination
                    rowsPerPageOptions={[10, 25, 50]}
                    component="div"
                    count={totalCount}
                    rowsPerPage={limit}
                    page={page}
                    onPageChange={(e, newPage) => setPage(newPage)}
                    onRowsPerPageChange={(e) => {
                      setLimit(parseInt(e.target.value, 10));
                      setPage(0);
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
          </>
        ) : (
          <Card sx={{ p: 4, backgroundColor: '#1e293b', border: '1px solid rgba(255,255,255,0.05)', textAlign: 'center' }}>
            <Typography variant="body1" sx={{ color: '#f43f5e' }}>
              Failed to load store owner dashboard data. Verify your user profile configuration.
            </Typography>
          </Card>
        )}
      </Container>
    </Box>
  );
};
