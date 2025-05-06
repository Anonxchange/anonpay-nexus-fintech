
import React from "react";
import AppLayout from "../components/layout/AppLayout";

const About: React.FC = () => {
  return (
    <AppLayout title="About Us">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white p-8 rounded-lg shadow-sm">
          <h2 className="text-3xl font-bold mb-6">Our Story</h2>
          <p className="text-gray-700 mb-6">
            Founded in 2023, AnonPay was born out of a simple vision: to create a secure, 
            transparent, and accessible platform for crypto and gift card transactions in Africa 
            and beyond. What began as a solution to the challenges faced by users in 
            cryptocurrency and gift card exchanges has grown into a comprehensive financial 
            technology platform serving thousands of customers.
          </p>

          <h3 className="text-2xl font-semibold mb-4 mt-8">Our Mission</h3>
          <p className="text-gray-700 mb-6">
            To provide a seamless, secure, and user-friendly platform for cryptocurrency 
            and gift card transactions while ensuring maximum value for our users through 
            competitive rates and exceptional service.
          </p>

          <h3 className="text-2xl font-semibold mb-4 mt-8">Our Values</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="bg-gray-50 p-6 rounded-lg">
              <h4 className="font-bold mb-2">Security</h4>
              <p className="text-gray-700">
                We prioritize the security of your transactions and personal information above all else. 
                Our platform incorporates industry-leading security measures to protect our users.
              </p>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg">
              <h4 className="font-bold mb-2">Transparency</h4>
              <p className="text-gray-700">
                We believe in complete transparency in our operations, rates, and policies. 
                You'll always know what to expect with AnonPay.
              </p>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg">
              <h4 className="font-bold mb-2">Innovation</h4>
              <p className="text-gray-700">
                We continuously strive to improve our platform and services through 
                technological innovation and user feedback.
              </p>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg">
              <h4 className="font-bold mb-2">Customer-Centric</h4>
              <p className="text-gray-700">
                Our users are at the heart of everything we do. We're committed to providing 
                exceptional service and support.
              </p>
            </div>
          </div>

          <h3 className="text-2xl font-semibold mb-4 mt-8">Our Team</h3>
          <p className="text-gray-700 mb-6">
            AnonPay is powered by a diverse team of experts in blockchain technology, 
            cybersecurity, finance, and customer service. With years of combined experience, 
            our team works tirelessly to ensure the best possible experience for our users.
          </p>
        </div>
      </div>
    </AppLayout>
  );
};

export default About;
