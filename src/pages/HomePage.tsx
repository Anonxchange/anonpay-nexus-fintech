
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Layout from "@/components/layout/Layout";
import { Bitcoin, Gift, Phone, Shield, Zap, Users } from "lucide-react";

const HomePage: React.FC = () => {
  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <section className="py-20 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Your Trusted <span className="text-primary">Fintech</span> Solution
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Trade cryptocurrency, exchange gift cards, and purchase VTU services with ease. 
            Secure, fast, and reliable financial transactions in Nigeria.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/signup">
              <Button size="lg" className="w-full sm:w-auto">
                Get Started
              </Button>
            </Link>
            <Link to="/login">
              <Button variant="outline" size="lg" className="w-full sm:w-auto">
                Sign In
              </Button>
            </Link>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20">
          <h2 className="text-3xl font-bold text-center mb-12">Our Services</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <Bitcoin className="h-12 w-12 text-primary mb-4" />
                <CardTitle>Cryptocurrency Trading</CardTitle>
                <CardDescription>
                  Buy and sell Bitcoin, Ethereum, and other cryptocurrencies at competitive rates
                </CardDescription>
              </CardHeader>
            </Card>
            
            <Card>
              <CardHeader>
                <Gift className="h-12 w-12 text-primary mb-4" />
                <CardTitle>Gift Card Exchange</CardTitle>
                <CardDescription>
                  Convert your gift cards to cash instantly with our secure exchange platform
                </CardDescription>
              </CardHeader>
            </Card>
            
            <Card>
              <CardHeader>
                <Phone className="h-12 w-12 text-primary mb-4" />
                <CardTitle>VTU Services</CardTitle>
                <CardDescription>
                  Purchase airtime, data, and utility bills conveniently through our platform
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </section>

        {/* Why Choose Us Section */}
        <section className="py-20 bg-gray-100 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">Why Choose AnonPay?</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <Shield className="h-16 w-16 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Secure & Safe</h3>
                <p className="text-gray-600">
                  Your transactions and data are protected with bank-level security
                </p>
              </div>
              
              <div className="text-center">
                <Zap className="h-16 w-16 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Fast Processing</h3>
                <p className="text-gray-600">
                  Quick processing times to get your transactions completed instantly
                </p>
              </div>
              
              <div className="text-center">
                <Users className="h-16 w-16 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">24/7 Support</h3>
                <p className="text-gray-600">
                  Round-the-clock customer support to help you when you need it
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Get Started?</h2>
          <p className="text-xl text-gray-600 mb-8">
            Join thousands of satisfied customers who trust AnonPay for their financial needs
          </p>
          <Link to="/signup">
            <Button size="lg">
              Create Your Account
            </Button>
          </Link>
        </section>
      </div>
    </Layout>
  );
};

export default HomePage;
