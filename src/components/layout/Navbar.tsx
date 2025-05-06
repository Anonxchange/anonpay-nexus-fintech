
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
        <Link to="/" className="font-bold text-2xl text-anonpay-primary">
          AnonPay
        </Link>
        
        <div className="hidden md:flex items-center space-x-4">
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <Link to="/services">
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                    Services
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link to="/dashboard">
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                    Dashboard
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
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
            <>
              <Button variant="outline" onClick={() => navigate("/login")}>
                Login
              </Button>
              <Button onClick={() => navigate("/signup")}>Sign Up</Button>
            </>
          )}
        </div>
        
        {/* Mobile Menu */}
        <div className="md:hidden">
          <Button variant="ghost" onClick={toggleMenu}>
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
          
          {isMenuOpen && (
            <div className="absolute top-full right-0 bg-white shadow-md rounded-md p-4 mt-2 w-48">
              <Link to="/services" className="block py-2 hover:bg-gray-100 rounded-md">
                Services
              </Link>
              <Link to="/dashboard" className="block py-2 hover:bg-gray-100 rounded-md">
                Dashboard
              </Link>
              {isAdmin && (
                <Link to="/admin" className="block py-2 hover:bg-gray-100 rounded-md">
                  Admin Panel
                </Link>
              )}
              
              {user ? (
                <>
                  <DropdownMenuSeparator />
                  <button onClick={() => navigate("/dashboard")} className="block py-2 hover:bg-gray-100 rounded-md w-full text-left">
                    My Account
                  </button>
                  <button onClick={() => navigate("/dashboard?tab=settings")} className="block py-2 hover:bg-gray-100 rounded-md w-full text-left">
                    Settings
                  </button>
                  {isAdmin && (
                    <button onClick={() => navigate("/admin")} className="block py-2 hover:bg-gray-100 rounded-md w-full text-left">
                      Admin Panel
                    </button>
                  )}
                  <DropdownMenuSeparator />
                  <button onClick={() => signOut()} className="block py-2 hover:bg-gray-100 rounded-md w-full text-left">
                    Log out
                  </button>
                </>
              ) : (
                <>
                  <DropdownMenuSeparator />
                  <Link to="/login" className="block py-2 hover:bg-gray-100 rounded-md">
                    Login
                  </Link>
                  <Link to="/signup" className="block py-2 hover:bg-gray-100 rounded-md">
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
