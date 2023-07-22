import { Schema, model, Types, Document } from 'mongoose';

// 1. Create an interface representing a document in MongoDB.
export interface IUser extends Document {
    uuid: string;
    name: string;
    email: string;
    password?: string;
}

// 2. Create a Schema corresponding to the document interface.
const userSchema: Schema = new Schema({
    id: Types.ObjectId,
    uuid: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    password: { type: String, required: true, select: false },
});

// 3. Create a Model.
export const Users = model<IUser>('User', userSchema);

//4. Create a DTO
export class UserDTO {
    private name: string;
    private uuid: string;
    private email: string;
    constructor(user: IUser) {
        this.uuid = user.uuid;
        this.email = user.email;
        this.name = user.name;
    }
}