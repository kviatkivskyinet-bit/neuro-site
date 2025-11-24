'use client';

import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-black border-t border-green-500/20 text-white py-12 px-4">
      <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-8">
        <div className="space-y-4">
          <h3 className="text-2xl font-bold">
            <span className="bg-gradient-to-r from-green-400 to-cyan-400 bg-clip-text text-transparent">
              NEUROSOUL
            </span>
            <span className="text-white ml-2">DOCTOR</span>
          </h3>
          <p className="text-gray-400">
            Трансформація свідомості через науку та технології
          </p>
          <Link href="/admin" className="inline-block bg-green-500/10 text-green-400 px-4 py-2 rounded-full text-sm hover:bg-green-500/20 transition-colors border border-green-500/30">
            Вхід для власника
          </Link>
        </div>
        <div className="space-y-2">
          <h4 className="font-semibold text-green-400">Навігація</h4>
          <div className="space-y-1">
            <Link href="/" className="block text-gray-400 hover:text-green-400 transition-colors">Головна</Link>
            <Link href="/shop" className="block text-gray-400 hover:text-green-400 transition-colors">Курси</Link>
            <Link href="/cart" className="block text-gray-400 hover:text-green-400 transition-colors">Корзина</Link>
          </div>
        </div>
        <div className="space-y-2">
          <p className="text-gray-400">© 2025 NeuroSoul Doctor.</p>
          <p className="text-sm text-gray-500">Всі права захищені</p>
        </div>
      </div>
    </footer>
  );
}
