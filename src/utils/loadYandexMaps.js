function loadYandexMaps() {
  return new Promise((resolve, reject) => {
    if (window?.ymaps) return resolve(window.ymaps);
    const API_KEY = import.meta.env.VITE_YANDEX_API_KEY;
    const SUGGESTIONS_API_KEY = import.meta.env.VITE_YANDEX_SUGGESTIONS_API_KEY;
    if (!API_KEY || !SUGGESTIONS_API_KEY) {
      return reject(new Error('Yandex Maps API key is not defined'));
    }

    const script = document.createElement('script');
    script.src =
      'https://api-maps.yandex.ru/2.1/?lang=uz_UZ&apikey=' +
      API_KEY +
      '&suggest_apikey=' +
      SUGGESTIONS_API_KEY +
      '&mode=release';
    script.type = 'text/javascript';
    script.crossOrigin = 'anonymous'; // Add this line
    script.onload = () => window.ymaps.ready(() => resolve(window.ymaps));
    script.onerror = reject;
    document.head.appendChild(script);
  });
}

export default loadYandexMaps;
