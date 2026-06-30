import type { Metadata } from "next";
import { Inter, Sora } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });
const sora = Sora({ subsets: ["latin"], variable: "--font-display" });

export const metadata: Metadata = {
  title: "WhatsZap Mágico — Painel de Controle",
  description: "Gerencie suas instâncias de WhatsApp e automatize seus envios.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={`${inter.variable} ${sora.variable} h-full dark antialiased`}>
      <body className="min-h-full bg-[#0a0a0f] text-[#e8e8f0] font-sans">
        {children}
      </body>
    </html>
  );
}
