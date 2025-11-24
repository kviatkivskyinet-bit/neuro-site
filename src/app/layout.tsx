import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
// Імпорт з папки components, яку ми створили вище
import Header from "../components/Header"; 

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "NeuroSoul - Магазин курсів",
  description: "Простір трансформації твоєї свідомості",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="uk">
      <body className={inter.className}>
        <Header />
        {children}
      </body>
    </html>
  );
}
