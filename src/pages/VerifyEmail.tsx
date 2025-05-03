
import React from "react";
import AuthLayout from "../components/layout/AuthLayout";
import VerifyEmailComponent from "../components/auth/VerifyEmail";

const VerifyEmail: React.FC = () => {
  return (
    <AuthLayout
      title="Email Verification"
      subtitle="Please verify your email to continue"
    >
      <VerifyEmailComponent />
    </AuthLayout>
  );
};

export default VerifyEmail;
