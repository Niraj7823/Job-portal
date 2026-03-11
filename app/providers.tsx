"use client";

import { HeroUIProvider } from "@heroui/react";
import { Toaster } from "react-hot-toast";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <HeroUIProvider>
      {children}
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            zIndex: 99999,
          },
        }}
      />
    </HeroUIProvider>
  );
}
