import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface Expense {
  id: number;
  description: string;
  amount: number;
  category: string;
  date: string;
}

const ExpensesTracker: React.FC = () => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
    try {
      const response = await fetch('/api/expenses');
      if (!response.ok) {
        throw new Error('Failed to fetch expenses');
      }
      const data = await response.json();
      setExpenses(data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch expenses');
      setLoading(false);
    }
  };

  const addExpense = async () => {
    if (!description || !amount || !category) {
      setError('Please fill all fields');
      return;
    }
    try {
      const response = await fetch('/api/expenses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          description,
          amount: parseFloat(amount),
          category,
          date: new Date().toISOString(),
        }),
      });
      if (!response.ok) {
        throw new Error('Failed to add expense');
      }
      fetchExpenses();
      setDescription('');
      setAmount('');
      setCategory('');
    } catch (err) {
      setError('Failed to add expense');
    }
  };

  const removeExpense = async (id: number) => {
    try {
      const response = await fetch(`/api/expenses/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to remove expense');
      }
      fetchExpenses();
    } catch (err) {
      setError('Failed to remove expense');
    }
  };

  const totalExpenses = expenses.reduce(
    (sum, expense) => sum + expense.amount,
    0,
  );

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <Card className='mx-auto w-full max-w-2xl'>
      <CardHeader>
        <CardTitle className='text-2xl'>Add New Expense</CardTitle>
      </CardHeader>
      <CardContent>
        <div className='mb-4 flex space-x-2'>
          <Input
            type='text'
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder='Description'
            className='flex-grow'
          />
          <Input
            type='number'
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder='Amount'
            className='w-1/4'
          />
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className='w-1/4'>
              <SelectValue placeholder='Category' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='food'>Food</SelectItem>
              <SelectItem value='transport'>Transport</SelectItem>
              <SelectItem value='entertainment'>Entertainment</SelectItem>
              <SelectItem value='other'>Other</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={addExpense}>Add</Button>
        </div>
        <div>
          <h2 className='mb-2 text-xl font-semibold'>Expenses List</h2>
          <ul className='space-y-2'>
            {expenses.map((expense) => (
              <li
                key={expense.id}
                className='flex items-center justify-between'
              >
                <span>
                  {expense.description}: {expense.amount.toFixed(2)}€ (
                  {expense.category}) -{' '}
                  {new Date(expense.date).toLocaleDateString()}
                </span>
                <Button
                  variant='destructive'
                  size='sm'
                  onClick={() => removeExpense(expense.id)}
                >
                  Remove
                </Button>
              </li>
            ))}
          </ul>
          <div className='mt-4 text-lg font-semibold'>
            Total Expenses: {totalExpenses.toFixed(2)}€
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ExpensesTracker;
