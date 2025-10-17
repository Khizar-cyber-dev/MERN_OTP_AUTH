import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/useAuth';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';

const VerifyAccount = () => {
  const { user, verifyOtp, sendVerificationOtp, isAccountVerified } = useAuth();
  const navigate = useNavigate();

  if(!user){
    navigate('/'); 
  }

  useEffect(() => {
    if (isAccountVerified) {
      navigate('/');
    }
  }, [isAccountVerified, navigate]);

  const otpInputsNumber = 6;
  const [otp, setOtp] = useState(new Array(otpInputsNumber).fill(""));
  const inputRefs = useRef([]);

  const handleChange = (event, index) => {
    const value = event.target.value;
    if (!/^[0-9]?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < otpInputsNumber - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (event, index) => {
    if (event.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const verifyTheOtp = async () => {
    try {
      const enteredOtp = otp.join("");
      console.log("Entered OTP:", enteredOtp);

      const response = await verifyOtp(enteredOtp);

      if (response?.success) {
        navigate('/home');
        return;
      }
      toast.error(response?.message || 'Invalid OTP. Please try again.');
    } catch (err) {
      console.error("Error verifying OTP:", err);
      toast.error("Error verifying OTP. Please try again.");
    }
  };

  const resendOtp = () => {
    setOtp(new Array(otpInputsNumber).fill(""));
    sendVerificationOtp();
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-center mt-10">Verify Your Account</h1>

      <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-lg flex flex-col items-center">
        <div className="text-center bg-blue-600 w-full rounded-lg p-4 mb-6">
          <h2 className="text-white text-lg font-semibold">
            Enter the OTP sent to your email to verify your account.
          </h2>
        </div>

        <div className="mb-4 flex justify-center">
          {otp.map((value, index) => (
            <input
              key={index}
              ref={(el) => (inputRefs.current[index] = el)}
              type="text"
              value={value}
              onChange={(e) => handleChange(e, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              maxLength="1"
              className="w-12 h-12 text-center border border-gray-300 rounded-lg mx-1 focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
            />
          ))}
        </div>

        <div className="mt-6">
          <button
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition duration-200"
            onClick={verifyTheOtp}
          >
            Verify Account
          </button>
        </div>

        <div className="text-center mt-4">
          <p className="text-gray-600">
            Didn’t receive the OTP?{" "}
            <button
              className="text-blue-600 hover:underline"
              onClick={resendOtp}
            >
              Resend OTP
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default VerifyAccount;
