import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/auth";
import { 
  ArrowRight, 
  ArrowDown, 
  ShieldCheck, 
  CreditCard, 
  Gift, 
  Phone, 
  Users, 
  BarChart3, 
  CheckCircle, 
  Download, 
  XCircle,
  Sparkles,
  Zap
} from "lucide-react";

const Index: React.FC = () => {
  const { user } = useAuth();
  
  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section - Modern Gradient Background */}
      <header className="bg-gradient-to-br from-purple-600 via-violet-500 to-indigo-600 text-white">
        <div className="container mx-auto px-4 py-20 md:py-28">
          <div className="flex flex-col md:flex-row gap-8 items-center">
            <div className="flex-1 space-y-6">
              {/* Logo and tagline */}
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-white rounded-xl p-3 shadow-xl animate-bounce">
                  <div className="text-2xl">💳</div>
                </div>
                <div className="flex flex-col">
                  <h2 className="text-xl font-bold">AnonPay</h2>
                  <p className="text-sm opacity-90">Secure Crypto & Fintech Solutions</p>
                </div>
              </div>
              
              <div className="inline-block px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium mb-2 animate-pulse">
                🚀 Most trusted fintech platform in Nigeria ✨
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                Your All-in-One <span className="text-amber-300 animate-bounce">Financial</span> Solution 💰
              </h1>
              <p className="text-lg md:text-xl text-white/90 max-w-lg">
                Seamlessly buy and sell crypto 🪙, trade gift cards 🎁, access VTU services 📱, 
                and manage your finances all in one secure platform! 🛡️
              </p>
              <div className="pt-6 flex flex-wrap gap-4">
                {user ? (
                  <Button size="lg" asChild className="bg-white text-purple-600 hover:bg-white/90">
                    <Link to="/dashboard">
                      Go to Dashboard
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                ) : (
                  <>
                    <Button size="lg" asChild className="bg-white text-purple-600 hover:bg-white/90">
                      <Link to="/signup">
                        Create Free Account
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                    <Button size="lg" variant="outline" asChild className="border-white/40 text-white hover:bg-white/10">
                      <Link to="/login">
                        Sign In
                      </Link>
                    </Button>
                  </>
                )}
              </div>
              <div className="flex items-center gap-4 text-sm pt-4">
                <div className="flex items-center">
                  <CheckCircle className="h-4 w-4 mr-1 text-green-300" />
                  <span>Secure Transactions</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-4 w-4 mr-1 text-green-300" />
                  <span>24/7 Support</span>
                </div>
              </div>
            </div>
            <div className="flex-1">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-xl">
                {/* Modern mockup of AnonPay interface */}
                <div className="bg-white rounded-xl p-5 shadow-lg">
                  <div className="mb-4 text-purple-600 text-lg font-bold text-left flex items-center">
                    <div className="w-8 h-8 rounded-lg bg-purple-600 flex items-center justify-center text-white mr-2">A</div>
                    AnonPay
                  </div>
                  <div className="bg-gradient-to-r from-violet-500 to-purple-700 p-5 rounded-xl text-white text-left mb-4 shadow-md">
                    <div className="text-sm opacity-90">Wallet Balance</div>
                    <div className="text-2xl font-bold">₦125,000.00</div>
                    <div className="flex items-center justify-between mt-4">
                      <Button size="sm" variant="outline" className="border-white/30 text-white hover:bg-white/10">
                        <Download className="h-3 w-3 mr-1" />
                        Deposit
                      </Button>
                      <div className="text-xs opacity-80">Updated: Just now</div>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="bg-gray-50 p-3 rounded-xl flex flex-col items-center shadow-sm hover:shadow-md transition-all cursor-pointer">
                      <CreditCard className="h-5 w-5 text-purple-600 mb-1" />
                      <span className="text-xs text-gray-700">Crypto</span>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-xl flex flex-col items-center shadow-sm hover:shadow-md transition-all cursor-pointer">
                      <Gift className="h-5 w-5 text-purple-600 mb-1" />
                      <span className="text-xs text-gray-700">Gift Cards</span>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-xl flex flex-col items-center shadow-sm hover:shadow-md transition-all cursor-pointer">
                      <Phone className="h-5 w-5 text-purple-600 mb-1" />
                      <span className="text-xs text-gray-700">VTU</span>
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t">
                    <div className="flex justify-between items-center text-xs text-gray-600">
                      <div>Recent Activity</div>
                      <Link to="#" className="text-purple-600">View All</Link>
                    </div>
                    <div className="mt-2 space-y-2">
                      <div className="flex justify-between items-center p-2 bg-gray-50 rounded-lg">
                        <div className="flex items-center">
                          <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center mr-2">
                            <ArrowDown className="h-3 w-3 text-green-600" />
                          </div>
                          <div className="text-xs">Deposit</div>
                        </div>
                        <div className="text-xs font-medium text-green-600">+₦10,000</div>
                      </div>
                      <div className="flex justify-between items-center p-2 bg-gray-50 rounded-lg">
                        <div className="flex items-center">
                          <div className="w-6 h-6 rounded-full bg-amber-100 flex items-center justify-center mr-2">
                            <Phone className="h-3 w-3 text-amber-600" />
                          </div>
                          <div className="text-xs">Airtime</div>
                        </div>
                        <div className="text-xs font-medium text-red-600">-₦1,000</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Wave Divider */}
        <div className="relative h-16 md:h-24">
          <svg className="absolute bottom-0 left-0 w-full h-full text-white" viewBox="0 0 1440 100" preserveAspectRatio="none">
            <path d="M0,0 C240,95 480,100 720,85 C960,70 1200,35 1440,80 L1440,100 L0,100 Z" fill="currentColor"></path>
          </svg>
        </div>
      </header>
      
      {/* Stats Section */}
      <section className="py-8 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
            <div className="p-4 text-center hover:scale-105 transition-transform">
              <div className="text-3xl md:text-4xl font-bold text-purple-600">10K+ 😊</div>
              <div className="text-sm text-gray-600">Happy Customers</div>
            </div>
            <div className="p-4 text-center hover:scale-105 transition-transform">
              <div className="text-3xl md:text-4xl font-bold text-purple-600">₦50M+ 📈</div>
              <div className="text-sm text-gray-600">Trading Volume</div>
            </div>
            <div className="p-4 text-center hover:scale-105 transition-transform">
              <div className="text-3xl md:text-4xl font-bold text-purple-600">99.9% ⚡</div>
              <div className="text-sm text-gray-600">Uptime</div>
            </div>
            <div className="p-4 text-center hover:scale-105 transition-transform">
              <div className="text-3xl md:text-4xl font-bold text-purple-600">24/7 🎧</div>
              <div className="text-sm text-gray-600">Customer Support</div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Complete Financial Ecosystem 🌟</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              We've built a comprehensive platform that addresses all your financial needs 💼
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="p-6 rounded-xl bg-white shadow-md hover:shadow-lg transition-shadow border border-gray-100">
              <div className="w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center mb-4">
                <ShieldCheck className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Secure Transactions</h3>
              <p className="text-gray-600">
                Your security is our priority. All transactions and personal data are protected with industry-standard encryption and multi-factor authentication.
              </p>
            </div>
            
            <div className="p-6 rounded-xl bg-white shadow-md hover:shadow-lg transition-shadow border border-gray-100">
              <div className="w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center mb-4">
                <Gift className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Gift Card Trading</h3>
              <p className="text-gray-600">
                Buy and sell gift cards at competitive rates with instant processing. We support Amazon, iTunes, Steam, Google Play, and over 20 other popular brands.
              </p>
            </div>
            
            <div className="p-6 rounded-xl bg-white shadow-md hover:shadow-lg transition-all hover:scale-105 border border-gray-100">
              <div className="w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center mb-4">
                <CreditCard className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Cryptocurrency 💰</h3>
              <p className="text-gray-600">
                Trade Bitcoin, USDT, Ethereum, and other cryptocurrencies at the best rates in the market with lower fees and faster processing times! ⚡
              </p>
            </div>
            
            <div className="p-6 rounded-xl bg-white shadow-md hover:shadow-lg transition-all hover:scale-105 border border-gray-100">
              <div className="w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center mb-4">
                <Phone className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">VTU Services 📱</h3>
              <p className="text-gray-600">
                Easily purchase airtime, data bundles, pay for cable TV subscriptions, and electricity bills at discounted rates! 💸
              </p>
            </div>
            
            <div className="p-6 rounded-xl bg-white shadow-md hover:shadow-lg transition-shadow border border-gray-100">
              <div className="w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center mb-4">
                <BarChart3 className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Real-time Rates</h3>
              <p className="text-gray-600">
                Stay informed with up-to-date exchange rates for cryptocurrencies and gift cards to make smart trading decisions.
              </p>
            </div>
            
            <div className="p-6 rounded-xl bg-white shadow-md hover:shadow-lg transition-shadow border border-gray-100">
              <div className="w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center mb-4">
                <Users className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Dedicated Support</h3>
              <p className="text-gray-600">
                Get access to 24/7 customer support through live chat, email, and phone. Our team is always ready to assist with any questions or concerns.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* How It Works */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">How It Works</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Getting started with AnonPay is simple and straightforward
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center hover:scale-105 transition-transform">
              <div className="w-16 h-16 rounded-full bg-gradient-to-r from-purple-600 to-pink-500 text-white flex items-center justify-center text-2xl font-bold mx-auto mb-4 shadow-lg animate-bounce">1</div>
              <h3 className="text-xl font-semibold mb-2">Create an Account 👤</h3>
              <p className="text-gray-600">
                Sign up in less than 2 minutes with just your email and basic information! ⚡
              </p>
            </div>
            
            <div className="text-center hover:scale-105 transition-transform">
              <div className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-600 to-purple-500 text-white flex items-center justify-center text-2xl font-bold mx-auto mb-4 shadow-lg">
                2
              </div>
              <h3 className="text-xl font-semibold mb-2">Fund Your Wallet 💳</h3>
              <p className="text-gray-600">
                Deposit funds using bank transfer, crypto, or any payment method of your choice! 🏦
              </p>
            </div>
            
            <div className="text-center hover:scale-105 transition-transform">
              <div className="w-16 h-16 rounded-full bg-gradient-to-r from-green-600 to-blue-500 text-white flex items-center justify-center text-2xl font-bold mx-auto mb-4 shadow-lg animate-pulse">3</div>
              <h3 className="text-xl font-semibold mb-2">Start Transacting 🚀</h3>
              <p className="text-gray-600">
                Buy/sell crypto, trade gift cards, purchase airtime, and enjoy our other services! 🎉
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Testimonials */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">What Our Customers Say</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Don't just take our word for it - hear from some of our satisfied customers
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-xl shadow">
              <div className="flex items-center text-yellow-400 mb-4">
                ★★★★★
              </div>
              <p className="text-gray-700 mb-4">
                "AnonPay has made trading gift cards incredibly easy. The rates are competitive and the service is fast. Highly recommended!"
              </p>
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-gray-200 mr-3"></div>
                <div>
                  <div className="font-medium">Sarah Johnson</div>
                  <div className="text-sm text-gray-500">Lagos, Nigeria</div>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow">
              <div className="flex items-center text-yellow-400 mb-4">
                ★★★★★
              </div>
              <p className="text-gray-700 mb-4">
                "I've been using AnonPay for crypto trading for over a year now. The platform is reliable, secure, and the customer support is excellent."
              </p>
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-gray-200 mr-3"></div>
                <div>
                  <div className="font-medium">Michael Adebayo</div>
                  <div className="text-sm text-gray-500">Abuja, Nigeria</div>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow">
              <div className="flex items-center text-yellow-400 mb-4">
                ★★★★★
              </div>
              <p className="text-gray-700 mb-4">
                "The VTU service on AnonPay has saved me so much time and money. I can buy airtime and data at discounted rates without leaving my home."
              </p>
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-gray-200 mr-3"></div>
                <div>
                  <div className="font-medium">Chioma Nwosu</div>
                  <div className="text-sm text-gray-500">Port Harcourt, Nigeria</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Call to Action */}
      <section className="py-16 bg-gradient-to-r from-purple-600 via-pink-500 to-indigo-600 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-pink-500/20 animate-pulse"></div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <h2 className="text-3xl font-bold mb-4">Ready to Get Started? 🚀</h2>
          <p className="text-white/90 max-w-2xl mx-auto mb-8">
            Join thousands of satisfied customers who trust AnonPay for their financial needs! 💯✨
          </p>
          {!user && (
            <div className="flex flex-wrap gap-4 justify-center">
              <Button size="lg" asChild className="bg-white text-purple-600 hover:bg-white/90">
                <Link to="/signup">Create an Account</Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="border-white/40 text-white hover:bg-white/10">
                <Link to="/login">Sign In</Link>
              </Button>
            </div>
          )}
        </div>
      </section>
      
      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between">
            <div className="mb-8 md:mb-0">
              <div className="text-2xl font-bold mb-4">AnonPay</div>
              <p className="text-gray-400 max-w-xs">
                Your trusted fintech solution for all your crypto, gift card, and VTU needs.
              </p>
              <div className="flex space-x-4 mt-4">
                <a href="#" className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors">
                  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"></path>
                  </svg>
                </a>
                <a href="#" className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors">
                  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2c5.514 0 10 4.486 10 10s-4.486 10-10 10-10-4.486-10-10 4.486-10 10-10zm0-2c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm-2 10h-2v2h2v6h3v-6h1.82l.18-2h-2v-.833c0-.478.096-.667.558-.667h1.442v-2.5h-2.404c-1.798 0-2.596.792-2.596 2.308v1.692z"></path>
                  </svg>
                </a>
                <a href="#" className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors">
                  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.689-.073-4.948 0-3.204.013-3.583.07-4.849-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"></path>
                  </svg>
                </a>
              </div>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
              <div>
                <h3 className="text-lg font-semibold mb-4">Services</h3>
                <ul className="space-y-2 text-gray-400">
                  <li><Link to="/services/crypto" className="hover:text-white transition-colors">Cryptocurrency</Link></li>
                  <li><Link to="/services/gift-cards" className="hover:text-white transition-colors">Gift Cards</Link></li>
                  <li><Link to="/services/vtu" className="hover:text-white transition-colors">VTU Services</Link></li>
                  <li><Link to="/services/rate-checker" className="hover:text-white transition-colors">Rate Checker</Link></li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-4">Company</h3>
                <ul className="space-y-2 text-gray-400">
                  <li><Link to="/about" className="hover:text-white transition-colors">About Us</Link></li>
                  <li><Link to="/contact" className="hover:text-white transition-colors">Contact</Link></li>
                  <li><Link to="/careers" className="hover:text-white transition-colors">Careers</Link></li>
                  <li><Link to="/blog" className="hover:text-white transition-colors">Blog</Link></li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-4">Legal</h3>
                <ul className="space-y-2 text-gray-400">
                  <li><Link to="/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
                  <li><Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
                  <li><Link to="/kyc-policy" className="hover:text-white transition-colors">KYC Policy</Link></li>
                  <li><Link to="/refund" className="hover:text-white transition-colors">Refund Policy</Link></li>
                </ul>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400">&copy; {new Date().getFullYear()} AnonPay. All rights reserved.</p>
            <div className="mt-4 md:mt-0 flex items-center space-x-4">
              <Link to="/terms" className="text-gray-400 text-sm hover:text-white transition-colors">Terms</Link>
              <span className="text-gray-700">•</span>
              <Link to="/privacy" className="text-gray-400 text-sm hover:text-white transition-colors">Privacy</Link>
              <span className="text-gray-700">•</span>
              <Link to="/contact" className="text-gray-400 text-sm hover:text-white transition-colors">Support</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
