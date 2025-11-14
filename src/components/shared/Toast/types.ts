export type ToastType = Readonly<{
  id: string;
  message: string;
  duration?: number;
}>;

export interface ToastProps {
  readonly toast: ToastType;
  readonly onRemove: (id: string) => void;
}

export interface ToastListProps {
  readonly toasts: readonly ToastType[];
  readonly onRemove: (id: string) => void;
}

export type ToastContextType = Readonly<{
  showToast: (message: string, duration?: number) => void;
}>;

export interface ToastProviderProps {
  readonly children: React.ReactNode;
}

