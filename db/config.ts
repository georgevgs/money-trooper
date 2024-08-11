import { defineDb, defineTable, column } from 'astro:db';

const User = defineTable({
  columns: {
    id: column.text({ primaryKey: true }), // Changed to text type
    name: column.text({ unique: true }),
    email: column.text({ unique: true }),
    image: column.text({ optional: true }),
  },
});

const Expense = defineTable({
  columns: {
    id: column.number({ primaryKey: true, autoIncrement: true }),
    description: column.text(),
    amount: column.number(),
    date: column.date(),
    category: column.text(),
    userId: column.text({ references: () => User.columns.id }), // Changed to text type
  },
});

export default defineDb({
  tables: { User, Expense },
});
