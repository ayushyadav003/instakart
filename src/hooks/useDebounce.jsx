import { useState, useEffect } from "react";

export const useDebounce = (val, delay) => {
  const [debounceValue, setDebounceValue] = useState(val);
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebounceValue(val);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [val, delay]);

  return debounceValue;
};
