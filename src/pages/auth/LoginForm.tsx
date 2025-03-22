
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CardContent, CardFooter } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';

interface LoginFormProps {
  isConfigured: boolean;
}

export const LoginForm: React.FC<LoginFormProps> = ({ isConfigured }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);
  
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isConfigured) {
      toast({
        variant: 'destructive',
        title: 'Not Configured',
        description: 'Authentication is not properly configured.',
      });
      return;
    }
    
    if (!email || !password) {
      toast({
        variant: 'destructive',
        title: 'Invalid Input',
        description: 'Please enter both email and password.',
      });
      return;
    }
    
    setIsLoggingIn(true);
    
    try {
      const result = await login(email, password);
      if (result && result.error) {
        console.error('Login returned error:', result.error);
        toast({
          variant: 'destructive',
          title: 'Login Failed',
          description: result.error || 'An error occurred during login',
        });
      } else {
        // The redirection will happen automatically via the useEffect hook above
        console.log('Login successful, authentication state updated');
      }
    } catch (error) {
      console.error('Login error:', error);
      toast({
        variant: 'destructive',
        title: 'Login Error',
        description: 'An unexpected error occurred',
      });
    } finally {
      setIsLoggingIn(false);
    }
  };
  
  return (
    <form onSubmit={handleLogin}>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="your.email@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Password</Label>
            <a href="#" className="text-xs text-primary hover:underline">
              Forgot password?
            </a>
          </div>
          <Input
            id="password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
      </CardContent>
      <CardFooter className="flex flex-col space-y-4">
        <Button 
          type="submit" 
          className="w-full" 
          disabled={isLoggingIn || !isConfigured}
        >
          {isLoggingIn ? 'Signing in...' : 'Sign In'}
        </Button>
      </CardFooter>
    </form>
  );
};
