import { Schema, model, Types, Model, Document } from 'mongoose';

// 1. Create an interface representing a document in MongoDB.
export interface IUser extends Document {
    uuid: string;
    name: string;
    email: string;
    password: string;
}

// 2. Create a Schema corresponding to the document interface.
const userSchema: Schema = new Schema({
    id: Types.ObjectId,
    uuid: { type: String, required: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
});

// 3. Create a Model.
export const Users = model<IUser>('User', userSchema);