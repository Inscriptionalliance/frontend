import React, { useEffect, useRef } from "react";

export function useObjectFitCover(imgRef: any) {
  useEffect(() => {
    const imgEl = imgRef.current;

    function updateStyleToFit() {
      if (imgEl) {
        const { width, height } = imgEl.getBoundingClientRect();
        const { naturalWidth, naturalHeight } = imgEl;
        const imageRatio = naturalWidth / naturalHeight;
        const containerRatio = width / height;

        if (imageRatio > containerRatio) {
          imgEl.style.width = "auto";
          imgEl.style.height = "100%";
        } else {
          imgEl.style.width = "100%";
          imgEl.style.height = "auto";
        }
      }
    }

    window.addEventListener("resize", updateStyleToFit);
    imgEl && imgEl.addEventListener("load", updateStyleToFit);

    // Call the function to update the style on mount
    updateStyleToFit();

    // Cleanup event listeners on unmount
    return () => {
      window.removeEventListener("resize", updateStyleToFit);
      imgEl && imgEl.removeEventListener("load", updateStyleToFit);
    };
  }, [imgRef]); // Only re-run if imgRef changes
}
