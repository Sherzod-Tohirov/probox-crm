import { useEffect, useRef } from 'react';
import loadYandexMaps from '@/utils/loadYandexMaps';
import styles from './style.module.scss';

const YandexMap = ({ userCoords = {}, onChangeCoords }) => {
  const mapRef = useRef(null);
  const API_KEY = import.meta.env.VITE_YANDEX_API_KEY;
  const DEFAULT_COORDS = [41.311081, 69.240562];
  const hasCoords = userCoords?.lat && userCoords?.long;
  useEffect(() => {
    loadYandexMaps(API_KEY).then((ymaps) => {
      if (!mapRef.current) return;

      const coords = hasCoords
        ? [userCoords.lat, userCoords.long]
        : DEFAULT_COORDS;
      const map = new ymaps.Map(mapRef.current, {
        center: coords,
        zoom: 12,
        controls: ['zoomControl'],
      });

      const placemark = new window.ymaps.Placemark(
        coords,
        {
          hintContent: 'Meni yurgiz',
          balloonContent: 'Bu sizning joyingiz',
        },
        {
          draggable: true, // Make the placemark draggable
        }
      );

      // 🧲 Catch the change event when dragging ends
      placemark.events.add('dragend', function () {
        const newCoords = placemark.geometry.getCoordinates();

        // Optional: Reverse geocode to get address
        window.ymaps.geocode(newCoords).then((res) => {
          const newAddress = res.geoObjects.get(0)?.getAddressLine();
          if (onChangeCoords && typeof onChangeCoords === 'function') {
            onChangeCoords(newCoords, newAddress);
          }
        });
      });
      map.geoObjects.add(placemark);
    });
  }, []);

  return (
    <div className={styles.map} ref={mapRef}>
      {!hasCoords && (
        <div className={styles['no-location']}>
          ⚠️ Geolokatsiya aniqlanmadi, xaritada standart joylashuv (Toshkent)
          ko‘rsatilmoqda.
        </div>
      )}
    </div>
  );
};

export default YandexMap;
