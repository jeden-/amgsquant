const express = require('express');
const Customer = require('../models/Customer');
const router = express.Router();

// GET /api/customers - Pobierz wszystkich klientów
router.get('/', async (req, res) => {
  try {
    const { search } = req.query;
    
    let customers;
    if (search) {
      customers = await Customer.search(search);
    } else {
      customers = await Customer.findAll();
    }

    res.json({
      success: true,
      data: customers,
      count: customers.length
    });
  } catch (error) {
    console.error('Błąd pobierania klientów:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// GET /api/customers/:id - Pobierz klienta po ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!id || isNaN(id)) {
      return res.status(400).json({
        success: false,
        error: 'Nieprawidłowe ID klienta'
      });
    }

    const customer = await Customer.findById(id);
    
    if (!customer) {
      return res.status(404).json({
        success: false,
        error: 'Klient nie znaleziony'
      });
    }

    res.json({
      success: true,
      data: customer
    });
  } catch (error) {
    console.error('Błąd pobierania klienta:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// POST /api/customers - Utwórz nowego klienta
router.post('/', async (req, res) => {
  try {
    const customerData = req.body;
    
    // Walidacja wymaganych pól
    if (!customerData.name || customerData.name.trim() === '') {
      return res.status(400).json({
        success: false,
        error: 'Nazwa klienta jest wymagana'
      });
    }

    const customer = await Customer.create(customerData);
    
    res.status(201).json({
      success: true,
      data: customer,
      message: 'Klient został utworzony pomyślnie'
    });
  } catch (error) {
    console.error('Błąd tworzenia klienta:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// PUT /api/customers/:id - Aktualizuj klienta
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const customerData = req.body;
    
    if (!id || isNaN(id)) {
      return res.status(400).json({
        success: false,
        error: 'Nieprawidłowe ID klienta'
      });
    }

    const existingCustomer = await Customer.findById(id);
    if (!existingCustomer) {
      return res.status(404).json({
        success: false,
        error: 'Klient nie znaleziony'
      });
    }

    const updatedCustomer = await existingCustomer.update(customerData);
    
    res.json({
      success: true,
      data: updatedCustomer,
      message: 'Klient został zaktualizowany pomyślnie'
    });
  } catch (error) {
    console.error('Błąd aktualizacji klienta:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// DELETE /api/customers/:id - Usuń klienta
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!id || isNaN(id)) {
      return res.status(400).json({
        success: false,
        error: 'Nieprawidłowe ID klienta'
      });
    }

    const existingCustomer = await Customer.findById(id);
    if (!existingCustomer) {
      return res.status(404).json({
        success: false,
        error: 'Klient nie znaleziony'
      });
    }

    await existingCustomer.delete();
    
    res.json({
      success: true,
      message: 'Klient został usunięty pomyślnie'
    });
  } catch (error) {
    console.error('Błąd usuwania klienta:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

module.exports = router;
