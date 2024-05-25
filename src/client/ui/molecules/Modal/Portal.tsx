import { createPortal } from "react-dom";
import React, { useEffect, useRef, useState } from "react";

export const ModalPortal: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const ref = useRef<HTMLElement>();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const element = document.getElementById("modalPortal");
    if (element) {
      ref.current = element;
    } else {
      const portalRoot = document.createElement("div");
      portalRoot.setAttribute("id", "modalPortal");
      document.body.appendChild(portalRoot);

      ref.current = portalRoot;
    }
    setMounted(true);
  }, []);

  if (ref.current) {
    return mounted ? createPortal(children, ref.current) : null;
  }

  return null;
};
