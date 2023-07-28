import { Router } from 'express'
import { UsersService } from '~/resources/users/users.service'
import { BadRequestException, ConflictException, NotFoundException } from '~/utils/exceptions'
import { authenticateToken } from "~/middlewares/authentication.handler";
import {IUser, UserDTO} from "~/types/users";

/**
 *
 * @swagger
 * tags:
 *   name: Users
 *   description: API for managing users
 */

/**
 * We create a router, allowing us to create routes outside `src/index.ts`
 */
const UsersController = Router()

/**
 * Service instance
 */
const service = new UsersService()

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Find all users
 *     tags: [Users]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Returns an array of users
 *         content:
 *          application/json:
 *           schema:
 *            type: array
 *            items:
 *             anyOf:
 *              - $ref: '#/components/schemas/User'
 */
UsersController.get('/', authenticateToken, async (req, res, next) => {
    try {
        return res
            .status(200)
            .json(await service.findAll())
    } catch (error) {
        return next(error)
    }
})

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Find a user by id
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: uuid
 *         schema:
 *           type: string
 *         required: true
 *         description: id of the user
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Returns a user object
 *         content:
 *          application/json:
 *           schema:
 *            $ref: '#/components/schemas/User'
 *       404:
 *         description: Restaurant not found
 */
UsersController.get('/:id', authenticateToken, async (req, res, next) => {
    try {
        const id = req.params.id

        if (Number.isInteger(id)) throw new BadRequestException('Invalid ID')

        const user = await service.findOneById(id)

        if (!user) throw new NotFoundException('User not found')

        return res
            .status(200)
            .json(user)
    } catch(error) {
        return next(error)
    }
})

/**
 * @swagger
 * /users:
 *   post:
 *     summary: Create a new user
 *     tags: [Users]
 *     requestBody:
 *       description: User object to be created
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/User"
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       201:
 *         description: Created successfully, returns the user object created
 *         content:
 *          application/json:
 *              schema:
 *                  $ref: "#/components/schemas/User"
 */
UsersController.post('/', async (req, res, next) => {
    try {
        const user = await service.findOneByEmail(req.body.email)

        if (user) throw new ConflictException('User already Exists')

        const createdUser = await service.create(req.body)

        return res
            .status(201)
            .json(new UserDTO(<IUser>createdUser))
    } catch(e) {
        return next(e);
    }
})

/**
 * @swagger
 * /users/{id}:
 *   put:
 *     summary: update a new user
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: user_id
 *         schema:
 *           type: string
 *         required: true
 *         description: id of the user
 *     requestBody:
 *       description: User object to be created
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/User"
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Updated successfully, returns the user object updated
 *         content:
 *          application/json:
 *              schema:
 *                  $ref: "#/components/schemas/User"
 *       404:
 *         description: User not found
 */
UsersController.put('/:id', authenticateToken, async (req, res, next) => {
    try {
        const id = req.params.id;

        if (Number.isInteger(id)) throw new BadRequestException('Invalid ID')

        const updatedUser = await service.update(req.body, id)

        return res
            .status(200)
            .json(new UserDTO(<IUser>updatedUser))
    } catch (error) {
        return next(error)
    }
})

/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     summary: Delete a user by id
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: user_id
 *         schema:
 *           type: string
 *         required: true
 *         description: id of the user
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Returns a user object
 *         content:
 *          application/json:
 *              schema:
 *                  $ref: "#/components/schemas/User"
 *       404:
 *         description: User not found
 */
UsersController.delete('/:id', authenticateToken, async (req, res, next) => {
    try {
        const id = Number(req.params.id)

        if (!Number.isInteger(id)) throw new BadRequestException('Invalid ID')

        let deletedUser = await service.delete(id);
        if (deletedUser === null) throw new NotFoundException('User not found');

        deletedUser = deletedUser.toJSON();

        return res
            .status(200)
            .json(new UserDTO(<IUser>deletedUser))
    } catch (error) {
        return next(error);
    }
})

export { UsersController }