import { relations, sql } from "drizzle-orm";
import {
  index,
  integer,
  pgTableCreator,
  primaryKey,
  serial,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";
import { type AdapterAccount } from "next-auth/adapters";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = pgTableCreator((name) => `condos_${name}`);

export const users = createTable("user", {
  id: varchar("id", { length: 255 }).notNull().primaryKey(),
  name: varchar("name", { length: 255 }),
  email: varchar("email", { length: 255 }).notNull(),
  emailVerified: timestamp("emailVerified", {
    mode: "date",
  }).default(sql`CURRENT_TIMESTAMP`),
  image: varchar("image", { length: 255 }),
});

export const usersRelations = relations(users, ({ many }) => ({
  accounts: many(accounts),
}));

export const accounts = createTable(
  "account",
  {
    userId: varchar("userId", { length: 255 })
      .notNull()
      .references(() => users.id),
    type: varchar("type", { length: 255 })
      .$type<AdapterAccount["type"]>()
      .notNull(),
    provider: varchar("provider", { length: 255 }).notNull(),
    providerAccountId: varchar("providerAccountId", { length: 255 }).notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: varchar("token_type", { length: 255 }),
    scope: varchar("scope", { length: 255 }),
    id_token: text("id_token"),
    session_state: varchar("session_state", { length: 255 }),
  },
  (account) => ({
    compoundKey: primaryKey({
      columns: [account.provider, account.providerAccountId],
    }),
    userIdIdx: index("account_userId_idx").on(account.userId),
  })
);

export const accountsRelations = relations(accounts, ({ one }) => ({
  user: one(users, { fields: [accounts.userId], references: [users.id] }),
}));

export const sessions = createTable(
  "session",
  {
    sessionToken: varchar("sessionToken", { length: 255 })
      .notNull()
      .primaryKey(),
    userId: varchar("userId", { length: 255 })
      .notNull()
      .references(() => users.id),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (session) => ({
    userIdIdx: index("session_userId_idx").on(session.userId),
  })
);

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, { fields: [sessions.userId], references: [users.id] }),
}));

export const verificationTokens = createTable(
  "verificationToken",
  {
    identifier: varchar("identifier", { length: 255 }).notNull(),
    token: varchar("token", { length: 255 }).notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (vt) => ({
    compoundKey: primaryKey({ columns: [vt.identifier, vt.token] }),
  })
);

export const buildings = createTable(
  "building",
  {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 255 }).notNull().default("Novo condomínio"),
    // createdById: varchar("createdById", { length: 255 })
    //   .notNull()
    //   .references(() => users.id),
    createdAt: timestamp("created_at")
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updatedAt"),
    floors: integer("floors").notNull().default(1),
    fractions: integer("fractions").notNull().default(1),
  },
  // (building) => ({
  //   creatorIdx: index("creator_idx").on(building.createdById)
  // })
)

export const residents = createTable(
  "resident", {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 255 }).notNull().default("Desconhecido"),
    contact: varchar("contact", { length: 15 }),
    floor: integer("floor").notNull(),
    fraction: integer("fraction").notNull()
  }
)

export const payments = createTable(
  "payment", {
    id: serial("id").primaryKey(),
    ammount: integer("ammount").notNull().default(0),
    month: varchar("month", { length: 7 }).notNull(),
    description: varchar("description", { length: 255 })
  }
)

export const expenses = createTable(
  "expense", {
    id: serial("id").primaryKey(),
    ammount: integer("ammount").notNull().default(0),
    month: varchar("month", { length: 7 }).notNull(),
    description: varchar("description", { length: 255 })
  }
)

export const residentRelations = relations(residents, ( { one, many }) => ({
  building: one(buildings, {
    fields: [residents.id],
    references: [buildings.id]
  }),
  payments: many(payments)
}))

export const buildingRelations = relations(buildings, ({ many }) => ({
  residents: many(residents),
  payments: many(payments),
  expenses: many(expenses)
}))

export const paymentRelations = relations(payments, ({one}) => ({
  resident: one(residents, {
    fields: [payments.id],
    references: [residents.id]
  }),
  building: one(buildings, {
    fields: [payments.id],
    references: [buildings.id]
  })
}))

export const expenseRelations = relations(expenses, ({one}) => ({  
  building: one(buildings, {
    fields: [expenses.id],
    references: [buildings.id]
  })
}))