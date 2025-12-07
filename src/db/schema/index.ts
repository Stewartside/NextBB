import { pgTable, uuid, text, timestamp, integer, boolean } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// USERS
export const users = pgTable('profiles', {
  id: uuid('id').primaryKey(),
  username: text('username').notNull().unique(),
  avatarUrl: text('avatar_url'),
  role: text('role').default('user').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// USERS RELATIONS
export const usersRelations = relations(users, ({ many }) => ({
  threads: many(threads),
  posts: many(posts),
}));

// CATEGORIES
export const categories = pgTable('categories', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  description: text('description'),
  sortOrder: integer('sort_order').default(0).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// CATEGORIES RELATIONS
export const categoriesRelations = relations(categories, ({ many }) => ({
  forums: many(forums),
}));

// FORUMS
export const forums = pgTable('forums', {
  id: uuid('id').primaryKey().defaultRandom(),
  categoryId: uuid('category_id').references(() => categories.id).notNull(),
  name: text('name').notNull(),
  shortCode: text('short_code'),
  description: text('description'),
  sortOrder: integer('sort_order').default(0).notNull(),
  isLocked: boolean('is_locked').default(false).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// FORUMS RELATIONS
export const forumsRelations = relations(forums, ({ one, many }) => ({
  category: one(categories, {
    fields: [forums.categoryId],
    references: [categories.id],
  }),
  threads: many(threads),
}));

// THREADS
export const threads = pgTable('threads', {
  id: uuid('id').primaryKey().defaultRandom(),
  forumId: uuid('forum_id').references(() => forums.id).notNull(),
  authorId: uuid('author_id').references(() => users.id).notNull(),
  title: text('title').notNull(),
  isPinned: boolean('is_pinned').default(false).notNull(),
  isLocked: boolean('is_locked').default(false).notNull(),
  viewCount: integer('view_count').default(0).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// THREADS RELATIONS
export const threadsRelations = relations(threads, ({ one, many }) => ({
  forum: one(forums, {
    fields: [threads.forumId],
    references: [forums.id],
  }),
  author: one(users, {
    fields: [threads.authorId],
    references: [users.id],
  }),
  posts: many(posts),
}));

// POSTS
export const posts = pgTable('posts', {
  id: uuid('id').primaryKey().defaultRandom(),
  threadId: uuid('thread_id').references(() => threads.id, { onDelete: 'cascade' }).notNull(),
  authorId: uuid('author_id').references(() => users.id).notNull(),
  content: text('content').notNull(),
  isEdited: boolean('is_edited').default(false).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// POSTS RELATIONS
export const postsRelations = relations(posts, ({ one }) => ({
  thread: one(threads, {
    fields: [posts.threadId],
    references: [threads.id],
  }),
  author: one(users, {
    fields: [posts.authorId],
    references: [users.id],
  }),
}));
