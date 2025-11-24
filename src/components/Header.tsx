'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
// Використовуємо звичайний <img> для логотипу, як у твоєму коді, або next/image
// Тут збережено твій оригінальний дизайн

export default function Header() {
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    // Функція для оновлення лічильника
    const updateCount = () => {
      // Використовуємо ключ 'cart' для сумісності з новим чекаутом
      const cart = JSON.parse(localStorage.getItem('cart') || '[]');
      const totalItems = cart.reduce((sum: number, item: any) => sum + (item.quantity || 1), 0);
      setCartCount(totalItems);
    };

    updateCount();
    // Слухаємо події зміни кошика
    window.addEventListener('storage', updateCount);
    window.addEventListener('cart-updated', updateCount);

    return () => {
      window.removeEventListener('storage', updateCount);
      window.removeEventListener('cart-updated', updateCount);
    };
  }, []);

  return (
    <nav className="fixed top-0 w-full bg-white/90 backdrop-blur-md border-b border-gray-200 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* LOGO SECTION */}
          <Link href="/" className="flex items-center space-x-4">
            <img
              src="https://ugc.same-assets.com/fupLQPfM_wu2d_t81dlMvKSNRo8HdOKO.png"
              alt="NeuroSoul Doctor Logo"
              className="w-10 h-10 rounded-full object-cover border-2 border-amber-500"
              onError={(e) => {
                // Твій Fallback SVG
                e.currentTarget.src = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMjgiIGZpbGw9InVybCgjZ3JhZGllbnQwX3JhZGlhbF8xXzIpIiBzdHJva2U9IiNENEFGMzciIHN0cm9rZS13aWR0aD0iNCIvPgo8ZGVmcz4KPHJhZGlhbEdyYWRpZW50IGlkPSJncmFkaWVudDBfcmFkaWFsXzFfMiIgY3g9IjAiIGN5PSIwIiByPSIxIiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSIgZ3JhZGllbnRUcmFuc2Zvcm09InRyYW5zbGF0ZSgzMCAzMCkgcm90YXRlKDkwKSBzY2FsZSgzMCkiPgo8c3RvcCBzdG9wLWNvbG9yPSIjRkZENzAwIi8+CjxzdG9wIG9mZnNldD0iMC41IiBzdG9wLWNvbG9yPSIjRkZBNTAwIi8+CjxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iI0Q0QUYzNyIvPgo8L2RlZnM+Cjwvc3ZnPgo=";
              }}
            />
            <h1 className="text-xl md:text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-amber-600 to-yellow-500 hidden sm:block">
              NEUROSSOUL DOCTOR
            </h1>
          </Link>

          {/* MENU LINKS */}
          <div className="hidden md:flex space-x-8 items-center">
            <Link href="/" className="text-gray-700 hover:text-yellow-600 transition-colors font-medium">Головна</Link>
            <Link href="/shop" className="text-gray-700 hover:text-yellow-600 transition-colors font-medium">Курси</Link>
            {/* Якоря працюватимуть коректно тільки на головній, тому для інших сторінок краще використовувати повні шляхи, якщо треба */}
            <a href="/#contact" className="text-gray-700 hover:text-yellow-600 transition-colors font-medium">Контакти</a>

            {/* CART ICON */}
            <Link href="/cart" className="relative p-2 text-gray-700 hover:text-yellow-600 transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.5 1.5M7 13l1.5 1.5m9.5-1.5H9" />
              </svg>
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                  {cartCount}
                </span>
              )}
            </Link>
          </div>
          
          {/* MOBILE CART ICON (Visible on small screens) */}
           <div className="md:hidden flex items-center gap-4">
             <Link href="/cart" className="relative p-2 text-gray-700 hover:text-yellow-600 transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.5 1.5M7 13l1.5 1.5m9.5-1.5H9" />
              </svg>
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                  {cartCount}
                </span>
              )}
            </Link>
           </div>
        </div>
      </div>
    </nav>
  );
}
