'use client';

import { Shield, Eye } from 'lucide-react';
import { useRoleStore } from '@/store/useRoleStore';
import { Role } from '@/types';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export function RoleSwitcher() {
  const { role, setRole } = useRoleStore();

  return (
    <Select value={role} onValueChange={(v) => setRole(v as Role)}>
      <SelectTrigger className="w-[120px] h-7 text-xs border-border bg-muted/40 font-[family-name:var(--font-jetbrains)] hover:border-primary/40 transition-colors">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="admin">
          <div className="flex items-center gap-2">
            <Shield className="h-3 w-3 text-primary" />
            <span className="font-[family-name:var(--font-jetbrains)] text-xs">admin</span>
          </div>
        </SelectItem>
        <SelectItem value="viewer">
          <div className="flex items-center gap-2">
            <Eye className="h-3 w-3 text-muted-foreground" />
            <span className="font-[family-name:var(--font-jetbrains)] text-xs">viewer</span>
          </div>
        </SelectItem>
      </SelectContent>
    </Select>
  );
}
