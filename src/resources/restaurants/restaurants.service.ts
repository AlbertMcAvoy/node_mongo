import {IRestaurant, Restaurants} from '~/types/restaurants'
import {AbstractException} from "~/utils/exceptions";

export class RestaurantsService {

    /**
     * Find all restaurants
     */
    async findAll() {
        try {
            return await Restaurants.find({}, {'_id': false, '__v': false});
        } catch (error) {
            console.log(error);
            throw error
        }
    }

    /**
     * Find a specific restaurant
     * @param id - restaurant's ID
     */
    async findOne(id: string) {
        try {
            return await Restaurants.findOne({restaurant_id: id}, {'_id': false, '__v': false});
        } catch (error) {
            console.log(error);
            throw error
        }
    }

    /**
     * Update a particular restaurant
     *
     * @param restaurantData - Object corresponding to a restaurant, has not necessary a full restaurant. Not taking ID.
     * @param id - unique ID of restaurant
     */
    async update(restaurantData: Partial<IRestaurant>, id: string) {
        try {
            if (restaurantData.restaurant_id || restaurantData.restaurant_id === "") delete restaurantData.restaurant_id;
            let result = await Restaurants.updateOne({restaurant_id: id}, restaurantData);
            if (!result.modifiedCount) throw new AbstractException('The restaurant was not updated, nothing to update', 500);
            return this.findOne(id);
        } catch (error) {
            console.log(error);
            throw error
        }
    }

    /**
     * Create a restaurant
     *
     * @param restaurantData - Object corresponding to a restaurant, has not necessary a full restaurant. Not taking ID.
     */
    async create(restaurantData: IRestaurant) {
        try {
            restaurantData.restaurant_id = String(Math.floor(Math.random() * 1000000));
            return (await Restaurants.create(restaurantData)).toJSON();
        } catch (error) {
            console.log(error);
            throw error
        }
    }

    /**
     * Delete a restaurant
     * @param id - unique ID of restaurant
     */
    async delete(id: number) {
        try {
            return await Restaurants.findOneAndDelete({restaurant_id: id});
        } catch (error) {
            console.log(error);
            throw error
        }
    }
}
