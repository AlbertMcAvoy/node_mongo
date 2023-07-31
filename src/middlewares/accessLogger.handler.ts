import {NextFunction, Request, Response} from "express";
import {wLogger} from "~/utils/logger";

/**
 * Middleware to log access to the api
 */
export const AccessHandler = (req: Request, res: Response, next: NextFunction) => {

    /**
     * log the access in a file
     */
    const logger = wLogger({ level: 'access' });
    const msg = `Action: ${req.method}\n URL: ${req.url}\n Authorization: ${req.headers.authorization}\n`
    logger.log('access', msg);

    return next();
}