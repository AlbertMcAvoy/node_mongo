import { Router } from 'express'
import { AuthenticationService } from '~/resources/security/authentication.service'
import { NotFoundException } from '~/utils/exceptions'
import {UsersService} from "~/resources/users/users.service";

/**
 * We create a router, allowing us to create routes outside `src/index.ts`
 */
const AuthenticationController = Router();

/**
 * Service instance
 */
const service = new AuthenticationService();

const userService = new UsersService();

/**
 * @swagger
 * /login:
 *   post:
 *     summary: Get authenticated
 *     tags: [Authentication]
 *     requestBody:
 *      description: Credentials
 *      required: true
 *      content:
 *       application/json:
 *        schema:
 *         type: object
 *         properties:
 *          email:
 *           type: string
 *           description: The user's email
 *          password:
 *           type: string
 *           description: The user's password
 *     responses:
 *       201:
 *         description: Created successfully, returns the user object created
 *         content:
 *          application/json:
 *           type: object
 *           properties:
 *            accessToken:
 *             type: string
 *             description: The JWT
 *       404:
 *          description: User not found
 */
AuthenticationController.post('/', async (req, res, next) => {
    try {
        const user = await userService.findOneByCredentials(req.body.email, req.body.password);

        if (!user) throw new NotFoundException('Invalid credentials');

        const accessToken = service.generateAccessToken(user.toJSON());

        return res
            .status(200)
            .json({
            accessToken,
        });
    } catch(error) {
        return next(error);
    }
});

export { AuthenticationController }