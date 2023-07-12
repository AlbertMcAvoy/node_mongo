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
UsersController.get('/', authenticateToken, (req, res) => {
    return res
        .status(200)
        .json(service.findAll())
})

/**
 * Find a specific user
 */
UsersController.get('/:id', authenticateToken, (req, res) => {
    const id = req.params.id

    if (Number.isInteger(id)) throw new BadRequestException('Invalid ID')

    const restaurant = service.findOne(id)

    if (!restaurant) throw new NotFoundException('User not found')

    return res
        .status(200)
        .json(restaurant)
})

/**
 * Create user
 */
UsersController.post('/', (req, res) => {
    const createdRestaurant = service.create(req.body)

    return res
        .status(201)
        .json(createdRestaurant)
})

/**
 * Update user
 */
UsersController.patch('/:id', authenticateToken, (req, res) => {
    const id = req.params.id;

    if (Number.isInteger(id)) throw new BadRequestException('Invalid ID')

    const updatedRestaurant = service.update(req.body, id)

    return res
        .status(200)
        .json(updatedRestaurant)
})

/**
 * Delete user
 */
UsersController.delete('/:id', authenticateToken, (req, res) => {
    const id = Number(req.params.id)

    if (!Number.isInteger(id)) throw new BadRequestException('Invalid ID')

    return res
        .status(200)
        .json(service.delete(id))
})

export { UsersController }