'use client';

import { useRoleStore } from '@/store/useRoleStore';

export function usePermissions() {
  const role = useRoleStore((s) => s.role);

  return {
    canEdit: role === 'admin',
    canDelete: role === 'admin',
    canAdd: role === 'admin',
    canExport: true, // both roles can export
    isAdmin: role === 'admin',
    isViewer: role === 'viewer',
  };
}
