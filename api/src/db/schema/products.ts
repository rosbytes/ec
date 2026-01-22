import { relations } from "drizzle-orm"
import { pgTable, uuid, varchar } from "drizzle-orm/pg-core"
import { timestamps } from "../columnHelper"
import { categories } from "./categories"
import { productVariants } from "./productVariants"

export const products = pgTable("products", {
    id: uuid().primaryKey().defaultRandom(),
    name: varchar({ length: 255 }).notNull(),
    brand: varchar({ length: 255 }).notNull(),
    categoryId: uuid("category_id")
        .notNull()
        .references(() => categories.id),
    // where is slug?
    ...timestamps,
})

export const productsRelations = relations(products, ({ one, many }) => ({
    // this might create problems later
    categories: one(categories, {
        fields: [products.categoryId],
        references: [categories.id],
    }),
    variants: many(productVariants),
}))

// import { Schema, model, Document, Types } from "mongoose";
// import slugify from "slugify";

// interface IVariant {
//   _id: Types.ObjectId;
//   label: string; // 500gm or 1kg
//   price: number;
//   stock: number;
//   isAvailable: boolean;
// }
// interface IImage {
//   public_id: string;
//   url: string;
//   mimeType?: string;
//   isPrimary?: boolean;
// }

// export interface IProduct extends Document {
//   name: string;
//   localName: string;
//   category: string;
//   slug: string;
//   description: string;
//   image: IImage[];
//   variants: IVariant[];
//   tags?: string[];
//   isActive: boolean;
//   isFeatured: boolean;
//   createdAt: Date;
//   updatedAt: Date;
// }

// const VariantSchema = new Schema<IVariant>({
//   _id: { type: Schema.Types.ObjectId, auto: true },
//   label: { type: String, required: true, trim: true },
//   price: { type: Number, required: true },
//   stock: { type: Number, default: 0 },
//   isAvailable: { type: Boolean, default: true },
// });

// const ImageSchema = new Schema<IImage>(
//   {
//     public_id: { type: String, required: true },
//     url: { type: String, required: true },
//     mimeType: { type: String },
//     isPrimary: { type: Boolean, default: false },
//   },
//   {
//     _id: false,
//   }
// );

// const ProductSchema = new Schema<IProduct>(
//   {
//     name: { type: String, required: true, trim: true },
//     localName: { type: String, trim: true },
//     slug: { type: String, unique: true },
//     category: {
//       type: String,
//       index: true,
//     },

//     description: { type: String, trim: true },
//     image: { type: [ImageSchema], default: [] },
//     variants: { type: [VariantSchema], required: true },
//     tags: { type: [String], default: [] },
//     isActive: { type: Boolean, default: true },
//     isFeatured: { type: Boolean, default: false },
//   },
//   { timestamps: true }
// );

// ProductSchema.index({
//   name: "text",
//   localName: "text",
//   tags: "text",
// });
// ProductSchema.index({ name: 1 });
// ProductSchema.index({ localName: 1 });
// ProductSchema.index({ isFeatured: 1 });
// ProductSchema.index({ isActive: 1 });

// ProductSchema.pre("save", async function (next) {
//   if (!this.isModified("name")) return next();

//   let slugValue = slugify(this.name, { lower: true, strict: true });
//   const existing = await (this.constructor as any).findOne({
//     slug: slugValue,
//     _id: { $ne: this._id },
//   });

//   if (existing) slugValue = `${slugValue}-${Date.now()}`;
//   this.slug = slugValue;

//   next();
// });

// export const Product = model<IProduct>("Product", ProductSchema);
