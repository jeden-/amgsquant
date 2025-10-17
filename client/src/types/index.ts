export interface Customer {
  id?: number;
  name: string;
  nip?: string;
  address?: string;
  city?: string;
  postal_code?: string;
  email?: string;
  phone?: string;
  created_at?: string;
  updated_at?: string;
}

export interface InvoiceItem {
  id?: number;
  invoice_id?: number;
  description: string;
  quantity: number;
  unit_price: number;
  net_amount: number;
  vat_rate: number;
  vat_amount: number;
  gross_amount: number;
}

export interface Invoice {
  id?: number;
  invoice_number?: string;
  customer_id: number;
  customer_name?: string;
  customer_nip?: string;
  customer_address?: string;
  customer_city?: string;
  customer_postal_code?: string;
  customer_email?: string;
  customer_phone?: string;
  issue_date: string;
  due_date: string;
  net_amount: number;
  vat_rate: number;
  vat_amount: number;
  gross_amount: number;
  description?: string;
  status: 'draft' | 'finalized' | 'paid' | 'cancelled';
  created_at?: string;
  updated_at?: string;
  items?: InvoiceItem[];
}

export interface CompanySettings {
  id?: number;
  company_name: string;
  nip: string;
  address: string;
  city: string;
  postal_code: string;
  email?: string;
  phone?: string;
  bank_account?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  count?: number;
}

export interface MonthlyReport {
  period: string;
  summary: {
    total_invoices: number;
    total_net: number;
    total_vat: number;
    total_gross: number;
  };
  invoices: Invoice[];
}

export interface YearlyReport {
  year: number;
  summary: {
    total_invoices: number;
    total_net: number;
    total_vat: number;
    total_gross: number;
  };
  monthly_breakdown: Array<{
    month: number;
    month_name: string;
    total_invoices: number;
    total_net: number;
    total_vat: number;
    total_gross: number;
  }>;
}

export interface CustomerReport {
  id: number;
  name: string;
  nip?: string;
  invoice_count: number;
  total_net: number;
  total_vat: number;
  total_gross: number;
}

export interface VatReport {
  vat_rate: number;
  invoice_count: number;
  total_net: number;
  total_vat: number;
  total_gross: number;
}
