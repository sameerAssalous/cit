import React from "react";
import { useAuth } from "@/context/AuthContext";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Settings as SettingsIcon } from "lucide-react";
import { useTranslation } from "react-i18next";

const Settings: React.FC = () => {
  const { user } = useAuth();
  const { t } = useTranslation();

  if (!user) return null;

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex items-center mb-6">
        <div className="mr-4 p-2 bg-muted rounded-full">
          <SettingsIcon className="h-6 w-6" />
        </div>
        <div>
          <h1 className="text-3xl font-bold">{t('settings.title')}</h1>
          <p className="text-gray-600">{t('settings.description')}</p>
        </div>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>{t('settings.profile.title')}</CardTitle>
            <CardDescription>
              {t('settings.profile.description')}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">{t('settings.profile.name_label')}</Label>
                <Input id="name" defaultValue={user.name} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">{t('settings.profile.email_label')}</Label>
                <Input id="email" defaultValue={user.email} type="email" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">{t('settings.profile.location_label')}</Label>
                <Input id="location" defaultValue={user.location || ""} />
              </div>
            </div>
            <Button>{t('settings.profile.save_changes')}</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t('settings.password.title')}</CardTitle>
            <CardDescription>
              {t('settings.password.description')}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="current-password">{t('settings.password.current_label')}</Label>
                <Input id="current-password" type="password" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-password">{t('settings.password.new_label')}</Label>
                <Input id="new-password" type="password" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-password">{t('settings.password.confirm_label')}</Label>
                <Input id="confirm-password" type="password" />
              </div>
            </div>
            <Button>{t('settings.password.update_button')}</Button>
          </CardContent>
        </Card>

      </div>
    </div>
  );
};

export default Settings;
