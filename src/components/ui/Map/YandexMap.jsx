import { useEffect, useRef, useState } from 'react';
import loadYandexMaps from '@/utils/loadYandexMaps';
import styles from './style.module.scss';
import useAlert from '@hooks/useAlert';
const YandexMap = ({ userCoords = {}, onChangeCoords }) => {
  const { alert } = useAlert();
  const mapRef = useRef(null);
  const inputRef = useRef(null);
  const placemarkRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const [searchValue, setSearchValue] = useState('');

  const API_KEY = import.meta.env.VITE_YANDEX_API_KEY;
  const DEFAULT_COORDS = [41.311081, 69.240562];
  const hasCoords = userCoords?.lat && userCoords?.long;

  useEffect(() => {
    loadYandexMaps(API_KEY).then((ymaps) => {
      if (!mapRef.current || !inputRef.current) return;

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
        { draggable: true }
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

      // 🔎 Setup SuggestView
      const suggestView = new ymaps.SuggestView(inputRef.current);

      suggestView.events.add('select', (e) => {
        const selected = e.get('item').value;
        ymaps.geocode(selected).then((res) => {
          const firstGeoObject = res.geoObjects.get(0);
          const coords = firstGeoObject.geometry.getCoordinates();
          const address = firstGeoObject.getAddressLine();

          map.setCenter(coords, 14, { checkZoomRange: true });
          placemark.geometry.setCoordinates(coords);
          placemark.properties.set({
            balloonContent: address,
            hintContent: address,
          });

          onChangeCoords?.(coords, address);
        });
      });
    });
  }, [searchValue]);

  const handleSearch = () => {
    if (!window.ymaps || !searchValue) return;

    window.ymaps.geocode(searchValue).then((res) => {
      const firstGeoObject = res.geoObjects.get(0);
      if (!firstGeoObject) {
        alert("Manzil topilmadi. Iltimos, to'g'ri manzil kiriting.", {
          type: 'error',
        });
        return;
      }

      const coords = firstGeoObject.geometry.getCoordinates();
      const address = firstGeoObject.getAddressLine();
      console.log(address);
      // Move map and placemark
      if (mapInstanceRef.current) {
        mapInstanceRef.current.setCenter(coords, 14, { checkZoomRange: true });
      }

      if (placemarkRef.current) {
        placemarkRef.current.geometry.setCoordinates(coords);
        placemarkRef.current.properties.set({
          balloonContent: address,
          hintContent: address,
        });
      }

      if (onChangeCoords && typeof onChangeCoords === 'function') {
        onChangeCoords(coords, address);
      }
    });
  };

  return (
    <div className={styles['yandex-map-container']}>
      <div className={styles['search-container']}>
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
