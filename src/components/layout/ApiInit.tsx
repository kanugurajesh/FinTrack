'use client';

import { useEffect, useRef } from 'react';
import { useTransactionStore } from '@/store/useTransactionStore';

export function ApiInit() {
  const initialize = useTransactionStore((s) => s.initialize);
  const called = useRef(false);

  useEffect(() => {
    if (called.current) return;
    called.current = true;
    initialize();
  }, [initialize]);

  return null;
}
