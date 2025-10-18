import { EMAIL_VERIFY_TEMPLATE, PASSWORD_RESET_TEMPLATE } from "../../frontend/src/assets/emailTemplates.js";
import transporter from "../config/nodeMailer.js";
import redis from "../config/redis.js";
import setCookies from "../lib/Cookies.js";
import { generateToken, getStoredRefreshToken, removeRefreshToken, storeRefreshToken, verifyToken } from "../lib/Token.js";
import User from "../model/User.js";

export const register = async (req, res) => {
    try{
        const { name, email, password } = req.body || {};
        if(!name || !email || !password){
            return res.status(400).json({ message: 'Name, email and password are required' });
        }
        const userExits = await User.findOne({ email });
        if(userExits){
            return res.status(400).json({ message: 'User already exists' });
        }
        const user = await User.create({ name, email, password });
        const { accesToken, refreshToken } = await generateToken(user._id);
        setCookies(res, accesToken, refreshToken);
        storeRefreshToken(user._id, refreshToken);

        user.password = undefined;

       try {
            const mailOptions = {
                from: process.env.SENDER_EMAIL,
                to: user.email,
                subject: 'Welcome to DeathWalk Team!',
                html: `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                        <h2 style="color: #333;">Welcome to DeathWalk Team!</h2>
                        <p>Hello <strong>${user.name}</strong>,</p>
                        <p>Thank you for registering at our app to your death! We're excited to have you on board.</p>
                        <p>If you have any questions, feel free to reach out to our support team.</p>
                        <br>
                        <p>Best regards,</p>
                        <p><strong>The DeathWalk Team</strong></p>
                    </div>
                `,
                text: `Hello ${user.name},\n\nThank you for registering at our app!\n\nBest regards,\nThe Team DeathWalk.`
            };

            console.log("Attempting to send email to:", user.email);
            console.log("From email:", process.env.SENDER_EMAIL);
            
            const emailResult = await transporter.sendMail(mailOptions);
            console.log("Email sent successfully:", emailResult.messageId);
            
        } catch (emailError) {
            console.error('Email sending failed:', emailError);
            console.error('Email error details:', {
                code: emailError.code,
                command: emailError.command,
                response: emailError.response,
                responseCode: emailError.responseCode
            });
        }

        res.status(201).json({ message: 'User registered successfully', 
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                isAccountVerified: user.isAccountVerified,
            }
         });
    }catch(err){
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
}

export const login = async (req, res) => {
    try{
        console.log('Login request body:', req.body);
        const { email, password } = req.body || {};
        if(!email || !password){
            return res.status(400).json({ message: 'Email and password are required' });
        }
        const user = await User.findOne({ email });
        if(!user){
            return res.status(400).json({ message: 'Invalid email or password' });
        }
        const isMatch = await user.matchPassword(password);
        if(!isMatch){
            return res.status(400).json({ message: 'Invalid email or password' });
        }
        const { accesToken, refreshToken } = await generateToken(user._id);
        setCookies(res, accesToken, refreshToken);
        storeRefreshToken(user._id, refreshToken);
        user.password = undefined;
        res.status(200).json({ message: 'User logged in successfully', 
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                isAccountVerified: user.isAccountVerified,
            }
         });
    }catch(err){
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
}

