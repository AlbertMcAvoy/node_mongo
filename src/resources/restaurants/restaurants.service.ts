import {IRestaurant, Restaurants} from '~~/types/restaurants'

export class RestaurantsService {

    /**
     * Find all restaurants
     */
    async findAll() {
        try {
            return await Restaurants.find();
        } catch (error) {
            console.log(error);
        }
    }

    /**
     * Find a specific restaurant
     * @param id - restaurant's ID
     */
    async findOne(id: string) {
        try {
            return await Restaurants.findOne({restaurant_id: id});
        } catch (error) {
            console.log(error);
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
            return await Restaurants.updateOne({restaurant_id: id}, restaurantData);
        } catch (error) {
            console.log(error);
        }
    }

    /**
     * Create a restaurant
     *
     * @param restaurantData - Object corresponding to a restaurant, has not necessary a full restaurant. Not taking ID.
     */
    async create(restaurantData: IRestaurant) {
        try {
            return await Restaurants.create(restaurantData);
        } catch (error) {
            console.log(error);
        }
    }

    /**
     * Delete a restaurant
     */
    async delete(id: number) {
        try {
            return await Restaurants.findOneAndDelete({restaurant_id: id});
        } catch (error) {
            console.log(error);
        }
    }
}
