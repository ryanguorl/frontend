import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

const LocaleSwitcher: React.FC = () => {
  const [locale, setLocale] = useState('');
  const router = useRouter();

  useEffect(() => {
    const storedLocale = localStorage.getItem('NEXT_LOCALE') || 'en';
    setLocale(storedLocale);
  }, []);

  const handleLocaleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedLocale = event.target.value;
    setLocale(selectedLocale);

    localStorage.setItem('NEXT_LOCALE', selectedLocale);
    router.reload();
  };

  return (
    <select value={locale} onChange={handleLocaleChange}>
      <option value="en">English</option>
      <option value="zh">Chinese</option>
    </select>
  );
};

export default LocaleSwitcher;
