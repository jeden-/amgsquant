import axios from 'axios';
import { Customer, Invoice, ApiResponse, MonthlyReport, YearlyReport, CustomerReport, VatReport } from '../types';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor dla błędów
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error);
    return Promise.reject(error);
  }
);

// Customers API
export const customersApi = {
  getAll: (search?: string): Promise<ApiResponse<Customer[]>> =>
    api.get('/customers', { params: { search } }).then(res => res.data),
  
  getById: (id: number): Promise<ApiResponse<Customer>> =>
    api.get(`/customers/${id}`).then(res => res.data),
  
  create: (customer: Omit<Customer, 'id'>): Promise<ApiResponse<Customer>> =>
    api.post('/customers', customer).then(res => res.data),
  
  update: (id: number, customer: Partial<Customer>): Promise<ApiResponse<Customer>> =>
    api.put(`/customers/${id}`, customer).then(res => res.data),
  
  delete: (id: number): Promise<ApiResponse<void>> =>
    api.delete(`/customers/${id}`).then(res => res.data),
};

// Invoices API
export const invoicesApi = {
  getAll: (params?: { status?: string; year?: number; month?: number }): Promise<ApiResponse<Invoice[]>> =>
    api.get('/invoices', { params }).then(res => res.data),
  
  getById: (id: number): Promise<ApiResponse<Invoice>> =>
    api.get(`/invoices/${id}`).then(res => res.data),
  
  create: (invoice: Omit<Invoice, 'id' | 'invoice_number'>): Promise<ApiResponse<Invoice>> =>
    api.post('/invoices', invoice).then(res => res.data),
  
  update: (id: number, invoice: Partial<Invoice>): Promise<ApiResponse<Invoice>> =>
    api.put(`/invoices/${id}`, invoice).then(res => res.data),
  
  delete: (id: number): Promise<ApiResponse<void>> =>
    api.delete(`/invoices/${id}`).then(res => res.data),
  
  finalize: (id: number): Promise<ApiResponse<Invoice>> =>
    api.post(`/invoices/${id}/finalize`).then(res => res.data),
  
  downloadPDF: async (id: number): Promise<void> => {
    const response = await api.get(`/invoices/${id}/pdf`, {
      responseType: 'blob',
    });
    
    // Utwórz URL dla blob i pobierz plik
    const blob = new Blob([response.data], { type: 'application/pdf' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `faktura-${id}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  },
};

// Reports API
export const reportsApi = {
  getMonthly: (year?: number, month?: number): Promise<ApiResponse<MonthlyReport>> =>
    api.get('/reports/monthly', { params: { year, month } }).then(res => res.data),
  
  getYearly: (year?: number): Promise<ApiResponse<YearlyReport>> =>
    api.get('/reports/yearly', { params: { year } }).then(res => res.data),
  
  getCustomers: (year?: number, month?: number): Promise<ApiResponse<CustomerReport[]>> =>
    api.get('/reports/customers', { params: { year, month } }).then(res => res.data),
  
  getVat: (year?: number, month?: number): Promise<ApiResponse<VatReport[]>> =>
    api.get('/reports/vat', { params: { year, month } }).then(res => res.data),
};

export default api;
