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
    restaurant_id: { type: String, required: true, unique: true },
});

// 3. Create a Model.
export const Restaurants = model<IRestaurant>('Restaurant', restaurantSchema);

// 4. Create a DTO
export class RestaurantDTO {
    address: any;
    borough: string;
    cuisine: string;
    grades: [];
    name: string;
    restaurant_id: string;
    constructor(restaurant: IRestaurant) {
        this.address = restaurant.address;
        this.borough = restaurant.borough;
        this.cuisine = restaurant.cuisine;
        this.grades = restaurant.grades;
        this.name = restaurant.name;
        this.restaurant_id = restaurant.restaurant_id;
    }
}