import { Document } from 'mongoose';

export default interface User extends Document {
  email: string;
  name: string;
  password: string;
  role: 'admin' | 'user';

  isValidPassword(password: string): Promise<Error | boolean>;
}
