import { useEffect, useRef, useState } from 'react';
import loadYandexMaps from '@/utils/loadYandexMaps';
import hasRole from '@utils/hasRole';
import styles from './style.module.scss';
import useAlert from '@hooks/useAlert';
import useAuth from '@hooks/useAuth';
import useToggle from '@hooks/useToggle';
import useIsMobile from '@hooks/useIsMobile';
import classNames from 'classnames';
const YandexMap = ({ userCoords = {}, onChangeCoords }) => {
  const { alert } = useAlert();
  const { user } = useAuth();
  const isMobile = useIsMobile();
  const { isOpen: isSidebarOpen } = useToggle('sidebar');
  const mapRef = useRef(null);
  const inputRef = useRef(null);
  const placemarkRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const isManager = hasRole(user, ['Manager']);
  const [searchValue, setSearchValue] = useState('');
  const API_KEY = import.meta.env.VITE_YANDEX_API_KEY;
  const DEFAULT_COORDS = [41.311081, 69.240562];
  const hasCoords = userCoords?.lat && userCoords?.long;

  useEffect(() => {
    loadYandexMaps(API_KEY).then((ymaps) => {
      if (!mapRef.current || !inputRef.current) return;

      // Setup suggestions with debounced handler
      const suggestView = new ymaps.SuggestView(inputRef.current, {
        provider: {
          suggest: (request, options) => {
            // Add bounds to limit search area
            const bounds = mapInstanceRef.current?.getBounds();
            return ymaps
              .suggest(request, {
                boundedBy: bounds,
                results: 5, // Limit results
                ...options,
              })
              .then((items) => items.slice(0, 5)); // Additional safety limit
          },
        },
        results: 5,
        boundedBy: mapInstanceRef.current?.getBounds(),
      });

      // Prevent recursive suggestions
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

          mapInstanceRef.current.setCenter(coords, 14, {
            checkZoomRange: true,
          });
          placemarkRef.current.geometry.setCoordinates(coords);
          placemarkRef.current.properties.set({
            balloonContent: address,
            hintContent: address,
          });

          onChangeCoords?.(coords, address);
        } catch (error) {
          console.error('Suggestion processing error:', error);
        } finally {
          isProcessingSuggestion = false;
        }
      });

      const coords = hasCoords
        ? [userCoords.lat, userCoords.long]
        : DEFAULT_COORDS;

      const map = new ymaps.Map(mapRef.current, {
        center: coords,
        zoom: 12,
        controls: ['zoomControl'],
      });

      mapInstanceRef.current = map;

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
        ymaps.geocode(newCoords).then((res) => {
          const address = res.geoObjects.get(0)?.getAddressLine();
          onChangeCoords?.(newCoords, address);
        });
      });

      map.geoObjects.add(placemark);
    });
  }, [isSidebarOpen]);

  const handleSearch = async () => {
    if (!window.ymaps || !searchValue || !mapInstanceRef.current) return;

    try {
      const res = await window.ymaps.geocode(searchValue, {
        boundedBy: mapInstanceRef.current.getBounds(),
        results: 1,
      });
      console.log(res.geoObjects.get(0), 'response');
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
    <div className={styles['yandex-map-container']}>
      <div className={classNames(styles['search-container'], {
        [styles["hidden"]]: !isManager
      })}>
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
        {!hasCoords && (
          <div className={styles['no-location']}>
            ⚠️ Geolokatsiya aniqlanmadi, xaritada standart joylashuv (Toshkent)
            ko‘rsatilmoqda.
          </div>
        )}
      </div>
    </div>
  );
};

export default YandexMap;
