import { useState, useEffect } from "react";

export function useLocalStorage(key, initialValue) {
  // Инициализация стейта (берем из localStorage или используем начальное значение)
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error("Ошибка чтения localStorage:", error);
      return initialValue;
    }
  });

  // Синхронизация с localStorage при каждом изменении
  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(storedValue));
    } catch (error) {
      console.error("Ошибка записи в localStorage:", error);
    }
  }, [key, storedValue]);

  return [storedValue, setStoredValue];
}
