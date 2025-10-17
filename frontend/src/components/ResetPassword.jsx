import { useState, useRef } from 'react';
import { useAuth } from '../context/useAuth';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const ResetPassword = () => {
    const { sendResetOtp, resetPassword, successMessage } = useAuth();
    const [email, setEmail] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [showOtpForm, setShowOtpForm] = useState(false);
    const navigate = useNavigate();

    const otpInputsNumber = 6;
    const [otp, setOtp] = useState(new Array(otpInputsNumber).fill(""));
    const inputRefs = useRef([]);

    const handleOtpChange = (event, index) => {
        const value = event.target.value;
        if (!/^[0-9]?$/.test(value)) return;

        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        if (value && index < otpInputsNumber - 1) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleOtpKeyDown = (event, index) => {
        if (event.key === "Backspace" && !otp[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handleSendOtp = async (e) => {
        try {
            e.preventDefault();
            await sendResetOtp(email);
            setShowOtpForm(true);
        } catch (err) {
            toast.error("Failed to send OTP. Please try again.");
        }
    }

    const resendOtp = () => {
        setShowOtpForm(false);
        setOtp(new Array(otpInputsNumber).fill(""));
    }

    const handleResetPassword = async (e) => {
        e.preventDefault();
        try {
            const enteredOtp = otp.join("");
            await resetPassword(email, enteredOtp, newPassword);
            if (successMessage) {
                setEmail("");
                setNewPassword("");
                setOtp(new Array(otpInputsNumber).fill(""));
                setShowOtpForm(false);
                navigate("/");
            }
        } catch (err) {
            toast.error("Failed to reset password. Please try again.");
        }
    }

    return (
        <div className='w-full h-screen'>
            <h2 className='text-3xl font-bold text-center mt-10'>Reset Password</h2>
            <div className='max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-lg flex flex-col items-center'>
                {!showOtpForm && (
                    <>
                        <div className="text-center bg-blue-600 w-full rounded-lg p-4 mb-6">
                            <h2 className="text-white text-lg font-semibold">
                                Enter your email to receive reset OTP
                            </h2>
                        </div>
                        <form className='w-full flex flex-col gap-4' onSubmit={(e) => { handleSendOtp(e); }}>
                            <input
                                type="email"
                                placeholder='Email'
                                className='p-3 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500'
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                            <button 
                                type="submit"
                                className='bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition duration-200 w-full'
                            >
                                Send Reset OTP
                            </button>
                        </form>
                    </>
                )}
                {showOtpForm && (
                    <>
                        <div className="text-center bg-blue-600 w-full rounded-lg p-4 mb-6">
                            <h2 className="text-white text-lg font-semibold">
                                Enter OTP and new password
                            </h2>
                        </div>
                        <form className='w-full flex flex-col gap-4' onSubmit={handleResetPassword}>
                            <div className="mb-4 flex justify-center gap-2">
                                {otp.map((value, index) => (
                                    <input
                                        key={index}
                                        ref={(el) => (inputRefs.current[index] = el)}
                                        type="text"
                                        value={value}
                                        onChange={(e) => handleOtpChange(e, index)}
                                        onKeyDown={(e) => handleOtpKeyDown(e, index)}
                                        maxLength="1"
                                        className="w-12 h-12 text-center border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
                                    />
                                ))}
                            </div>
                            <input
                                type="password"
                                placeholder='New Password'
                                className='p-3 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500'
                                required
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                            />
                            <button 
                                type="submit"
                                className='bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition duration-200 w-full'
                            >
                                Reset Password
                            </button>
                        </form>
                        <div className="text-center mt-4">
                            <p className="text-gray-600">
                                Didn't receive the OTP?{" "}
                                <button
                                    className="text-blue-600 hover:underline"
                                    onClick={resendOtp}
                                >
                                    Resend OTP
                                </button>
                            </p>
                        </div>
                    </>
                )}
            </div>
        </div>
    )
}

export default ResetPassword