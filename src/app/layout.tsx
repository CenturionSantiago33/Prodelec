import type { Metadata, Viewport } from "next";
import { Poppins, League_Spartan } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { CartDrawer } from "@/components/cart/CartDrawer";

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
  title: "Prodelec | Soluciones de Ingeniería para Redes de Agua y Saneamiento",
  description: "Fabricación nacional de cajas de conexión, abrazaderas y accesorios de polímeros para redes de agua potable y saneamiento.",
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
