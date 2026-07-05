import React, { useEffect } from "react";

interface ToastProps {
  message: string;
  onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({ message, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 2000);

    return () => clearTimeout(timer);
  }, [onClose, message]);

  return (
    <div className="toast-overlay">
      <div className="toast-box">{message}</div>
    </div>
  );
};

export default Toast;
