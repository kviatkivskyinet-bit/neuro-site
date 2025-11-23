'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { coursesData } from '@/lib/courses-data';

export default function HomePage() {
  const [cart, setCart] = useState<any[]>([]);
  
  useEffect(() => {
    const saved = localStorage.getItem('neurossoul_cart');
    if (saved) setCart(JSON.parse(saved));
  }, []);

  const featuredCourses = coursesData.filter(c => c.isActive).slice(0, 4);

  return (
    <div className="min-h-screen bg-white">
      <nav className="fixed top-0 w-full bg-white/90 backdrop-blur-md border-b border-gray-200 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-yellow-600 rounded-full flex items-center justify-center text-white font-bold">ND</div>
            <span className="font-bold text-xl tracking-tight">NEUROSSOUL</span>
          </div>
          <div className="hidden md:flex space-x-8">
            <Link href="/" className="text-gray-900 hover:text-yellow-600">Головна</Link>
            <Link href="/shop" className="text-gray-500 hover:text-yellow-600">Всі Курси</Link>
            <Link href="/admin" className="text-gray-400 hover:text-gray-600 text-sm pt-1">Вхід для власника</Link>
          </div>
          <Link href="/cart" className="relative p-2">
            <span className="text-2xl">🛒</span>
            {cart.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">{cart.reduce((a:any, b:any) => a + b.quantity, 0)}</span>
            )}
          </Link>
        </div>
      </nav>

      <section className="pt-32 pb-16 px-4 max-w-7xl mx-auto text-center lg:text-left">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-5xl font-extrabold text-gray-900 leading-tight mb-6">Простір, де твій розум <span className="text-yellow-600">грає за тебе</span></h1>
            <p className="text-xl text-gray-600 mb-8">Гіпноз, вплив, контроль над реальністю.</p>
            <Link href="/shop" className="bg-yellow-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-yellow-700 transition-transform hover:scale-105">Вибрати Курс</Link>
          </div>
          <div className="relative hidden lg:block">
            <img src="https://placehold.co/600x600/png?text=NeuroSoul" alt="Hero" className="relative z-10 rounded-3xl shadow-2xl" />
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-50 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold mb-12 text-center">Популярні Курси</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredCourses.map((course) => (
              <div key={course.id} className="bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 group overflow-hidden border border-gray-100">
                <div className="h-48 overflow-hidden bg-gray-200 relative">
                  <img src={course.image} alt={course.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" onError={(e:any)=>{e.target.src='https://placehold.co/400'}}/>
                </div>
                <div className="p-5">
                  <h3 className="font-bold text-lg mb-2 line-clamp-2 h-14">{course.title}</h3>
                  <div className="flex justify-between items-center mt-4">
                    <span className="text-xl font-bold text-gray-900">₴{course.price}</span>
                    <Link href="/shop" className="text-yellow-600 font-medium hover:text-yellow-700">Детальніше</Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
