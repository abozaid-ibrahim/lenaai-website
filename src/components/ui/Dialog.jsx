"use client";

import { X } from "lucide-react";
import ReactDOM from "react-dom";
import { useEffect, useRef, useState } from "react";

/**
 * INFO: Why `createPortal`?
 *  - Allows to render dialog comp outside of its parent DOM hierarchy, How this can help:
 *      1- Avoiding CSS overflow issues.
 *      2- Z-index management.
 */
const DialogPortal = ({ children }) => {
  const [isMounted, setIsMounted] = useState(false);

  /**
   * INFO: why `useEffect`?
   *    - Avoid SSR issues: On the server `document.body` is not exist => leading to errors during server-side rendering.
   *    - Avoid Potential Rendering issues: The dialog might attempt to render before the DOM is fully ready => causing errors or unexpected behavior.
   *    - No Cleanup: without `cleanup` => the comp might leave behind stale state.
   */
  useEffect(() => {
    setIsMounted(true);

    return () => setIsMounted(false);
  }, []);

  if (!isMounted) return null;

  return ReactDOM.createPortal(children, document.body);
};

const Dialog = ({
  isOpen,
  onClose,
  title,
  children,
  closeOnOverlayClick = true,
  showCloseButton,
  className = ""
}) => {
  const dialogRef = useRef(null);
  const contentRef = useRef(null);

  // Handle Escape key press
  const onkeyDown = (e) => {
    if (isOpen && e.key === "Escape") onClose();
  };

  // Handle click outside dialog
  const handleOverlayClick = (e) => {
    if (closeOnOverlayClick && isOpen && dialogRef.current === e.target)
      onClose();
  };

  useEffect(() => {
    if (isOpen) {
      // Focus management
      contentRef.current?.focus();

      document.addEventListener("keydown", onkeyDown);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", onkeyDown);
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const sizeClasses = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-xl",
    "2xl": "max-w-2xl",
    full: "max-w-full w-full"
  };

  return (
    <DialogPortal>
      <div
        ref={dialogRef}
        onClick={handleOverlayClick}
        role="dialog"
        aria-modal="true"
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0"
      >
        <div
          ref={contentRef}
          tabIndex="-1"
          className={`inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle ${sizeClasses[size]} w-full ${className}`}
        >
          {/* Dialog Header */}
          <div className="flex items-center gap-3">
            <X />
            <h3 className="flex-1 flex items-center justify-between">
              {title}
            </h3>
          </div>

          {/* Dialog Body */}
          <div>{children}</div>
        </div>
      </div>
    </DialogPortal>
  );
};
