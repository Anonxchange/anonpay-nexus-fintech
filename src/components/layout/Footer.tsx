
import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Instagram, Twitter } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-100 py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-bold mb-4">AnonPay</h3>
            <p className="text-gray-600 mb-4">
              Your trusted platform for secure crypto transactions and gift card exchanges.
            </p>
            <div className="flex space-x-4">
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
                <Twitter className="h-5 w-5 text-gray-600 hover:text-anonpay-primary" />
              </a>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
                <Facebook className="h-5 w-5 text-gray-600 hover:text-anonpay-primary" />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
                <Instagram className="h-5 w-5 text-gray-600 hover:text-anonpay-primary" />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-bold mb-4">Company</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/about" className="text-gray-600 hover:text-anonpay-primary">About Us</Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-600 hover:text-anonpay-primary">Contact Us</Link>
              </li>
              <li>
                <Link to="#" className="text-gray-600 hover:text-anonpay-primary">Careers</Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-bold mb-4">Resources</h3>
            <ul className="space-y-2">
              <li>
                <Link to="#" className="text-gray-600 hover:text-anonpay-primary">Help Center</Link>
              </li>
              <li>
                <Link to="#" className="text-gray-600 hover:text-anonpay-primary">Blog</Link>
              </li>
              <li>
                <Link to="#" className="text-gray-600 hover:text-anonpay-primary">FAQs</Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-bold mb-4">Legal</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/terms" className="text-gray-600 hover:text-anonpay-primary">Terms of Service</Link>
              </li>
              <li>
                <Link to="/privacy" className="text-gray-600 hover:text-anonpay-primary">Privacy Policy</Link>
              </li>
              <li>
                <Link to="#" className="text-gray-600 hover:text-anonpay-primary">Cookie Policy</Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-200 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-600 text-sm mb-4 md:mb-0">
            © {new Date().getFullYear()} AnonPay. All rights reserved.
          </p>
          <div className="flex space-x-4">
            <Link to="#" className="text-gray-600 text-sm hover:text-anonpay-primary">
              English (US)
            </Link>
            <Link to="#" className="text-gray-600 text-sm hover:text-anonpay-primary">
              Support
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
