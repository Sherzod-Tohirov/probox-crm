import { useEffect, useRef, useState, useCallback } from 'react';
import loadYandexMaps, { createThemedMap, setupThemeListener, updateMapTheme } from '@/utils/loadYandexMaps';
import hasRole from '@utils/hasRole';
import styles from './style.module.scss';
import useAlert from '@hooks/useAlert';
import useAuth from '@hooks/useAuth';
import useToggle from '@hooks/useToggle';
import useIsMobile from '@hooks/useIsMobile';
import useTheme from '@hooks/useTheme';
import classNames from 'classnames';
import { Button } from '@components/ui';
const YandexMap = ({ userCoords = {}, onChangeCoords, isCompactLayout = false }) => {
  const { alert } = useAlert();
  const { user } = useAuth();
  const { currentTheme } = useTheme();
  const mapRef = useRef(null);
  const inputRef = useRef(null);
  const placemarkRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const themeListenerRef = useRef(null);
  const isManager = hasRole(user, ['Manager']);
  const [searchValue, setSearchValue] = useState('');
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [loadError, setLoadError] = useState(null);
  const DEFAULT_COORDS = [41.311081, 69.240562];
  const hasCoords = userCoords?.lat && userCoords?.long;

  // Cleanup function
  const cleanup = useCallback(() => {
    // Clean up resize observer
    if (mapRef.current?._resizeObserver) {
      mapRef.current._resizeObserver.disconnect();
      mapRef.current._resizeObserver = null;
    }

    // Clean up theme listener
    if (themeListenerRef.current) {
      themeListenerRef.current();
      themeListenerRef.current = null;
    }

    if (mapInstanceRef.current) {
      mapInstanceRef.current.destroy();
      mapInstanceRef.current = null;
    }
    placemarkRef.current = null;
    setIsMapLoaded(false);
  }, []);

  // Initialize map
  const initializeMap = useCallback(async () => {
    if (!mapRef.current) return;

    try {
      setLoadError(null);
      
      if (!mapRef.current) return; // Component might have unmounted

      const coords = hasCoords
        ? [userCoords.lat, userCoords.long]
        : DEFAULT_COORDS;

      // Use the new theme-aware map creation
      const map = await createThemedMap(
        mapRef.current,
        {
          center: coords,
          zoom: 12,
          controls: ['zoomControl'],
          // Map state options
          autoFitToViewport: 'always',
          avoidFractionalZoom: false,
          exitFullscreenByEsc: true,
          fullscreenUnavailable: true,
        },
        currentTheme
      );

      mapInstanceRef.current = map;

      // Setup theme change listener for automatic theme switching
      themeListenerRef.current = setupThemeListener(map);

      // Get ymaps from loadYandexMaps for placemark creation
      const ymaps = await loadYandexMaps();
      
      const placemark = new ymaps.Placemark(
        coords,
        {
          hintContent: 'Sizning joyingiz',
          balloonContent: 'Bu sizning belgilangan joyingiz',
        },
        { draggable: isManager }
      );

      placemarkRef.current = placemark;

      placemark.events.add('dragend', () => {
        const newCoords = placemark.geometry.getCoordinates();
        ymaps
          .geocode(newCoords)
          .then((res) => {
            const address = res.geoObjects.get(0)?.getAddressLine();
            onChangeCoords?.(newCoords, address);
          })
          .catch(console.error);
      });

      map.geoObjects.add(placemark);
      setIsMapLoaded(true);

      // Setup resize observer to handle container size changes
      if (window.ResizeObserver && mapRef.current) {
        const resizeObserver = new ResizeObserver(() => {
          if (map && mapRef.current) {
            // Trigger map resize when container size changes
            setTimeout(() => {
              map.container.fitToViewport();
            }, 50);
          }
        });
        resizeObserver.observe(mapRef.current);

        // Store observer for cleanup
        mapRef.current._resizeObserver = resizeObserver;
      }

      // Setup suggestions only if input exists and user is manager
      if (inputRef.current && isManager) {
        setupSuggestions(ymaps);
      }
    } catch (error) {
      console.error('Map initialization error:', error);
      setLoadError(error.message);
    }
  }, [hasCoords, userCoords, isManager, onChangeCoords, currentTheme]);

  // Setup suggestions
  const setupSuggestions = useCallback(
    (ymaps) => {
      if (!inputRef.current || !mapInstanceRef.current) return;

      try {
        const suggestView = new ymaps.SuggestView(inputRef.current, {
          provider: {
            suggest: (request, options) => {
              const bounds = mapInstanceRef.current?.getBounds();
              return ymaps
                .suggest(request, {
                  boundedBy: bounds,
                  results: 5,
                  ...options,
                })
                .then((items) => items.slice(0, 5))
                .catch(() => []); // Handle suggestion errors gracefully
            },
          },
          results: 5,
          boundedBy: mapInstanceRef.current?.getBounds(),
        });

        let isProcessingSuggestion = false;

        suggestView.events.add('select', async (e) => {
          if (isProcessingSuggestion) return;

          try {
            isProcessingSuggestion = true;
            const selected = e.get('item').value;
            const res = await ymaps.geocode(selected);

            const firstGeoObject = res.geoObjects.get(0);
            if (!firstGeoObject) return;

            const coords = firstGeoObject.geometry.getCoordinates();
            const address = firstGeoObject.getAddressLine();

            if (mapInstanceRef.current && placemarkRef.current) {
              mapInstanceRef.current.setCenter(coords, 14, {
                checkZoomRange: true,
              });
              placemarkRef.current.geometry.setCoordinates(coords);
              placemarkRef.current.properties.set({
                balloonContent: address,
                hintContent: address,
              });

              onChangeCoords?.(coords, address);
            }
          } catch (error) {
            console.error('Suggestion processing error:', error);
          } finally {
            isProcessingSuggestion = false;
          }
        });
      } catch (error) {
        console.error('Suggestions setup error:', error);
      }
    },
    [onChangeCoords]
  );

  // Initialize map on mount and when theme changes
  useEffect(() => {
    initializeMap();
    return cleanup;
  }, []);
  
  // Update map color scheme when theme changes (without recreating map)
  useEffect(() => {
    if (mapInstanceRef.current && isMapLoaded) {
      mapInstanceRef.current.options.set('scheme', currentTheme === 'dark' ? 'dark' : 'light');
    }
  }, [currentTheme, isMapLoaded]);

  // Handle window resize for responsive behavior
  useEffect(() => {
    const handleResize = () => {
      if (mapInstanceRef.current && mapRef.current) {
        // Force map to recalculate its size
        setTimeout(() => {
          mapInstanceRef.current.container.fitToViewport();
        }, 100);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isMapLoaded]);

  // Update map when coordinates change
  useEffect(() => {
    if (!isMapLoaded || !mapInstanceRef.current || !placemarkRef.current)
      return;

    const coords = hasCoords
      ? [userCoords.lat, userCoords.long]
      : DEFAULT_COORDS;

    mapInstanceRef.current.setCenter(coords, 12);
    placemarkRef.current.geometry.setCoordinates(coords);
  }, [userCoords, hasCoords, isMapLoaded]);

  const handleSearch = async () => {
    if (!window.ymaps || !searchValue || !mapInstanceRef.current) return;

    try {
      const res = await window.ymaps.geocode(searchValue, {
        boundedBy: mapInstanceRef.current.getBounds(),
        results: 1,
      });
      const firstGeoObject = res.geoObjects.get(0);
      if (!firstGeoObject) {
        alert("Manzil topilmadi. Iltimos, to'g'ri manzil kiriting.", {
          type: 'error',
        });
        return;
      }

      const coords = firstGeoObject.geometry.getCoordinates();
      const address = firstGeoObject.getAddressLine();

      mapInstanceRef.current.setCenter(coords, 14, { checkZoomRange: true });

      if (placemarkRef.current) {
        placemarkRef.current.geometry.setCoordinates(coords);
        placemarkRef.current.properties.set({
          balloonContent: address,
          hintContent: address,
        });
      }

      onChangeCoords?.(coords, address);
    } catch (error) {
      console.error('Search error:', error);
      alert('Qidiruvda xatolik yuz berdi', { type: 'error' });
    }
  };

  return (
    <div className={classNames(styles['yandex-map-container'], {
      [styles['compact']]: isCompactLayout,
    })}>
      <div
        className={classNames(styles['search-container'], {
          [styles['hidden']]: !isManager,
          [styles['compact-search']]: isCompactLayout,
        })}
      >
        <input
          ref={inputRef}
          type="text"
          placeholder="Manzilni kiriting..."
          value={searchValue}
          onChange={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setSearchValue(e.target.value);
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault(); // Prevents form submit on Enter key
              handleSearch();
            }
          }}
          className={styles['search-input']}
        />
        <button
          type="button"
          onClick={handleSearch}
          className={styles['search-button']}
          disabled={!searchValue.length > 0}
        >
          Qidirish
        </button>
      </div>

      <div className={styles.map} ref={mapRef}>
        {loadError && (
          <div className={styles['error-message']}>
            ❌ Xarita yuklanmadi: {loadError}
            <Button
              variant={'danger'}
              type="button"
              onClick={initializeMap}
              style={{ marginLeft: '10px', padding: '5px 10px' }}
            >
              Qayta urinish
            </Button>
          </div>
        )}
        {!isMapLoaded && !loadError && (
          <div className={styles['loading']}>Xarita yuklanmoqda...</div>
        )}
        {!hasCoords && isMapLoaded && (
          <div className={styles['no-location']}>
            ⚠️ Geolokatsiya aniqlanmadi, xaritada standart joylashuv (Toshkent)
            ko'rsatilmoqda.
          </div>
        )}
      </div>
    </div>
  );
};

export default YandexMap;
