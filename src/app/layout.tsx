import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { Providers } from "@/providers/Providers";
import { ToastContainer } from "react-toastify";
import "./globals.css";
import "react-toastify/dist/ReactToastify.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://crosti-focaccias.vercel.app"),
  title: {
    default: "Crosti Focaccias | Focaccias Artesanales en Mar del Plata",
    template: "%s | Crosti Focaccias",
  },

  description:
    "Las mejores focaccias artesanales de Mar del Plata. Masa madre, ingredientes frescos y sabores únicos. Pedí las tuyas por WhatsApp.",

  keywords: [
    "focaccias",
    "focaccia artesanal",
    "Mar del Plata",
    "masa madre",
    "delivery focaccias",
    "Crosti Focaccias",
  ],

  authors: [{ name: "Crosti Focaccias" }],

  robots: {
    index: true,
    follow: true,
  },

  icons: {
    icon: "/CrostiSinFondo.png",
  },

  openGraph: {
    type: "website",
    url: "https://crosti-focaccias.vercel.app",
    title:
      "Crosti Focaccias | Focaccias Artesanales en Mar del Plata",
    description:
      "Las mejores focaccias artesanales de Mar del Plata. Masa madre e ingredientes frescos.",
    images: [
      {
        url: "/LogoCrosti.png",
        width: 1200,
        height: 630,
        alt: "Crosti Focaccias",
      },
    ],
    locale: "es_AR",
    siteName: "Crosti Focaccias",
  },

  twitter: {
    card: "summary_large_image",
    title:
      "Crosti Focaccias | Focaccias Artesanales en Mar del Plata",
    description:
      "Las mejores focaccias artesanales de Mar del Plata.",
    images: ["/LogoCrosti.png"],
  },

  alternates: {
    canonical: "/",
  },
};

export const viewport: Viewport = {
  themeColor: "#ffd700",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className={inter.variable}>
        <Providers>
          {children}
          <ToastContainer position="top-right" autoClose={3000} />
        </Providers>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Restaurant",
              name: "Crosti Focaccias",
              image: "https://crosti-focaccias.vercel.app/LogoCrosti.png",
              address: {
                "@type": "PostalAddress",
                addressLocality: "Mar del Plata",
                addressCountry: "AR",
              },
              servesCuisine: "Italian",
            }),
          }}
        />
      </body>
    </html>
  );
}
