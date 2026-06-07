import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle, X, AlertTriangle, Info } from 'lucide-react';

type ToastType = 'success' | 'error' | 'warning' | 'info';

interface ToastProps {
  message: string;
  type: ToastType;
  duration?: number;
  onClose?: () => void;
}

interface ToastContainerProps {
  darkMode?: boolean;
}

export const Toast = ({ message, type, duration = 3000, onClose }: ToastProps) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      onClose?.();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle size={20} className="text-green-500" />;
      case 'error':
        return <X size={20} className="text-red-500" />;
      case 'warning':
        return <AlertTriangle size={20} className="text-yellow-500" />;
      case 'info':
        return <Info size={20} className="text-blue-500" />;
      default:
        return <Info size={20} className="text-gray-500" />;
    }
  };

  const getBackgroundColor = () => {
    switch (type) {
      case 'success':
        return 'bg-green-50 border-green-200';
      case 'error':
        return 'bg-red-50 border-red-200';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200';
      case 'info':
        return 'bg-blue-50 border-blue-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -50, scale: 0.9 }}
          className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 flex items-center gap-3 px-4 py-3 rounded-2xl border shadow-lg backdrop-blur-sm"
          style={{ backgroundColor: 'white' }}
        >
          <div className={`flex items-center gap-3 px-4 py-3 rounded-2xl border shadow-lg ${getBackgroundColor()}`}>
            {getIcon()}
            <span className="text-sm font-medium text-gray-800">{message}</span>
            <button
              onClick={() => {
                setIsVisible(false);
                onClose?.();
              }}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X size={16} />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Global toast container
let toastQueue: Array<{ id: string; message: string; type: ToastType; duration?: number }> = [];

export const showToast = (message: string, type: ToastType = 'info', duration?: number) => {
  const id = Date.now().toString();
  const newToast = { id, message, type, duration };
  
  toastQueue = [...toastQueue, newToast];
  
  // Trigger a custom event to notify the app
  window.dispatchEvent(new CustomEvent('showToast', { detail: newToast }));
};

export const ToastContainer = ({ darkMode }: ToastContainerProps) => {
  const [toasts, setToasts] = useState<Array<{ id: string; message: string; type: ToastType; duration?: number }>>([]);

  useEffect(() => {
    const handleShowToast = (event: CustomEvent) => {
      const newToast = event.detail;
      setToasts(prev => [...prev, newToast]);
      
      // Auto remove after duration
      setTimeout(() => {
        setToasts(prev => prev.filter(toast => toast.id !== newToast.id));
      }, newToast.duration || 3000);
    };

    window.addEventListener('showToast', handleShowToast as EventListener);
    
    return () => {
      window.removeEventListener('showToast', handleShowToast as EventListener);
    };
  }, []);

  return (
    <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 space-y-2 pointer-events-none">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: -50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -50, scale: 0.9 }}
            className="pointer-events-auto"
          >
            <div className={`flex items-center gap-3 px-4 py-3 rounded-2xl border shadow-lg backdrop-blur-sm ${
              darkMode 
                ? 'bg-slate-800 border-slate-600' 
                : 'bg-white border-gray-200'
            }`}>
              {toast.type === 'success' && <CheckCircle size={20} className={darkMode ? "text-green-400" : "text-green-500"} />}
              {toast.type === 'error' && <X size={20} className={darkMode ? "text-red-400" : "text-red-500"} />}
              {toast.type === 'warning' && <AlertTriangle size={20} className={darkMode ? "text-yellow-400" : "text-yellow-500"} />}
              {toast.type === 'info' && <Info size={20} className={darkMode ? "text-blue-400" : "text-blue-500"} />}
              <span className={`text-sm font-medium ${darkMode ? 'text-slate-100' : 'text-gray-800'}`}>{toast.message}</span>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};
