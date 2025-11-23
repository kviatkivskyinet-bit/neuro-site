'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { coursesData } from '@/lib/courses-data';

export default function ShopPage() {
  const [cart, setCart] = useState<any[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('neurossoul_cart');
    if (saved) setCart(JSON.parse(saved));
  }, []);

  const addToCart = (course: any) => {
    const existing = cart.find(i => i.id === course.id);
    const newCart = existing 
      ? cart.map(i => i.id === course.id ? {...i, quantity: i.quantity + 1} : i)
      : [...cart, {...course, quantity: 1}];
    
    setCart(newCart);
    localStorage.setItem('neurossoul_cart', JSON.stringify(newCart));
    alert('Додано в кошик!');
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-24 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Магазин Курсів</h1>
          <Link href="/cart" className="bg-gray-900 text-white px-4 py-2 rounded-lg">Кошик ({cart.reduce((a,b)=>a+b.quantity,0)})</Link>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {coursesData.filter(c => c.isActive).map((course) => (
            <div key={course.id} className="bg-white rounded-xl shadow overflow-hidden flex flex-col">
              <img src={course.image} className="h-48 w-full object-cover" onError={(e:any)=>e.target.src='https://placehold.co/400'}/>
              <div className="p-4 flex-1 flex flex-col">
                <h3 className="font-bold mb-2 line-clamp-2">{course.title}</h3>
                <div className="mt-auto flex justify-between items-center">
                  <span className="text-xl font-bold text-yellow-600">₴{course.price}</span>
                  <button onClick={() => addToCart(course)} className="bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-700">Купити</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
