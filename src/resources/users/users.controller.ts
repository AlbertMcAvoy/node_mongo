import { Router } from 'express'
import { UsersService } from '~/resources/users/users.service'
import { BadRequestException, NotFoundException } from '~/utils/exceptions'
import {authenticateToken} from "~/middlewares/authentication.handler";
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
UsersController.get('/', authenticateToken, async (req, res) => {
    return res
        .status(200)
        .json(await service.findAll())
})

/**
 * Find a specific user
 */
UsersController.get('/:id', authenticateToken, async (req, res) => {
    const id = req.params.id

    if (Number.isInteger(id)) throw new BadRequestException('Invalid ID')

    const user = await service.findOne(id)

    if (!user) throw new NotFoundException('User not found')

    return res
        .status(200)
        .json(user)
})

/**
 * Create user
 */
UsersController.post('/', async (req, res) => {
    const createdUser = await service.create(req.body)

    return res
        .status(201)
        .json(createdUser)
})

/**
 * Update user
 */
UsersController.patch('/:id', authenticateToken, async (req, res) => {
    const id = req.params.id;

    if (Number.isInteger(id)) throw new BadRequestException('Invalid ID')

    const updatedUser = await service.update(req.body, id)

    return res
        .status(200)
        .json(updatedUser)
})

/**
 * Delete user
 */
UsersController.delete('/:id', authenticateToken, async (req, res) => {
    const id = Number(req.params.id)

    if (!Number.isInteger(id)) throw new BadRequestException('Invalid ID')

    return res
        .status(200)
        .json(await service.delete(id))
})

export { UsersController }