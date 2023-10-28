import { Document } from 'mongoose';

export default interface Category extends Document {
  app: string;
  name: string;
  parentId: string;
  active: boolean;
}
