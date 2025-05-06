
import React, { useState } from "react";
import AppLayout from "@/components/layout/AppLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

const Careers: React.FC = () => {
  const { toast } = useToast();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [position, setPosition] = useState("");
  const [message, setMessage] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      toast({
        title: "Application Submitted",
        description: "Thank you for your interest! We'll review your application and get back to you soon.",
      });
      
      setName("");
      setEmail("");
      setPosition("");
      setMessage("");
      setFile(null);
      setIsSubmitting(false);
    }, 1500);
  };

  const openPositions = [
    {
      title: "Senior Fullstack Developer",
      department: "Technology",
      type: "Full-time",
      location: "Lagos, Nigeria (Hybrid)"
    },
    {
      title: "Customer Support Specialist",
      department: "Operations",
      type: "Full-time",
      location: "Remote (Nigeria)"
    },
    {
      title: "Finance & Compliance Officer",
      department: "Finance",
      type: "Full-time",
      location: "Lagos, Nigeria"
    }
  ];

  return (
    <AppLayout title="Careers">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto mb-10 text-center">
          <h1 className="text-3xl font-bold mb-4">Join Our Team</h1>
          <p className="text-gray-600">
            We're looking for talented individuals passionate about fintech and cryptocurrency to help build the future of financial services in Africa.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div>
            <h2 className="text-2xl font-bold mb-6">Why Work With Us</h2>
            <ul className="space-y-4">
              <li className="flex gap-3">
                <div className="bg-purple-100 rounded-full p-2 h-8 w-8 flex items-center justify-center text-purple-600">1</div>
                <div>
                  <h3 className="font-semibold">Innovative Environment</h3>
                  <p className="text-gray-600">Be part of a team shaping the future of fintech in Africa</p>
                </div>
              </li>
              <li className="flex gap-3">
                <div className="bg-purple-100 rounded-full p-2 h-8 w-8 flex items-center justify-center text-purple-600">2</div>
                <div>
                  <h3 className="font-semibold">Growth Opportunities</h3>
                  <p className="text-gray-600">Continuous learning and career advancement</p>
                </div>
              </li>
              <li className="flex gap-3">
                <div className="bg-purple-100 rounded-full p-2 h-8 w-8 flex items-center justify-center text-purple-600">3</div>
                <div>
                  <h3 className="font-semibold">Competitive Compensation</h3>
                  <p className="text-gray-600">Attractive salary and benefits package</p>
                </div>
              </li>
              <li className="flex gap-3">
                <div className="bg-purple-100 rounded-full p-2 h-8 w-8 flex items-center justify-center text-purple-600">4</div>
                <div>
                  <h3 className="font-semibold">Flexible Work Environment</h3>
                  <p className="text-gray-600">Remote and hybrid options available</p>
                </div>
              </li>
            </ul>
          </div>
          
          <div className="bg-gray-50 p-6 rounded-lg">
            <h2 className="text-2xl font-bold mb-4">Open Positions</h2>
            {openPositions.map((job, index) => (
              <div key={index} className="mb-4 bg-white p-4 rounded-lg shadow-sm">
                <h3 className="font-bold">{job.title}</h3>
                <div className="text-sm text-gray-600 mt-1">
                  <p>{job.department} • {job.type}</p>
                  <p>{job.location}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>Submit Your Application</CardTitle>
            <CardDescription>
              Don't see a position that matches your skills? Send us your CV anyway!
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input 
                    id="name" 
                    value={name} 
                    onChange={(e) => setName(e.target.value)} 
                    required 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                    required 
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="position">Position of Interest</Label>
                <Input 
                  id="position" 
                  value={position} 
                  onChange={(e) => setPosition(e.target.value)} 
                  placeholder="E.g., Developer, Designer, Product Manager" 
                  required 
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="message">Cover Letter / Message</Label>
                <Textarea 
                  id="message" 
                  value={message} 
                  onChange={(e) => setMessage(e.target.value)} 
                  placeholder="Tell us about yourself and why you're interested in joining AnonPay" 
                  rows={5} 
                  required 
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="resume">Upload Resume/CV</Label>
                <Input 
                  id="resume" 
                  type="file" 
                  accept=".pdf,.doc,.docx" 
                  onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)} 
                  required 
                />
                <p className="text-xs text-gray-500">Accepted formats: PDF, DOC, DOCX (Max: 5MB)</p>
              </div>
              
              <div className="flex justify-end">
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Submitting..." : "Submit Application"}
                </Button>
              </div>
            </form>
            
            <div className="mt-8 text-center border-t pt-6">
              <p>You can also email your CV directly to:</p>
              <a href="mailto:careers@anonpay.com" className="text-purple-600 font-medium">
                careers@anonpay.com
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default Careers;
