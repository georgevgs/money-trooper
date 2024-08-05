import { db, Expense } from 'astro:db';

export default async function seed() {
  await db.insert(Expense).values([
    {
      description: 'Groceries',
      amount: 50.0,
      category: 'Food',
      date: new Date('2024-08-01'),
    },
    {
      description: 'Gas',
      amount: 30.0,
      category: 'Transport',
      date: new Date('2024-08-02'),
    },
    {
      description: 'Movie tickets',
      amount: 25.0,
      category: 'Entertainment',
      date: new Date('2024-08-03'),
    },
  ]);
}
