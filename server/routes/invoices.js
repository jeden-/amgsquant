const express = require('express');
const Invoice = require('../models/Invoice');
const router = express.Router();

// GET /api/invoices - Pobierz wszystkie faktury
router.get('/', async (req, res) => {
  try {
    const { status, year, month } = req.query;
    
    let invoices = await Invoice.findAll();
    
    // Filtrowanie po statusie
    if (status) {
      invoices = invoices.filter(invoice => invoice.status === status);
    }
    
    // Filtrowanie po roku i miesiącu
    if (year && month) {
      invoices = invoices.filter(invoice => {
        const invoiceDate = new Date(invoice.issue_date);
        return invoiceDate.getFullYear() == year && 
               invoiceDate.getMonth() + 1 == month;
      });
    }

    res.json({
      success: true,
      data: invoices,
      count: invoices.length
    });
  } catch (error) {
    console.error('Błąd pobierania faktur:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// GET /api/invoices/:id - Pobierz fakturę po ID
router.get('/:id', async (req, res) => {
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
    
    res.json({
      success: true,
      data: {
        ...invoice,
        items: items
      }
    });
  } catch (error) {
    console.error('Błąd pobierania faktury:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// POST /api/invoices - Utwórz nową fakturę
router.post('/', async (req, res) => {
  try {
    const invoiceData = req.body;
    
    // Walidacja wymaganych pól
    if (!invoiceData.customer_id || !invoiceData.issue_date || !invoiceData.due_date) {
      return res.status(400).json({
        success: false,
        error: 'Wymagane pola: customer_id, issue_date, due_date'
      });
    }

    if (!invoiceData.net_amount || invoiceData.net_amount <= 0) {
      return res.status(400).json({
        success: false,
        error: 'Kwota netto musi być większa od 0'
      });
    }

    // Oblicz VAT i kwotę brutto jeśli nie podano
    if (!invoiceData.vat_rate) {
      invoiceData.vat_rate = 23; // Domyślna stawka VAT w Polsce
    }
    
    if (!invoiceData.vat_amount) {
      invoiceData.vat_amount = invoiceData.net_amount * (invoiceData.vat_rate / 100);
    }
    
    if (!invoiceData.gross_amount) {
      invoiceData.gross_amount = invoiceData.net_amount + invoiceData.vat_amount;
    }

    const invoice = await Invoice.create(invoiceData);
    
    res.status(201).json({
      success: true,
      data: invoice,
      message: 'Faktura została utworzona pomyślnie'
    });
  } catch (error) {
    console.error('Błąd tworzenia faktury:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// PUT /api/invoices/:id - Aktualizuj fakturę
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const invoiceData = req.body;
    
    if (!id || isNaN(id)) {
      return res.status(400).json({
        success: false,
        error: 'Nieprawidłowe ID faktury'
      });
    }

    const existingInvoice = await Invoice.findById(id);
    if (!existingInvoice) {
      return res.status(404).json({
        success: false,
        error: 'Faktura nie znaleziona'
      });
    }

    // Oblicz VAT i kwotę brutto jeśli nie podano
    if (invoiceData.net_amount && !invoiceData.vat_amount) {
      const vatRate = invoiceData.vat_rate || existingInvoice.vat_rate;
      invoiceData.vat_amount = invoiceData.net_amount * (vatRate / 100);
    }
    
    if (invoiceData.net_amount && !invoiceData.gross_amount) {
      invoiceData.gross_amount = invoiceData.net_amount + invoiceData.vat_amount;
    }

    const updatedInvoice = await existingInvoice.update(invoiceData);
    
    res.json({
      success: true,
      data: updatedInvoice,
      message: 'Faktura została zaktualizowana pomyślnie'
    });
  } catch (error) {
    console.error('Błąd aktualizacji faktury:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// DELETE /api/invoices/:id - Usuń fakturę
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!id || isNaN(id)) {
      return res.status(400).json({
        success: false,
        error: 'Nieprawidłowe ID faktury'
      });
    }

    const existingInvoice = await Invoice.findById(id);
    if (!existingInvoice) {
      return res.status(404).json({
        success: false,
        error: 'Faktura nie znaleziona'
      });
    }

    await existingInvoice.delete();
    
    res.json({
      success: true,
      message: 'Faktura została usunięta pomyślnie'
    });
  } catch (error) {
    console.error('Błąd usuwania faktury:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// POST /api/invoices/:id/finalize - Finalizuj fakturę (zmień status na 'finalized')
router.post('/:id/finalize', async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!id || isNaN(id)) {
      return res.status(400).json({
        success: false,
        error: 'Nieprawidłowe ID faktury'
      });
    }

    const existingInvoice = await Invoice.findById(id);
    if (!existingInvoice) {
      return res.status(404).json({
        success: false,
        error: 'Faktura nie znaleziona'
      });
    }

    const updatedInvoice = await existingInvoice.update({ 
      ...existingInvoice, 
      status: 'finalized' 
    });
    
    res.json({
      success: true,
      data: updatedInvoice,
      message: 'Faktura została sfinalizowana'
    });
  } catch (error) {
    console.error('Błąd finalizacji faktury:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

module.exports = router;
