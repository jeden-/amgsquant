const db = require('../database/database');

class Invoice {
  constructor(data) {
    this.id = data.id;
    this.invoice_number = data.invoice_number;
    this.customer_id = data.customer_id;
    this.issue_date = data.issue_date;
    this.due_date = data.due_date;
    this.net_amount = data.net_amount;
    this.vat_rate = data.vat_rate;
    this.vat_amount = data.vat_amount;
    this.gross_amount = data.gross_amount;
    this.description = data.description;
    this.status = data.status;
    this.created_at = data.created_at;
    this.updated_at = data.updated_at;
  }

  static async findAll() {
    try {
      const invoices = await db.all(`
        SELECT i.*, c.name as customer_name 
        FROM invoices i 
        LEFT JOIN customers c ON i.customer_id = c.id 
        ORDER BY i.issue_date DESC, i.invoice_number DESC
      `);
      return invoices.map(invoice => new Invoice(invoice));
    } catch (error) {
      throw new Error(`Błąd pobierania faktur: ${error.message}`);
    }
  }

  static async findById(id) {
    try {
      const invoice = await db.get(`
        SELECT i.*, c.name as customer_name, c.nip as customer_nip,
               c.address as customer_address, c.city as customer_city,
               c.postal_code as customer_postal_code, c.email as customer_email,
               c.phone as customer_phone
        FROM invoices i 
        LEFT JOIN customers c ON i.customer_id = c.id 
        WHERE i.id = ?
      `, [id]);
      return invoice ? new Invoice(invoice) : null;
    } catch (error) {
      throw new Error(`Błąd pobierania faktury: ${error.message}`);
    }
  }

  static async create(data) {
    try {
      const { 
        customer_id, issue_date, due_date, net_amount, vat_rate, 
        vat_amount, gross_amount, description, items 
      } = data;

      // Walidacja
      if (!customer_id || !issue_date || !due_date) {
        throw new Error('Wymagane pola: customer_id, issue_date, due_date');
      }

      if (!net_amount || net_amount <= 0) {
        throw new Error('Kwota netto musi być większa od 0');
      }

      // Generuj numer faktury
      const invoiceNumber = await this.generateInvoiceNumber();

      // Rozpocznij transakcję
      const result = await db.run(`
        INSERT INTO invoices 
        (invoice_number, customer_id, issue_date, due_date, net_amount, 
         vat_rate, vat_amount, gross_amount, description, status)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'draft')
      `, [invoiceNumber, customer_id, issue_date, due_date, net_amount, 
          vat_rate, vat_amount, gross_amount, description]);

      // Dodaj pozycje faktury
      if (items && items.length > 0) {
        for (const item of items) {
          await db.run(`
            INSERT INTO invoice_items 
            (invoice_id, description, quantity, unit_price, net_amount, 
             vat_rate, vat_amount, gross_amount)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
          `, [result.id, item.description, item.quantity, item.unit_price,
              item.net_amount, item.vat_rate, item.vat_amount, item.gross_amount]);
        }
      }

      return await this.findById(result.id);
    } catch (error) {
      throw new Error(`Błąd tworzenia faktury: ${error.message}`);
    }
  }

  async update(data) {
    try {
      const { 
        customer_id, issue_date, due_date, net_amount, vat_rate, 
        vat_amount, gross_amount, description, status, items 
      } = data;

      await db.run(`
        UPDATE invoices 
        SET customer_id = ?, issue_date = ?, due_date = ?, net_amount = ?,
            vat_rate = ?, vat_amount = ?, gross_amount = ?, description = ?,
            status = ?, updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `, [customer_id, issue_date, due_date, net_amount, vat_rate, 
          vat_amount, gross_amount, description, status, this.id]);

      // Usuń stare pozycje i dodaj nowe
      if (items) {
        await db.run('DELETE FROM invoice_items WHERE invoice_id = ?', [this.id]);
        
        for (const item of items) {
          await db.run(`
            INSERT INTO invoice_items 
            (invoice_id, description, quantity, unit_price, net_amount, 
             vat_rate, vat_amount, gross_amount)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
          `, [this.id, item.description, item.quantity, item.unit_price,
              item.net_amount, item.vat_rate, item.vat_amount, item.gross_amount]);
        }
      }

      return await Invoice.findById(this.id);
    } catch (error) {
      throw new Error(`Błąd aktualizacji faktury: ${error.message}`);
    }
  }

  async delete() {
    try {
      // Usuń pozycje faktury
      await db.run('DELETE FROM invoice_items WHERE invoice_id = ?', [this.id]);
      // Usuń fakturę
      await db.run('DELETE FROM invoices WHERE id = ?', [this.id]);
      return true;
    } catch (error) {
      throw new Error(`Błąd usuwania faktury: ${error.message}`);
    }
  }

  async getItems() {
    try {
      const items = await db.all(
        'SELECT * FROM invoice_items WHERE invoice_id = ? ORDER BY id',
        [this.id]
      );
      return items;
    } catch (error) {
      throw new Error(`Błąd pobierania pozycji faktury: ${error.message}`);
    }
  }

  static async generateInvoiceNumber() {
    try {
      const year = new Date().getFullYear();
      const month = String(new Date().getMonth() + 1).padStart(2, '0');
      
      // Znajdź ostatni numer faktury dla tego miesiąca
      const lastInvoice = await db.get(`
        SELECT invoice_number FROM invoices 
        WHERE invoice_number LIKE ? 
        ORDER BY invoice_number DESC LIMIT 1
      `, [`FV/${year}/${month}/%`]);

      let nextNumber = 1;
      if (lastInvoice) {
        const lastNumber = parseInt(lastInvoice.invoice_number.split('/').pop());
        nextNumber = lastNumber + 1;
      }

      return `FV/${year}/${month}/${String(nextNumber).padStart(3, '0')}`;
    } catch (error) {
      throw new Error(`Błąd generowania numeru faktury: ${error.message}`);
    }
  }

  static async getMonthlyReport(year, month) {
    try {
      const startDate = `${year}-${String(month).padStart(2, '0')}-01`;
      const endDate = `${year}-${String(month).padStart(2, '0')}-31`;

      const report = await db.get(`
        SELECT 
          COUNT(*) as total_invoices,
          SUM(net_amount) as total_net,
          SUM(vat_amount) as total_vat,
          SUM(gross_amount) as total_gross
        FROM invoices 
        WHERE issue_date BETWEEN ? AND ?
      `, [startDate, endDate]);

      return report;
    } catch (error) {
      throw new Error(`Błąd generowania raportu miesięcznego: ${error.message}`);
    }
  }
}

module.exports = Invoice;
