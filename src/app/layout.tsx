import type { Metadata } from "next";
import { Playfair_Display, Lato, Great_Vibes } from "next/font/google";
import "./globals.css";
import { LayoutShell } from "@/components/layout/LayoutShell";
import { CartProvider } from "@/context/CartContext";
import { AdminProvider } from "@/context/AdminContext";
import { AuthProvider } from "@/context/AuthContext";
import { WishlistProvider } from "@/context/WishlistContext";
import { ReviewProvider } from "@/context/ReviewContext";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-heading",
  display: "swap",
});

const lato = Lato({
  subsets: ["latin"],
  weight: ["300", "400", "700", "900"],
  variable: "--font-body",
  display: "swap",
});

const greatVibes = Great_Vibes({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-script",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Mahalakshmi Silk Saree | Premium Handcrafted Silk Sarees",
  description:
    "Discover exquisite handcrafted soft silk sarees. Premium quality, traditional weaving, modern elegance.",
  keywords: "soft silk sarees, silk sarees, wedding sarees, Indian sarees",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${playfair.variable} ${lato.variable} ${greatVibes.variable}`}>
      <body className="antialiased">
        <AdminProvider>
          <AuthProvider>
            <ReviewProvider>
              <WishlistProvider>
                <CartProvider>
                  <LayoutShell>{children}</LayoutShell>
                </CartProvider>
              </WishlistProvider>
            </ReviewProvider>
          </AuthProvider>
        </AdminProvider>
      </body>
    </html>
  );
}
