import { useCallback } from "react";
import domtoimage from "dom-to-image-more";
import useAlert from "@hooks/useAlert";
const useSaveScreenshot = () => {
  const { alert } = useAlert();
  const handleSaveScreenshot = useCallback(async (captureRef) => {
    const element = captureRef?.current || document.body;
    if (!element) return;
    // Wait for all fonts to load
    await document.fonts.ready;
    // Save original styles to restore after screenshot
    const originalStyle = {
      overflow: element.style.overflow,
      width: element.style.width,
      height: element.style.height,
    };

    try {
      // Ensure full size is captured
      const width = element.scrollWidth;
      const height = element.scrollHeight;
      const scale = 2; // Image quality scale

      // Apply temporary styles to eliminate scrollbars and set full dimensions
      element.style.overflow = "visible";
      element.style.width = `${width}px`;
      element.style.height = `${height}px`;

      // Generate image as blob with scaling
      const blob = await domtoimage.toBlob(element, {
        bgcolor: "#ffffff",
        width: width * scale,
        height: height * scale,
        style: {
          padding: "25px",
          transform: `scale(${scale})`,
          transformOrigin: "top left",
          width: `${width}px`,
          height: `150dvh`,
          overflow: "visible",
        },
      });

      // Try copying to clipboard (if supported)
      if (navigator.clipboard && window.ClipboardItem) {
        const clipboardItem = new ClipboardItem({ "image/png": blob });
        await navigator.clipboard.write([clipboardItem]);
        alert("Rasm vaqtinchalik xotiraga nusxalandi!");
      } else {
        // Fallback to download
        const dataUrl = await domtoimage.toPng(element);
        const link = document.createElement("a");
        link.download = "screenshot.png";
        link.href = dataUrl;
        link.click();
        console.warn(
          "⚠️ Clipboard not supported. Screenshot downloaded instead."
        );
      }
    } catch (error) {
      alert("Rasm yuklashda xatolik yuz berdi!", { type: "error" });
    } finally {
      // Restore original styles
      element.style.overflow = originalStyle.overflow;
      element.style.width = originalStyle.width;
      element.style.height = originalStyle.height;
    }
  }, []);

  return { handleSaveScreenshot };
};

export default useSaveScreenshot;
