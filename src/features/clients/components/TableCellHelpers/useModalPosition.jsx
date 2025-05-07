import { useState, useEffect, useCallback } from "react";

const useModalPosition = (buttonRef, modalRef, showModal) => {
  const [position, setPosition] = useState({ top: 0, left: 0 });

  const calculateModalPosition = useCallback(() => {
    if (!buttonRef.current) return { top: 0, left: 0 };

    const boundaries = buttonRef.current.getBoundingClientRect();
    const windowHeight = window.innerHeight;
    const modalHeight = modalRef.current?.offsetHeight || 300;
    const scrollY = window.scrollY;

    let top = boundaries.bottom + scrollY + 10;

    const spaceBelow = windowHeight - boundaries.bottom;
    if (spaceBelow < modalHeight && boundaries.top > modalHeight) {
      top = boundaries.top + scrollY - modalHeight - 10;
    }

    const modalWidth = modalRef.current?.offsetWidth || 300;
    let left = boundaries.left - modalWidth - 10;

    const minLeft = 10;
    left = Math.max(minLeft, left);

    return { top, left };
  }, [buttonRef, modalRef]);

  const updatePosition = useCallback(() => {
    setPosition(calculateModalPosition());
  }, [calculateModalPosition]);

  useEffect(() => {
    if (!showModal) return;

    const debouncedUpdate = () => {
      requestAnimationFrame(updatePosition);
    };

    window.addEventListener("scroll", debouncedUpdate);
    window.addEventListener("resize", debouncedUpdate);

    updatePosition();

    return () => {
      window.removeEventListener("scroll", debouncedUpdate);
      window.removeEventListener("resize", debouncedUpdate);
    };
  }, [showModal, updatePosition]);

  return { position, updatePosition };
};

export default useModalPosition;
