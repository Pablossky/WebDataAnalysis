import { useEffect } from "react";

export default function useDebounce(callback, delay, dependencies) {
  useEffect(() => {
    const handler = setTimeout(callback, delay);
    return () => clearTimeout(handler);
  }, [...dependencies, delay]);
}
