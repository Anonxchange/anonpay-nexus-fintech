
import React from "react";
import AuthLayout from "../components/layout/AuthLayout";
import SignUpForm from "../components/auth/SignUpForm";

const SignUp: React.FC = () => {
  return (
    <AuthLayout
      title="Create an account"
      subtitle="Sign up for AnonPay to access all features"
    >
      <SignUpForm />
    </AuthLayout>
  );
};

export default SignUp;
