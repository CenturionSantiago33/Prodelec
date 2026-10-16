import type { Metadata, Viewport } from "next";
import { Poppins, League_Spartan } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { HydraulicRippleProvider } from "@/components/ui/HydraulicRippleProvider";
import { AppHydration } from "@/components/system/AppHydration";
import { SITE } from "@/lib/site";

const poppins = Poppins({
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
  subsets: ["latin"],
});

const leagueSpartan = League_Spartan({
  weight: ["400", "600", "700", "800"],
  variable: "--font-league-spartan",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: "Prodelec | Soluciones de Ingeniería para Redes de Agua, Saneamiento y Gas",
    template: "%s | Prodelec",
  },
  description: SITE.description,
  applicationName: SITE.name,
  keywords: [
    "Prodelec",
    "cajas de conexión",
    "abrazaderas de derivación",
    "abrazaderas de reparación",
    "componentes para agua potable",
    "redes de saneamiento",
    "polímeros de ingeniería",
    "ISO 9001",
  ],
  openGraph: {
    type: "website",
    siteName: SITE.name,
    title: "Prodelec | Componentes poliméricos para redes de agua, saneamiento y gas",
    description: SITE.description,
    locale: "es_AR",
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
    <html
      lang="es"
      className={`${poppins.variable} ${leagueSpartan.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans">
        <AppHydration />
        <HydraulicRippleProvider />
        <Navbar />
        <main className="flex-1 flex flex-col">
          {children}
        </main>
        <Footer />
        <CartDrawer />
      </body>
    </html>
  );
}
