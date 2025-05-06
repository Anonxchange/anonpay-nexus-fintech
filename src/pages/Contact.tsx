
import React from "react";
import AppLayout from "../components/layout/AppLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { Mail, Phone, MapPin, Clock } from "lucide-react";

const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  subject: z.string().min(5, { message: "Subject must be at least 5 characters." }),
  message: z.string().min(10, { message: "Message must be at least 10 characters." }),
});

const Contact: React.FC = () => {
  const { toast } = useToast();
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    // In a real application, this would send the data to a backend API
    toast({
      title: "Message Sent",
      description: "Thank you for your message. We'll get back to you shortly.",
    });
    form.reset();
  }

  return (
    <AppLayout title="Contact Us">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Get in Touch</h1>
          <p className="text-gray-600 max-w-lg mx-auto">
            Have questions or need assistance? Our team is here to help you with any inquiries.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                  <Phone className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-medium">Phone</h3>
                  <p className="text-gray-600 text-sm mt-1">+234 (0) 801 234 5678</p>
                  <p className="text-gray-600 text-sm">+234 (0) 901 234 5678</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                  <Mail className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-medium">Email</h3>
                  <p className="text-gray-600 text-sm mt-1">support@anonpay.com</p>
                  <p className="text-gray-600 text-sm">info@anonpay.com</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                  <Clock className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-medium">Working Hours</h3>
                  <p className="text-gray-600 text-sm mt-1">Monday - Friday: 9am - 6pm</p>
                  <p className="text-gray-600 text-sm">Saturday: 10am - 3pm</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Send Us a Message</CardTitle>
                <CardDescription>
                  Fill out the form below and our team will get back to you as soon as possible.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Full Name</FormLabel>
                            <FormControl>
                              <Input placeholder="John Doe" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email Address</FormLabel>
                            <FormControl>
                              <Input placeholder="john@example.com" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <FormField
                      control={form.control}
                      name="subject"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Subject</FormLabel>
                          <FormControl>
                            <Input placeholder="How can we help you?" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="message"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Message</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Write your message here..."
                              rows={5}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <Button type="submit" className="w-full">Send Message</Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </div>
          
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold mb-4">Our Office</h2>
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-start space-x-4">
                    <div className="pt-1">
                      <MapPin className="h-5 w-5 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-gray-600">
                        123 Victoria Island Way<br />
                        Victoria Island<br />
                        Lagos, Nigeria
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div>
              <h2 className="text-xl font-semibold mb-4">Frequently Asked Questions</h2>
              <div className="space-y-4">
                <details className="group bg-white p-4 rounded-lg border">
                  <summary className="font-medium cursor-pointer list-none flex justify-between items-center">
                    How secure is AnonPay?
                    <span className="text-purple-600">+</span>
                  </summary>
                  <div className="mt-2 text-gray-600 text-sm">
                    AnonPay employs industry-standard security measures, including 256-bit encryption, two-factor authentication, and regular security audits to ensure your financial information and transactions remain secure.
                  </div>
                </details>
                
                <details className="group bg-white p-4 rounded-lg border">
                  <summary className="font-medium cursor-pointer list-none flex justify-between items-center">
                    How long do transactions take to process?
                    <span className="text-purple-600">+</span>
                  </summary>
                  <div className="mt-2 text-gray-600 text-sm">
                    Most transactions are processed instantly or within minutes. However, cryptocurrency transactions may take longer depending on blockchain confirmation times.
                  </div>
                </details>
                
                <details className="group bg-white p-4 rounded-lg border">
                  <summary className="font-medium cursor-pointer list-none flex justify-between items-center">
                    What payment methods do you accept?
                    <span className="text-purple-600">+</span>
                  </summary>
                  <div className="mt-2 text-gray-600 text-sm">
                    We accept bank transfers, cryptocurrency deposits, and other local payment methods. Check our payment page for a complete list of accepted payment methods.
                  </div>
                </details>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default Contact;
