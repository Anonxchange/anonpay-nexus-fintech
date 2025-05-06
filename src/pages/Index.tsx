
import React from 'react';
import Hero from '../components/marketing/Hero';
import Features from '../components/marketing/Features';
import Testimonials from '../components/marketing/Testimonials';
import CTASection from '../components/marketing/CTASection';
import { useAuth } from '../contexts/auth';
import AdminSetupGuide from '../components/admin/AdminSetupGuide';

const Index = () => {
  const { user } = useAuth();
  
  return (
    <div>
      {user && (
        <div className="container mx-auto px-4 py-6 max-w-4xl">
          <AdminSetupGuide />
        </div>
      )}
      <Hero />
      <Features />
      <Testimonials />
      <CTASection />
    </div>
  );
};

export default Index;
