import React from 'react';
import { createContext, useContext, useState } from 'react';
import { Language } from '../common/enums/language.enum';

const LocaleContext = createContext({
  currentLanguage: 'ro',
  languageChange: (locale: Language) => Promise.resolve(),
});

const LocaleProvider = ({ children }: { children: JSX.Element }) => {
  const [currentLanguage, setCurrenLanguage] = useState<Language>(Language.RO);

  const languageChange = async (locale: Language) => {
    const { messages } = await import(`../assets/locales/${locale}/messages`);
    setCurrenLanguage(locale);
  };

  return (
    <LocaleContext.Provider value={{ currentLanguage, languageChange }}>
      {children}
    </LocaleContext.Provider>
  );
};

const useLocaleContext = () => {
  return useContext(LocaleContext);
};

export { LocaleContext, LocaleProvider, useLocaleContext };
