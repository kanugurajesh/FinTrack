import { Transaction } from '@/types';
import Papa from 'papaparse';

export function exportToCSV(transactions: Transaction[], filename = 'transactions.csv') {
  const data = transactions.map((t) => ({
    Date: t.date,
    Description: t.description,
    Amount: t.type === 'expense' ? -t.amount : t.amount,
    Category: t.category,
    Type: t.type,
    Note: t.note ?? '',
  }));

  const csv = Papa.unparse(data);
  downloadFile(csv, filename, 'text/csv');
}

export function exportToJSON(transactions: Transaction[], filename = 'transactions.json') {
  const json = JSON.stringify(transactions, null, 2);
  downloadFile(json, filename, 'application/json');
}

function downloadFile(content: string, filename: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
