import type { Metadata } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-display",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://cupc.vercel.app"),
  title: "CUPC - Chittagong University Physics Club",
  description: "Discovering the universe through physics.",
  openGraph: {
    title: "CUPC - Chittagong University Physics Club",
    description: "Discovering the universe through physics.",
    url: "https://cupc.vercel.app", // Replace with your actual domain
    siteName: "CUPC",
    images: [
      {
        url: "/CUPC_logo.jpg",
        width: 800,
        height: 600,
        alt: "CUPC Logo",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "CUPC - Chittagong University Physics Club",
    description: "Discovering the universe through physics.",
    images: ["/CUPC_logo.jpg"],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${plusJakarta.variable} h-full antialiased scroll-smooth`}
    >
      <body className="min-h-full flex flex-col font-sans overscroll-none">
        {children}
        <Toaster position="top-center" />
      </body>
    </html>
  );
}
