'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Transaction, Category, TransactionType } from '@/types';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const CATEGORIES: Category[] = [
  'Food & Dining', 'Transport', 'Shopping', 'Entertainment',
  'Health', 'Housing', 'Salary', 'Freelance', 'Investments', 'Other',
];

const schema = z.object({
  description: z.string().min(1, 'Description is required'),
  amount: z.coerce.number().positive('Amount must be positive'),
  date: z.string().min(1, 'Date is required'),
  category: z.enum(CATEGORIES as [Category, ...Category[]]),
  type: z.enum(['income', 'expense'] as const),
  note: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

interface TransactionFormProps {
  defaultValues?: Partial<Transaction>;
  onSubmit: (values: Omit<Transaction, 'id'>) => void;
  onCancel: () => void;
}

export function TransactionForm({ defaultValues, onSubmit, onCancel }: TransactionFormProps) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(schema) as any,
    defaultValues: {
      description: defaultValues?.description ?? '',
      amount: defaultValues?.amount ?? ('' as unknown as number),
      date: defaultValues?.date ?? new Date().toISOString().split('T')[0],
      category: defaultValues?.category ?? 'Other',
      type: defaultValues?.type ?? 'expense',
      note: defaultValues?.note ?? '',
    },
  });

  const type = watch('type');
  const category = watch('category');

  function handleFormSubmit(values: FormValues) {
    onSubmit({
      description: values.description,
      amount: values.amount,
      date: values.date,
      category: values.category,
      type: values.type,
      note: values.note,
    });
  }

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div className="col-span-2">
          <label className="text-xs font-medium text-muted-foreground">Description *</label>
          <Input {...register('description')} placeholder="e.g. Grocery Store" className="mt-1 h-9" />
          {errors.description && <p className="text-xs text-red-500 mt-1">{errors.description.message}</p>}
        </div>

        <div>
          <label className="text-xs font-medium text-muted-foreground">Amount (USD) *</label>
          <Input {...register('amount')} type="number" step="0.01" placeholder="0.00" className="mt-1 h-9" />
          {errors.amount && <p className="text-xs text-red-500 mt-1">{errors.amount.message}</p>}
        </div>

        <div>
          <label className="text-xs font-medium text-muted-foreground">Date *</label>
          <Input {...register('date')} type="date" className="mt-1 h-9" />
          {errors.date && <p className="text-xs text-red-500 mt-1">{errors.date.message}</p>}
        </div>

        <div>
          <label className="text-xs font-medium text-muted-foreground">Type *</label>
          <Select value={type} onValueChange={(v) => setValue('type', v as TransactionType)}>
            <SelectTrigger className="mt-1 h-9 text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="expense">Expense</SelectItem>
              <SelectItem value="income">Income</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="text-xs font-medium text-muted-foreground">Category *</label>
          <Select value={category} onValueChange={(v) => setValue('category', v as Category)}>
            <SelectTrigger className="mt-1 h-9 text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {CATEGORIES.map((c) => (
                <SelectItem key={c} value={c} className="text-sm">{c}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="col-span-2">
          <label className="text-xs font-medium text-muted-foreground">Note (optional)</label>
          <Input {...register('note')} placeholder="Optional note..." className="mt-1 h-9" />
        </div>
      </div>

      <div className="flex gap-2 justify-end pt-2">
        <Button type="button" variant="outline" size="sm" onClick={onCancel}>Cancel</Button>
        <Button type="submit" size="sm">Save Transaction</Button>
      </div>
    </form>
  );
}
