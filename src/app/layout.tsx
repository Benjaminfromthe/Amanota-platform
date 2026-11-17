import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { AppContextProvider } from "@/context/AppContext";

export const metadata: Metadata = {
  title: "AMANOTA — AUCA Peer Academic Network",
  description:
    "The high-trust academic video learning library and verified peer tutoring marketplace for AUCA campus excellence.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {/* AuthProvider must wrap AppContextProvider so AppContext can read the Supabase session */}
        <AuthProvider>
          <AppContextProvider>
            {children}
          </AppContextProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
