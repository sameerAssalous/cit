import React from "react";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";

const LanguageSwitcher: React.FC = () => {
  const { i18n } = useTranslation();

  const toggleLanguage = () => {
    const newLang = i18n.language === "en" ? "de" : "en";
    i18n.changeLanguage(newLang);
  };

  return (
    <Button
      variant="ghost"
      onClick={toggleLanguage}
      className="w-full justify-start"
    >
      {i18n.language === "en" ? "🇬🇧 English" : "🇩🇪 Deutsch"}
    </Button>
  );
};

export default LanguageSwitcher;
