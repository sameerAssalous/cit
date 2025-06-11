
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useLocalization } from "@/context/LocalizationContext";
import { getProfile } from "@/services/profileService";
import { UserRole } from "@/types";

const Profile: React.FC = () => {
  const { t } = useLocalization();

  const { data: profileData, isLoading, error } = useQuery({
    queryKey: ["profile"],
    queryFn: getProfile,
  });

  const user = profileData?.data?.user;

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  const getRoleLabel = (role: UserRole) => {
    switch (role) {
      case UserRole.ADMINISTRATOR:
        return t("users.roles.admin");
      case UserRole.PROJECT_MANAGER:
        return t("users.roles.project_manager");
      case UserRole.EMPLOYEE:
        return t("users.roles.employee");
      default:
        return role;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/3 mb-8"></div>
            <div className="grid gap-6">
              <div className="h-64 bg-gray-200 rounded"></div>
              <div className="h-48 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <Card>
            <CardContent className="pt-6">
              <p className="text-red-600">{t("profile.error")}</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const allPermissions = user.roles?.flatMap(role => role.permissions) || [];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">{t("profile.title")}</h1>
          <p className="text-gray-600 mt-2">{t("profile.subtitle")}</p>
        </div>

        <div className="grid gap-6">
          {/* Personal Information Card */}
          <Card>
            <CardHeader>
              <CardTitle>{t("profile.personal_info")}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-start space-x-4">
                <Avatar className="h-16 w-16">
                  <AvatarFallback className="bg-construction-tertiary text-white text-lg">
                    {getInitials(user.name)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold">{user.name}</h3>
                  <p className="text-gray-600">{user.email}</p>
                  <div className="mt-2">
                    <Badge variant="secondary">
                      {getRoleLabel(user.role)}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Account Details Card */}
          <Card>
            <CardHeader>
              <CardTitle>{t("profile.account_details")}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      {t("users.email")}
                    </label>
                    <p className="mt-1 text-gray-900">{user.email}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      {t("users.role")}
                    </label>
                    <p className="mt-1 text-gray-900">{getRoleLabel(user.role)}</p>
                  </div>
                </div>
                
                {user.created_at && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      {t("profile.member_since")}
                    </label>
                    <p className="mt-1 text-gray-900">{formatDate(user.created_at)}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Permissions Card */}
          <Card>
            <CardHeader>
              <CardTitle>{t("profile.permissions")}</CardTitle>
              <CardDescription>
                {t("profile.your_permissions")}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {allPermissions.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                  {allPermissions.map((permission) => (
                    <Badge key={permission.id} variant="outline" className="justify-start">
                      {permission.name}
                    </Badge>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">{t("profile.no_permissions")}</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Profile;
