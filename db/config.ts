import { defineTable, column, defineDb } from 'astro:db';

const Expense = defineTable({
  columns: {
    id: column.number({ primaryKey: true, autoIncrement: true }),
    description: column.text(),
    amount: column.number(),
    date: column.date(),
    category: column.text(),
  },
});

export default defineDb({
  tables: { Expense },
});
