
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/context/AuthContext";
import { UserRole } from "@/types";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import Logo from "@/components/layout/Logo";
import { authService } from "@/services/authService.js";

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
        await authService.login(email, password);
     // await login(email, password);
      toast({
        title: "Login successful",
        description: "Welcome back!",
      });
      navigate("/dashboard"); // Redirect to dashboard page after successful login
    } catch (error) {
      toast({
        title: "Login failed",
        description: "Invalid email or password. Please try again.",
        variant: "destructive",
      });
      console.error("Login error:", error);
    } finally {
      setIsLoading(false);
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
          <form onSubmit={handleLogin}>
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
                disabled={isLoading}
              >
                {isLoading ? "Logging in..." : "Sign In"}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default Login;