export const logout = async (req, res) => {
    try{
        const refreshToken = req.cookies.refreshToken;
        if(!refreshToken){
            return res.status(400).json({ message: 'No refresh token found' });
        }
        const decoded = await verifyToken(refreshToken, 'refresh');
        if(!decoded){
            return res.status(400).json({ message: 'Invalid refresh token' });
        }
        res.clearCookie('accessToken');
        res.clearCookie('refreshToken');
        await removeRefreshToken(decoded.id);
        res.status(200).json({ message: 'User logged out successfully' });
    }catch(err){
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
}

export const refreshToken = async (req, res) => {
    try{
        const refreshToken = req.cookies.refreshToken;
        if(!refreshToken){
            return res.status(400).json({ message: 'No refresh token found' });
        }
        const decoded = await verifyToken(refreshToken, 'refresh');
        if(!decoded){
            return res.status(400).json({ message: 'Invalid refresh token' });
        }
        const storedToken = await getStoredRefreshToken(decoded.id);
        if(storedToken !== refreshToken){
            return  res.status(400).json({ message: 'Refresh token mismatch' });
        }
        const { accesToken: newAccessToken, refreshToken: newRefreshToken } = await generateToken(decoded.id);
        setCookies(res, newAccessToken, newRefreshToken);
        res.status(200).json({ message: 'Token refreshed successfully' });
    }
    catch(err){
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
}

export const getProfile = async (req, res) => {
    try{
        const user = await User.findById(req.user.id).select('-password');
        if(!user){
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json({ 
            userData: {
            _id: user._id,
            name: user.name,
            email: user.email,
            isAccountVerified: user.isAccountVerified,
        }
    });
    }catch(err){
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
}

export const sendOtp = async (req, res) => {
    try{
        const userId = req?.user?._id;
        if(!userId) return res.status(400).json({ message: 'userId is required' });
        const user = await User.findById(userId);
        if(!user){
            return res.status(404).json({ message: 'User not found' });
        }
        const otp = String(Math.floor(100000 + Math.random() * 900000));
        const otpExpiry = Date.now() + 10 * 60 * 1000;
        user.verifyOtp = otp;
        user.verifyOtpExpiry = otpExpiry;
        await user.save();
        try {
            const mailOptions = {
                from: process.env.SENDER_EMAIL,
                to: user.email,
                subject: 'DeathWalk Team!',
                html: EMAIL_VERIFY_TEMPLATE.replace('{{otp}}', otp).replace('{{email}}', user.email)
            };

            console.log("Attempting to send email to:", user.email);
            console.log("From email:", process.env.SENDER_EMAIL);
            
            const emailResult = await transporter.sendMail(mailOptions);
            console.log("Email sent successfully:", emailResult.messageId);
            
        } catch (emailError) {
            console.error('Email sending failed:', emailError);
            console.error('Email error details:', {
                code: emailError.code,
                command: emailError.command,
                response: emailError.response,
                responseCode: emailError.responseCode
            });
            return res.status(500).json({ message: 'Failed to send OTP email' });
        }

        return res.status(200).json({ message: 'OTP sent successfully' });
    }catch(err){
        console.error(err);
        return res.status(500).json({ message: 'Server Error' });
    }
}

export const verifyOtp = async (req, res) => {
    try{
        const userId =  req?.user?._id;
        const otp = req?.body?.otp;
        if(!userId) return res.status(400).json({ message: 'userId is required' });
        if(!otp) return res.status(400).json({ message: 'OTP is required' });
        const user = await User.findById(userId);
        if(!user){
            return res.status(404).json({ message: 'User not found' });
        }
        if(user.isAccountVerified){
            return res.status(400).json({ message: 'Account already verified' });
        }
        if(user.verifyOtp !== otp || user.verifyOtpExpiry < Date.now()){
            return res.status(400).json({ message: 'Invalid or expired OTP' });
        }
        user.isAccountVerified = true;
        user.verifyOtp = '';
        user.verifyOtpExpiry = 0;
        await user.save();
        res.status(200).json({ message: 'Account verified successfully', data: {
            isAccountVerified: user.isAccountVerified,
        } });
    }catch(err){
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
}

export const resetOtp = async (req, res) => {
    try{
        const { email } = req.body;
        const user = await User.findOne({ email });
        if(!user){
            return res.status(404).json({ message: 'User not found' });
        }
        const otp = String(Math.floor(100000 + Math.random() * 900000));
        const otpExpiry = Date.now() + 10 * 60 * 1000;
        user.resetOtp = otp;
        user.resetOtpExpiry = otpExpiry;
        await user.save();
        try {
            const mailOptions = {
                from: process.env.SENDER_EMAIL,
                to: user.email,
                subject: 'DeathWalk Team - Password Reset OTP',
                html: PASSWORD_RESET_TEMPLATE.replace('{{email}}', user.email).replace('{{otp}}', otp)
            };
            console.log("Attempting to send email to:", user.email);
            console.log("From email:", process.env.SENDER_EMAIL);
            const emailResult = await transporter.sendMail(mailOptions);
            console.log("Email sent successfully:", emailResult.messageId);
        } catch (emailError) {
            console.error('Email sending failed:', emailError);
            console.error('Email error details:', {
                code: emailError.code,
                command: emailError.command,
                response: emailError.response,
                responseCode: emailError.responseCode
            });
            return res.status(500).json({ message: 'Failed to send OTP email' });
        }
        return res.status(200).json({ message: 'Password reset OTP sent successfully' });
    }catch(err){
        console.error(err);
        return res.status(500).json({ message: 'Server Error' });
    }
}

export const resetPassword = async (req, res) => {
    try{
        const { email, otp, newPassword } = req.body;
        if(!email || !otp || !newPassword){
            return res.status(400).json({ message: 'Email, OTP and new password are required' });
        }
        const user = await User.findOne({ email });
        if(!user){
            return res.status(404).json({ message: 'User not found' });
        }
        if(user.resetOtp !== otp || user.resetOtpExpiry < Date.now()){
            return res.status(400).json({ message: 'Invalid or expired OTP' });
        }
        user.password = newPassword;
        user.resetOtp = '';
        user.resetOtpExpiry = 0;
        await user.save();
        res.status(200).json({ message: 'Password reset successfully' });
    }catch(err){
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
}