import {Router} from 'express'
import {RestaurantsService} from '~/resources/restaurants/restaurants.service'
import {BadRequestException, ConflictException, NotFoundException} from '~/utils/exceptions'
import {authenticateToken} from "~/middlewares/authentication.handler";
import {IRestaurant, RestaurantDTO} from "~/types/restaurants";

/**
 *
 * @swagger
 * tags:
 *   name: Restaurants
 *   description: API for managing restaurants
 */

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     BearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *
 */

/*
 * We create a router, allowing us to create routes outside `src/index.ts`
 */
const RestaurantsController = Router();

/**
 * Service instance
 */
const service = new RestaurantsService();

/**
 * @swagger
 * /restaurants:
 *   get:
 *     summary: Find all restaurants
 *     tags: [Restaurants]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Returns an array of restaurants
 *         content:
 *          application/json:
 *           schema:
 *            type: array
 *            items:
 *             anyOf:
 *              - $ref: '#/components/schemas/Restaurant'
 */
RestaurantsController.get('/', authenticateToken, async (req, res, next) => {
    try {
        return res
            .status(200)
            .json(await service.findAll());
    } catch(error) {
        return next(error);
    }
})

/**
 * @swagger
 * /restaurants/{id}:
 *   get:
 *     summary: Find a restaurant by id
 *     tags: [Restaurants]
 *     parameters:
 *       - in: path
 *         name: restaurant_id
 *         schema:
 *           type: string
 *         required: true
 *         description: id of the restaurant
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Returns a restaurant object
 *         content:
 *          application/json:
 *           schema:
 *            $ref: '#/components/schemas/Restaurant'
 *       404:
 *         description: Restaurant not found
 */
RestaurantsController.get('/:id', authenticateToken, async (req, res, next) => {
    try {

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
 * @swagger
 * /restaurants:
 *   post:
 *     summary: Create a new restaurant
 *     tags: [Restaurants]
 *     requestBody:
 *       description: Restaurant object to be created
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/Restaurant"
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       201:
 *         description: Created successfully, returns the restaurant object created
 *         content:
 *          application/json:
 *              schema:
 *                  $ref: "#/components/schemas/Restaurant"
 */
RestaurantsController.post('/', authenticateToken, async (req, res, next) => {
    try {

        const restaurant = await service.findOne(req.body.restaurant_id)

        if (restaurant) throw new ConflictException('Restaurant already Exists')

        const createdRestaurant = await service.create(req.body);

        return res
            .status(201)
            .json(new RestaurantDTO(<IRestaurant>createdRestaurant));
    } catch(error) {
        return next(error);
    }
})


/**
 * @swagger
 * /restaurants/{id}:
 *   put:
 *     summary: update a new restaurant
 *     tags: [Restaurants]
 *     parameters:
 *       - in: path
 *         name: restaurant_id
 *         schema:
 *           type: string
 *         required: true
 *         description: id of the restaurant
 *     requestBody:
 *       description: Restaurant object to be created
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/Restaurant"
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Updated successfully, returns the restaurant object updated
 *         content:
 *          application/json:
 *              schema:
 *                  $ref: "#/components/schemas/Restaurant"
 *       404:
 *         description: Restaurant not found
 */
RestaurantsController.put('/:id', authenticateToken, async (req, res, next) => {
    try {
        const id = req.params.id;

        if (Number.isInteger(id)) throw new BadRequestException('Invalid ID');

        const updatedRestaurant = await service.update(req.body, id);

        return res
            .status(200)
            .json(new RestaurantDTO(<IRestaurant>updatedRestaurant));
    } catch(error) {
        return next(error);
    }
})

/**
 * @swagger
 * /restaurants/{id}:
 *   delete:
 *     summary: Delete a restaurant by id
 *     tags: [Restaurants]
 *     parameters:
 *       - in: path
 *         name: restaurant_id
 *         schema:
 *           type: string
 *         required: true
 *         description: id of the restaurant
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Returns a restaurant object
 *         content:
 *          application/json:
 *              schema:
 *                  $ref: "#/components/schemas/Restaurant"
 *       404:
 *         description: Restaurant not found
 */
RestaurantsController.delete('/:id', authenticateToken, async (req, res, next) => {
    try {
        const id = Number(req.params.id);

        if (!Number.isInteger(id)) throw new BadRequestException('Invalid ID');

        let deletedRestaurant = await service.delete(id);
        if (deletedRestaurant === null) throw new NotFoundException('Restaurant not found');

        deletedRestaurant = deletedRestaurant.toJSON();

        return res
            .status(200)
            .json(new RestaurantDTO(<IRestaurant>deletedRestaurant));
    } catch(error) {
        return next(error);
    }
})

export { RestaurantsController }