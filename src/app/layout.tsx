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
      <head>
        {/* Material Symbols */}
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"
        />
      </head>
      <body>
        <AppContextProvider>{children}</AppContextProvider>
      </body>
    </html>
  );
}
