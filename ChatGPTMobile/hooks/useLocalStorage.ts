import { useState, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';

export function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(initialValue);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadStoredValue = async () => {
      try {
        const item = await SecureStore.getItemAsync(key);
        if (item) {
          setStoredValue(JSON.parse(item));
        }
      } catch (error) {
        console.error(`Error reading SecureStore key "${key}":`, error);
      } finally {
        setIsLoading(false);
      }
    };

    loadStoredValue();
  }, [key]);

  const setValue = async (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      await SecureStore.setItemAsync(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(`Error setting SecureStore key "${key}":`, error);
    }
  };

  return [storedValue, setValue, isLoading] as const;
}