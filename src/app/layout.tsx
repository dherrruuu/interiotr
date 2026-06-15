import type { Metadata } from "next";
import { Cormorant_Garamond, Manrope } from "next/font/google";

import { ThemeProvider } from "@/components/theme-provider";
import "./globals.css";

const displayFont = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const bodyFont = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Balaji Wood Decor | Luxury Interior Design & Execution",
  description:
    "Frontend-only luxury website for Balaji Wood Decor, an interior design studio & Execution company.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${displayFont.variable} ${bodyFont.variable} h-full scroll-smooth antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full bg-[color:var(--background)] text-[color:var(--foreground)]">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
