import { 
  pgTable, 
  uuid, 
  text, 
  timestamp, 
  boolean, 
  integer,
  varchar
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// Admin Users
export const adminUsers = pgTable('admin_users', {
  adminId: uuid('admin_id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  lastLogin: timestamp('last_login').defaultNow()
});

// Mail Templates
export const mailTemplates = pgTable('mail_templates', {
  templateId: uuid('template_id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  content: text('content').notNull(),
  status: text('status').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
  adminId: uuid('admin_id').references(() => adminUsers.adminId)
});

// Mail Folders
export const mailFolders = pgTable('mail_folders', {
  folderId: uuid('folder_id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  path: text('path').notNull(),
  createdAt: timestamp('created_at').defaultNow()
});

// Emails
export const emails = pgTable('emails', {
  emailId: uuid('email_id').primaryKey().defaultRandom(),
  templateId: uuid('template_id').references(() => mailTemplates.templateId),
  status: text('status').notNull(),
  queuedAt: timestamp('queued_at').defaultNow(),
  sentAt: timestamp('sent_at'),
  errorDetails: text('error_details')
});

// Define relationships
export const mailTemplateRelations = relations(mailTemplates, ({ one, many }) => ({
  admin: one(adminUsers, {
    fields: [mailTemplates.adminId],
    references: [adminUsers.adminId],
  }),
  emails: many(emails)
}));

export const emailRelations = relations(emails, ({ one }) => ({
  template: one(mailTemplates, {
    fields: [emails.templateId],
    references: [mailTemplates.templateId],
  })
}));

// Add more tables and relations as needed... 