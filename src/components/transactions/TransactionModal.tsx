'use client';

import { useState } from 'react';
import { Plus, Pencil } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { TransactionForm } from './TransactionForm';
import { useTransactionStore } from '@/store/useTransactionStore';
import { Transaction } from '@/types';
import { toast } from 'sonner';

interface AddModalProps {
  mode: 'add';
}

interface EditModalProps {
  mode: 'edit';
  transaction: Transaction;
}

type TransactionModalProps = AddModalProps | EditModalProps;

export function TransactionModal(props: TransactionModalProps) {
  const [open, setOpen] = useState(false);
  const { addTransaction, updateTransaction } = useTransactionStore();

  function handleSubmit(values: Omit<Transaction, 'id'>) {
    if (props.mode === 'add') {
      addTransaction(values);
      toast.success('Transaction added successfully');
    } else {
      updateTransaction(props.transaction.id, values);
      toast.success('Transaction updated');
    }
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {props.mode === 'add' ? (
        <DialogTrigger
          render={
            <Button size="sm" className="h-9 gap-2 text-xs">
              <Plus className="h-3.5 w-3.5" />
              Add Transaction
            </Button>
          }
        />
      ) : (
        <DialogTrigger
          render={
            <button className="p-1.5 rounded hover:bg-muted text-muted-foreground hover:text-foreground transition-colors" />
          }
        >
          <Pencil className="h-3.5 w-3.5" />
        </DialogTrigger>
      )}
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {props.mode === 'add' ? 'Add Transaction' : 'Edit Transaction'}
          </DialogTitle>
        </DialogHeader>
        <TransactionForm
          defaultValues={props.mode === 'edit' ? props.transaction : undefined}
          onSubmit={handleSubmit}
          onCancel={() => setOpen(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
