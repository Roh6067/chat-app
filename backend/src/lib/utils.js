import jwt from 'jsonwebtoken';
import { ENV } from './env.js';

export const generateToken = (userId, res) => {
    const { JWT_SECRET } = ENV;
    if(!JWT_SECRET) throw new Error("JWT_SECRET is not defined");
    
    const token = jwt.sign({userId}, ENV.JWT_SECRET, {
        expiresIn: '7d'
    });
    res.cookie("jwt", token, {
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        httpOnly: true, 
        sameSite: 'lax',
        path: '/',
        // secure: ENV.NODE_ENV === 'development' ? false : true,
        secure: false, // Set to false for development, true for production
    });
    return token;
}