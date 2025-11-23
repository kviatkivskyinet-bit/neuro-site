'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { coursesData } from '@/lib/courses-data';

export default function ShopPage() {
  const [courses, setCourses] = useState(coursesData);
  const [cart, setCart] = useState<any[]>([]);

  // Завантаження корзини
  useEffect(() => {
    const savedCart = localStorage.getItem('neurossoul_cart');
    if (savedCart) setCart(JSON.parse(savedCart));
    
    // Фільтруємо тільки активні курси
    setCourses(coursesData.filter(c => c.isActive));
  }, []);

  const addToCart = (course: any) => {
    const existingItem = cart.find(item => item.id === course.id);
    let newCart;
    if (existingItem) {
      newCart = cart.map(item => item.id === course.id ? {...item, quantity: item.quantity + 1} : item);
    } else {
      newCart = [...cart, {...course, quantity: 1}];
    }
    setCart(newCart);
    localStorage.setItem('neurossoul_cart', JSON.stringify(newCart));
    alert('Додано в корзину! (Перейдіть на Головну, щоб оформити замовлення)');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <nav className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center space-x-2">
               <div className="w-8 h-8 bg-yellow-600 rounded-full flex items-center justify-center text-white font-bold">ND</div>
               <span className="font-bold text-xl">NEUROSSOUL</span>
            </Link>
            <div className="flex items-center space-x-4">
              <Link href="/" className="text-gray-600 hover:text-yellow-600">Головна</Link>
              <div className="relative">
                 <span className="text-xl">🛒</span>
                 {cart.reduce((a, b) => a + b.quantity, 0) > 0 && (
                   <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                     {cart.reduce((a, b) => a + b.quantity, 0)}
                   </span>
                 )}
              </div>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Магазин Курсів</h1>
          <p className="text-xl text-gray-600">Трансформуйте свою свідомість з професійними курсами</p>
        </div>

        {courses.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            Курси не знайдено. Перевірте налаштування в Адмінці.
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {courses.map((course) => (
              <div key={course.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 flex flex-col">
                <div className="relative h-48 bg-gray-200">
                  <img
                    src={course.image}
                    alt={course.title}
                    className="w-full h-full object-cover"
                    onError={(e) => { e.currentTarget.src = "https://placehold.co/600x400?text=No+Image"; }}
                  />
                  {course.isDiscount && (
                    <span className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded">Знижка</span>
                  )}
                </div>
                
                <div className="p-5 flex-1 flex flex-col">
                  <h3 className="font-bold text-lg mb-2 line-clamp-2">{course.title}</h3>
                  <p className="text-sm text-gray-500 mb-4 line-clamp-3">{course.description}</p>
                  <div className="mt-auto flex justify-between items-center">
                    <span className="text-2xl font-bold text-yellow-600">₴{course.price}</span>
                    <button
                      onClick={() => addToCart(course)}
                      className="bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors"
                    >
                      В корзину
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
