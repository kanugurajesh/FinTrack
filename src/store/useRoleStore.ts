'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Role } from '@/types';

interface RoleStore {
  role: Role;
  setRole: (role: Role) => void;
}

export const useRoleStore = create<RoleStore>()(
  persist(
    (set) => ({
      role: 'admin',
      setRole: (role) => set({ role }),
    }),
    { name: 'finance-role' }
  )
);
