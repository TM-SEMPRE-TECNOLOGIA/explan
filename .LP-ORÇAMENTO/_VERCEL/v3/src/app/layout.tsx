import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Explan Orçamento Express",
  description: "Sistema de orçamento premium — Explan Marcenaria",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Archivo:wght@300;400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
        <script src="https://unpkg.com/lucide@0.468.0" defer />
      </head>
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
