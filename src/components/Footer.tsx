'use client';

import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-12 px-4">
      <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-8">
        <div className="space-y-4">
          <h3 className="text-2xl font-bold text-amber-500">NEUROSSOUL DOCTOR</h3>
          <Link href="/admin" className="inline-block bg-gray-800 text-gray-500 px-3 py-1 rounded text-xs hover:text-white">
            Вхід для власника
          </Link>
        </div>
        <div>
          <p>© 2025 NeuroSoul Doctor.</p>
        </div>
      </div>
    </footer>
  );
}
