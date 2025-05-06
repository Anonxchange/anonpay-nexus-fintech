
import React from "react";
import AppLayout from "../components/layout/AppLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { MapPin, Phone, Mail, MessageSquare } from "lucide-react";

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  subject: z.string().min(5, "Subject must be at least 5 characters"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

const Contact = () => {
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

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    console.log(values);
    toast({
      title: "Message sent",
      description: "We'll get back to you as soon as possible.",
    });
    form.reset();
  };

  return (
    <AppLayout title="Contact Us">
      <div className="container mx-auto py-8">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold">Contact Us</CardTitle>
            <CardDescription>Got questions? We're here to help!</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <MapPin className="h-5 w-5 text-anonpay-primary mt-0.5" />
                  <div>
                    <h3 className="font-semibold">Address</h3>
                    <p className="text-gray-600">Benin City, Nigeria</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <Phone className="h-5 w-5 text-anonpay-primary mt-0.5" />
                  <div>
                    <h3 className="font-semibold">Phone</h3>
                    <p className="text-gray-600">+234 814 683 3604 (Calls)</p>
                    <p className="text-gray-600">+234 813 447 8949 (WhatsApp)</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <Mail className="h-5 w-5 text-anonpay-primary mt-0.5" />
                  <div>
                    <h3 className="font-semibold">Email</h3>
                    <p className="text-gray-600">support@anonpay.com</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <MessageSquare className="h-5 w-5 text-anonpay-primary mt-0.5" />
                  <div>
                    <h3 className="font-semibold">Customer Support</h3>
                    <p className="text-gray-600">
                      Our customer support team is available 24/7 to assist you
                      with any questions or issues.
                    </p>
                  </div>
                </div>
              </div>

              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Your name" {...field} />
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
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input placeholder="Your email" type="email" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="subject"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Subject</FormLabel>
                        <FormControl>
                          <Input placeholder="Message subject" {...field} />
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
                            placeholder="How can we help you?"
                            className="min-h-[120px]"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button type="submit" className="w-full">
                    Send Message
                  </Button>
                </form>
              </Form>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default Contact;
