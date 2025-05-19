
import React, { createContext, useState, useContext, useEffect, ReactNode } from "react";
import enTranslations from "../locales/en.json";
import deTranslations from "../locales/de.json";

// Define types
type Translations = typeof enTranslations;
type LanguageCode = "en" | "de";

interface LocalizationContextType {
  language: LanguageCode;
  translations: Translations;
  changeLanguage: (lang: LanguageCode) => void;
  t: (key: string) => string;
}

// Create context
const LocalizationContext = createContext<LocalizationContextType | undefined>(undefined);

// Available translations
const availableTranslations: Record<LanguageCode, Translations> = {
  en: enTranslations,
  de: deTranslations,
};

interface LocalizationProviderProps {
  children: ReactNode;
  defaultLanguage?: LanguageCode;
}

export const LocalizationProvider: React.FC<LocalizationProviderProps> = ({ 
  children, 
  defaultLanguage = "de" // Set German as default
}) => {
  const [language, setLanguage] = useState<LanguageCode>(() => {
    // Try to get language from localStorage, fall back to default
    const savedLanguage = localStorage.getItem("language") as LanguageCode | null;
    return savedLanguage && availableTranslations[savedLanguage] ? savedLanguage : defaultLanguage;
  });
  
  const [translations, setTranslations] = useState<Translations>(availableTranslations[language]);
  
  useEffect(() => {
    // Save language preference to localStorage
    localStorage.setItem("language", language);
    setTranslations(availableTranslations[language]);
    document.documentElement.lang = language;
  }, [language]);

  // Translation function
  const t = (key: string): string => {
    const keys = key.split(".");
    let result: any = translations;
    
    for (const k of keys) {
      if (result && result[k]) {
        result = result[k];
      } else {
        console.warn(`Translation not found for key: ${key}`);
        return key;
      }
    }
    
    return typeof result === "string" ? result : key;
  };

  const changeLanguage = (lang: LanguageCode) => {
    if (availableTranslations[lang]) {
      setLanguage(lang);
    } else {
      console.error(`Language ${lang} is not available`);
    }
  };

  const value = {
    language,
    translations,
    changeLanguage,
    t
  };

  return (
    <LocalizationContext.Provider value={value}>
      {children}
    </LocalizationContext.Provider>
  );
};

export const useLocalization = (): LocalizationContextType => {
  const context = useContext(LocalizationContext);
  if (context === undefined) {
    throw new Error("useLocalization must be used within a LocalizationProvider");
  }
  return context;
};
