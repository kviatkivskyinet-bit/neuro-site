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
    <div className="min-h-screen bg-gray-50 pt-24 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Магазин Курсів</h1>
          <Link href="/cart" className="bg-gray-900 text-white px-4 py-2 rounded-lg">
            Кошик ({cart.reduce((a,b)=>a+b.quantity,0)})
          </Link>
        </div>
        
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {coursesData.filter(c => c.isActive).map((course) => (
            <div key={course.id} className="bg-white rounded-xl shadow overflow-hidden flex flex-col">
              <div className="h-48 bg-gradient-to-br from-yellow-100 to-orange-100 flex items-center justify-center">
                <div className="text-4xl font-bold text-yellow-600/20">NS</div>
              </div>
              <div className="p-4 flex-1 flex flex-col">
                <h3 className="font-bold mb-2 line-clamp-2">{course.title}</h3>
                <p className="text-sm text-gray-600 mb-4">{course.description}</p>
                <div className="mt-auto flex justify-between items-center">
                  <span className="text-xl font-bold text-yellow-600">₴{course.price}</span>
                  <button 
                    onClick={() => addToCart(course)} 
                    className="bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-700"
                  >
                    Купити
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
