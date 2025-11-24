'use client';

import Link from "next/link";
import { useState, useEffect } from 'react';
import { coursesData } from '@/lib/courses-data';

export default function ShopPage() {
  const [cart, setCart] = useState<any[]>([]);

  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, []);

  const addToCart = (course: any) => {
    const existingItem = cart.find(item => item.id === course.id);
    let newCart;

    if (existingItem) {
      newCart = cart.map(item =>
        item.id === course.id
          ? {...item, quantity: item.quantity + 1}
          : item
      );
    } else {
      newCart = [...cart, {...course, quantity: 1}];
    }

    setCart(newCart);
    localStorage.setItem('cart', JSON.stringify(newCart));
    window.dispatchEvent(new Event('cart-updated'));
    alert(`Курс "${course.title}" додано до корзини!`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/90 backdrop-blur-md border-b border-gray-200 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center space-x-4">
              <div className="w-[60px] h-[60px] rounded-lg bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center">
                <span className="text-white font-bold text-xl">NS</span>
              </div>
              <h1 className="text-2xl font-bold text-gray-800">NEUROSSOUL DOCTOR</h1>
            </Link>
            <div className="hidden md:flex space-x-8 items-center">
              <Link href="/" className="text-gray-700 hover:text-yellow-600 transition-colors">Головна</Link>
              <Link href="/shop" className="text-yellow-600 font-semibold">Курси</Link>
              <Link href="/cart" className="relative p-2 text-gray-700 hover:text-yellow-600 transition-colors">
                🛒
                {cart.reduce((sum, item) => sum + item.quantity, 0) > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {cart.reduce((sum, item) => sum + item.quantity, 0)}
                  </span>
                )}
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Header */}
      <section className="pt-24 pb-12 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-6">
            Магазин Курсів
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Трансформуйте свою свідомість з професійними курсами від NeuroSoul Doctor
          </p>
        </div>
      </section>

      {/* Courses Grid */}
      <section className="pb-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {coursesData.filter(c => c.isActive).map((course) => (
              <div key={course.id} className="bg-white border-0 shadow-lg rounded-lg overflow-hidden">
                <div className="relative">
                  {course.isNew && (
                    <div className="absolute top-4 left-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium z-10">
                      Новинка
                    </div>
                  )}
                  <div className="h-48 bg-gradient-to-br from-yellow-100 to-orange-100 flex items-center justify-center">
                    <div className="text-6xl font-bold text-yellow-500/30">NS</div>
                  </div>
                </div>
                <div className="p-6 space-y-4">
                  <h3 className="text-lg font-semibold text-gray-800">
                    {course.title}
                  </h3>
                  <p className="text-sm text-gray-600 line-clamp-2">{course.description}</p>
                  <div className="text-2xl font-bold text-yellow-600">
                    ₴{course.price} UAH
                  </div>
                  <div className="flex space-x-2">
                    <Link
                      href={`/course/${course.id}`}
                      className="flex-1 border border-yellow-500 text-yellow-700 hover:bg-yellow-50 py-3 px-4 rounded-lg font-medium text-center transition-colors"
                    >
                      ДЕТАЛЬНІШЕ
                    </Link>
                    <button
                      onClick={() => addToCart(course)}
                      className="flex-1 bg-gradient-to-r from-yellow-500 to-orange-500 text-white hover:scale-105 transition-transform py-3 px-4 rounded-lg font-medium"
                    >
                      КУПИТИ
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h3 className="text-2xl font-bold mb-4">NEUROSSOUL DOCTOR</h3>
          <p className="text-gray-400 mb-6">
            Експерт у сфері гіпнотерапії та трансформації свідомості
          </p>
          <p>© 2025 NeuroSoul Doctor. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
