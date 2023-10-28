import { Schema, model } from 'mongoose';
// eslint-disable-next-line import/no-named-as-default
import paginate from 'mongoose-paginate-v2';
import Product from '@resources/product/product.interface';

const ProductSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    unit_type: {
      type: String,
      enum: ['qty', 'ltr', 'kg', 'meter'],
      required: true,
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: 'category',
      required: true,
    },
    assets: [
      {
        url: {
          type: String,
          required: true,
        },
        type: {
          type: String,
          enum: ['image', 'video', 'gif'],
          required: true,
        },
      },
    ],
    price: {
      type: Number,
      required: true,
    },
    discount_percentage: {
      type: Number,
      required: true,
    },
    discount_amount: {
      type: Number,
      required: true,
    },
    discount_range: {
      from: {
        type: Date,
        required: true,
      },
      to: {
        type: Date,
        required: true,
      },
    },
    tax_percentage: {
      type: Number,
      required: true,
    },
    stock: {
      total: {
        type: Number,
        required: true,
      },
      available: {
        type: Number,
        required: true,
      },
    },
    active: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true },
);
ProductSchema.plugin(paginate);

export default model<Product>('product', ProductSchema);
