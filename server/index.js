const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');
const db = require('./database/database');
require('dotenv').config({ path: './config.env' });

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.NODE_ENV === 'production' ? false : ['http://localhost:3000'],
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minut
  max: 100 // limit każdego IP do 100 requestów na windowMs
});
app.use('/api/', limiter);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Import routes
const customerRoutes = require('./routes/customers');
const invoiceRoutes = require('./routes/invoices');
const reportRoutes = require('./routes/reports');
const pdfRoutes = require('./routes/pdf');

// Routes
app.use('/api/customers', customerRoutes);
app.use('/api/invoices', invoiceRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api', pdfRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV 
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: 'Coś poszło nie tak!',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Błąd serwera'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Endpoint nie znaleziony' });
});

// Initialize database and start server
async function startServer() {
  try {
    await db.init();
    
    app.listen(PORT, () => {
      console.log(`🚀 Serwer uruchomiony na porcie ${PORT}`);
      console.log(`📊 Środowisko: ${process.env.NODE_ENV}`);
      console.log(`💾 Baza danych: ${process.env.DB_PATH}`);
    });
  } catch (error) {
    console.error('Błąd uruchamiania serwera:', error);
    process.exit(1);
  }
}

startServer();

module.exports = app;
