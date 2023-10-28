import { Document } from 'mongoose';

export default interface Product extends Document {
  name: string;
  unit_type: 'qty' | 'ltr' | 'kg' | 'meter';
  category: string;
  assets: [
    {
      url: string;
      type: 'image' | 'video' | 'gif';
    },
  ];
  price: number;
  discount_percentage: number;
  discount_amount: number;
  discount_range: {
    from: Date;
    to: Date;
  };
  tax_percentage: number;
  stock: {
    total: number;
    available: number;
  };
}
