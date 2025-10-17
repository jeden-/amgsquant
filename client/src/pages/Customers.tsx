import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Chip,
  TextField,
  InputAdornment,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { customersApi } from '../services/api';
import { Customer } from '../types';

const Customers: React.FC = () => {
  const navigate = useNavigate();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean;
    customer: Customer | null;
  }>({ open: false, customer: null });

  useEffect(() => {
    loadCustomers();
  }, []);

  const loadCustomers = async (search?: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await customersApi.getAll(search);
      if (response.success) {
        setCustomers(response.data || []);
      } else {
        setError(response.error || 'Błąd ładowania klientów');
      }
    } catch (err) {
      console.error('Błąd ładowania klientów:', err);
      setError('Nie udało się załadować klientów');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSearchTerm(value);
    loadCustomers(value);
  };

  const handleDelete = async (customer: Customer) => {
    try {
      const response = await customersApi.delete(customer.id!);
      if (response.success) {
        setCustomers(customers.filter(c => c.id !== customer.id));
        setDeleteDialog({ open: false, customer: null });
      } else {
        setError(response.error || 'Błąd usuwania klienta');
      }
    } catch (err) {
      console.error('Błąd usuwania klienta:', err);
      setError('Nie udało się usunąć klienta');
    }
  };

  const openDeleteDialog = (customer: Customer) => {
    setDeleteDialog({ open: true, customer });
  };

  const closeDeleteDialog = () => {
    setDeleteDialog({ open: false, customer: null });
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1">
          Klienci
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate('/customers/new')}
        >
          Dodaj klienta
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Paper sx={{ mb: 2 }}>
        <Box p={2}>
          <TextField
            fullWidth
            placeholder="Szukaj klientów..."
            value={searchTerm}
            onChange={handleSearch}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
        </Box>
      </Paper>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nazwa</TableCell>
              <TableCell>NIP</TableCell>
              <TableCell>Miasto</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Telefon</TableCell>
              <TableCell align="right">Akcje</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {customers.length > 0 ? (
              customers.map((customer) => (
                <TableRow key={customer.id} hover>
                  <TableCell>
                    <Typography variant="body1" fontWeight="medium">
                      {customer.name}
                    </Typography>
                  </TableCell>
                  <TableCell>{customer.nip || '-'}</TableCell>
                  <TableCell>{customer.city || '-'}</TableCell>
                  <TableCell>{customer.email || '-'}</TableCell>
                  <TableCell>{customer.phone || '-'}</TableCell>
                  <TableCell align="right">
                    <IconButton
                      color="primary"
                      onClick={() => navigate(`/customers/${customer.id}/edit`)}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      color="error"
                      onClick={() => openDeleteDialog(customer)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  <Typography color="textSecondary">
                    {searchTerm ? 'Nie znaleziono klientów' : 'Brak klientów'}
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Dialog potwierdzenia usunięcia */}
      <Dialog
        open={deleteDialog.open}
        onClose={closeDeleteDialog}
        aria-labelledby="delete-dialog-title"
      >
        <DialogTitle id="delete-dialog-title">
          Potwierdź usunięcie
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Czy na pewno chcesz usunąć klienta "{deleteDialog.customer?.name}"?
            Ta operacja nie może zostać cofnięta.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDeleteDialog} color="primary">
            Anuluj
          </Button>
          <Button
            onClick={() => deleteDialog.customer && handleDelete(deleteDialog.customer)}
            color="error"
            variant="contained"
          >
            Usuń
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Customers;
