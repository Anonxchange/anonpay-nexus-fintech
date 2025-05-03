
import React from 'react';
import AuthLayout from '../components/layout/AuthLayout';
import ResetPasswordForm from '../components/auth/ResetPasswordForm';

const ResetPassword: React.FC = () => {
  return (
    <AuthLayout
      title="Set new password"
      subtitle="Create a new password for your account"
    >
      <ResetPasswordForm />
    </AuthLayout>
  );
};

export default ResetPassword;
