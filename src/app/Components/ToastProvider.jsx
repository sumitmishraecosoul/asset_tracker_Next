"use client";

import { createContext, useContext, useState, useCallback, useEffect } from "react";
import { FiCheck, FiX, FiLoader, FiAlertCircle } from "react-icons/fi";

const ToastContext = createContext();

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};

const Toast = ({ toast, onRemove }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);

  useEffect(() => {
    // Trigger entrance animation
    const timer = setTimeout(() => setIsVisible(true), 10);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (toast.duration && toast.duration > 0) {
      const timer = setTimeout(() => {
        handleRemove();
      }, toast.duration);

      return () => clearTimeout(timer);
    }
  }, [toast.duration]);

  const handleRemove = useCallback(() => {
    setIsLeaving(true);
    setTimeout(() => {
      onRemove(toast.id);
    }, 300);
  }, [toast.id, onRemove]);

  const getToastIcon = () => {
    switch (toast.type) {
      case "success":
        return <FiCheck className="h-5 w-5 text-emerald-600" />;
      case "error":
        return <FiX className="h-5 w-5 text-red-600" />;
      case "loading":
        return <FiLoader className="h-5 w-5 text-blue-600 animate-spin" />;
      default:
        return <FiAlertCircle className="h-5 w-5 text-slate-600" />;
    }
  };

  const getToastStyles = () => {
    const baseStyles = "bg-white border border-slate-200 shadow-lg rounded-xl p-4 min-w-[320px] max-w-[400px]";
    
    switch (toast.type) {
      case "success":
        return `${baseStyles} border-l-4 border-l-emerald-500`;
      case "error":
        return `${baseStyles} border-l-4 border-l-red-500`;
      case "loading":
        return `${baseStyles} border-l-4 border-l-blue-500`;
      default:
        return `${baseStyles} border-l-4 border-l-slate-500`;
    }
  };

  return (
    <div
      className={`transform transition-all duration-300 ease-in-out ${
        isVisible && !isLeaving
          ? "translate-x-0 opacity-100"
          : "translate-x-full opacity-0"
      }`}
    >
      <div className={getToastStyles()}>
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 mt-0.5">
            {getToastIcon()}
          </div>
          <div className="flex-1 min-w-0">
            {toast.title && (
              <h4 className="text-sm font-semibold text-slate-900 mb-1">
                {toast.title}
              </h4>
            )}
            <p className="text-sm text-slate-700 leading-relaxed">
              {toast.message}
            </p>
          </div>
          <button
            onClick={handleRemove}
            className="flex-shrink-0 p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <FiX className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((toast) => {
    const id = Math.random().toString(36).substr(2, 9);
    const newToast = {
      id,
      type: "info",
      duration: 3000,
      ...toast,
    };

    setToasts((prev) => [...prev, newToast]);
    return id;
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const success = useCallback((message, options = {}) => {
    return addToast({
      type: "success",
      message,
      duration: 3000,
      ...options,
    });
  }, [addToast]);

  const error = useCallback((message, options = {}) => {
    return addToast({
      type: "error",
      message,
      duration: 5000,
      ...options,
    });
  }, [addToast]);

  const loading = useCallback((message, options = {}) => {
    return addToast({
      type: "loading",
      message,
      duration: 0, // Loading toasts don't auto-dismiss
      ...options,
    });
  }, [addToast]);

  const dismiss = useCallback((id) => {
    removeToast(id);
  }, [removeToast]);

  const promise = useCallback(async (promise, messages) => {
    const loadingId = loading(messages.loading || "Loading...");

    try {
      const result = await promise;
      dismiss(loadingId);
      success(messages.success || "Operation completed successfully");
      return result;
    } catch (error) {
      dismiss(loadingId);
      error(messages.error || "Operation failed");
      throw error;
    }
  }, [loading, dismiss, success, error]);

  const value = {
    success,
    error,
    loading,
    dismiss,
    promise,
  };

  return (
    <ToastContext.Provider value={value}>
      {children}
      
      {/* Toast Container */}
      <div className="fixed top-4 right-4 z-[9999] space-y-3 pointer-events-none">
        {toasts.map((toast) => (
          <div key={toast.id} className="pointer-events-auto">
            <Toast toast={toast} onRemove={removeToast} />
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};
