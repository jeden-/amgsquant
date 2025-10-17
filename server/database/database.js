const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

class Database {
  constructor() {
    this.db = null;
    this.dbPath = process.env.DB_PATH || './database/invoices.db';
  }

  async init() {
    return new Promise((resolve, reject) => {
      // Upewnij się, że katalog database istnieje
      const dbDir = path.dirname(this.dbPath);
      if (!fs.existsSync(dbDir)) {
        fs.mkdirSync(dbDir, { recursive: true });
      }

      this.db = new sqlite3.Database(this.dbPath, (err) => {
        if (err) {
          console.error('Błąd połączenia z bazą danych:', err.message);
          reject(err);
        } else {
          console.log('✅ Połączono z bazą danych SQLite');
          this.createTables().then(resolve).catch(reject);
        }
      });
    });
  }

  async createTables() {
    const tables = [
      // Tabela klientów
      `CREATE TABLE IF NOT EXISTS customers (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        nip TEXT,
        address TEXT,
        city TEXT,
        postal_code TEXT,
        email TEXT,
        phone TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`,

      // Tabela faktur
      `CREATE TABLE IF NOT EXISTS invoices (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        invoice_number TEXT UNIQUE NOT NULL,
        customer_id INTEGER NOT NULL,
        issue_date DATE NOT NULL,
        due_date DATE NOT NULL,
        net_amount DECIMAL(10,2) NOT NULL,
        vat_rate DECIMAL(5,2) NOT NULL,
        vat_amount DECIMAL(10,2) NOT NULL,
        gross_amount DECIMAL(10,2) NOT NULL,
        description TEXT,
        status TEXT DEFAULT 'draft',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (customer_id) REFERENCES customers (id)
      )`,

      // Tabela pozycji faktury
      `CREATE TABLE IF NOT EXISTS invoice_items (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        invoice_id INTEGER NOT NULL,
        description TEXT NOT NULL,
        quantity DECIMAL(10,2) NOT NULL,
        unit_price DECIMAL(10,2) NOT NULL,
        net_amount DECIMAL(10,2) NOT NULL,
        vat_rate DECIMAL(5,2) NOT NULL,
        vat_amount DECIMAL(10,2) NOT NULL,
        gross_amount DECIMAL(10,2) NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (invoice_id) REFERENCES invoices (id) ON DELETE CASCADE
      )`,

      // Tabela ustawień firmy
      `CREATE TABLE IF NOT EXISTS company_settings (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        company_name TEXT NOT NULL,
        nip TEXT NOT NULL,
        address TEXT NOT NULL,
        city TEXT NOT NULL,
        postal_code TEXT NOT NULL,
        email TEXT,
        phone TEXT,
        bank_account TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`
    ];

    for (const table of tables) {
      await this.run(table);
    }

    // Dodaj domyślne ustawienia firmy jeśli nie istnieją
    const companyExists = await this.get('SELECT COUNT(*) as count FROM company_settings');
    if (companyExists.count === 0) {
      await this.run(`
        INSERT INTO company_settings 
        (company_name, nip, address, city, postal_code, email, phone, bank_account)
        VALUES 
        ('AMGS Quant Sp. z o.o.', '1234567890', 'ul. Przykładowa 123', 'Warszawa', '00-001', 'kontakt@amgsquant.pl', '+48 123 456 789', '12 3456 7890 1234 5678 9012 3456')
      `);
    }

    console.log('✅ Tabele bazy danych utworzone');
  }

  run(sql, params = []) {
    return new Promise((resolve, reject) => {
      this.db.run(sql, params, function(err) {
        if (err) {
          reject(err);
        } else {
          resolve({ id: this.lastID, changes: this.changes });
        }
      });
    });
  }

  get(sql, params = []) {
    return new Promise((resolve, reject) => {
      this.db.get(sql, params, (err, row) => {
        if (err) {
          reject(err);
        } else {
          resolve(row);
        }
      });
    });
  }

  all(sql, params = []) {
    return new Promise((resolve, reject) => {
      this.db.all(sql, params, (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  }

  close() {
    return new Promise((resolve) => {
      this.db.close((err) => {
        if (err) {
          console.error('Błąd zamykania bazy danych:', err.message);
        } else {
          console.log('✅ Połączenie z bazą danych zamknięte');
        }
        resolve();
      });
    });
  }
}

module.exports = new Database();
