import { Schema, model } from 'mongoose';
import { hash as bHash, compare } from 'bcrypt';
import User from '@resources/user/user.interface';

const UserSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    password: {
      type: String,
    },
    role: {
      type: String,
      enum: ['admin', 'user'],
      required: true,
    },
  },
  { timestamps: true },
);

UserSchema.pre<User>('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }

  const hash = await bHash(this.password, 10);

  this.password = hash;

  next();
});

UserSchema.methods.isValidPassword = async function (password: string): Promise<Error | boolean> {
  return await compare(password, this.password);
};

export default model<User>('User', UserSchema);
