// Global promise to prevent multiple script loading
let yandexMapsPromise = null;

function loadYandexMaps() {
  // Return existing promise if already loading or loaded
  if (yandexMapsPromise) {
    return yandexMapsPromise;
  }

  // If already loaded, return resolved promise
  if (window?.ymaps) {
    return Promise.resolve(window.ymaps);
  }

  // Create new loading promise
  yandexMapsPromise = new Promise((resolve, reject) => {
    const API_KEY = import.meta.env.VITE_YANDEX_API_KEY;
    const SUGGESTIONS_API_KEY = import.meta.env.VITE_YANDEX_SUGGESTIONS_API_KEY;
    
    if (!API_KEY || !SUGGESTIONS_API_KEY) {
      const error = new Error('Yandex Maps API key is not defined');
      yandexMapsPromise = null; // Reset promise on error
      return reject(error);
    }

    // Check if script is already being loaded
    const existingScript = document.querySelector('script[src*="api-maps.yandex.ru"]');
    if (existingScript) {
      // Script is already loading, wait for it
      existingScript.onload = () => {
        if (window.ymaps) {
          window.ymaps.ready(() => resolve(window.ymaps));
        } else {
          yandexMapsPromise = null;
          reject(new Error('Yandex Maps failed to load'));
        }
      };
      existingScript.onerror = () => {
        yandexMapsPromise = null;
        reject(new Error('Failed to load Yandex Maps script'));
      };
      return;
    }

    const script = document.createElement('script');
    script.src =
      'https://api-maps.yandex.ru/2.1/?lang=uz_UZ&apikey=' +
      API_KEY +
      '&suggest_apikey=' +
      SUGGESTIONS_API_KEY +
      '&mode=release';
    script.type = 'text/javascript';
    script.crossOrigin = 'anonymous';
    script.async = true;
    
    script.onload = () => {
      if (window.ymaps) {
        window.ymaps.ready(() => resolve(window.ymaps));
      } else {
        yandexMapsPromise = null;
        reject(new Error('Yandex Maps API not available after script load'));
      }
    };
    
    script.onerror = (error) => {
      yandexMapsPromise = null;
      document.head.removeChild(script);
      reject(new Error('Failed to load Yandex Maps script: ' + error.message));
    };
    
    document.head.appendChild(script);
  });

  return yandexMapsPromise;
}

export default loadYandexMaps;
