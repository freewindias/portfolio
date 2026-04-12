import { relations } from "drizzle-orm";
import { pgTable, text, timestamp, boolean, index, jsonb, integer } from "drizzle-orm/pg-core";

export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").default(false).notNull(),
  image: text("image"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
});

export const session = pgTable(
  "session",
  {
    id: text("id").primaryKey(),
    expiresAt: timestamp("expires_at").notNull(),
    token: text("token").notNull().unique(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
    ipAddress: text("ip_address"),
    userAgent: text("user_agent"),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
  },
  (table) => [index("session_userId_idx").on(table.userId)],
);

export const account = pgTable(
  "account",
  {
    id: text("id").primaryKey(),
    accountId: text("account_id").notNull(),
    providerId: text("provider_id").notNull(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    accessToken: text("access_token"),
    refreshToken: text("refresh_token"),
    idToken: text("id_token"),
    accessTokenExpiresAt: timestamp("access_token_expires_at"),
    refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
    scope: text("scope"),
    password: text("password"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [index("account_userId_idx").on(table.userId)],
);

export const verification = pgTable(
  "verification",
  {
    id: text("id").primaryKey(),
    identifier: text("identifier").notNull(),
    value: text("value").notNull(),
    expiresAt: timestamp("expires_at").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [index("verification_identifier_idx").on(table.identifier)],
);

export const userRelations = relations(user, ({ many }) => ({
  sessions: many(session),
  accounts: many(account),
}));

export const sessionRelations = relations(session, ({ one }) => ({
  user: one(user, {
    fields: [session.userId],
    references: [user.id],
  }),
}));

export const accountRelations = relations(account, ({ one }) => ({
  user: one(user, {
    fields: [account.userId],
    references: [user.id],
  }),
}));

export const hero = pgTable("hero", {
  id: text("id").primaryKey(),
  bannerUrl: text("banner_url"),
  profileUrl: text("profile_url"),
  name: text("name"),
  role: text("role"),
  location: text("location"),
  githubUrl: text("github_url"),
  linkedinUrl: text("linkedin_url"),
  mailEmail: text("mail_email"),
  resumeUrl: text("resume_url"),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
});

export const project = pgTable("project", {
  id: text("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  category: text("category").notNull(),
  client: text("client"),
  year: text("year"),
  website: text("website"),
  image: text("image"),
  additionalImages: jsonb("additional_images").$type<string[]>(),
  featured: boolean("featured").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
});

export const experience = pgTable("experience", {
  id: text("id").primaryKey(),
  iconUrl: text("icon_url"),
  role: text("role").notNull(),
  location: text("location").notNull(),
  startYear: text("start_year").notNull(),
  endYear: text("end_year").notNull(),
  bulletPoints: jsonb("bullet_points").$type<string[]>().default([]).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
});

export const budgetPeriod = pgTable("budget_period", {
  id: text("id").primaryKey(),
  month: integer("month").notNull(),
  year: integer("year").notNull(),
  salaryDay: integer("salary_day").notNull().default(1),
  creditCardLimit: integer("credit_card_limit").notNull().default(0),
  availableCreditLimit: integer("available_credit_limit").notNull().default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
});

export const budgetSubCategory = pgTable("budget_sub_category", {
  id: text("id").primaryKey(),
  periodId: text("period_id")
    .notNull()
    .references(() => budgetPeriod.id, { onDelete: "cascade" }),
  primaryCategory: text("primary_category").notNull(),
  name: text("name").notNull(),
  plannedAmount: integer("planned_amount").notNull().default(0),
  actualAmount: integer("actual_amount").notNull().default(0),
  paid: boolean("paid").notNull().default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
});

export const transaction = pgTable("transaction", {
  id: text("id").primaryKey(),
  periodId: text("period_id")
    .notNull()
    .references(() => budgetPeriod.id, { onDelete: "cascade" }),
  subCategoryId: text("sub_category_id")
    .notNull()
    .references(() => budgetSubCategory.id, { onDelete: "cascade" }),
  amount: integer("amount").notNull().default(0),
  description: text("description").notNull(),
  date: timestamp("date").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
});

export const budgetPeriodRelations = relations(budgetPeriod, ({ many }) => ({
  subCategories: many(budgetSubCategory),
  transactions: many(transaction),
}));

export const budgetSubCategoryRelations = relations(budgetSubCategory, ({ one, many }) => ({
  period: one(budgetPeriod, {
    fields: [budgetSubCategory.periodId],
    references: [budgetPeriod.id],
  }),
  transactions: many(transaction),
}));

export const transactionRelations = relations(transaction, ({ one }) => ({
  period: one(budgetPeriod, {
    fields: [transaction.periodId],
    references: [budgetPeriod.id],
  }),
  subCategory: one(budgetSubCategory, {
    fields: [transaction.subCategoryId],
    references: [budgetSubCategory.id],
  }),
}));

export const schema = {
  user,
  session,
  account,
  verification,
  hero,
  project,
  experience,
  budgetPeriod,
  budgetSubCategory,
  transaction,
  budgetPeriodRelations,
  budgetSubCategoryRelations,
  transactionRelations,
};