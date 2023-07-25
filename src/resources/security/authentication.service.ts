import { sign } from 'jsonwebtoken';
import { config } from "dotenv";
config();

export class AuthenticationService {

    generateAccessToken(user: object) {
        try {
            return sign(user, process.env.ACCESS_TOKEN_SECRET as string, { expiresIn: '1800s' });
        } catch(e) {
            console.log(e);
            throw e;
        }
    }
}