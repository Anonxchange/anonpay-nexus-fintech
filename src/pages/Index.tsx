
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "../contexts/auth";
import { ArrowRight, ShieldCheck, CreditCard, Gift, Phone } from "lucide-react";

const Index: React.FC = () => {
  const { user } = useAuth();
  
  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <header className="bg-gradient-primary text-white">
        <div className="container mx-auto px-4 py-16 md:py-24">
          <div className="flex flex-col md:flex-row gap-8 items-center">
            <div className="flex-1 space-y-6">
              <h1 className="text-4xl md:text-5xl font-bold leading-tight">
                Your Ultimate Fintech Solution in Nigeria
              </h1>
              <p className="text-lg md:text-xl text-white/80">
                Buy and sell crypto, trade gift cards, and access VTU services all in one place. 
                Experience seamless transactions with AnonPay.
              </p>
              <div className="pt-4 flex flex-wrap gap-4">
                {user ? (
                  <Button size="lg" asChild className="bg-white text-anonpay-primary hover:bg-white/90">
                    <Link to="/dashboard">
                      Go to Dashboard
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                ) : (
                  <>
                    <Button size="lg" asChild className="bg-white text-anonpay-primary hover:bg-white/90">
                      <Link to="/signup">
                        Get Started
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                    <Button size="lg" variant="outline" asChild className="border-white text-white hover:bg-white/10">
                      <Link to="/login">
                        Login
                      </Link>
                    </Button>
                  </>
                )}
              </div>
            </div>
            <div className="flex-1 hidden md:block">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
                {/* Mockup of AnonPay interface */}
                <div className="bg-white rounded-md p-4 shadow-lg">
                  <div className="mb-4 text-anonpay-primary text-lg font-bold text-left">
                    AnonPay
                  </div>
                  <div className="bg-gradient-to-r from-anonpay-primary to-anonpay-secondary p-4 rounded-md text-white text-left mb-3">
                    <div className="text-sm opacity-80">Wallet Balance</div>
                    <div className="text-2xl font-bold">₦125,000.00</div>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="bg-gray-100 p-3 rounded-md flex flex-col items-center">
                      <CreditCard className="h-5 w-5 text-anonpay-secondary mb-1" />
                      <span className="text-xs text-gray-700">Crypto</span>
                    </div>
                    <div className="bg-gray-100 p-3 rounded-md flex flex-col items-center">
                      <Gift className="h-5 w-5 text-anonpay-secondary mb-1" />
                      <span className="text-xs text-gray-700">Gift Cards</span>
                    </div>
                    <div className="bg-gray-100 p-3 rounded-md flex flex-col items-center">
                      <Phone className="h-5 w-5 text-anonpay-secondary mb-1" />
                      <span className="text-xs text-gray-700">VTU</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>
      
      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Why Choose AnonPay?</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              We offer a comprehensive suite of financial services designed to meet your needs
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="p-6 border rounded-xl bg-white shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-anonpay-primary/10 rounded-full flex items-center justify-center mb-4">
                <ShieldCheck className="h-6 w-6 text-anonpay-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Secure Transactions</h3>
              <p className="text-gray-600">
                Your security is our priority. All transactions and personal data are protected with industry-standard encryption.
              </p>
            </div>
            
            <div className="p-6 border rounded-xl bg-white shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-anonpay-primary/10 rounded-full flex items-center justify-center mb-4">
                <Gift className="h-6 w-6 text-anonpay-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Gift Card Trading</h3>
              <p className="text-gray-600">
                Buy and sell gift cards at competitive rates. We support Amazon, iTunes, Steam, Google Play, and more.
              </p>
            </div>
            
            <div className="p-6 border rounded-xl bg-white shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-anonpay-primary/10 rounded-full flex items-center justify-center mb-4">
                <CreditCard className="h-6 w-6 text-anonpay-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Cryptocurrency</h3>
              <p className="text-gray-600">
                Trade Bitcoin, USDT, and other cryptocurrencies at the best rates in the market.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Call to Action */}
      <section className="bg-gray-100 py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-gray-600 max-w-2xl mx-auto mb-8">
            Join thousands of satisfied customers who trust AnonPay for their financial needs
          </p>
          {!user && (
            <div className="flex flex-wrap gap-4 justify-center">
              <Button size="lg" asChild>
                <Link to="/signup">Create an Account</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link to="/login">Login</Link>
              </Button>
            </div>
          )}
        </div>
      </section>
      
      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between">
            <div className="mb-6 md:mb-0">
              <div className="text-2xl font-bold mb-4">AnonPay</div>
              <p className="text-gray-400 max-w-xs">
                Your trusted fintech solution for all your crypto, gift card, and VTU needs.
              </p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
              <div>
                <h3 className="text-lg font-semibold mb-4">Services</h3>
                <ul className="space-y-2 text-gray-400">
                  <li><a href="#" className="hover:text-white">Cryptocurrency</a></li>
                  <li><a href="#" className="hover:text-white">Gift Cards</a></li>
                  <li><a href="#" className="hover:text-white">VTU Services</a></li>
                  <li><a href="#" className="hover:text-white">Wallet</a></li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-4">Company</h3>
                <ul className="space-y-2 text-gray-400">
                  <li><a href="#" className="hover:text-white">About Us</a></li>
                  <li><a href="#" className="hover:text-white">Contact</a></li>
                  <li><a href="#" className="hover:text-white">Careers</a></li>
                  <li><a href="#" className="hover:text-white">Blog</a></li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-4">Legal</h3>
                <ul className="space-y-2 text-gray-400">
                  <li><a href="#" className="hover:text-white">Terms of Service</a></li>
                  <li><a href="#" className="hover:text-white">Privacy Policy</a></li>
                  <li><a href="#" className="hover:text-white">KYC Policy</a></li>
                  <li><a href="#" className="hover:text-white">Refund Policy</a></li>
                </ul>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400">&copy; {new Date().getFullYear()} AnonPay. All rights reserved.</p>
            <div className="mt-4 md:mt-0">
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-white">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"></path>
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2c5.514 0 10 4.486 10 10s-4.486 10-10 10-10-4.486-10-10 4.486-10 10-10zm0-2c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm-2 10h-2v2h2v6h3v-6h1.82l.18-2h-2v-.833c0-.478.096-.667.558-.667h1.442v-2.5h-2.404c-1.798 0-2.596.792-2.596 2.308v1.692z"></path>
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"></path>
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
