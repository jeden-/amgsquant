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
} from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { customersApi } from '../services/api';
import { Customer } from '../types';

const CustomerForm: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEdit = Boolean(id);

  const [formData, setFormData] = useState<Partial<Customer>>({
    name: '',
    nip: '',
    address: '',
    city: '',
    postal_code: '',
    email: '',
    phone: '',
  });

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isEdit && id) {
      loadCustomer(parseInt(id));
    }
  }, [id, isEdit]);

  const loadCustomer = async (customerId: number) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await customersApi.getById(customerId);
      if (response.success && response.data) {
        setFormData(response.data);
      } else {
        setError(response.error || 'Nie udało się załadować klienta');
      }
    } catch (err) {
      console.error('Błąd ładowania klienta:', err);
      setError('Nie udało się załadować klienta');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: keyof Customer) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData(prev => ({
      ...prev,
      [field]: event.target.value,
    }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    
    if (!formData.name?.trim()) {
      setError('Nazwa klienta jest wymagana');
      return;
    }

    try {
      setSaving(true);
      setError(null);

      let response;
      if (isEdit && id) {
        response = await customersApi.update(parseInt(id), formData);
      } else {
        response = await customersApi.create(formData as Omit<Customer, 'id'>);
      }

      if (response.success) {
        navigate('/customers');
      } else {
        setError(response.error || 'Błąd zapisywania klienta');
      }
    } catch (err) {
      console.error('Błąd zapisywania klienta:', err);
      setError('Nie udało się zapisać klienta');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    navigate('/customers');
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
      <Typography variant="h4" component="h1" gutterBottom>
        {isEdit ? 'Edytuj klienta' : 'Dodaj nowego klienta'}
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Paper sx={{ p: 3 }}>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Nazwa klienta *"
                value={formData.name || ''}
                onChange={handleChange('name')}
                required
                error={!formData.name?.trim()}
                helperText={!formData.name?.trim() ? 'Nazwa klienta jest wymagana' : ''}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="NIP"
                value={formData.nip || ''}
                onChange={handleChange('nip')}
                placeholder="1234567890"
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Adres"
                value={formData.address || ''}
                onChange={handleChange('address')}
                placeholder="ul. Przykładowa 123"
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Miasto"
                value={formData.city || ''}
                onChange={handleChange('city')}
                placeholder="Warszawa"
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Kod pocztowy"
                value={formData.postal_code || ''}
                onChange={handleChange('postal_code')}
                placeholder="00-001"
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Email"
                type="email"
                value={formData.email || ''}
                onChange={handleChange('email')}
                placeholder="klient@example.com"
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Telefon"
                value={formData.phone || ''}
                onChange={handleChange('phone')}
                placeholder="+48 123 456 789"
              />
            </Grid>

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
                  disabled={saving || !formData.name?.trim()}
                >
                  {saving ? <CircularProgress size={20} /> : (isEdit ? 'Zapisz zmiany' : 'Dodaj klienta')}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Box>
  );
};

export default CustomerForm;
