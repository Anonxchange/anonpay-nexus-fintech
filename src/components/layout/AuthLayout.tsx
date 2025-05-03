
import React from "react";
import { Link } from "react-router-dom";

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children, title, subtitle }) => {
  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Branding panel */}
      <div className="bg-gradient-primary hidden md:flex md:w-1/2 p-8 flex-col justify-between">
        <div>
          <Link to="/" className="text-white text-3xl font-bold">
            AnonPay
          </Link>
          <p className="text-white/80 mt-2">Your trusted fintech solution</p>
        </div>
        
        <div className="space-y-6">
          <div className="bg-white/10 p-4 rounded-lg backdrop-blur-sm">
            <p className="text-white font-medium">Secure Transactions</p>
            <p className="text-white/80 text-sm mt-1">Your data and transactions are encrypted and secure</p>
          </div>
          
          <div className="bg-white/10 p-4 rounded-lg backdrop-blur-sm">
            <p className="text-white font-medium">Competitive Rates</p>
            <p className="text-white/80 text-sm mt-1">Get the best rates for crypto and gift cards</p>
          </div>
        </div>
        
        <div className="text-white/60 text-sm">
          &copy; {new Date().getFullYear()} AnonPay. All rights reserved.
        </div>
      </div>
      
      {/* Auth form panel */}
      <div className="flex-1 flex flex-col items-center justify-center p-6">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="md:hidden mb-6">
              <Link to="/" className="text-anonpay-primary text-3xl font-bold">
                AnonPay
              </Link>
            </div>
            <h1 className="text-2xl font-bold">{title}</h1>
            {subtitle && <p className="text-gray-600 mt-2">{subtitle}</p>}
          </div>
          
          {children}
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
