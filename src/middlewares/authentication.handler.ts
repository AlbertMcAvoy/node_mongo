import { NextFunction, Request, Response } from 'express'
import { verify } from 'jsonwebtoken';
import { config } from "dotenv";
import {UnauthorizedException} from "~/utils/exceptions";
config();

/**
 * Middleware to verify JWT
 *
 * @param req - initial request
 * @param res - object response
 * @param next - allow to pass to the next middleware if exists
 *
 */
export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {

    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]

    if (token == null) throw new UnauthorizedException('Authorization required');

    verify(token, process.env.ACCESS_TOKEN_SECRET as string, (err) => {
        if (err) {
            throw new UnauthorizedException('Authorization required');
        }
        next();
    });
}