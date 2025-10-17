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
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  Receipt as ReceiptIcon,
  PictureAsPdf as PdfIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { invoicesApi } from '../services/api';
import { Invoice } from '../types';

const Invoices: React.FC = () => {
  const navigate = useNavigate();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean;
    invoice: Invoice | null;
  }>({ open: false, invoice: null });

  useEffect(() => {
    loadInvoices();
  }, []);

  const loadInvoices = async (search?: string, status?: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await invoicesApi.getAll({ 
        ...(status && { status }),
        ...(search && { search })
      });
      if (response.success) {
        setInvoices(response.data || []);
      } else {
        setError(response.error || 'Błąd ładowania faktur');
      }
    } catch (err) {
      console.error('Błąd ładowania faktur:', err);
      setError('Nie udało się załadować faktur');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSearchTerm(value);
    loadInvoices(value, statusFilter);
  };

  const handleStatusFilter = (status: string) => {
    setStatusFilter(status);
    loadInvoices(searchTerm, status);
  };

  const handleDelete = async (invoice: Invoice) => {
    try {
      const response = await invoicesApi.delete(invoice.id!);
      if (response.success) {
        setInvoices(invoices.filter(i => i.id !== invoice.id));
        setDeleteDialog({ open: false, invoice: null });
      } else {
        setError(response.error || 'Błąd usuwania faktury');
      }
    } catch (err) {
      console.error('Błąd usuwania faktury:', err);
      setError('Nie udało się usunąć faktury');
    }
  };

  const handleFinalize = async (invoice: Invoice) => {
    try {
      const response = await invoicesApi.finalize(invoice.id!);
      if (response.success) {
        // Odśwież listę faktur
        loadInvoices(searchTerm, statusFilter);
      } else {
        setError(response.error || 'Błąd finalizacji faktury');
      }
    } catch (err) {
      console.error('Błąd finalizacji faktury:', err);
      setError('Nie udało się sfinalizować faktury');
    }
  };

  const handleDownloadPDF = async (invoice: Invoice) => {
    try {
      await invoicesApi.downloadPDF(invoice.id!);
    } catch (err) {
      console.error('Błąd pobierania PDF:', err);
      setError('Nie udało się pobrać PDF faktury');
    }
  };

  const openDeleteDialog = (invoice: Invoice) => {
    setDeleteDialog({ open: true, invoice });
  };

  const closeDeleteDialog = () => {
    setDeleteDialog({ open: false, invoice: null });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'warning';
      case 'finalized': return 'info';
      case 'paid': return 'success';
      case 'cancelled': return 'error';
      default: return 'default';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'draft': return 'Szkic';
      case 'finalized': return 'Sfinalizowana';
      case 'paid': return 'Opłacona';
      case 'cancelled': return 'Anulowana';
      default: return status;
    }
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
          Faktury
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate('/invoices/new')}
        >
          Dodaj fakturę
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Paper sx={{ mb: 2, p: 2 }}>
        <Box display="flex" gap={2} alignItems="center">
          <TextField
            placeholder="Szukaj faktur..."
            value={searchTerm}
            onChange={handleSearch}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            sx={{ flexGrow: 1 }}
          />
          <FormControl sx={{ minWidth: 150 }}>
            <InputLabel>Status</InputLabel>
            <Select
              value={statusFilter}
              label="Status"
              onChange={(e) => handleStatusFilter(e.target.value)}
            >
              <MenuItem value="">Wszystkie</MenuItem>
              <MenuItem value="draft">Szkic</MenuItem>
              <MenuItem value="finalized">Sfinalizowana</MenuItem>
              <MenuItem value="paid">Opłacona</MenuItem>
              <MenuItem value="cancelled">Anulowana</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Paper>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Numer faktury</TableCell>
              <TableCell>Klient</TableCell>
              <TableCell>Data wystawienia</TableCell>
              <TableCell>Termin płatności</TableCell>
              <TableCell>Kwota</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="right">Akcje</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {invoices.length > 0 ? (
              invoices.map((invoice) => (
                <TableRow key={invoice.id} hover>
                  <TableCell>
                    <Typography variant="body1" fontWeight="medium">
                      {invoice.invoice_number}
                    </Typography>
                  </TableCell>
                  <TableCell>{invoice.customer_name}</TableCell>
                  <TableCell>
                    {new Date(invoice.issue_date).toLocaleDateString('pl-PL')}
                  </TableCell>
                  <TableCell>
                    {new Date(invoice.due_date).toLocaleDateString('pl-PL')}
                  </TableCell>
                  <TableCell>
                    <Typography variant="body1" fontWeight="medium">
                      {invoice.gross_amount.toLocaleString('pl-PL', {
                        style: 'currency',
                        currency: 'PLN'
                      })}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={getStatusLabel(invoice.status)}
                      color={getStatusColor(invoice.status) as any}
                      size="small"
                    />
                  </TableCell>
                  <TableCell align="right">
                    <IconButton
                      color="primary"
                      onClick={() => navigate(`/invoices/${invoice.id}/edit`)}
                    >
                      <EditIcon />
                    </IconButton>
                    {invoice.status === 'draft' && (
                      <IconButton
                        color="success"
                        onClick={() => handleFinalize(invoice)}
                        title="Sfinalizuj fakturę"
                      >
                        <ReceiptIcon />
                      </IconButton>
                    )}
                    <IconButton
                      color="info"
                      onClick={() => handleDownloadPDF(invoice)}
                      title="Pobierz PDF"
                    >
                      <PdfIcon />
                    </IconButton>
                    <IconButton
                      color="error"
                      onClick={() => openDeleteDialog(invoice)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  <Typography color="textSecondary">
                    {searchTerm || statusFilter ? 'Nie znaleziono faktur' : 'Brak faktur'}
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
            Czy na pewno chcesz usunąć fakturę "{deleteDialog.invoice?.invoice_number}"?
            Ta operacja nie może zostać cofnięta.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDeleteDialog} color="primary">
            Anuluj
          </Button>
          <Button
            onClick={() => deleteDialog.invoice && handleDelete(deleteDialog.invoice)}
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

export default Invoices;
