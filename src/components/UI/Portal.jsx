import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

/**
 * Portal component to render children outside the DOM hierarchy
 * Useful for dropdowns, modals, tooltips that need to escape overflow:hidden
 */
export default function Portal({ children }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  if (!mounted) return null;

  return createPortal(children, document.body);
}
