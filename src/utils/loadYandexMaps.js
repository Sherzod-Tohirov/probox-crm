// Global promise to prevent multiple script loading
let yandexMapsPromise = null;

/**
 * Get current theme from document
 * @returns {'light' | 'dark'}
 */
function getCurrentTheme() {
  return document.documentElement.getAttribute('data-theme') === 'dark'
    ? 'dark'
    : 'light';
}

/**
 * Get Yandex Maps theme configuration based on current theme
 * @param {string} theme - 'light' or 'dark'
 * @returns {object} Theme configuration for Yandex Maps
 */
function getMapThemeConfig(theme = getCurrentTheme()) {
  if (theme === 'dark') {
    return {
      // Dark theme configuration
      theme: 'dark',
      controls: ['zoomControl', 'typeSelector', 'fullscreenControl'],
      controlsOptions: {
        zoomControl: { theme: 'dark' },
        typeSelector: { theme: 'dark' },
        fullscreenControl: { theme: 'dark' },
      },
    };
  } else {
    return {
      // Light theme configuration (default)
      theme: 'light',
      controls: ['zoomControl', 'typeSelector', 'fullscreenControl'],
      controlsOptions: {
        zoomControl: { theme: 'light' },
        typeSelector: { theme: 'light' },
        fullscreenControl: { theme: 'light' },
      },
    };
  }
}

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
    const existingScript = document.querySelector(
      'script[src*="api-maps.yandex.ru"]'
    );
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

/**
 * Create a theme-aware Yandex Map instance
 * @param {string|HTMLElement} container - ID of the container element or the element itself
 * @param {object} mapOptions - Map configuration options
 * @param {string} theme - Optional theme override ('light' or 'dark')
 * @returns {Promise<ymaps.Map>} Promise that resolves to map instance
 */
export async function createThemedMap(container, mapOptions = {}, theme) {
  const ymaps = await loadYandexMaps();
  const themeConfig = getMapThemeConfig(theme);

  // Validate container
  if (!container) {
    throw new Error('Container element is required for map creation');
  }

  // Get container element
  let containerElement = container;
  if (typeof container === 'string') {
    containerElement = document.getElementById(container);
    if (!containerElement) {
      throw new Error(`Container element with id "${container}" not found`);
    }
  }

  // Separate map state options from constructor options
  const {
    autoFitToViewport,
    avoidFractionalZoom,
    exitFullscreenByEsc,
    fullscreenUnavailable,
    ...mapStateOptions
  } = mapOptions;

  // Merge theme configuration with user options for map constructor
  const finalOptions = {
    center: [41.2995, 69.2401], // Default to Tashkent
    zoom: 10,
    ...mapStateOptions,
    controls: mapStateOptions.controls || themeConfig.controls,
  };

  // Create the map
  const map = new ymaps.Map(containerElement, finalOptions);

  // Wait for map to be fully initialized
  await new Promise((resolve) => {
    map.events.once('ready', resolve);
  });

  // Apply state options after map is ready
  if (autoFitToViewport !== undefined)
    map.options.set('autoFitToViewport', autoFitToViewport);
  if (avoidFractionalZoom !== undefined)
    map.options.set('avoidFractionalZoom', avoidFractionalZoom);
  if (exitFullscreenByEsc !== undefined)
    map.options.set('exitFullscreenByEsc', exitFullscreenByEsc);
  if (fullscreenUnavailable !== undefined)
    map.options.set('fullscreenUnavailable', fullscreenUnavailable);

  // Apply theme styling after map is ready
  if (themeConfig.theme === 'dark') {
    // Set dark map style
    map.setType('yandex#dark');
  } else {
    // Set light map style (default)
    map.setType('yandex#map');
  }

  return map;
}

/**
 * Update existing map theme
 * @param {ymaps.Map} map - Yandex Map instance
 * @param {string} theme - 'light' or 'dark'
 */
export function updateMapTheme(map, theme = getCurrentTheme()) {
  if (!map) return;

  if (theme === 'dark') {
    map.setType('yandex#dark');
  } else {
    map.setType('yandex#map');
  }
}

/**
 * Listen for theme changes and update map accordingly
 * @param {ymaps.Map} map - Yandex Map instance
 * @returns {function} Cleanup function to remove listener
 */
export function setupThemeListener(map) {
  if (!map) return () => {};

  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (
        mutation.type === 'attributes' &&
        mutation.attributeName === 'data-theme'
      ) {
        const newTheme = getCurrentTheme();
        updateMapTheme(map, newTheme);
      }
    });
  });

  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['data-theme'],
  });

  return () => observer.disconnect();
}

export { getCurrentTheme, getMapThemeConfig };
export default loadYandexMaps;
