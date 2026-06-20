import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "StreetHeat — Premium Sneakers & Streetwear",
  description: "Authenticated sneakers and streetwear. Make an offer, earn loyalty points, shop the heat.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className} style={{ backgroundColor: "#0A0A0A", color: "white", minHeight: "100vh" }}>
        <Navbar />
        {children}
      </body>
    </html>
  );
}