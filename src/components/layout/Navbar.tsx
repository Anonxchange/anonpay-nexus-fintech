import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  Home, 
  Wallet, 
  History, 
  Settings, 
  LogOut, 
  Menu, 
  X,
  Gift,
  Phone,
  ShieldCheck,
} from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Navbar: React.FC = () => {
  const { user, profile, signOut } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path: string) => location.pathname === path;

  const navItems = [
    { path: "/dashboard", label: "Dashboard", icon: <Home className="h-4 w-4" /> },
    { path: "/kyc", label: "KYC", icon: <ShieldCheck className="h-4 w-4" /> },
    { 
      path: "/services", 
      label: "Services", 
      icon: <Gift className="h-4 w-4" />, 
      children: [
        { path: "/services/crypto", label: "Crypto" },
        { path: "/services/gift-cards", label: "Gift Cards" },
        { path: "/services/vtu", label: "VTU" },
      ]
    },
    { path: "/history", label: "History", icon: <History className="h-4 w-4" /> },
  ];

  const adminNavItems = [
    { path: "/admin", label: "Admin Panel", icon: <Settings className="h-4 w-4" /> },
  ];

  const handleLogout = () => {
    signOut();
  };

  const getInitials = () => {
    if (!profile?.name) return user?.email?.[0]?.toUpperCase() || "U";
    
    const names = profile.name.split(" ");
    if (names.length >= 2) {
      return `${names[0][0]}${names[1][0]}`.toUpperCase();
    }
    return names[0][0].toUpperCase();
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <header className="bg-white border-b sticky top-0 z-10">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-4">
          {/* Logo */}
          <Link to={user ? "/dashboard" : "/"} className="flex items-center">
            <span className="text-xl font-bold text-anonpay-primary">AnonPay</span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center space-x-1">
            {user && navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`px-3 py-2 text-sm font-medium rounded-md ${
                  isActive(item.path)
                    ? "bg-anonpay-primary/10 text-anonpay-primary"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <div className="flex items-center space-x-1">
                  {item.icon}
                  <span>{item.label}</span>
                </div>
              </Link>
            ))}
            
            {profile?.kyc_status === "admin" && adminNavItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`px-3 py-2 text-sm font-medium rounded-md ${
                  isActive(item.path)
                    ? "bg-anonpay-primary/10 text-anonpay-primary"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <div className="flex items-center space-x-1">
                  {item.icon}
                  <span>{item.label}</span>
                </div>
              </Link>
            ))}
          </nav>

          {/* User Menu (Desktop) */}
          <div className="hidden md:flex items-center">
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar>
                      <AvatarFallback className="bg-anonpay-primary text-white">
                        {getInitials()}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>
                    <div className="font-normal">
                      <div className="font-medium">{profile?.name || "User"}</div>
                      <div className="text-xs text-muted-foreground">{user.email}</div>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/dashboard">Dashboard</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/profile">Profile</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="text-red-500">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center space-x-2">
                <Button variant="ghost" asChild>
                  <Link to="/login">Log in</Link>
                </Button>
                <Button asChild>
                  <Link to="/signup">Sign up</Link>
                </Button>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              className="px-2"
              onClick={toggleMobileMenu}
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <nav className="md:hidden bg-white border-t p-4">
          <div className="space-y-1">
            {user && navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                  isActive(item.path)
                    ? "bg-anonpay-primary/10 text-anonpay-primary"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.icon}
                <span className="ml-3">{item.label}</span>
              </Link>
            ))}
            
            {profile?.kyc_status === "admin" && adminNavItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                  isActive(item.path)
                    ? "bg-anonpay-primary/10 text-anonpay-primary"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.icon}
                <span className="ml-3">{item.label}</span>
              </Link>
            ))}
            
            {user ? (
              <>
                <div className="px-3 py-2 border-t border-gray-200 mt-2">
                  <div className="flex items-center">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-anonpay-primary text-white text-xs">
                        {getInitials()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="ml-3">
                      <p className="text-sm font-medium">{profile?.name || "User"}</p>
                      <p className="text-xs text-gray-500">{user.email}</p>
                    </div>
                  </div>
                </div>
                <button
                  className="flex items-center w-full px-3 py-2 text-sm font-medium text-red-600 rounded-md hover:bg-red-50"
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                >
                  <LogOut className="h-4 w-4" />
                  <span className="ml-3">Log out</span>
                </button>
              </>
            ) : (
              <div className="space-y-2 pt-2 border-t border-gray-200 mt-2">
                <Link
                  to="/login"
                  className="block px-3 py-2 text-sm font-medium text-center text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Log in
                </Link>
                <Link
                  to="/signup"
                  className="block px-3 py-2 text-sm font-medium text-center text-white bg-anonpay-primary rounded-md hover:bg-anonpay-secondary"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Sign up
                </Link>
              </div>
            )}
          </div>
        </nav>
      )}
    </header>
  );
};

export default Navbar;
