import { relations } from "drizzle-orm"
import { pgTable, uuid, primaryKey, integer } from "drizzle-orm/pg-core"
import { timestamps } from "../columnHelper"
import { categories } from "./categories"

// Junction table for many-to-many category relationships
// Allows a category to have multiple parents
export const categoryHierarchy = pgTable(
    "category_hierarchy",
    {
        parentId: uuid("parent_id")
            .notNull()
            .references(() => categories.id, { onDelete: "cascade" }),
        childId: uuid("child_id")
            .notNull()
            .references(() => categories.id, { onDelete: "cascade" }),

        // Optional: Display order within this specific parent
        displayOrder: integer("display_order").default(0),

        ...timestamps,
    },
    (t) => [
        //     // Composite primary key
        primaryKey({ columns: [t.parentId, t.childId] }),
        //     // Index for efficient parent lookups
        //     index("hierarchy_parent_idx").on(t.parentId),
        //     // Index for efficient child lookups
        //     index("hierarchy_child_idx").on(t.childId),
    ],
)

export const categoryHierarchyRelations = relations(categoryHierarchy, ({ one }) => ({
    // Parent category in this relationship
    parent: one(categories, {
        fields: [categoryHierarchy.parentId],
        references: [categories.id],
        relationName: "parent_category",
    }),

    // Child category in this relationship
    child: one(categories, {
        fields: [categoryHierarchy.childId],
        references: [categories.id],
        relationName: "child_category",
    }),
}))
