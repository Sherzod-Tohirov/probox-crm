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

function waitForContainerReady(containerElement, maxWaitMs = 2000) {
  return new Promise((resolve) => {
    const start = Date.now();
    const check = () => {
      const attached =
        document.body && document.body.contains(containerElement);
      const sized =
        containerElement &&
        containerElement.offsetWidth > 0 &&
        containerElement.offsetHeight > 0;
      if (!containerElement || (attached && sized)) {
        resolve();
        return;
      }
      if (Date.now() - start >= maxWaitMs) {
        resolve();
        return;
      }
      setTimeout(check, 50);
    };
    check();
  });
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

  await waitForContainerReady(containerElement);

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

  // Defer to next frame to ensure map is initialized/rendered
  await new Promise((resolve) => {
    if (typeof requestAnimationFrame === 'function') {
      requestAnimationFrame(() => resolve());
    } else {
      setTimeout(resolve, 0);
    }
  });

  // Apply state options after map is ready; if early, retry once shortly after
  const applyOptions = () => {
    if (autoFitToViewport !== undefined)
      map.options.set('autoFitToViewport', autoFitToViewport);
    if (avoidFractionalZoom !== undefined)
      map.options.set('avoidFractionalZoom', avoidFractionalZoom);
    if (exitFullscreenByEsc !== undefined)
      map.options.set('exitFullscreenByEsc', exitFullscreenByEsc);
    if (fullscreenUnavailable !== undefined)
      map.options.set('fullscreenUnavailable', fullscreenUnavailable);
  };
  try {
    applyOptions();
  } catch (e) {
    setTimeout(() => {
      try {
        applyOptions();
      } catch (_) {}
    }, 50);
  }

  // Apply initial theme (dark/light) immediately after map is created
  try {
    updateMapTheme(map, theme);
  } catch (_) {}

  return map;
}

/**
 * Update existing map theme
 * @param {ymaps.Map} map - Yandex Map instance
 * @param {string} theme - 'light' or 'dark'
 */
export function updateMapTheme(map, theme = getCurrentTheme()) {
  if (!map) return;
  const ymaps = typeof window !== 'undefined' ? window.ymaps : null;

  // Helper: apply/remove CSS filter on ground pane as a fallback for dark theme
  const applyCssDarkFallback = (enable) => {
    const containerEl = map?.container?.getElement?.();
    if (!containerEl) return;
    const groundPane = containerEl.querySelector('.ymaps-2-1-79-ground-pane');
    if (groundPane) {
      groundPane.style.filter = enable
        ? 'invert(88%) hue-rotate(180deg) saturate(80%) brightness(85%)'
        : '';
    }
  };

  // Prefer explicit dark type if available, otherwise use CSS fallback
  const darkType = 'yandex#dark';
  const lightType = 'yandex#map';
  const darkAvailable = ymaps?.mapType?.storage?.get?.(darkType);

  const setTypeSafe = (type) => {
    try {
      map.setType(type);
    } catch (e) {
      setTimeout(() => {
        try {
          map.setType(type);
        } catch (_) {}
      }, 50);
    }
  };

  if (theme === 'dark') {
    if (darkAvailable) {
      // Use native dark tiles if present
      applyCssDarkFallback(false);
      setTypeSafe(darkType);
    } else {
      // Fallback: keep standard tiles but apply CSS darkening to ground pane
      setTypeSafe(lightType);
      applyCssDarkFallback(true);
    }
  } else {
    // Light theme
    applyCssDarkFallback(false);
    setTypeSafe(lightType);
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
