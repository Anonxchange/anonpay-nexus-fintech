
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { LogIn, Shield } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

// Admin credentials - in a real application, these would be stored and verified securely
const ADMIN_EMAIL = "admin@anonpay.com";
const ADMIN_PASSWORD = "Admin@123456";

const AdminLogin: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Check if admin is already logged in
  useEffect(() => {
    const adminData = localStorage.getItem("anonpay_admin");
    if (adminData) {
      navigate("/admin");
    }
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Try both methods: local admin credentials and Supabase auth
      if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
        // Store admin data using hardcoded credentials
        const adminData = {
          email: ADMIN_EMAIL,
          role: "admin",
          name: "Admin User",
          id: "admin-1",
        };
        
        localStorage.setItem("anonpay_admin", JSON.stringify(adminData));
        
        toast({
          title: "Admin login successful",
          description: "Welcome to the admin dashboard!",
        });
        
        navigate("/admin");
      } else {
        // Try to sign in with Supabase
        const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
          email,
          password
        });
        
        if (authError) {
          throw new Error(authError.message);
        }
        
        if (authData?.user) {
          // Check if user has admin role
          const { data: profileData, error: profileError } = await supabase
            .from('profiles')
            .select('role, name')
            .eq('id', authData.user.id)
            .single();
            
          if (profileError) {
            throw new Error('Failed to fetch user profile');
          }
          
          if (profileData?.role === 'admin') {
            // Store admin data
            const adminData = {
              email: authData.user.email,
              role: "admin",
              name: profileData.name || authData.user.email || "Admin User",
              id: authData.user.id,
            };
            
            localStorage.setItem("anonpay_admin", JSON.stringify(adminData));
            
            toast({
              title: "Admin login successful",
              description: "Welcome to the admin dashboard!",
            });
            
            navigate("/admin");
          } else {
            throw new Error('You do not have admin privileges');
          }
        } else {
          throw new Error('Invalid admin credentials');
        }
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Login failed",
        description: error.message || "Invalid admin credentials. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-center mb-4">
            <Shield className="h-12 w-12 text-anonpay-primary" />
          </div>
          <CardTitle className="text-2xl text-center">Admin Login</CardTitle>
          <CardDescription className="text-center">
            Enter your credentials to access the admin dashboard
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Logging in...
                </span>
              ) : (
                <span className="flex items-center">
                  <LogIn className="mr-2 h-4 w-4" /> Login as Admin
                </span>
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default AdminLogin;
