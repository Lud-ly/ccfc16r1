// src/Section/components/Loader.tsx

import React from 'react';

const Loader: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="100"
        height="100"
        viewBox="0 0 100 100"
        className="animate-spin"
      >
        <circle
          cx="50"
          cy="50"
          r="45"
          stroke="green"
          strokeWidth="5"
          fill="none"
        />
        <circle
          cx="50"
          cy="50"
          r="35"
          stroke="#007bff"
          strokeWidth="5"
          fill="none"
          strokeDasharray="90, 150"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
};

export default Loader;
