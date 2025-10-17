const express = require('express');
const Invoice = require('../models/Invoice');
const db = require('../database/database');
const router = express.Router();

// GET /api/reports/monthly - Raport miesięczny
router.get('/monthly', async (req, res) => {
  try {
    const { year, month } = req.query;
    
    const currentDate = new Date();
    const reportYear = year || currentDate.getFullYear();
    const reportMonth = month || (currentDate.getMonth() + 1);

    const report = await Invoice.getMonthlyReport(reportYear, reportMonth);
    
    // Pobierz szczegóły faktur z tego miesiąca
    const invoices = await Invoice.findAll();
    const monthlyInvoices = invoices.filter(invoice => {
      const invoiceDate = new Date(invoice.issue_date);
      return invoiceDate.getFullYear() == reportYear && 
             invoiceDate.getMonth() + 1 == reportMonth;
    });

    res.json({
      success: true,
      data: {
        period: `${reportYear}-${String(reportMonth).padStart(2, '0')}`,
        summary: {
          total_invoices: report.total_invoices || 0,
          total_net: parseFloat(report.total_net || 0),
          total_vat: parseFloat(report.total_vat || 0),
          total_gross: parseFloat(report.total_gross || 0)
        },
        invoices: monthlyInvoices
      }
    });
  } catch (error) {
    console.error('Błąd generowania raportu miesięcznego:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// GET /api/reports/yearly - Raport roczny
router.get('/yearly', async (req, res) => {
  try {
    const { year } = req.query;
    const currentDate = new Date();
    const reportYear = year || currentDate.getFullYear();

    // Pobierz dane dla całego roku
    const startDate = `${reportYear}-01-01`;
    const endDate = `${reportYear}-12-31`;

    const yearlyReport = await db.get(`
      SELECT 
        COUNT(*) as total_invoices,
        SUM(net_amount) as total_net,
        SUM(vat_amount) as total_vat,
        SUM(gross_amount) as total_gross
      FROM invoices 
      WHERE issue_date BETWEEN ? AND ?
    `, [startDate, endDate]);

    // Raport miesięczny dla każdego miesiąca
    const monthlyBreakdown = [];
    for (let month = 1; month <= 12; month++) {
      const monthReport = await Invoice.getMonthlyReport(reportYear, month);
      monthlyBreakdown.push({
        month: month,
        month_name: new Date(reportYear, month - 1).toLocaleString('pl-PL', { month: 'long' }),
        total_invoices: monthReport.total_invoices || 0,
        total_net: parseFloat(monthReport.total_net || 0),
        total_vat: parseFloat(monthReport.total_vat || 0),
        total_gross: parseFloat(monthReport.total_gross || 0)
      });
    }

    res.json({
      success: true,
      data: {
        year: reportYear,
        summary: {
          total_invoices: yearlyReport.total_invoices || 0,
          total_net: parseFloat(yearlyReport.total_net || 0),
          total_vat: parseFloat(yearlyReport.total_vat || 0),
          total_gross: parseFloat(yearlyReport.total_gross || 0)
        },
        monthly_breakdown: monthlyBreakdown
      }
    });
  } catch (error) {
    console.error('Błąd generowania raportu rocznego:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// GET /api/reports/customers - Raport klientów
router.get('/customers', async (req, res) => {
  try {
    const { year, month } = req.query;
    
    let dateFilter = '';
    let params = [];
    
    if (year && month) {
      dateFilter = 'WHERE i.issue_date BETWEEN ? AND ?';
      const startDate = `${year}-${String(month).padStart(2, '0')}-01`;
      const endDate = `${year}-${String(month).padStart(2, '0')}-31`;
      params = [startDate, endDate];
    } else if (year) {
      dateFilter = 'WHERE i.issue_date BETWEEN ? AND ?';
      const startDate = `${year}-01-01`;
      const endDate = `${year}-12-31`;
      params = [startDate, endDate];
    }

    const customerReport = await db.all(`
      SELECT 
        c.id,
        c.name,
        c.nip,
        COUNT(i.id) as invoice_count,
        SUM(i.net_amount) as total_net,
        SUM(i.vat_amount) as total_vat,
        SUM(i.gross_amount) as total_gross
      FROM customers c
      LEFT JOIN invoices i ON c.id = i.customer_id ${dateFilter}
      GROUP BY c.id, c.name, c.nip
      ORDER BY total_gross DESC
    `, params);

    res.json({
      success: true,
      data: customerReport.map(customer => ({
        ...customer,
        total_net: parseFloat(customer.total_net || 0),
        total_vat: parseFloat(customer.total_vat || 0),
        total_gross: parseFloat(customer.total_gross || 0)
      }))
    });
  } catch (error) {
    console.error('Błąd generowania raportu klientów:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// GET /api/reports/vat - Raport VAT
router.get('/vat', async (req, res) => {
  try {
    const { year, month } = req.query;
    
    let dateFilter = '';
    let params = [];
    
    if (year && month) {
      dateFilter = 'WHERE issue_date BETWEEN ? AND ?';
      const startDate = `${year}-${String(month).padStart(2, '0')}-01`;
      const endDate = `${year}-${String(month).padStart(2, '0')}-31`;
      params = [startDate, endDate];
    } else if (year) {
      dateFilter = 'WHERE issue_date BETWEEN ? AND ?';
      const startDate = `${year}-01-01`;
      const endDate = `${year}-12-31`;
      params = [startDate, endDate];
    }

    const vatReport = await db.all(`
      SELECT 
        vat_rate,
        COUNT(*) as invoice_count,
        SUM(net_amount) as total_net,
        SUM(vat_amount) as total_vat,
        SUM(gross_amount) as total_gross
      FROM invoices 
      ${dateFilter}
      GROUP BY vat_rate
      ORDER BY vat_rate
    `, params);

    res.json({
      success: true,
      data: vatReport.map(vat => ({
        ...vat,
        total_net: parseFloat(vat.total_net || 0),
        total_vat: parseFloat(vat.total_vat || 0),
        total_gross: parseFloat(vat.total_gross || 0)
      }))
    });
  } catch (error) {
    console.error('Błąd generowania raportu VAT:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

module.exports = router;
