const express = require('express');
const puppeteer = require('puppeteer');
const path = require('path');
const Invoice = require('../models/Invoice');
const db = require('../database/database');
const router = express.Router();

// GET /api/invoices/:id/pdf - Generuj PDF faktury
router.get('/:id/pdf', async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!id || isNaN(id)) {
      return res.status(400).json({
        success: false,
        error: 'Nieprawidłowe ID faktury'
      });
    }

    const invoice = await Invoice.findById(id);
    if (!invoice) {
      return res.status(404).json({
        success: false,
        error: 'Faktura nie znaleziona'
      });
    }

    // Pobierz pozycje faktury
    const items = await invoice.getItems();
    
    // Pobierz dane firmy
    const companySettings = await db.get('SELECT * FROM company_settings LIMIT 1');
    
    // Generuj HTML faktury
    const html = generateInvoiceHTML(invoice, items, companySettings);
    
    // Generuj PDF
    const pdfBuffer = await generatePDF(html);
    
    // Ustaw nagłówki dla pobierania pliku
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="faktura-${invoice.invoice_number}.pdf"`);
    res.setHeader('Content-Length', pdfBuffer.length);
    
    res.send(pdfBuffer);
  } catch (error) {
    console.error('Błąd generowania PDF:', error);
    res.status(500).json({
      success: false,
      error: 'Błąd generowania PDF faktury'
    });
  }
});

function generateInvoiceHTML(invoice, items, companySettings) {
  const issueDate = new Date(invoice.issue_date).toLocaleDateString('pl-PL');
  const dueDate = new Date(invoice.due_date).toLocaleDateString('pl-PL');
  
  return `
    <!DOCTYPE html>
    <html lang="pl">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Faktura ${invoice.invoice_number}</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                margin: 0;
                padding: 20px;
                font-size: 12px;
                line-height: 1.4;
            }
            .header {
                display: flex;
                justify-content: space-between;
                margin-bottom: 30px;
                border-bottom: 2px solid #333;
                padding-bottom: 20px;
            }
            .company-info {
                flex: 1;
            }
            .invoice-info {
                flex: 1;
                text-align: right;
            }
            .invoice-title {
                font-size: 24px;
                font-weight: bold;
                margin-bottom: 10px;
            }
            .invoice-number {
                font-size: 18px;
                font-weight: bold;
                color: #1976d2;
            }
            .customer-info {
                margin-bottom: 30px;
                padding: 15px;
                background-color: #f5f5f5;
                border-radius: 5px;
            }
            .customer-title {
                font-weight: bold;
                margin-bottom: 10px;
                font-size: 14px;
            }
            .items-table {
                width: 100%;
                border-collapse: collapse;
                margin-bottom: 20px;
            }
            .items-table th,
            .items-table td {
                border: 1px solid #ddd;
                padding: 8px;
                text-align: left;
            }
            .items-table th {
                background-color: #f5f5f5;
                font-weight: bold;
            }
            .items-table .number {
                text-align: right;
                width: 80px;
            }
            .items-table .price {
                text-align: right;
                width: 100px;
            }
            .summary {
                margin-top: 20px;
                margin-left: auto;
                width: 300px;
            }
            .summary-row {
                display: flex;
                justify-content: space-between;
                padding: 5px 0;
                border-bottom: 1px solid #ddd;
            }
            .summary-row.total {
                font-weight: bold;
                font-size: 14px;
                border-top: 2px solid #333;
                border-bottom: 2px solid #333;
                margin-top: 10px;
                padding-top: 10px;
            }
            .footer {
                margin-top: 50px;
                font-size: 10px;
                color: #666;
                text-align: center;
            }
            .status {
                display: inline-block;
                padding: 4px 8px;
                border-radius: 4px;
                font-size: 10px;
                font-weight: bold;
                text-transform: uppercase;
            }
            .status.draft { background-color: #ffeb3b; color: #000; }
            .status.finalized { background-color: #2196f3; color: #fff; }
            .status.paid { background-color: #4caf50; color: #fff; }
            .status.cancelled { background-color: #f44336; color: #fff; }
        </style>
    </head>
    <body>
        <div class="header">
            <div class="company-info">
                <div class="invoice-title">FAKTURA VAT</div>
                <div><strong>${companySettings.company_name}</strong></div>
                <div>NIP: ${companySettings.nip}</div>
                <div>${companySettings.address}</div>
                <div>${companySettings.postal_code} ${companySettings.city}</div>
                ${companySettings.email ? `<div>Email: ${companySettings.email}</div>` : ''}
                ${companySettings.phone ? `<div>Tel: ${companySettings.phone}</div>` : ''}
                ${companySettings.bank_account ? `<div>Konto: ${companySettings.bank_account}</div>` : ''}
            </div>
            <div class="invoice-info">
                <div class="invoice-number">${invoice.invoice_number}</div>
                <div>Data wystawienia: ${issueDate}</div>
                <div>Termin płatności: ${dueDate}</div>
                <div>Status: <span class="status ${invoice.status}">${getStatusLabel(invoice.status)}</span></div>
            </div>
        </div>

        <div class="customer-info">
            <div class="customer-title">Nabywca:</div>
            <div><strong>${invoice.customer_name}</strong></div>
            ${invoice.customer_nip ? `<div>NIP: ${invoice.customer_nip}</div>` : ''}
            ${invoice.customer_address ? `<div>${invoice.customer_address}</div>` : ''}
            ${invoice.customer_city ? `<div>${invoice.customer_postal_code} ${invoice.customer_city}</div>` : ''}
            ${invoice.customer_email ? `<div>Email: ${invoice.customer_email}</div>` : ''}
            ${invoice.customer_phone ? `<div>Tel: ${invoice.customer_phone}</div>` : ''}
        </div>

        <table class="items-table">
            <thead>
                <tr>
                    <th>Lp.</th>
                    <th>Opis</th>
                    <th class="number">Ilość</th>
                    <th class="price">Cena j.m.</th>
                    <th class="price">Wartość netto</th>
                    <th class="number">VAT %</th>
                    <th class="price">Kwota VAT</th>
                    <th class="price">Wartość brutto</th>
                </tr>
            </thead>
            <tbody>
                ${items.map((item, index) => `
                    <tr>
                        <td>${index + 1}</td>
                        <td>${item.description}</td>
                        <td class="number">${item.quantity}</td>
                        <td class="price">${item.unit_price.toLocaleString('pl-PL', { style: 'currency', currency: 'PLN' })}</td>
                        <td class="price">${item.net_amount.toLocaleString('pl-PL', { style: 'currency', currency: 'PLN' })}</td>
                        <td class="number">${item.vat_rate}%</td>
                        <td class="price">${item.vat_amount.toLocaleString('pl-PL', { style: 'currency', currency: 'PLN' })}</td>
                        <td class="price">${item.gross_amount.toLocaleString('pl-PL', { style: 'currency', currency: 'PLN' })}</td>
                    </tr>
                `).join('')}
            </tbody>
        </table>

        <div class="summary">
            <div class="summary-row">
                <span>Razem netto:</span>
                <span>${invoice.net_amount.toLocaleString('pl-PL', { style: 'currency', currency: 'PLN' })}</span>
            </div>
            <div class="summary-row">
                <span>VAT:</span>
                <span>${invoice.vat_amount.toLocaleString('pl-PL', { style: 'currency', currency: 'PLN' })}</span>
            </div>
            <div class="summary-row total">
                <span>RAZEM DO ZAPŁATY:</span>
                <span>${invoice.gross_amount.toLocaleString('pl-PL', { style: 'currency', currency: 'PLN' })}</span>
            </div>
        </div>

        ${invoice.description ? `
            <div style="margin-top: 30px;">
                <strong>Uwagi:</strong><br>
                ${invoice.description}
            </div>
        ` : ''}

        <div class="footer">
            <p>Faktura wygenerowana przez system AMGS Quant</p>
            <p>Data generowania: ${new Date().toLocaleString('pl-PL')}</p>
        </div>
    </body>
    </html>
  `;
}

function getStatusLabel(status) {
  switch (status) {
    case 'draft': return 'Szkic';
    case 'finalized': return 'Sfinalizowana';
    case 'paid': return 'Opłacona';
    case 'cancelled': return 'Anulowana';
    default: return status;
  }
}

async function generatePDF(html) {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  try {
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'networkidle0' });
    
    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: {
        top: '20mm',
        right: '20mm',
        bottom: '20mm',
        left: '20mm'
      }
    });
    
    return pdfBuffer;
  } finally {
    await browser.close();
  }
}

module.exports = router;
