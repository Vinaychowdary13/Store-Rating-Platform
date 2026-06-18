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
  Button,
  TextField,
  MenuItem,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Rating as MuiRating,
  TablePagination,
  Alert,
  Snackbar,
} from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import SearchIcon from '@mui/icons-material/Search';

interface Store {
  id: number;
  name: string;
  email: string;
  address: string;
  averageRating: number;
  ratingsCount: number;
  myRating: number | null;
}

export const UserDashboard: React.FC = () => {
  const [stores, setStores] = useState<Store[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Search & Filtering States
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(6);
  const [totalCount, setTotalCount] = useState(0);

  // Rating Modal States
  const [selectedStore, setSelectedStore] = useState<Store | null>(null);
  const [ratingValue, setRatingValue] = useState<number | null>(null);
  const [submittingRating, setSubmittingRating] = useState(false);
  const [ratingError, setRatingError] = useState<string | null>(null);
  
  // Toast State
  const [toast, setToast] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });

  // Fetch Stores from Backend
  const fetchStores = useCallback(async () => {
    setLoading(true);
    try {
      const params = {
        page: page + 1,
        limit,
        search: search || undefined,
        sortBy,
        sortOrder,
      };
      
      const res = await api.get('/stores', { params });
      setStores(res.data.data.stores);
      setTotalCount(res.data.data.pagination.total);
    } catch (err) {
      console.error('Failed to load stores', err);
    } finally {
      setLoading(false);
    }
  }, [page, limit, search, sortBy, sortOrder]);

  useEffect(() => {
    fetchStores();
  }, [fetchStores]);

  const handleOpenRatingModal = (store: Store) => {
    setSelectedStore(store);
    setRatingValue(store.myRating || 5); // Default to current rating or 5 stars
    setRatingError(null);
  };

  const handleCloseRatingModal = () => {
    setSelectedStore(null);
    setRatingValue(null);
    setRatingError(null);
  };

  const handleRatingSubmit = async () => {
    if (!selectedStore || ratingValue === null) return;
    
    setSubmittingRating(true);
    setRatingError(null);

    try {
      await api.post('/ratings', {
        storeId: selectedStore.id,
        rating: ratingValue,
      });

      setToast({
        open: true,
        message: `Successfully rated "${selectedStore.name}"!`,
        severity: 'success',
      });
      
      handleCloseRatingModal();
      fetchStores(); // Refresh stores list to calculate new average rating dynamically
    } catch (err: any) {
      setRatingError(err.response?.data?.message || 'Failed to submit rating. Please try again.');
    } finally {
      setSubmittingRating(false);
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#0f172a', pb: 6 }}>
      <Navbar />
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 800, color: '#f8fafc' }}>
              Stores Directory
            </Typography>
            <Typography variant="body2" sx={{ color: '#94a3b8', mt: 0.5 }}>
              Browse stores, check their performance, and share your rating.
            </Typography>
          </Box>

          {/* Search, Sort Filters */}
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
            <TextField
              size="small"
              placeholder="Search stores..."
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
                width: '240px',
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
              label="Sort By"
              value={sortBy}
              onChange={(e) => {
                setSortBy(e.target.value);
                setPage(0);
              }}
              InputLabelProps={{ style: { color: '#94a3b8' } }}
              inputProps={{ style: { color: '#f8fafc' } }}
              sx={{
                width: '160px',
                '& .MuiOutlinedInput-root': {
                  '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.1)' },
                  '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.25)' },
                  '&.Mui-focused fieldset': { borderColor: '#3b82f6' },
                },
              }}
            >
              <MenuItem value="createdAt">Date Created</MenuItem>
              <MenuItem value="name">Store Name</MenuItem>
              <MenuItem value="averageRating">Average Rating</MenuItem>
            </TextField>

            <TextField
              select
              size="small"
              label="Order"
              value={sortOrder}
              onChange={(e) => {
                setSortOrder(e.target.value as any);
                setPage(0);
              }}
              InputLabelProps={{ style: { color: '#94a3b8' } }}
              inputProps={{ style: { color: '#f8fafc' } }}
              sx={{
                width: '120px',
                '& .MuiOutlinedInput-root': {
                  '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.1)' },
                  '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.25)' },
                  '&.Mui-focused fieldset': { borderColor: '#3b82f6' },
                },
              }}
            >
              <MenuItem value="asc">Ascending</MenuItem>
              <MenuItem value="desc">Descending</MenuItem>
            </TextField>
          </Box>
        </Box>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <CircularProgress color="primary" />
          </Box>
        ) : (
          <>
            <Grid container spacing={3}>
              {stores.length === 0 ? (
                <Grid item xs={12}>
                  <Card sx={{ p: 4, backgroundColor: '#1e293b', border: '1px solid rgba(255,255,255,0.05)', textAlign: 'center' }}>
                    <Typography variant="body1" sx={{ color: '#94a3b8' }}>
                      No stores found matching your criteria.
                    </Typography>
                  </Card>
                </Grid>
              ) : (
                stores.map((store) => (
                  <Grid item xs={12} sm={6} md={4} key={store.id}>
                    <Card
                      sx={{
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        backgroundColor: '#1e293b',
                        borderRadius: '12px',
                        border: '1px solid rgba(255, 255, 255, 0.05)',
                        boxShadow: '0 4px 10px rgba(0, 0, 0, 0.15)',
                        transition: 'transform 0.2s, border-color 0.2s',
                        '&:hover': {
                          transform: 'translateY(-4px)',
                          borderColor: 'rgba(59, 130, 246, 0.3)',
                        },
                      }}
                    >
                      <CardContent sx={{ p: 3 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1.5 }}>
                          <Typography variant="h6" sx={{ fontWeight: 700, color: '#f8fafc', lineHeight: 1.2 }}>
                            {store.name}
                          </Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center', color: '#f59e0b', fontWeight: 700 }}>
                            <StarIcon sx={{ fontSize: 20, mr: 0.5 }} />
                            {store.averageRating > 0 ? store.averageRating.toFixed(1) : 'N/A'}
                          </Box>
                        </Box>
                        
                        <Typography variant="caption" sx={{ display: 'block', color: '#64748b', mb: 1.5 }}>
                          {store.ratingsCount} {store.ratingsCount === 1 ? 'rating' : 'ratings'}
                        </Typography>

                        <Typography variant="body2" sx={{ color: '#94a3b8', mb: 1 }}>
                          <strong>Email:</strong> {store.email}
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#94a3b8', mb: 2 }}>
                          <strong>Address:</strong> {store.address}
                        </Typography>
                        
                        <Box sx={{ borderTop: '1px solid rgba(255, 255, 255, 0.05)', pt: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Box>
                            {store.myRating ? (
                              <Typography variant="caption" sx={{ color: '#10b981', fontWeight: 600 }}>
                                My Rating: {store.myRating} ★
                              </Typography>
                            ) : (
                              <Typography variant="caption" sx={{ color: '#64748b' }}>
                                Not rated yet
                              </Typography>
                            )}
                          </Box>
                          
                          <Button
                            variant="outlined"
                            size="small"
                            onClick={() => handleOpenRatingModal(store)}
                            sx={{
                              textTransform: 'none',
                              borderColor: store.myRating ? '#10b981' : '#3b82f6',
                              color: store.myRating ? '#10b981' : '#3b82f6',
                              fontWeight: 600,
                              '&:hover': {
                                backgroundColor: store.myRating ? 'rgba(16, 185, 129, 0.05)' : 'rgba(59, 130, 246, 0.05)',
                                borderColor: store.myRating ? '#059669' : '#2563eb',
                              },
                            }}
                          >
                            {store.myRating ? 'Edit Rating' : 'Rate Store'}
                          </Button>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                ))
              )}
            </Grid>

            {/* Pagination */}
            <TablePagination
              component="div"
              count={totalCount}
              rowsPerPage={limit}
              page={page}
              onPageChange={(e, newPage) => setPage(newPage)}
              onRowsPerPageChange={(e) => {
                setLimit(parseInt(e.target.value, 10));
                setPage(0);
              }}
              rowsPerPageOptions={[6, 12, 24]}
              sx={{
                color: '#94a3b8',
                mt: 4,
                '& .MuiTablePagination-actions': { color: '#94a3b8' },
                '& .MuiTablePagination-select': { color: '#f8fafc' },
              }}
            />
          </>
        )}

        {/* Dialog: Rate Store */}
        <Dialog
          open={!!selectedStore}
          onClose={handleCloseRatingModal}
          PaperProps={{
            style: {
              backgroundColor: '#1e293b',
              color: '#f8fafc',
              borderRadius: '12px',
              width: '400px',
            },
          }}
        >
          <DialogTitle sx={{ fontWeight: 700 }}>
            {selectedStore?.myRating ? 'Update Rating' : 'Submit Rating'}
          </DialogTitle>
          <DialogContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 3 }}>
            {ratingError && <Alert severity="error" sx={{ mb: 2, width: '100%', borderRadius: '8px' }}>{ratingError}</Alert>}
            
            <Typography variant="subtitle1" sx={{ color: '#94a3b8', mb: 2, textAlign: 'center' }}>
              How was your experience at <strong style={{ color: '#f8fafc' }}>{selectedStore?.name}</strong>?
            </Typography>

            <MuiRating
              value={ratingValue}
              onChange={(event, newValue) => {
                if (newValue !== null) {
                  setRatingValue(newValue);
                }
              }}
              size="large"
              emptyIcon={<StarIcon style={{ opacity: 0.15, color: '#f8fafc' }} fontSize="inherit" />}
              sx={{
                fontSize: '3rem',
                color: '#f59e0b',
                mb: 2,
              }}
            />

            <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 600 }}>
              {ratingValue ? `${ratingValue} Star${ratingValue !== 1 ? 's' : ''}` : 'Select Rating'}
            </Typography>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 3 }}>
            <Button onClick={handleCloseRatingModal} sx={{ color: '#94a3b8', textTransform: 'none' }}>
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={handleRatingSubmit}
              disabled={submittingRating || ratingValue === null}
              sx={{
                background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                textTransform: 'none',
                borderRadius: '6px',
                px: 3,
                '&:hover': {
                  background: 'linear-gradient(135deg, #2563eb 0%, #1e40af 100%)',
                },
              }}
            >
              {submittingRating ? <CircularProgress size={20} sx={{ color: '#fff' }} /> : 'Submit'}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Toast Notification */}
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
