import cors from 'cors'
import express from 'express'
import { RestaurantsController } from '~/resources/restaurants/restaurants.controller'
import { UsersController } from '~/resources/users/users.controller'
import { ExceptionsHandler } from '~/middlewares/exceptions.handler'
import { UnknownRoutesHandler } from '~/middlewares/unknownRoutes.handler'
import mongoose from "mongoose";
import { config } from "dotenv";
import {AuthenticationController} from "~/resources/security/authentication.controller";
config();

/**
 * Create new express app
 */
const app = express()

/**
 * Tell express we want to parse the request body to JSON
 *
 * @example app.post('/', (req) => req.body.prop)
 */
app.use(express.json())

/**
 * Tell express that we want all DNS to access the API
 */
app.use(cors())

/**
 * Authentication stuff
 */
app.use('/login', AuthenticationController)

/**
 * CRUD for restaurants handled by '/restaurants'
 */
app.use('/restaurants', RestaurantsController)

/**
 * CRUD for users handled by '/users'
 */
app.use('/users', UsersController)

/**
 * Return an error for all other routes not supported
 */
app.all('*', UnknownRoutesHandler)

/**
 * Manage errors
 * /!\ this must be the last `app.use`
 */
app.use(ExceptionsHandler)

if (require.main === module) {
    mongoose.connect(process.env.MONGO_DB_URL || 'mongodb+srv://mykechastang:fYCZmUHTzOlXULNm@clusteralbert.c3xo0el.mongodb.net/sample_restaurants?retryWrites=true&w=majority')
        .then(() => {
            console.log('Connected!')

            /**
             * Tell express to listen to request on the config port
             */
            app.listen(process.env.API_PORT, () => console.log(`Application running on port : ${process.env.API_PORT}`))
        });
}

mongoose.set('toObject', { useProjection: true });
mongoose.set('toJSON', { useProjection: true });

export { app };