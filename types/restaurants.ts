import {model, Schema, Types, Document} from "mongoose";

// 1. Create an interface representing a document in MongoDB.
export interface IRestaurant extends Document {
    address: any,
    borough: string,
    cuisine: string,
    grades: [],
    name: string,
    restaurant_id: string
}

// 2. Create a Schema corresponding to the document interface.
const restaurantSchema = new Schema({
    id: Types.ObjectId,
    address: Object,
    borough: String,
    cuisine: String,
    grades: Array,
    name: String,
    restaurant_id: { type: String, required: true },
});

// 3. Create a Model.
export const Restaurants = model<IRestaurant>('Restaurant', restaurantSchema);