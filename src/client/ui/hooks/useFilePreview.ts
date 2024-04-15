import { useEffect, useState } from "react";

export function useFilePreview(file: File | null) {
  const [imgSrc, setImgSrc] = useState<string | null>(null);

  useEffect(() => {
    if (file) {
      const newUrl = URL.createObjectURL(file);

      if (newUrl !== imgSrc) {
        setImgSrc(newUrl);
      }
    }
  }, [file]);

  return [imgSrc, setImgSrc] as const;
}
