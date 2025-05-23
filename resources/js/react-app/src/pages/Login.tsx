import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import Logo from "@/components/layout/Logo";
import { useTranslation } from "react-i18next";

const DEMO_ACCOUNTS = [
  { email: "Administratorin@gmail.com", role: "Administrator" },
  { email: "Managerin@gmail.com", role: "Manager" },
  { email: "Arbeitgeberin@gmail.com", role: "Arbeitgeber" }
];

const Login: React.FC = () => {
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await login(email, password);
      toast({
        title: t('auth.login_success'),
        description: t('auth.welcome_back'),
      });
      navigate("/dashboard");
    } catch (err) {
      toast({
        title: t('auth.login_failed'),
        description: err.message || t('auth.invalid_credentials'),
        variant: "destructive",
      });
      console.error("Login error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = (demoEmail: string) => {
    setEmail(demoEmail);
    setPassword("password");
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
              {t('auth.login')}
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium" htmlFor="email">
                  {t('auth.email')}
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder={t('auth.email_placeholder')}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full"
                  autoComplete="username"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium" htmlFor="password">
                  {t('auth.password')}
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
              <div className="space-y-2">
                <p className="text-sm text-gray-500">{t('auth.demo_accounts')}</p>
                <div className="grid grid-cols-1 gap-2">
                  {DEMO_ACCOUNTS.map((account) => (
                    <Button
                      key={account.email}
                      type="button"
                      variant="outline"
                      className="w-full"
                      onClick={() => handleDemoLogin(account.email)}
                    >
                      {account.role}
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button
                type="submit"
                className="w-full bg-construction-primary hover:bg-construction-tertiary"
                disabled={isLoading}
              >
                {isLoading ? t('auth.logging_in') : t('auth.sign_in')}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default Login;
