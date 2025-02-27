import { useState, useEffect } from 'react';

export function useLocalStorageState(key: string) {
  const [value, setValue] = useState(function () {
    // Check local storage first (defaulted to null but will be updated by user)
    const storedValue = localStorage.getItem(key);
    if (storedValue) return JSON.parse(storedValue);

    // If there isn't a stored value, go to system preference
    const prefersDark = window.matchMedia(
      '(prefers-color-scheme: dark)'
    ).matches;
    return prefersDark ? 'dark' : 'light';
  });

  // Sync with local storage whenever there is a change
  useEffect(
    function () {
      localStorage.setItem(key, JSON.stringify(value));
    },
    [value, key]
  );

  // Listen for OS preference change in real-time
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const handleChange = (e: MediaQueryListEvent) => {
      if (!localStorage.getItem(key)) {
        setValue(e.matches ? 'dark' : 'light');
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [key]);

  return [value, setValue];
}

export default useLocalStorageState;
