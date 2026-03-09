import { useState, useEffect } from 'react';

/**
 * Delays updating a value until the user stops typing.
 * @param {*}      value  — the reactive value to debounce
 * @param {number} delay  — milliseconds to wait (default 400)
 */
export function useDebounce(value, delay = 400) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}

export default useDebounce;
