import React from 'react';
import { useAuth } from '../context/useAuth';
import bgImage from '../assets/bg_img.png';
import robortImage from '../assets/header_img.png';
import handWaveImage from '../assets/hand_wave.png';
import { useEffect } from 'react';

const Home = () => {
  const { user, isAccountVerified } = useAuth();
  return (
    <div 
      className="min-h-screen bg-cover bg-center bg-no-repeat py-8 px-4"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <div className="max-w-6xl mx-auto">
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-8 mb-8">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center space-x-6 mb-4 md:mb-0">
              <img 
                src={robortImage} 
                alt="Robot" 
                className="w-20 h-20 object-contain"
              />
              <div>
                <div className="flex items-center space-x-3">
                  <h1 className="text-4xl font-bold text-gray-800">
                    Hello, {user?.name || 'User'}!
                  </h1>
                  <img 
                    src={handWaveImage} 
                    alt="Hand Wave" 
                    className="w-8 h-8 animate-wave"
                  />
                </div>
                <p className="text-gray-600 text-lg mt-2">
                  {user?.email && `Welcome back to your account - ${user.email}`}
                </p>
              </div>
            </div>
            <div className="flex flex-col items-end space-y-3">
              {isAccountVerified ? (
                <div className="flex items-center bg-green-100 text-green-800 px-4 py-2 rounded-full">
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Verified Account
                </div>
              ) : (
                <div className="flex items-center bg-yellow-100 text-yellow-800 px-4 py-2 rounded-full">
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  Verification Required
                </div>
              )}
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold border-4 border-white shadow-lg">
                {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add CSS for wave animation */}
      <style jsx>{`
        @keyframes wave {
          0%, 100% { transform: rotate(0deg); }
          25% { transform: rotate(15deg); }
          75% { transform: rotate(-15deg); }
        }
        .animate-wave {
          animation: wave 1s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default Home;