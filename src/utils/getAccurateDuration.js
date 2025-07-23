const getAccurateDuration = (blob) => {
  return new Promise((resolve) => {
    const tempAudio = document.createElement('audio');
    tempAudio.src = URL.createObjectURL(blob);
    tempAudio.preload = 'metadata';

    tempAudio.addEventListener('loadedmetadata', () => {
      if (tempAudio.duration === Infinity) {
        // Hack: seek to a large number to force browser to read full metadata
        tempAudio.currentTime = 1e101;
        tempAudio.ontimeupdate = () => {
          tempAudio.ontimeupdate = null;
          resolve(tempAudio.duration);
          tempAudio.currentTime = 0;
        };
      } else {
        resolve(tempAudio.duration);
      }
    });
  });
};

export default getAccurateDuration;
