
import React from "react";

const KycInfoSection: React.FC = () => {
  return (
    <div className="mt-6">
      <h4 className="text-sm font-medium mb-2">Why is KYC required?</h4>
      <p className="text-sm text-gray-600">
        KYC verification helps us comply with financial regulations and protect our users from fraud. 
        By verifying your identity, we can provide you with secure access to all our services.
      </p>
      
      <h4 className="text-sm font-medium mt-4 mb-2">What happens after submission?</h4>
      <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
        <li>Our compliance team will review your documents</li>
        <li>You'll receive a notification when your KYC is approved or rejected</li>
        <li>If approved, you'll gain access to all platform features</li>
        <li>If rejected, you'll be asked to resubmit with corrections</li>
      </ul>
    </div>
  );
};

export default KycInfoSection;
