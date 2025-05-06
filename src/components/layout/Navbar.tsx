
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "../../contexts/auth";
import { Menu, X, LogOut, User, Settings, Shield } from "lucide-react";

interface NavbarProps {
  
}

const Navbar: React.FC<NavbarProps> = () => {
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const isAdmin = profile?.role === "admin";

  return (
    <div className="shadow-sm bg-white sticky top-0 z-50">
      <div className="container mx-auto py-4 px-4 flex items-center justify-between">
        <div className="flex items-center">
          <img 
            src="/anonpay-logo.svg"
            alt="AnonPay Logo"
            className="h-8 w-8 mr-2"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.onerror = null;
              target.src = "/placeholder.svg";
            }}
          />
          <Link to="/" className="font-bold text-2xl text-anonpay-primary">
            AnonPay
          </Link>
        </div>
        
        <div className="hidden md:flex items-center space-x-4">
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <Link to="/about">
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                    About
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link to="/services/rate-checker">
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                    Rates
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link to="/contact">
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                    Contact
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link to="/blog">
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                    Blog
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link to="/contact">
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                    Support
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link to="/services">
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                    Services
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
              {user && (
                <NavigationMenuItem>
                  <Link to="/dashboard">
                    <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                      Dashboard
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
              )}
              {isAdmin && (
                <NavigationMenuItem>
                  <Link to="/admin">
                    <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                      Admin Panel
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
              )}
            </NavigationMenuList>
          </NavigationMenu>
          
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={profile?.avatar_url || ""} alt={profile?.name || "User Avatar"} />
                    <AvatarFallback>{profile?.name?.charAt(0).toUpperCase() || "U"}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>{profile?.name || user.email}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate("/dashboard")}>
                  <User className="mr-2 h-4 w-4" />
                  <span>My Account</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate("/dashboard?tab=settings")}>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                {isAdmin && (
                  <DropdownMenuItem onClick={() => navigate("/admin")}>
                    <Shield className="mr-2 h-4 w-4" />
                    <span>Admin Panel</span>
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => signOut()}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center space-x-3">
              <Button variant="outline" onClick={() => navigate("/login")}>
                Login
              </Button>
              <Button onClick={() => navigate("/signup")}>Sign Up</Button>
            </div>
          )}
        </div>
        
        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <Button variant="ghost" onClick={toggleMenu}>
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>
      
      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white shadow-lg border-t">
          <div className="container mx-auto px-4 py-3">
            <div className="space-y-2">
              <Link 
                to="/about"
                className="block py-2 hover:bg-gray-100 rounded-md px-3"
                onClick={() => setIsMenuOpen(false)}
              >
                About
              </Link>
              <Link 
                to="/services/rate-checker"
                className="block py-2 hover:bg-gray-100 rounded-md px-3"
                onClick={() => setIsMenuOpen(false)}
              >
                Rates
              </Link>
              <Link 
                to="/contact"
                className="block py-2 hover:bg-gray-100 rounded-md px-3"
                onClick={() => setIsMenuOpen(false)}
              >
                Contact
              </Link>
              <Link 
                to="/blog"
                className="block py-2 hover:bg-gray-100 rounded-md px-3"
                onClick={() => setIsMenuOpen(false)}
              >
                Blog
              </Link>
              <Link 
                to="/contact"
                className="block py-2 hover:bg-gray-100 rounded-md px-3"
                onClick={() => setIsMenuOpen(false)}
              >
                Support
              </Link>
              <Link 
                to="/services"
                className="block py-2 hover:bg-gray-100 rounded-md px-3"
                onClick={() => setIsMenuOpen(false)}
              >
                Services
              </Link>
              {user && (
                <Link 
                  to="/dashboard"
                  className="block py-2 hover:bg-gray-100 rounded-md px-3"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Dashboard
                </Link>
              )}
              {isAdmin && (
                <Link 
                  to="/admin"
                  className="block py-2 hover:bg-gray-100 rounded-md px-3"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Admin Panel
                </Link>
              )}
              
              <div className="pt-3 border-t border-gray-100">
                {user ? (
                  <div className="space-y-2">
                    <div className="flex items-center px-3 py-2">
                      <Avatar className="h-8 w-8 mr-3">
                        <AvatarImage src={profile?.avatar_url || ""} alt={profile?.name || "User Avatar"} />
                        <AvatarFallback>{profile?.name?.charAt(0).toUpperCase() || "U"}</AvatarFallback>
                      </Avatar>
                      <div className="font-medium">{profile?.name || user.email}</div>
                    </div>
                    <button 
                      className="w-full text-left px-3 py-2 hover:bg-gray-100 rounded-md flex items-center"
                      onClick={() => {
                        navigate("/dashboard");
                        setIsMenuOpen(false);
                      }}
                    >
                      <User className="mr-2 h-4 w-4" />
                      <span>My Account</span>
                    </button>
                    <button 
                      className="w-full text-left px-3 py-2 hover:bg-gray-100 rounded-md flex items-center"
                      onClick={() => {
                        navigate("/dashboard?tab=settings");
                        setIsMenuOpen(false);
                      }}
                    >
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Settings</span>
                    </button>
                    <button 
                      className="w-full text-left px-3 py-2 hover:bg-gray-100 rounded-md flex items-center text-red-500"
                      onClick={() => {
                        signOut();
                        setIsMenuOpen(false);
                      }}
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Log out</span>
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col space-y-2">
                    <Button 
                      variant="outline" 
                      className="w-full justify-center"
                      onClick={() => {
                        navigate("/login");
                        setIsMenuOpen(false);
                      }}
                    >
                      Login
                    </Button>
                    <Button 
                      className="w-full justify-center"
                      onClick={() => {
                        navigate("/signup");
                        setIsMenuOpen(false);
                      }}
                    >
                      Sign Up
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Navbar;
