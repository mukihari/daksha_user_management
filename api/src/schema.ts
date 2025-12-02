import { pgTable, uuid, varchar, timestamp } from 'drizzle-orm/pg-core';

export const user = pgTable('user', {
  id: uuid('user_id').defaultRandom().primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  phone: varchar('phone', { length: 255 }).notNull().unique(),
  password_hash: varchar('password_hash', { length: 255 }).notNull(),
  role: varchar('role', { length: 50 }).notNull().default('user'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const address = pgTable('address', {
  id: uuid('address_id').defaultRandom().primaryKey(),
  address: varchar('address', { length: 255 }).notNull(),
  user_id: uuid('user_id').notNull().references(() => user.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const dept = pgTable('dept', {
  id: uuid('department_id').defaultRandom().primaryKey(),
  name: varchar('name', { length: 255 }).notNull().unique(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const user_dept = pgTable('user_dept', {
  id: uuid('user_department_id').defaultRandom().primaryKey(),
  user_id: uuid('user_id').notNull().references(() => user.id, { onDelete: 'cascade' }),
  dept_id: uuid('dept_id').notNull().references(() => dept.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});