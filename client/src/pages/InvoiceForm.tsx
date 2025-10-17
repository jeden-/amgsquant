import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Grid,
  Alert,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Divider,
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router-dom';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { pl } from 'date-fns/locale';
import { invoicesApi, customersApi } from '../services/api';
import { Invoice, Customer, InvoiceItem } from '../types';

const InvoiceForm: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEdit = Boolean(id);

  const [formData, setFormData] = useState<Partial<Invoice>>({
    customer_id: 0,
    issue_date: new Date().toISOString().split('T')[0],
    due_date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 14 dni od dziś
    net_amount: 0,
    vat_rate: 23,
    vat_amount: 0,
    gross_amount: 0,
    description: '',
    status: 'draft',
  });

  const [items, setItems] = useState<InvoiceItem[]>([
    {
      description: '',
      quantity: 1,
      unit_price: 0,
      net_amount: 0,
      vat_rate: 23,
      vat_amount: 0,
      gross_amount: 0,
    }
  ]);

  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadCustomers();
    if (isEdit && id) {
      loadInvoice(parseInt(id));
    }
  }, [id, isEdit]);

  const loadCustomers = async () => {
    try {
      const response = await customersApi.getAll();
      if (response.success) {
        setCustomers(response.data || []);
      }
    } catch (err) {
      console.error('Błąd ładowania klientów:', err);
    }
  };

  const loadInvoice = async (invoiceId: number) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await invoicesApi.getById(invoiceId);
      if (response.success && response.data) {
        const invoice = response.data;
        setFormData(invoice);
        if (invoice.items) {
          setItems(invoice.items);
        }
      } else {
        setError(response.error || 'Nie udało się załadować faktury');
      }
    } catch (err) {
      console.error('Błąd ładowania faktury:', err);
      setError('Nie udało się załadować faktury');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: keyof Invoice) => (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const value = event.target.value;
    setFormData(prev => ({
      ...prev,
      [field]: field === 'customer_id' ? parseInt(value) : value,
    }));
  };

  const handleCustomerChange = (customerId: number) => {
    setFormData(prev => ({
      ...prev,
      customer_id: customerId,
    }));
  };

  const handleItemChange = (index: number, field: keyof InvoiceItem, value: any) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    
    // Przelicz kwoty dla tego elementu
    if (field === 'quantity' || field === 'unit_price' || field === 'vat_rate') {
      const quantity = field === 'quantity' ? value : newItems[index].quantity;
      const unitPrice = field === 'unit_price' ? value : newItems[index].unit_price;
      const vatRate = field === 'vat_rate' ? value : newItems[index].vat_rate;
      
      const netAmount = quantity * unitPrice;
      const vatAmount = netAmount * (vatRate / 100);
      const grossAmount = netAmount + vatAmount;
      
      newItems[index] = {
        ...newItems[index],
        quantity,
        unit_price: unitPrice,
        vat_rate: vatRate,
        net_amount: netAmount,
        vat_amount: vatAmount,
        gross_amount: grossAmount,
      };
    }
    
    setItems(newItems);
    calculateTotals(newItems);
  };

  const calculateTotals = (itemsList: InvoiceItem[]) => {
    const totals = itemsList.reduce(
      (acc, item) => ({
        net: acc.net + item.net_amount,
        vat: acc.vat + item.vat_amount,
        gross: acc.gross + item.gross_amount,
      }),
      { net: 0, vat: 0, gross: 0 }
    );

    setFormData(prev => ({
      ...prev,
      net_amount: totals.net,
      vat_amount: totals.vat,
      gross_amount: totals.gross,
    }));
  };

  const addItem = () => {
    setItems(prev => [...prev, {
      description: '',
      quantity: 1,
      unit_price: 0,
      net_amount: 0,
      vat_rate: 23,
      vat_amount: 0,
      gross_amount: 0,
    }]);
  };

  const removeItem = (index: number) => {
    if (items.length > 1) {
      const newItems = items.filter((_, i) => i !== index);
      setItems(newItems);
      calculateTotals(newItems);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    
    if (!formData.customer_id) {
      setError('Wybierz klienta');
      return;
    }

    if (!formData.issue_date || !formData.due_date) {
      setError('Wypełnij daty wystawienia i płatności');
      return;
    }

    if (items.some(item => !item.description.trim())) {
      setError('Wszystkie pozycje muszą mieć opis');
      return;
    }

    try {
      setSaving(true);
      setError(null);

      const invoiceData = {
        ...formData,
        items: items.filter(item => item.description.trim()),
      };

      let response;
      if (isEdit && id) {
        response = await invoicesApi.update(parseInt(id), invoiceData);
      } else {
        response = await invoicesApi.create(invoiceData as Omit<Invoice, 'id' | 'invoice_number'>);
      }

      if (response.success) {
        navigate('/invoices');
      } else {
        setError(response.error || 'Błąd zapisywania faktury');
      }
    } catch (err) {
      console.error('Błąd zapisywania faktury:', err);
      setError('Nie udało się zapisać faktury');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    navigate('/invoices');
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={pl}>
      <Box>
        <Typography variant="h4" component="h1" gutterBottom>
          {isEdit ? 'Edytuj fakturę' : 'Dodaj nową fakturę'}
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            {/* Informacje podstawowe */}
            <Grid item xs={12}>
              <Paper sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Informacje podstawowe
                </Typography>
                
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <FormControl fullWidth required>
                      <InputLabel>Klient</InputLabel>
                      <Select
                        value={formData.customer_id || ''}
                        label="Klient"
                        onChange={(e) => handleCustomerChange(Number(e.target.value))}
                      >
                        {customers.map((customer) => (
                          <MenuItem key={customer.id} value={customer.id}>
                            {customer.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>

                  <Grid item xs={12} md={3}>
                    <DatePicker
                      label="Data wystawienia"
                      value={formData.issue_date ? new Date(formData.issue_date) : null}
                      onChange={(date) => setFormData(prev => ({
                        ...prev,
                        issue_date: date ? date.toISOString().split('T')[0] : ''
                      }))}
                      slotProps={{ textField: { fullWidth: true, required: true } }}
                    />
                  </Grid>

                  <Grid item xs={12} md={3}>
                    <DatePicker
                      label="Termin płatności"
                      value={formData.due_date ? new Date(formData.due_date) : null}
                      onChange={(date) => setFormData(prev => ({
                        ...prev,
                        due_date: date ? date.toISOString().split('T')[0] : ''
                      }))}
                      slotProps={{ textField: { fullWidth: true, required: true } }}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Opis faktury"
                      multiline
                      rows={2}
                      value={formData.description || ''}
                      onChange={handleChange('description')}
                      placeholder="Opis faktury (opcjonalny)"
                    />
                  </Grid>
                </Grid>
              </Paper>
            </Grid>

            {/* Pozycje faktury */}
            <Grid item xs={12}>
              <Paper sx={{ p: 3 }}>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                  <Typography variant="h6">
                    Pozycje faktury
                  </Typography>
                  <Button
                    variant="outlined"
                    startIcon={<AddIcon />}
                    onClick={addItem}
                  >
                    Dodaj pozycję
                  </Button>
                </Box>

                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Opis</TableCell>
                        <TableCell align="right">Ilość</TableCell>
                        <TableCell align="right">Cena jednostkowa</TableCell>
                        <TableCell align="right">Stawka VAT (%)</TableCell>
                        <TableCell align="right">Kwota netto</TableCell>
                        <TableCell align="right">VAT</TableCell>
                        <TableCell align="right">Kwota brutto</TableCell>
                        <TableCell align="center">Akcje</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {items.map((item, index) => (
                        <TableRow key={index}>
                          <TableCell>
                            <TextField
                              fullWidth
                              value={item.description}
                              onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                              placeholder="Opis pozycji"
                              required
                            />
                          </TableCell>
                          <TableCell>
                            <TextField
                              type="number"
                              value={item.quantity}
                              onChange={(e) => handleItemChange(index, 'quantity', parseFloat(e.target.value) || 0)}
                              inputProps={{ min: 0, step: 0.01 }}
                            />
                          </TableCell>
                          <TableCell>
                            <TextField
                              type="number"
                              value={item.unit_price}
                              onChange={(e) => handleItemChange(index, 'unit_price', parseFloat(e.target.value) || 0)}
                              inputProps={{ min: 0, step: 0.01 }}
                            />
                          </TableCell>
                          <TableCell>
                            <TextField
                              type="number"
                              value={item.vat_rate}
                              onChange={(e) => handleItemChange(index, 'vat_rate', parseFloat(e.target.value) || 0)}
                              inputProps={{ min: 0, max: 100, step: 0.01 }}
                            />
                          </TableCell>
                          <TableCell align="right">
                            {item.net_amount.toLocaleString('pl-PL', {
                              style: 'currency',
                              currency: 'PLN'
                            })}
                          </TableCell>
                          <TableCell align="right">
                            {item.vat_amount.toLocaleString('pl-PL', {
                              style: 'currency',
                              currency: 'PLN'
                            })}
                          </TableCell>
                          <TableCell align="right">
                            {item.gross_amount.toLocaleString('pl-PL', {
                              style: 'currency',
                              currency: 'PLN'
                            })}
                          </TableCell>
                          <TableCell align="center">
                            <IconButton
                              color="error"
                              onClick={() => removeItem(index)}
                              disabled={items.length === 1}
                            >
                              <DeleteIcon />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Paper>
            </Grid>

            {/* Podsumowanie */}
            <Grid item xs={12}>
              <Paper sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Podsumowanie
                </Typography>
                
                <Grid container spacing={2}>
                  <Grid item xs={12} md={4}>
                    <Typography variant="body1">
                      <strong>Kwota netto:</strong> {formData.net_amount?.toLocaleString('pl-PL', {
                        style: 'currency',
                        currency: 'PLN'
                      })}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Typography variant="body1">
                      <strong>VAT:</strong> {formData.vat_amount?.toLocaleString('pl-PL', {
                        style: 'currency',
                        currency: 'PLN'
                      })}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Typography variant="h6" color="primary">
                      <strong>Kwota brutto:</strong> {formData.gross_amount?.toLocaleString('pl-PL', {
                        style: 'currency',
                        currency: 'PLN'
                      })}
                    </Typography>
                  </Grid>
                </Grid>
              </Paper>
            </Grid>

            {/* Przyciski */}
            <Grid item xs={12}>
              <Box display="flex" gap={2} justifyContent="flex-end">
                <Button
                  variant="outlined"
                  onClick={handleCancel}
                  disabled={saving}
                >
                  Anuluj
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={saving || !formData.customer_id || !formData.issue_date || !formData.due_date}
                >
                  {saving ? <CircularProgress size={20} /> : (isEdit ? 'Zapisz zmiany' : 'Dodaj fakturę')}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </Box>
    </LocalizationProvider>
  );
};

export default InvoiceForm;
