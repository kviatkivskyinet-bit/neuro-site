'use client';

import Link from 'next/link';

export default function Footer() {
  // Статичні посилання на соцмережі
  const socialMedia = [
    { id: "telegram", name: "Telegram", url: "https://t.me/NeuroSoulDoctor", icon: "telegram" },
    { id: "tiktok", name: "TikTok", url: "https://www.tiktok.com/@souldoctor58", icon: "tiktok" }
  ];

  return (
    <footer className="bg-gray-900 text-white py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-3 gap-8">
          {/* BRAND */}
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <h3 className="text-2xl font-bold text-white bg-clip-text text-transparent bg-gradient-to-r from-amber-500 to-yellow-300">
                NEUROSSOUL DOCTOR
              </h3>
            </div>
            <p className="text-gray-400">
              Експерт у сфері гіпнотерапії та трансформації свідомості
            </p>
             <Link href="/admin" className="inline-block bg-gray-800 text-gray-500 px-3 py-1 rounded text-xs hover:text-white transition-colors">
                Вхід для власника
             </Link>
          </div>

          {/* LINKS */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-amber-500">Корисні посилання</h4>
            <div className="space-y-2">
              <button onClick={() => alert('Незабаром')} className="text-gray-400 hover:text-yellow-400 block transition-colors text-left">
                Публічна оферта
              </button>
              <button onClick={() => alert('Незабаром')} className="text-gray-400 hover:text-yellow-400 block transition-colors text-left">
                Правова інформація
              </button>
            </div>
          </div>

          {/* CONTACTS */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-amber-500">Контакти</h4>
            <div className="flex space-x-4">
              {socialMedia.map((social) => (
                <a
                  key={social.id}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-yellow-400 transition-colors"
                >
                  {social.name}
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-500 text-sm">
          <p>© 2025 NeuroSoul Doctor. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
