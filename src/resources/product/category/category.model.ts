import { Schema, model } from 'mongoose';
// eslint-disable-next-line import/no-named-as-default
import paginate from 'mongoose-paginate-v2';
import Category from './category.interface';

const CategorySchema = new Schema(
  {
    name: {
      type: String,
      unique: true,
      required: true,
      trim: true,
    },
    parentId: {
      type: Schema.Types.ObjectId,
      ref: 'category',
    },
    active: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true },
);

CategorySchema.plugin(paginate);

export default model<Category>('category', CategorySchema);
