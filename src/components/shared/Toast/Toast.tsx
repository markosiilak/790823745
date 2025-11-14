"use client";

import { useEffect, useRef, useState } from "react";
import { Toast as StyledToast, ToastMessage, ToastCloseButton, ToastContainer } from "./styles";
import type { ToastProps, ToastListProps, ToastType } from "./types";

export type { ToastType } from "./types";

function Toast({ toast, onRemove }: ToastProps) {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const exitTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    const duration = toast.duration ?? 4000;

    timeoutRef.current = setTimeout(() => {
      setIsExiting(true);
      exitTimeoutRef.current = setTimeout(() => {
        onRemove(toast.id);
      }, 300);
    }, duration);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      if (exitTimeoutRef.current) {
        clearTimeout(exitTimeoutRef.current);
      }
    };
  }, [toast.id, toast.duration, onRemove]);

  const handleClose = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    if (exitTimeoutRef.current) {
      clearTimeout(exitTimeoutRef.current);
    }
    setIsExiting(true);
    exitTimeoutRef.current = setTimeout(() => {
      onRemove(toast.id);
    }, 300);
  };

  return (
    <StyledToast $isExiting={isExiting}>
      <ToastMessage>{toast.message}</ToastMessage>
      <ToastCloseButton type="button" onClick={handleClose} aria-label="Close">
        ×
      </ToastCloseButton>
    </StyledToast>
  );
}

export function ToastList({ toasts, onRemove }: ToastListProps) {
  if (toasts.length === 0) {
    return null;
  }

  return (
    <ToastContainer role="region" aria-live="polite" aria-label="Notifications">
      {toasts.map((toast: ToastType) => (
        <Toast key={toast.id} toast={toast} onRemove={onRemove} />
      ))}
    </ToastContainer>
  );
}

