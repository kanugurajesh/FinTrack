/**
 * Mock API — simulates a real REST backend.
 * All functions return Promises with realistic network delays.
 */

import { Transaction } from '@/types';
import { mockTransactions } from './mockData';

const delay = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

// Simulate occasional slow network (1-in-6 chance of 200ms extra)
const jitter = () => (Math.random() < 0.17 ? 200 : 0);

export async function apiGetTransactions(): Promise<Transaction[]> {
  await delay(750 + jitter());
  return [...mockTransactions];
}

export async function apiCreateTransaction(
  data: Omit<Transaction, 'id'>
): Promise<Transaction> {
  await delay(350 + jitter());
  return { ...data, id: crypto.randomUUID() };
}

export async function apiUpdateTransaction(
  id: string,
  updates: Partial<Omit<Transaction, 'id'>>
): Promise<Transaction> {
  await delay(300 + jitter());
  // In a real API this would return the server-updated record
  return { id, ...updates } as Transaction;
}

export async function apiDeleteTransaction(id: string): Promise<{ id: string }> {
  await delay(250 + jitter());
  return { id };
}
