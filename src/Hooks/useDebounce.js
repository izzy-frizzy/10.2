import { useState, useEffect } from "react";


export default function useDebounce(value, delay = 500) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);

    // Cancel the pending update if value/delay changes or the component unmounts.
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}