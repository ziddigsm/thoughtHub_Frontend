import { useEffect } from "react";

export function Alert({ type, message, onClose }) {
  const getAlertStyle = () => {
    switch (type) {
      case "success":
        return "bg-green-200 text-white border-green-400"; 
      case "error":
        return "bg-red-100 text-red-700 border-red-400";
      case "warning":
        return "bg-yellow-100 text-yellow-700 border-yellow-400";
      case "info":
        return "bg-blue-100 text-blue-700 border-blue-400";
      default:
        return "bg-gray-100 text-gray-700 border-gray-400";
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 5000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div
      className={`fixed top-4 left-1/2 transform -translate-x-1/2 w-80 p-4 mb-4 border-l-4 rounded-lg ${getAlertStyle()} flex justify-between items-center shadow-md transition-all duration-300 ease-in-out z-50`}
    >
      <div className="flex items-center space-x-2">
        <span>{message}</span>
      </div>
      <button
        onClick={onClose}
        className="ml-4 text-xl text-gray-500 hover:text-gray-700"
      >
        &times;
      </button>
    </div>
  );
}
