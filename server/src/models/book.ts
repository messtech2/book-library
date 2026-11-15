import { model, Schema, type  Document } from 'mongoose';

export interface IBook extends Document {
  title: string;
  author: string;
  genre: string;
  publishedYear: number;
  available: boolean;
  isbn: string;
}

const bookSchema = new Schema<IBook>({
  title: { type: String, required: true },
  author: { type: String, required: true },
  genre: { type: String, required: false },
  publishedYear: { type: Number, required: true },
  isbn: { type: String, required: false },
  available: { type: Boolean, required: true },
});

bookSchema.set('toJSON', {
  transform: (_doc, ret) => {
    const { _id, __v, ...rest } = ret
    return { id: _id.toString(), ...rest }
  },
})
export const Book = model<IBook>('Book', bookSchema);
