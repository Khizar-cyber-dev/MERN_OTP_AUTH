import { verifyToken } from "../lib/Token.js";
import User from "../model/User.js";

export const authMiddleware = async (req, res, next) => {
    try{
        const accessToken = req.cookies.accessToken;
        if(!accessToken){
            return res.status(401).json({ message: 'Not authorized, no token' });
        }
        const decoded = await verifyToken(accessToken, 'access');
        if(!decoded){
            return res.status(401).json({ message: 'Not authorized, token failed' });
        }
        const user = await User.findById(decoded.id).select('-password');
        if(!user){
            return res.status(401).json({ message: 'Not authorized, user not found' });
        }
        req.user = user;
        next();
    }catch(err){
        console.error(err);
        return res.status(401).json({ message: 'Not authorized, token failed' });
    }
}