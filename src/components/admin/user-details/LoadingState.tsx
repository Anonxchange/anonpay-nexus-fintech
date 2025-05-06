
import React from "react";

const LoadingState: React.FC = () => {
  return (
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-anonpay-primary"></div>
      <span className="ml-2">Loading user details...</span>
    </div>
  );
};

export default LoadingState;
