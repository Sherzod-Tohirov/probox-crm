import { useCallback } from "react";
import domtoimage from "dom-to-image-more";
const useSaveScreenshot = () => {
  const handleSaveScreenshot = useCallback(async (captureRef) => {
    const element = captureRef.current;
    if (!element) return;

    // Wait for all fonts
    await document.fonts.ready;
      
    try {
      const dataUrl = await domtoimage.toPng(element, {
        bgcolor: "#fff",
        style: {
          padding: "20px",
          height: "100%",
        },
      });
      const link = document.createElement("a");
      link.download = "screenshot.png";
      link.href = dataUrl;
      link.click();
    } catch (error) {
      console.log(error);
    }
    
  }, []);

  return { handleSaveScreenshot };
};

export default useSaveScreenshot;
