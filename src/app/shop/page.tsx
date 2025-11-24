'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { coursesData } from '@/lib/courses-data';

export default function ShopPage() {
  const [cart, setCart] = useState<any[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('cart');
    if (saved) setCart(JSON.parse(saved));
  }, []);

  const addToCart = (course: any) => {
    const existing = cart.find(i => i.id === course.id);
    const newCart = existing 
      ? cart.map(i => i.id === course.id ? {...i, quantity: i.quantity + 1} : i)
      : [...cart, {...course, quantity: 1}];
    
    setCart(newCart);
    localStorage.setItem('cart', JSON.stringify(newCart));
    
    // Trigger cart update event
    window.dispatchEvent(new Event('cart-updated'));
    
    // Show success notification
    const notification = document.createElement('div');
    notification.className = 'fixed top-20 right-4 bg-green-500 text-black px-6 py-3 rounded-full font-semibold z-50 animate-pulse';
    notification.textContent = '✓ Додано в кошик!';
    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 2000);
  };

  return (
    <div className="min-h-screen bg-black pt-24 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-12">
          <h1 className="text-4xl font-bold">
            <span className="bg-gradient-to-r from-green-400 to-cyan-400 bg-clip-text text-transparent">
              Магазин Курсів
            </span>
          </h1>
          <Link 
            href="/cart" 
            className="bg-green-500/10 border border-green-500/30 text-green-400 px-6 py-3 rounded-full hover:bg-green-500/20 transition-colors font-semibold"
          >
            Кошик ({cart.reduce((a,b)=>a+b.quantity,0)})
          </Link>
        </div>
        
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {coursesData.filter(c => c.isActive).map((course) => (
            <div key={course.id} className="group relative">
              {/* Glow effect */}
              <div className="absolute -inset-1 bg-gradient-to-r from-green-500/20 to-cyan-500/20 rounded-2xl blur-lg group-hover:blur-xl transition-all duration-300 opacity-0 group-hover:opacity-100" />
              
              <div className="relative bg-black/50 border border-green-500/30 rounded-2xl overflow-hidden flex flex-col hover:border-green-500/50 transition-all duration-300">
                <div className="h-48 bg-gradient-to-br from-green-900/30 to-cyan-900/30 flex items-center justify-center">
                  <div className="text-6xl font-bold text-green-500/20">NS</div>
                </div>
                
                <div className="p-6 flex-1 flex flex-col space-y-4">
                  <h3 className="font-bold text-white text-lg line-clamp-2">{course.title}</h3>
                  <p className="text-gray-400 text-sm line-clamp-3">{course.description}</p>
                  
                  <div className="mt-auto space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-2xl font-bold text-green-400">₴{course.price}</span>
                      <span className="text-sm text-gray-500">{course.duration}</span>
                    </div>
                    
                    <button 
                      onClick={() => addToCart(course)} 
                      className="w-full bg-gradient-to-r from-green-500 to-cyan-500 text-black px-4 py-3 rounded-full font-bold hover:shadow-lg hover:shadow-green-500/50 transition-all duration-300 hover:scale-105"
                    >
                      Додати в кошик
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {coursesData.filter(c => c.isActive).length === 0 && (
          <div className="text-center py-20">
            <p className="text-gray-400 text-xl">Курси незабаром будуть доступні</p>
          </div>
        )}
      </div>
    </div>
  );
}
