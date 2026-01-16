import { Schema, model, Document, Types } from "mongoose";

export interface ISearchHistory extends Document {
  userId: Types.ObjectId;
  productId: Types.ObjectId;
  productName: string;
  productLocalName: string;
  productImage: string;
  createdAt: Date;
}

const SearchHistorySchema = new Schema<ISearchHistory>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    productId: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    productName: {
      type: String,
      required: true,
    },
    productLocalName: {
      type: String,
    },
    productImage: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

// fetch recent search
SearchHistorySchema.index({ userId: 1, createdAt: -1 });

//
SearchHistorySchema.index({ userId: 1,productId:1}, { unique: true });

export const SearchHistory = model<ISearchHistory>(
  "SearchHistory",
  SearchHistorySchema
);
