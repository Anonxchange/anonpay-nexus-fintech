
import React from "react";
import AppLayout from "../components/layout/AppLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Users, Building2, Medal, BarChart, ThumbsUp, Globe } from "lucide-react";

const About: React.FC = () => {
  return (
    <AppLayout title="About Us">
      <div className="max-w-4xl mx-auto">
        <div className="prose prose-lg max-w-none">
          <section className="mb-12">
            <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
            <p className="text-gray-700 mb-4">
              At AnonPay, our mission is to provide accessible, secure, and efficient financial services to everyone in Nigeria and beyond. We aim to bridge the gap between traditional financial systems and the digital economy, making it easier for people to participate in the global marketplace.
            </p>
            <p className="text-gray-700">
              We believe that financial services should be accessible to all, regardless of location or background. Our platform is designed to be user-friendly, secure, and reliable, providing our customers with the tools they need to manage their finances effectively.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-3xl font-bold mb-6">Our Story</h2>
            <div className="bg-gray-50 p-6 rounded-xl mb-6">
              <p className="text-gray-700 mb-4">
                AnonPay was founded in 2020 by a team of financial technology experts who recognized the challenges faced by Nigerians in accessing global financial services. Starting with just cryptocurrency trading, we quickly expanded our offerings to include gift card trading, virtual top-up services, and more.
              </p>
              <p className="text-gray-700">
                What began as a small startup has now grown into a trusted financial platform serving thousands of customers across Nigeria. Through dedication to security, customer satisfaction, and continuous innovation, we've built a reputation for reliability and excellence in the Nigerian fintech sector.
              </p>
            </div>
          </section>
          
          <section className="mb-12">
            <h2 className="text-3xl font-bold mb-6">Our Values</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-start mb-2">
                    <div className="mr-3 mt-1">
                      <Users className="h-5 w-5 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="font-medium text-lg">Customer First</h3>
                      <p className="text-gray-600 text-sm mt-1">
                        We prioritize our customers' needs and are committed to providing exceptional service.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-start mb-2">
                    <div className="mr-3 mt-1">
                      <ThumbsUp className="h-5 w-5 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="font-medium text-lg">Integrity</h3>
                      <p className="text-gray-600 text-sm mt-1">
                        We conduct our business with honesty, transparency, and ethical practices.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-start mb-2">
                    <div className="mr-3 mt-1">
                      <Building2 className="h-5 w-5 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="font-medium text-lg">Innovation</h3>
                      <p className="text-gray-600 text-sm mt-1">
                        We continuously strive to improve our services and embrace new technologies.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-start mb-2">
                    <div className="mr-3 mt-1">
                      <Medal className="h-5 w-5 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="font-medium text-lg">Excellence</h3>
                      <p className="text-gray-600 text-sm mt-1">
                        We are committed to excellence in everything we do, from customer service to platform security.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-start mb-2">
                    <div className="mr-3 mt-1">
                      <BarChart className="h-5 w-5 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="font-medium text-lg">Reliability</h3>
                      <p className="text-gray-600 text-sm mt-1">
                        We build systems and processes that our customers can depend on consistently.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-start mb-2">
                    <div className="mr-3 mt-1">
                      <Globe className="h-5 w-5 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="font-medium text-lg">Inclusivity</h3>
                      <p className="text-gray-600 text-sm mt-1">
                        We aim to make financial services accessible to everyone, regardless of background.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>
          
          <section className="mb-12">
            <h2 className="text-3xl font-bold mb-6">Leadership Team</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-32 h-32 rounded-full bg-gray-200 mx-auto mb-4"></div>
                <h3 className="font-semibold text-lg">John Doe</h3>
                <p className="text-gray-600 text-sm">Co-founder & CEO</p>
              </div>
              
              <div className="text-center">
                <div className="w-32 h-32 rounded-full bg-gray-200 mx-auto mb-4"></div>
                <h3 className="font-semibold text-lg">Jane Smith</h3>
                <p className="text-gray-600 text-sm">Co-founder & CTO</p>
              </div>
              
              <div className="text-center">
                <div className="w-32 h-32 rounded-full bg-gray-200 mx-auto mb-4"></div>
                <h3 className="font-semibold text-lg">Michael Johnson</h3>
                <p className="text-gray-600 text-sm">Chief Operations Officer</p>
              </div>
            </div>
          </section>
          
          <section>
            <h2 className="text-3xl font-bold mb-6">Our Achievements</h2>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              <li>Processed over ₦1 billion in transactions since inception</li>
              <li>Expanded customer base to over 10,000 users across Nigeria</li>
              <li>Maintained 99.9% uptime for our platform</li>
              <li>Named "Most Innovative Fintech" by Nigerian Tech Awards 2022</li>
              <li>Featured in leading business publications including BusinessDay and TechCabal</li>
            </ul>
          </section>
        </div>
      </div>
    </AppLayout>
  );
};

export default About;
