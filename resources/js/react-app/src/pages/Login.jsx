import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
//import { useAuth } from "@/context/AuthContext";
import { UserRole } from "@/types";
import { useToast } from "@/components/ui/use-toast";
//import { useNavigate } from "react-router-dom";
import Logo from "@/components/layout/Logo";

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await login(email, password);
            navigate('/dashboard');
        } catch (err) {
            setError(err.message || 'Failed to login');
        } finally {
            setLoading(false);
        }
    };

    return (
<div className="flex flex-col items-center justify-center min-h-screen bg-construction-background p-4">
      <div className="w-full max-w-md mx-auto">
        <Card className="shadow-lg">
          <CardHeader className="space-y-1 text-center">
            <div className="flex justify-center mb-4">
              <Logo variant="default" className="mx-auto" />
            </div>
            <CardDescription>
              Login
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium" htmlFor="email">
                  Email
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder="email@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full"
                  autoComplete="username"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium" htmlFor="password">
                  Password
                </label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full"
                  autoComplete="current-password"
                />
              </div>
              
              <div className="text-sm text-gray-500 p-2 bg-blue-50 rounded-md">
                <p className="font-semibold mb-1">Demo Accounts:</p>
                <p>Employee: employee@example.com / password</p>
                <p>Manager: manager@example.com / password</p>
                <p>Admin: admin@example.com / password</p>
              </div>
            </CardContent>
            <CardFooter>
              <Button
                type="submit"
                className="w-full bg-construction-primary hover:bg-construction-tertiary"
                disabled={loading}
              >
                {loading ? "Logging in..." : "Sign In"}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
    
    
    );
};

export default Login;
