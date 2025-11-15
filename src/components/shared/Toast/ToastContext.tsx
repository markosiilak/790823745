"use client";

import { createContext, useContext, useState, useCallback } from "react";
import { ToastList } from "./Toast";
import type { ToastType, ToastContextType, ToastProviderProps } from "./types";

const ToastContext = createContext<ToastContextType | undefined>(undefined);

function generateToastId(): string {
  return `toast-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

export function ToastProvider({ children }: ToastProviderProps): React.ReactElement {
  const [toasts, setToasts] = useState<readonly ToastType[]>([]);

  const showToast = useCallback((message: string, duration?: number) => {
    const id = generateToastId();
    setToasts((prev) => [...prev, { id, message, duration }]);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <ToastList toasts={toasts} onRemove={removeToast} />
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}

