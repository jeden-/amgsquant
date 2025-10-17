import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  Alert,
  Chip,
} from '@mui/material';
import {
  Assessment as AssessmentIcon,
  TrendingUp as TrendingUpIcon,
  People as PeopleIcon,
  Receipt as ReceiptIcon,
} from '@mui/icons-material';
import { reportsApi } from '../services/api';
import { MonthlyReport, YearlyReport, CustomerReport, VatReport } from '../types';

const Reports: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState<number>(new Date().getMonth() + 1);
  const [reportType, setReportType] = useState<'monthly' | 'yearly' | 'customers' | 'vat'>('monthly');
  
  const [monthlyReport, setMonthlyReport] = useState<MonthlyReport | null>(null);
  const [yearlyReport, setYearlyReport] = useState<YearlyReport | null>(null);
  const [customerReport, setCustomerReport] = useState<CustomerReport[]>([]);
  const [vatReport, setVatReport] = useState<VatReport[]>([]);

  useEffect(() => {
    loadReport();
  }, [reportType, selectedYear, selectedMonth]);

  const loadReport = async () => {
    try {
      setLoading(true);
      setError(null);

      let response;
      switch (reportType) {
        case 'monthly':
          response = await reportsApi.getMonthly(selectedYear, selectedMonth);
          if (response.success) {
            setMonthlyReport(response.data || null);
          }
          break;
        case 'yearly':
          response = await reportsApi.getYearly(selectedYear);
          if (response.success) {
            setYearlyReport(response.data || null);
          }
          break;
        case 'customers':
          response = await reportsApi.getCustomers(selectedYear, selectedMonth);
          if (response.success) {
            setCustomerReport(response.data || []);
          }
          break;
        case 'vat':
          response = await reportsApi.getVat(selectedYear, selectedMonth);
          if (response.success) {
            setVatReport(response.data || []);
          }
          break;
      }

      if (response && !response.success) {
        setError(response.error || 'Błąd ładowania raportu');
      }
    } catch (err) {
      console.error('Błąd ładowania raportu:', err);
      setError('Nie udało się załadować raportu');
    } finally {
      setLoading(false);
    }
  };

  const generateYears = () => {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let i = currentYear; i >= currentYear - 5; i--) {
      years.push(i);
    }
    return years;
  };

  const months = [
    'Styczeń', 'Luty', 'Marzec', 'Kwiecień', 'Maj', 'Czerwiec',
    'Lipiec', 'Sierpień', 'Wrzesień', 'Październik', 'Listopad', 'Grudzień'
  ];

  const renderMonthlyReport = () => {
    if (!monthlyReport) return null;

    return (
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <ReceiptIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6">Podsumowanie</Typography>
              </Box>
              <Typography variant="body2" color="textSecondary" gutterBottom>
                Okres: {monthlyReport.period}
              </Typography>
              <Typography variant="h4" gutterBottom>
                {monthlyReport.summary.total_invoices}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                faktur
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <TrendingUpIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6">Przychody</Typography>
              </Box>
              <Typography variant="h4" color="primary" gutterBottom>
                {monthlyReport.summary.total_gross.toLocaleString('pl-PL', {
                  style: 'currency',
                  currency: 'PLN'
                })}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                brutto
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <AssessmentIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6">VAT</Typography>
              </Box>
              <Typography variant="h4" gutterBottom>
                {monthlyReport.summary.total_vat.toLocaleString('pl-PL', {
                  style: 'currency',
                  currency: 'PLN'
                })}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                do zapłaty
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Faktury z okresu
            </Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Numer faktury</TableCell>
                    <TableCell>Klient</TableCell>
                    <TableCell>Data wystawienia</TableCell>
                    <TableCell align="right">Kwota brutto</TableCell>
                    <TableCell>Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {monthlyReport.invoices.map((invoice) => (
                    <TableRow key={invoice.id}>
                      <TableCell>{invoice.invoice_number}</TableCell>
                      <TableCell>{invoice.customer_name}</TableCell>
                      <TableCell>
                        {new Date(invoice.issue_date).toLocaleDateString('pl-PL')}
                      </TableCell>
                      <TableCell align="right">
                        {invoice.gross_amount.toLocaleString('pl-PL', {
                          style: 'currency',
                          currency: 'PLN'
                        })}
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={invoice.status}
                          color={invoice.status === 'paid' ? 'success' : 'default'}
                          size="small"
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>
      </Grid>
    );
  };

  const renderYearlyReport = () => {
    if (!yearlyReport) return null;

    return (
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h5" gutterBottom>
                Raport roczny {yearlyReport.year}
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={6} md={3}>
                  <Typography variant="h4" color="primary">
                    {yearlyReport.summary.total_invoices}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    faktur
                  </Typography>
                </Grid>
                <Grid item xs={6} md={3}>
                  <Typography variant="h4" color="primary">
                    {yearlyReport.summary.total_gross.toLocaleString('pl-PL', {
                      style: 'currency',
                      currency: 'PLN'
                    })}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    przychód brutto
                  </Typography>
                </Grid>
                <Grid item xs={6} md={3}>
                  <Typography variant="h4">
                    {yearlyReport.summary.total_net.toLocaleString('pl-PL', {
                      style: 'currency',
                      currency: 'PLN'
                    })}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    przychód netto
                  </Typography>
                </Grid>
                <Grid item xs={6} md={3}>
                  <Typography variant="h4">
                    {yearlyReport.summary.total_vat.toLocaleString('pl-PL', {
                      style: 'currency',
                      currency: 'PLN'
                    })}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    VAT
                  </Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Rozbicie miesięczne
            </Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Miesiąc</TableCell>
                    <TableCell align="right">Liczba faktur</TableCell>
                    <TableCell align="right">Kwota netto</TableCell>
                    <TableCell align="right">VAT</TableCell>
                    <TableCell align="right">Kwota brutto</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {yearlyReport.monthly_breakdown.map((month) => (
                    <TableRow key={month.month}>
                      <TableCell>{month.month_name}</TableCell>
                      <TableCell align="right">{month.total_invoices}</TableCell>
                      <TableCell align="right">
                        {month.total_net.toLocaleString('pl-PL', {
                          style: 'currency',
                          currency: 'PLN'
                        })}
                      </TableCell>
                      <TableCell align="right">
                        {month.total_vat.toLocaleString('pl-PL', {
                          style: 'currency',
                          currency: 'PLN'
                        })}
                      </TableCell>
                      <TableCell align="right">
                        {month.total_gross.toLocaleString('pl-PL', {
                          style: 'currency',
                          currency: 'PLN'
                        })}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>
      </Grid>
    );
  };

  const renderCustomerReport = () => {
    return (
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Raport klientów
            </Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Klient</TableCell>
                    <TableCell>NIP</TableCell>
                    <TableCell align="right">Liczba faktur</TableCell>
                    <TableCell align="right">Kwota netto</TableCell>
                    <TableCell align="right">VAT</TableCell>
                    <TableCell align="right">Kwota brutto</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {customerReport.map((customer) => (
                    <TableRow key={customer.id}>
                      <TableCell>{customer.name}</TableCell>
                      <TableCell>{customer.nip || '-'}</TableCell>
                      <TableCell align="right">{customer.invoice_count}</TableCell>
                      <TableCell align="right">
                        {customer.total_net.toLocaleString('pl-PL', {
                          style: 'currency',
                          currency: 'PLN'
                        })}
                      </TableCell>
                      <TableCell align="right">
                        {customer.total_vat.toLocaleString('pl-PL', {
                          style: 'currency',
                          currency: 'PLN'
                        })}
                      </TableCell>
                      <TableCell align="right">
                        {customer.total_gross.toLocaleString('pl-PL', {
                          style: 'currency',
                          currency: 'PLN'
                        })}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>
      </Grid>
    );
  };

  const renderVatReport = () => {
    return (
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Raport VAT
            </Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Stawka VAT (%)</TableCell>
                    <TableCell align="right">Liczba faktur</TableCell>
                    <TableCell align="right">Kwota netto</TableCell>
                    <TableCell align="right">VAT</TableCell>
                    <TableCell align="right">Kwota brutto</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {vatReport.map((vat) => (
                    <TableRow key={vat.vat_rate}>
                      <TableCell>{vat.vat_rate}%</TableCell>
                      <TableCell align="right">{vat.invoice_count}</TableCell>
                      <TableCell align="right">
                        {vat.total_net.toLocaleString('pl-PL', {
                          style: 'currency',
                          currency: 'PLN'
                        })}
                      </TableCell>
                      <TableCell align="right">
                        {vat.total_vat.toLocaleString('pl-PL', {
                          style: 'currency',
                          currency: 'PLN'
                        })}
                      </TableCell>
                      <TableCell align="right">
                        {vat.total_gross.toLocaleString('pl-PL', {
                          style: 'currency',
                          currency: 'PLN'
                        })}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>
      </Grid>
    );
  };

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Raporty
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {/* Kontrolki raportu */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={3}>
            <FormControl fullWidth>
              <InputLabel>Typ raportu</InputLabel>
              <Select
                value={reportType}
                label="Typ raportu"
                onChange={(e) => setReportType(e.target.value as any)}
              >
                <MenuItem value="monthly">Miesięczny</MenuItem>
                <MenuItem value="yearly">Roczny</MenuItem>
                <MenuItem value="customers">Klienci</MenuItem>
                <MenuItem value="vat">VAT</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} md={2}>
            <FormControl fullWidth>
              <InputLabel>Rok</InputLabel>
              <Select
                value={selectedYear}
                label="Rok"
                onChange={(e) => setSelectedYear(Number(e.target.value))}
              >
                {generateYears().map((year) => (
                  <MenuItem key={year} value={year}>
                    {year}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {reportType === 'monthly' && (
            <Grid item xs={12} md={2}>
              <FormControl fullWidth>
                <InputLabel>Miesiąc</InputLabel>
                <Select
                  value={selectedMonth}
                  label="Miesiąc"
                  onChange={(e) => setSelectedMonth(Number(e.target.value))}
                >
                  {months.map((month, index) => (
                    <MenuItem key={index + 1} value={index + 1}>
                      {month}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          )}

          <Grid item xs={12} md={2}>
            <Button
              variant="contained"
              onClick={loadReport}
              disabled={loading}
              fullWidth
            >
              {loading ? <CircularProgress size={20} /> : 'Generuj'}
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* Wyświetlanie raportu */}
      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
          <CircularProgress />
        </Box>
      ) : (
        <>
          {reportType === 'monthly' && renderMonthlyReport()}
          {reportType === 'yearly' && renderYearlyReport()}
          {reportType === 'customers' && renderCustomerReport()}
          {reportType === 'vat' && renderVatReport()}
        </>
      )}
    </Box>
  );
};

export default Reports;
