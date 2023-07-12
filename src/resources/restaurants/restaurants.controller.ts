import { Router } from 'express'
import { RestaurantsService } from '~/resources/restaurants/restaurants.service'
import {BadRequestException, NotFoundException, UnauthorizedException} from '~/utils/exceptions'
import {authenticateToken} from "~/middlewares/authentication.handler";


/**
 * We create a router, allowing us to create routes outside `src/index.ts`
 */
const RestaurantsController = Router();

/**
 * Service instance
 */
const service = new RestaurantsService();

/**
 * Find all restaurants
 */
RestaurantsController.get('/', authenticateToken, async (req, res, next) => {
    try {
        const restaurants = await service.findAll();
        return res
            .status(200)
            .json(restaurants);
    } catch(error) {
        return next(error);
    }
})

/**
 * Find a specific restaurant
 */
RestaurantsController.get('/:id', authenticateToken, async (req, res, next) => {
    try {
        const authHeader = req.headers['authorization']
        const token = authHeader && authHeader.split(' ')[1]

        if (token == null) throw new UnauthorizedException('Authorization required');

        const id = req.params.id;

        if (Number.isInteger(id)) throw new BadRequestException('Invalid ID');

        const restaurant = await service.findOne(id);

        if (!restaurant) throw new NotFoundException('Restaurant not found');

        return res
            .status(200)
            .json(restaurant);
    } catch(error) {
        return next(error);
    }
})

/**
 * Create a restaurant
 */
RestaurantsController.post('/', authenticateToken, async (req, res, next) => {
    try {
        const createdRestaurant = await service.create(req.body);

        return res
            .status(201)
            .json(createdRestaurant);
    } catch(error) {
        return next(error);
    }
})

/**
 * Update restaurant
 */
RestaurantsController.put('/:id', authenticateToken, async (req, res, next) => {
    try {
        const id = req.params.id;

        if (Number.isInteger(id)) throw new BadRequestException('Invalid ID');

        const updatedRestaurant = await service.update(req.body, id);

        return res
            .status(200)
            .json(updatedRestaurant);
    } catch(error) {
        return next(error);
    }
})

/**
 * Delete restaurant
 */
RestaurantsController.delete('/:id', authenticateToken, async (req, res, next) => {
    try {
        const id = Number(req.params.id);

        if (!Number.isInteger(id)) throw new BadRequestException('Invalid ID');

        const restaurant = await service.delete(id);

        return res
            .status(200)
            .json(restaurant);
    } catch(error) {
        return next(error);
    }
})

export { RestaurantsController }