import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Free Fire - Ganhe Contas Grátis",
  description: "Jogue, acumule pontos e ganhe contas de Free Fire gratuitamente!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
