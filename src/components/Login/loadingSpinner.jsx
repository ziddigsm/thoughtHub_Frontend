import React from 'react';

const LoadingSpinner = () => (
  <div className="col-span-full flex flex-col items-center justify-center min-h-[400px]">
    <div className="w-20 h-20 border-4 border-white border-t-[#198b91] rounded-full animate-spin"></div>
    <p className="mt-4 text-gray-600 text-lg">Loading posts...</p>
  </div>
);

export default LoadingSpinner;
