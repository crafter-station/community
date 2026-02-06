import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { JetBrains_Mono } from "next/font/google";

import "./globals.css";

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Crafter Station | Comunidad de Builders Tech en Perú",
    template: "%s | Crafter Station",
  },
  description:
    "Directorio de builders, desarrolladores y creadores tech en Perú. Descubre proyectos innovadores, conecta con la comunidad y comparte lo que estás construyendo.",
  keywords: [
    "builders peru",
    "tech peru",
    "desarrolladores peru",
    "startups peru",
    "comunidad tech",
    "proyectos tech peru",
  ],
  authors: [{ name: "Crafter Station" }],
  creator: "Crafter Station",
  openGraph: {
    type: "website",
    locale: "es_PE",
    siteName: "Crafter Station",
    title: "Crafter Station | Comunidad de Builders Tech en Perú",
    description:
      "Directorio de builders, desarrolladores y creadores tech en Perú.",
  },
  twitter: {
    card: "summary_large_image",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider
      appearance={{
        baseTheme: dark,
        variables: {
          colorPrimary: "#FFD700",
          colorBackground: "#000000",
          colorInputBackground: "#0A0A0A",
          colorInputText: "#FAFAFA",
        },
      }}
    >
      <html lang="es" className="dark">
        <body
          className={`${jetbrainsMono.variable} font-mono antialiased bg-[#000000] text-white`}
        >
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
