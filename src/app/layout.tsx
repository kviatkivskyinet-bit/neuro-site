import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
// Імпортуємо компоненти (вони мають бути у своїх файлах!)
import Header from "../components/Header";
import Footer from "../components/Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "NeuroSoul Doctor - Трансформація свідомості",
  description: "Експерт у сфері гіпнотерапії та психології впливу",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="uk" className="scroll-smooth">
      <body className={inter.className}>
        {/* 1. Вставляємо Шапку */}
        <Header />
        
        {/* 2. Вставляємо Контент сторінки (те, що в page.tsx) */}
        <main className="min-h-screen pt-16"> 
          {children}
        </main>
        
        {/* 3. Вставляємо Підвал */}
        <Footer />
      </body>
    </html>
  );
}
