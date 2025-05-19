
import React from "react";
import { Button } from "@/components/ui/button";
import { useLocalization } from "@/context/LocalizationContext";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Check, Flag } from "lucide-react";

const LanguageSwitcher: React.FC = () => {
  const { language, changeLanguage } = useLocalization();

  const languages = [
    { code: "de", name: "Deutsch" },
    { code: "en", name: "English" }
  ];

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="sm" className="flex items-center gap-2">
          <Flag size={16} />
          <span className="hidden md:inline">{language === "de" ? "Deutsch" : "English"}</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-48 p-0">
        <div className="flex flex-col">
          {languages.map((lang) => (
            <Button
              key={lang.code}
              variant="ghost"
              className="justify-start rounded-none h-10 px-4 py-2 flex items-center space-x-2"
              onClick={() => changeLanguage(lang.code as "en" | "de")}
            >
              <span className="flex-1">{lang.name}</span>
              {language === lang.code && <Check size={16} />}
            </Button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default LanguageSwitcher;
