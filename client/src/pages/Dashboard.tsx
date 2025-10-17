import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Grid,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Chip,
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  People as PeopleIcon,
  Receipt as ReceiptIcon,
  AttachMoney as MoneyIcon,
  TrendingUp as TrendingUpIcon,
} from '@mui/icons-material';
import { customersApi, invoicesApi, reportsApi } from '../services/api';
import { Customer, Invoice, MonthlyReport } from '../types';

const Dashboard: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState({
    totalCustomers: 0,
    totalInvoices: 0,
    monthlyRevenue: 0,
    pendingInvoices: 0,
  });
  const [recentInvoices, setRecentInvoices] = useState<Invoice[]>([]);
  const [monthlyReport, setMonthlyReport] = useState<MonthlyReport | null>(null);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      const currentDate = new Date();
      const currentYear = currentDate.getFullYear();
      const currentMonth = currentDate.getMonth() + 1;

      // Załaduj dane równolegle
      const [
        customersResponse,
        invoicesResponse,
        monthlyReportResponse,
      ] = await Promise.all([
        customersApi.getAll(),
        invoicesApi.getAll(),
        reportsApi.getMonthly(currentYear, currentMonth),
      ]);

      if (customersResponse.success) {
        setStats(prev => ({ ...prev, totalCustomers: customersResponse.data?.length || 0 }));
      }

      if (invoicesResponse.success) {
        const invoices = invoicesResponse.data || [];
        setStats(prev => ({
          ...prev,
          totalInvoices: invoices.length,
          pendingInvoices: invoices.filter(inv => inv.status === 'draft').length,
        }));
        
        // Pokaż ostatnie 5 faktur
        setRecentInvoices(invoices.slice(0, 5));
      }

      if (monthlyReportResponse.success) {
        setMonthlyReport(monthlyReportResponse.data || null);
        setStats(prev => ({
          ...prev,
          monthlyRevenue: monthlyReportResponse.data?.summary.total_gross || 0,
        }));
      }

    } catch (err) {
      console.error('Błąd ładowania danych dashboard:', err);
      setError('Nie udało się załadować danych dashboard');
    } finally {
      setLoading(false);
    }
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

  if (error) {
    return (
      <Alert severity="error" sx={{ mb: 2 }}>
        {error}
      </Alert>
    );
  }

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Dashboard
      </Typography>
      
      <Grid container spacing={3}>
        {/* Statystyki */}
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <PeopleIcon color="primary" sx={{ mr: 2, fontSize: 40 }} />
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Klienci
                  </Typography>
                  <Typography variant="h4">
                    {stats.totalCustomers}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <ReceiptIcon color="primary" sx={{ mr: 2, fontSize: 40 }} />
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Faktury
                  </Typography>
                  <Typography variant="h4">
                    {stats.totalInvoices}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <MoneyIcon color="primary" sx={{ mr: 2, fontSize: 40 }} />
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Przychód (miesiąc)
                  </Typography>
                  <Typography variant="h4">
                    {stats.monthlyRevenue.toLocaleString('pl-PL', {
                      style: 'currency',
                      currency: 'PLN'
                    })}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <TrendingUpIcon color="primary" sx={{ mr: 2, fontSize: 40 }} />
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Szkice
                  </Typography>
                  <Typography variant="h4">
                    {stats.pendingInvoices}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Ostatnie faktury */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Ostatnie faktury
            </Typography>
            {recentInvoices.length > 0 ? (
              <List>
                {recentInvoices.map((invoice) => (
                  <ListItem key={invoice.id} divider>
                    <ListItemText
                      primary={invoice.invoice_number}
                      secondary={`${invoice.customer_name} • ${new Date(invoice.issue_date).toLocaleDateString('pl-PL')}`}
                    />
                    <ListItemSecondaryAction>
                      <Box display="flex" alignItems="center" gap={1}>
                        <Typography variant="body2" color="textSecondary">
                          {invoice.gross_amount.toLocaleString('pl-PL', {
                            style: 'currency',
                            currency: 'PLN'
                          })}
                        </Typography>
                        <Chip
                          label={getStatusLabel(invoice.status)}
                          color={getStatusColor(invoice.status) as any}
                          size="small"
                        />
                      </Box>
                    </ListItemSecondaryAction>
                  </ListItem>
                ))}
              </List>
            ) : (
              <Typography color="textSecondary">
                Brak faktur
              </Typography>
            )}
          </Paper>
        </Grid>

        {/* Raport miesięczny */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Raport miesięczny
            </Typography>
            {monthlyReport ? (
              <Box>
                <Typography variant="body2" color="textSecondary" gutterBottom>
                  Okres: {monthlyReport.period}
                </Typography>
                <Typography variant="h6" gutterBottom>
                  Liczba faktur: {monthlyReport.summary.total_invoices}
                </Typography>
                <Typography variant="body2" gutterBottom>
                  Netto: {monthlyReport.summary.total_net.toLocaleString('pl-PL', {
                    style: 'currency',
                    currency: 'PLN'
                  })}
                </Typography>
                <Typography variant="body2" gutterBottom>
                  VAT: {monthlyReport.summary.total_vat.toLocaleString('pl-PL', {
                    style: 'currency',
                    currency: 'PLN'
                  })}
                </Typography>
                <Typography variant="h6" color="primary">
                  Brutto: {monthlyReport.summary.total_gross.toLocaleString('pl-PL', {
                    style: 'currency',
                    currency: 'PLN'
                  })}
                </Typography>
              </Box>
            ) : (
              <Typography color="textSecondary">
                Brak danych
              </Typography>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
