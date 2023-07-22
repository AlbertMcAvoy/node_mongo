import { Router } from 'express'
import { UsersService } from '~/resources/users/users.service'
import { BadRequestException, ConflictException, NotFoundException } from '~/utils/exceptions'
import { authenticateToken } from "~/middlewares/authentication.handler";
import {IUser, UserDTO} from "~/types/Users";

/**
 * We create a router, allowing us to create routes outside `src/index.ts`
 */
const UsersController = Router()

/**
 * Service instance
 */
const service = new UsersService()

/**
 * Find all users
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
 * Find a specific user
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
 * Create user
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
 * Update user
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
 * Delete user
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