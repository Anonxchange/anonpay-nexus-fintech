
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Mail } from 'lucide-react';

const forgotPasswordSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address' }),
});

type ForgotPasswordValues = z.infer<typeof forgotPasswordSchema>;

const ForgotPasswordForm: React.FC = () => {
  const { resetPassword } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const form = useForm<ForgotPasswordValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: '',
    },
  });

  const onSubmit = async (data: ForgotPasswordValues) => {
    try {
      setIsLoading(true);
      await resetPassword(data.email);
      setIsSubmitted(true);
    } catch (error) {
      // Error is already handled in the resetPassword function
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="flex flex-col items-center text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6">
          <Mail className="w-8 h-8 text-green-600" />
        </div>
        <h2 className="text-2xl font-semibold mb-2">Check your email</h2>
        <p className="text-gray-600 mb-6">
          We've sent a password reset link to your email address. Please check your inbox and follow the instructions.
        </p>
        <p className="text-sm text-gray-500">
          Didn't receive an email?{' '}
          <button
            type="button"
            onClick={() => form.handleSubmit(onSubmit)()}
            className="text-anonpay-primary hover:underline font-medium"
          >
            Click here to resend
          </button>
        </p>
        <Link to="/login" className="mt-4 text-anonpay-primary hover:underline">
          Back to login
        </Link>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email address</FormLabel>
              <FormControl>
                <Input placeholder="you@example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? (
            <span className="flex items-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Sending email...
            </span>
          ) : (
            'Reset Password'
          )}
        </Button>

        <div className="text-center mt-6">
          <Link
            to="/login"
            className="text-sm font-medium text-anonpay-primary hover:underline"
          >
            Back to login
          </Link>
        </div>
      </form>
    </Form>
  );
};

export default ForgotPasswordForm;
