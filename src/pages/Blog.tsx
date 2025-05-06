
import React from "react";
import AppLayout from "@/components/layout/AppLayout";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "lucide-react";

const Blog: React.FC = () => {
  return (
    <AppLayout title="Blog">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto mb-10 text-center">
          <h1 className="text-3xl font-bold mb-4">AnonPay Blog</h1>
          <p className="text-gray-600">
            Stay updated with the latest news, trends, and insights in cryptocurrency, gift cards, and fintech.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <Card className="overflow-hidden">
            <div className="h-48 bg-gray-200 flex items-center justify-center">
              <span className="text-gray-500">Coming Soon</span>
            </div>
            <CardHeader>
              <CardTitle>Upcoming Article: The Future of Cryptocurrency in Nigeria</CardTitle>
              <CardDescription>
                <div className="flex items-center gap-2 text-gray-500">
                  <Calendar className="h-4 w-4" />
                  <span>Coming soon</span>
                </div>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p>
                We'll be exploring how cryptocurrency is reshaping the financial landscape in Nigeria and what opportunities it presents for businesses and individuals.
              </p>
            </CardContent>
            <CardFooter>
              <Button variant="ghost" disabled>Read More</Button>
            </CardFooter>
          </Card>

          <Card className="overflow-hidden">
            <div className="h-48 bg-gray-200 flex items-center justify-center">
              <span className="text-gray-500">Coming Soon</span>
            </div>
            <CardHeader>
              <CardTitle>Upcoming Article: Gift Card Trading: Tips and Best Practices</CardTitle>
              <CardDescription>
                <div className="flex items-center gap-2 text-gray-500">
                  <Calendar className="h-4 w-4" />
                  <span>Coming soon</span>
                </div>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p>
                Learn how to get the best rates when trading gift cards and avoid common pitfalls in the market.
              </p>
            </CardContent>
            <CardFooter>
              <Button variant="ghost" disabled>Read More</Button>
            </CardFooter>
          </Card>
        </div>

        <div className="text-center p-10 bg-gray-50 rounded-lg">
          <h2 className="text-2xl font-bold mb-4">Subscribe to Our Blog</h2>
          <p className="mb-6 text-gray-600">
            More articles coming soon! Subscribe to get notified when new content is published.
          </p>
          <div className="flex max-w-md mx-auto">
            <input type="email" placeholder="Enter your email" className="flex-1 px-4 py-2 rounded-l-md border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-600" />
            <Button className="rounded-l-none">Subscribe</Button>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default Blog;
