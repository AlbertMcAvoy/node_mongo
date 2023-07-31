import { NextFunction, Request, Response } from 'express'
import {wLogger} from "~/utils/logger";

/**
 * Middleware to manage global errors
 *
 * @param err - express error
 * @param req - initial request
 * @param res - object response
 * @param next - allow to pass to the next middleware if exists
 *
 * @see https://expressjs.com/en/guide/error-handling.html
 */
export const ExceptionsHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
    /**
     * See "The default error handler" in the official doc
     */
    if (res.headersSent) {
        return next(err)
    }

    /**
     * log the errors and warns in a file
     */
    let level = 'errors';
    if (err.status >= 400) level = "warns";
    const logger = wLogger({ level });
    logger.log(level, err.error && err.error || err.toString());

    /**
     * if true, we know this is our error
     */
    if (err.status && err.error) {
        return res
            .status(err.status)
            .json({ error: err.error })
    }

    /**
     * in other case, we return a 500
     */
    return res
        .status(500)
        .json({ error: 'Internal Error' })
}