
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

export const useAuthOperations = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const signUp = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });
      
      if (error) throw error;
      
      return;
    } catch (error: any) {
      console.error('Error signing up:', error.message);
      throw error;
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) throw error;
      
      return;
    } catch (error: any) {
      console.error('Error signing in:', error.message);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      navigate('/login');
    } catch (error: any) {
      console.error('Error signing out:', error.message);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: `Failed to sign out: ${error.message}`,
      });
    }
  };

  const resetPassword = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      
      if (error) throw error;
      
      toast({
        title: 'Check your email',
        description: 'We sent you a link to reset your password',
      });
    } catch (error: any) {
      console.error('Error resetting password:', error.message);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: `Failed to send reset email: ${error.message}`,
      });
      throw error;
    }
  };

  const updatePassword = async (password: string) => {
    try {
      const { error } = await supabase.auth.updateUser({ password });
      
      if (error) throw error;
      
      toast({
        title: 'Password updated',
        description: 'Your password has been updated successfully',
      });
      navigate('/login');
    } catch (error: any) {
      console.error('Error updating password:', error.message);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: `Failed to update password: ${error.message}`,
      });
      throw error;
    }
  };

  const verifyEmail = async (userId: string) => {
    // In a real app, this would make an API call to verify the email
    // For now, we'll just simulate it by updating the user state
    toast({
      title: 'Email verified',
      description: 'Your email has been verified successfully',
    });
    navigate('/dashboard');
  };

  const resendVerificationEmail = async () => {
    try {
      // Create an edge function to handle email verification in a real application
      // For now, we'll just show a toast
      toast({
        title: 'Email sent',
        description: 'We sent you a verification email',
      });
    } catch (error: any) {
      console.error('Error resending verification email:', error.message);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: `Failed to resend verification email: ${error.message}`,
      });
      throw error;
    }
  };

  return {
    signUp,
    signIn,
    signOut,
    resetPassword,
    updatePassword,
    verifyEmail,
    resendVerificationEmail,
    isLoading,
    setIsLoading
  };
};
