const db = require('../database/database');

class Customer {
  constructor(data) {
    this.id = data.id;
    this.name = data.name;
    this.nip = data.nip;
    this.address = data.address;
    this.city = data.city;
    this.postal_code = data.postal_code;
    this.email = data.email;
    this.phone = data.phone;
    this.created_at = data.created_at;
    this.updated_at = data.updated_at;
  }

  static async findAll() {
    try {
      const customers = await db.all('SELECT * FROM customers ORDER BY name');
      return customers.map(customer => new Customer(customer));
    } catch (error) {
      throw new Error(`Błąd pobierania klientów: ${error.message}`);
    }
  }

  static async findById(id) {
    try {
      const customer = await db.get('SELECT * FROM customers WHERE id = ?', [id]);
      return customer ? new Customer(customer) : null;
    } catch (error) {
      throw new Error(`Błąd pobierania klienta: ${error.message}`);
    }
  }

  static async create(data) {
    try {
      const { name, nip, address, city, postal_code, email, phone } = data;
      
      // Walidacja wymaganych pól
      if (!name || name.trim() === '') {
        throw new Error('Nazwa klienta jest wymagana');
      }

      const result = await db.run(
        `INSERT INTO customers (name, nip, address, city, postal_code, email, phone)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [name, nip, address, city, postal_code, email, phone]
      );

      return await this.findById(result.id);
    } catch (error) {
      throw new Error(`Błąd tworzenia klienta: ${error.message}`);
    }
  }

  async update(data) {
    try {
      const { name, nip, address, city, postal_code, email, phone } = data;
      
      if (!name || name.trim() === '') {
        throw new Error('Nazwa klienta jest wymagana');
      }

      await db.run(
        `UPDATE customers 
         SET name = ?, nip = ?, address = ?, city = ?, postal_code = ?, 
             email = ?, phone = ?, updated_at = CURRENT_TIMESTAMP
         WHERE id = ?`,
        [name, nip, address, city, postal_code, email, phone, this.id]
      );

      return await Customer.findById(this.id);
    } catch (error) {
      throw new Error(`Błąd aktualizacji klienta: ${error.message}`);
    }
  }

  async delete() {
    try {
      // Sprawdź czy klient ma faktury
      const invoices = await db.get(
        'SELECT COUNT(*) as count FROM invoices WHERE customer_id = ?',
        [this.id]
      );

      if (invoices.count > 0) {
        throw new Error('Nie można usunąć klienta, który ma przypisane faktury');
      }

      await db.run('DELETE FROM customers WHERE id = ?', [this.id]);
      return true;
    } catch (error) {
      throw new Error(`Błąd usuwania klienta: ${error.message}`);
    }
  }

  static async search(query) {
    try {
      const customers = await db.all(
        `SELECT * FROM customers 
         WHERE name LIKE ? OR nip LIKE ? OR email LIKE ?
         ORDER BY name`,
        [`%${query}%`, `%${query}%`, `%${query}%`]
      );
      return customers.map(customer => new Customer(customer));
    } catch (error) {
      throw new Error(`Błąd wyszukiwania klientów: ${error.message}`);
    }
  }
}

module.exports = Customer;
