import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { cn } from "../../../utils/cn";

export const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  footer,
  className,
  closeOnOverlayClick = true,
}:any) => {
  const modalRef = useRef(null);

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "Escape") onClose();
      // Optional: trap focus here if you want advanced accessibility
    };

    if (isOpen) {
      document.body.style.overflow = "hidden";
      document.addEventListener("keydown", handleKey);

      // Focus first focusable element inside modal or the modal container itself
      const firstFocusable = modalRef.current?.querySelector(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      (firstFocusable || modalRef.current)?.focus();
    }

    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", handleKey);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleOverlayClick = (e) => {
    if (closeOnOverlayClick && e.target === e.currentTarget) {
      onClose();
    }
  };

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center select-none"
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? "modal-title" : undefined}
      onClick={handleOverlayClick}
      // animation container
      style={{ animation: "fadeInOverlay 0.3s ease forwards" }}
    >
      {/* Overlay with blur & subtle dim */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
        aria-hidden="true"
        // fade-in handled by parent div's animation
      />

      {/* Modal box */}
      <div
        ref={modalRef}
        tabIndex={-1}
        className={cn(
          "relative z-10 w-full max-w-lg mx-auto rounded-lg bg-white shadow-2xl overflow-y-auto focus:outline-none",
          "p-6 sm:p-8",
          "max-h-[80vh]",
          "animate-fadeInUp",
          className
        )}
        role="document"
      >
        <button
          onClick={onClose}
          aria-label="Close modal"
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded-full p-1 transition"
        >
          <X className="w-5 h-5" />
        </button>
        {title && (
          <h2
            id="modal-title"
            className="text-xl sm:text-2xl font-semibold mb-6 text-gray-900 select-text"
          >
            {title}
          </h2>
        )}
        <div>{children}</div>
        {footer && <div className="mt-6">{footer}</div>}
      </div>

      <style jsx>{`
        @keyframes fadeInOverlay {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeInUp {
          animation: fadeInUp 0.3s ease forwards;
        }
      `}</style>
    </div>,
    document.body
  );
};
