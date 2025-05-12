import { useCallback } from "react";
import html2canvas from "html2canvas";
import useAlert from "@hooks/useAlert";

const useSaveScreenshot = () => {
  const { alert } = useAlert();
  // Example: Replace inputs with their values before capture
  const patchInputValues = (element) => {
    const inputs = element.querySelectorAll("input, textarea, select");
    inputs.forEach((input) => {
      if (input.type === "checkbox" || input.type === "radio") return;

      const span = document.createElement("span");
      const styles = window.getComputedStyle(input);

      span.textContent = input.value;
      span.style.cssText = `
        position: absolute;
        left: ${input.offsetLeft}px;
        top: ${input.offsetTop}px;
        width: ${input.offsetWidth}px;
        height: ${input.offsetHeight}px;
        font: ${styles.font};
        line-height: ${input.offsetHeight}px;
        color: ${styles.color};
        background: ${styles.backgroundColor || "white"};
        padding: ${styles.padding};
        border: ${styles.border};
        box-sizing: border-box;
        z-index: 9999;
      `;

      // Add temporary overlay
      element.appendChild(span);
      input.style.visibility = "hidden";
    });
  };
  const handleSaveScreenshot = useCallback(async (captureRef) => {
    const element = captureRef.current;
    if (!element) return;

    // Wait for all fonts
    await document.fonts.ready;

    // Force input values to be visible
    const inputs = element.querySelectorAll("input, textarea, select");
    inputs.forEach((input) => {
      input.setAttribute("value", input.value);
    });

    // Remove CSS constraints
    element.style.overflow = "visible";

    // Give browser time to flush changes
    setTimeout(() => {
      requestAnimationFrame(async () => {
        const canvas = await html2canvas(element, {
          allowTaint: true,
          useCORS: true,
          backgroundColor: "#fff", // or null for transparent
          scale: 2, // improve text clarity
        });
        const link = document.createElement("a");
        link.href = canvas.toDataURL("image/png");
        link.download = "screenshot.png";
        link.click();
      });
    }, 300); // Delay to allow DOM repaint
  }, []);

  return { handleSaveScreenshot };
};

export default useSaveScreenshot;
