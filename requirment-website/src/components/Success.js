import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const Success = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { task } = location.state || {};

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full mx-auto">
        <div className="bg-white rounded-lg shadow-xl p-8">
          {/* Success Icon */}
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
            <svg
              className="h-6 w-6 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>

          {/* Title */}
          <h2 className="text-center text-3xl font-extrabold text-gray-900 mb-6">
            Registration Successful!
          </h2>

          {/* Task Content */}
          {task ? (
            <div className="space-y-4">
              <p className="text-lg text-gray-700 font-medium">
                Your assigned task:
              </p>
              <blockquote className="bg-gray-50 p-4 rounded-lg border-l-4 border-indigo-500 text-gray-700">
                {task}
              </blockquote>
            </div>
          ) : (
            <p className="text-gray-600 text-center">
              No task assigned. Please contact support.
            </p>
          )}

          {/* Back Button */}
          <button
            onClick={() => navigate('/')}
            className="mt-8 w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
          >
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default Success;