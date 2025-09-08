import { useEffect } from 'react';

export const usePWA = () => {
  useEffect(() => {
    if (import.meta.env.PROD && 'serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js')
        .then((registration) => {
          console.log('SW registered: ', registration);
        })
        .catch((registrationError) => {
          console.log('SW registration failed: ', registrationError);
        });
    }
  }, []);

  const installPrompt = () => {
    // This would be used to show install prompt
    // Implementation depends on browser support
  };

  return { installPrompt };
};
