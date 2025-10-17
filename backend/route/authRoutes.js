import { Router } from "express";
import { 
    getProfile, 
    login, 
    logout, 
    refreshToken, 
    register, 
    resetOtp, 
    resetPassword, 
    sendOtp, 
    verifyOtp 
} from "../controller/authController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);
router.post('/refresh', refreshToken);
router.post('/send-verification-otp', authMiddleware, sendOtp);
router.post('/verify-the-otp', authMiddleware, verifyOtp);
router.post('/reset-otp', resetOtp);
router.post('/reset-password', resetPassword);
router.get('/me', authMiddleware, getProfile);

export default router;