function loadYandexMaps() {
  return new Promise((resolve, reject) => {
    if (window?.ymaps) return resolve(window.ymaps);
    const API_KEY = import.meta.env.VITE_YANDEX_API_KEY;
    console.log(API_KEY, "Yandex API Key");
    console.log("variables", import.meta.env);
    if (!API_KEY) {
      return reject(new Error("Yandex Maps API key is not defined"));
    }

    const script = document.createElement("script");
    script.src = "https://api-maps.yandex.ru/2.1/?lang=ru_RU&apikey=" + API_KEY;
    script.type = "text/javascript";
    script.onload = () => window.ymaps.ready(() => resolve(window.ymaps));
    script.onerror = reject;
    document.head.appendChild(script);
  });
}

export default loadYandexMaps;
