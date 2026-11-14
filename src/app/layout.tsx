import type { Metadata } from "next";
import "./globals.css";
import { AppContextProvider } from "@/context/AppContext";

export const metadata: Metadata = {
  title: "AMANOTA — AUCA Peer Academic Network",
  description:
    "The high-trust academic video learning library and verified peer tutoring marketplace for AUCA campus excellence.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AppContextProvider>{children}</AppContextProvider>
      </body>
    </html>
  );
}
