"use client";

import React, { createContext, useContext, ReactNode } from "react";
import { Toaster, toast, type ExternalToast } from "sonner";

interface NotificationContextType {
  notify: (message: string, options?: ExternalToast) => void;
  error: (message: string, options?: ExternalToast) => void;
  success: (message: string, options?: ExternalToast) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined
);

export function NotificationProvider({ children }: { children: ReactNode }) {
  const notify = (message: string, options?: ExternalToast) => toast(message, options);
  const error = (message: string, options?: ExternalToast) => toast.error(message, options);
  const success = (message: string, options?: ExternalToast) =>
    toast.success(message, options);

  return (
    <NotificationContext.Provider value={{ notify, error, success }}>
      <Toaster 
        richColors 
        position="top-right"
        closeButton
        expand={true}
        theme="light"
      />
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error(
      "useNotifications must be used within a NotificationProvider"
    );
  }
  return context;
}
