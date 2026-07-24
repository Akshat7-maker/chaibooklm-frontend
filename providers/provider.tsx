"use client";

import { AuthProvider } from "./auth-provider";
import { SocketProvider } from "./socket-provider";
import TanstackProvider from "./tanstackprovider";
import { TooltipProvider } from "@/components/ui/tooltip";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <TanstackProvider>
        <TooltipProvider>
          <SocketProvider>{children}</SocketProvider>
        </TooltipProvider>
      </TanstackProvider>
    </AuthProvider>
  );
}
