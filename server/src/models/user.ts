import { model, Schema, type  Document } from 'mongoose';

export interface IUser extends Document {
  firstName: string;
  lastName: string;
  email: string;
  passwordHash: string;
  role?:  'member' | 'admin' | 'librarian';
}


const userSchema = new Schema<IUser>({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, lowercase: true, trim: true, unique: true, match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ },
  passwordHash: { type: String, required: true },
  role: { type: String, enum: ['member', 'admin', 'librarian'], default: 'member' },
},
{ timestamps: true });

userSchema.set('toJSON', {
  transform: (_doc, ret) => {
    const { _id, __v, passwordHash: _passwordHash, ...rest } = ret;
    
    return { id: _id.toString(), ...rest }
  },
})



export const User = model<IUser>('User', userSchema);
