"use client";

import { AuthProvider } from "./auth-provider";
import { SocketProvider } from "./socket-provider";
import TanstackProvider from "./tanstackprovider";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <TanstackProvider>
        <SocketProvider>{children}</SocketProvider>
      </TanstackProvider>
    </AuthProvider>
  );
}
