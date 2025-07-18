import { useEffect, useRef } from "react";
import loadYandexMaps from "@/utils/loadYandexMaps";

const YandexMap = ({ userCoords = [41.2995, 69.2401], onChangeCoords }) => {
  const mapRef = useRef(null);
  const API_KEY = import.meta.env.VITE_YANDEX_API_KEY;
  useEffect(() => {
    loadYandexMaps(API_KEY).then((ymaps) => {
      if (!mapRef.current) return;

      const map = new ymaps.Map(mapRef.current, {
        center: userCoords ?? [41.2995, 69.2401], // Tashkent
        zoom: 12,
        controls: ["zoomControl"],
      });

      const placemark = new window.ymaps.Placemark(
        userCoords,
        {
          hintContent: "Meni yurgiz",
          balloonContent: "Bu sizning joyingiz",
        },
        {
          draggable: true, // Make the placemark draggable
        }
      );

      // 🧲 Catch the change event when dragging ends
      placemark.events.add("dragend", function () {
        const newCoords = placemark.geometry.getCoordinates();

        // Optional: Reverse geocode to get address
        window.ymaps.geocode(newCoords).then((res) => {
          const newAddress = res.geoObjects.get(0)?.getAddressLine();
          if (onChangeCoords && typeof onChangeCoords === "function") {
            onChangeCoords(newCoords, newAddress);
          }
        });
      });
      map.geoObjects.add(placemark);
    });
  }, []);

  return <div ref={mapRef} style={{ width: "480px", height: "290px" }} />;
};

export default YandexMap;
