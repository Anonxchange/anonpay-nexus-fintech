
import React from "react";
import AppLayout from "../components/layout/AppLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const About = () => {
  return (
    <AppLayout title="About Us">
      <div className="container mx-auto py-8">
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-3xl font-bold">About AnonPay</CardTitle>
            <CardDescription>Learn more about our company and mission</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-lg">
              AnonPay is a leading fintech company specializing in secure cryptocurrency transactions
              and gift card exchanges. Our platform is designed to provide users with a seamless experience
              for managing digital assets and making transactions.
            </p>
            
            <h2 className="text-xl font-semibold mt-6">Our Team</h2>
            <div className="grid md:grid-cols-1 gap-6 mt-4">
              <div className="flex flex-col items-center md:items-start md:flex-row gap-4">
                <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                  <img 
                    src="/placeholder.svg" 
                    alt="CEO" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="text-center md:text-left">
                  <h3 className="text-xl font-semibold">Olamide Oluwole</h3>
                  <p className="text-gray-500">Chief Executive Officer</p>
                  <p className="mt-2">
                    With a passion for blockchain technology and financial inclusion, Olamide leads
                    AnonPay with a vision to make cryptocurrency transactions accessible to everyone.
                    His expertise in fintech and digital payments has been instrumental in the growth
                    and success of AnonPay.
                  </p>
                </div>
              </div>
            </div>
            
            <h2 className="text-xl font-semibold mt-6">Our Mission</h2>
            <p>
              At AnonPay, we're committed to providing a secure, reliable, and user-friendly platform
              for cryptocurrency transactions and gift card exchanges. We believe in financial inclusion
              and aim to make digital asset management accessible to everyone.
            </p>
            
            <h2 className="text-xl font-semibold mt-6">Our Values</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong>Security:</strong> We prioritize the security of our users' funds and personal information.</li>
              <li><strong>Transparency:</strong> We believe in being open and honest in all our operations.</li>
              <li><strong>Innovation:</strong> We continuously strive to improve our services and adopt new technologies.</li>
              <li><strong>User Experience:</strong> We focus on creating a seamless and intuitive platform for our users.</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default About;
