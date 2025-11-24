'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Course } from '@/lib/courses-data';

export default function CoursePage() {
  const params = useParams();
  const courseId = params?.id as string;
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [cart, setCart] = useState<Array<{id: number, title: string, price: number, quantity: number, image: string}>>([]);

  // Завантаження корзини з localStorage
  useEffect(() => {
    const savedCart = localStorage.getItem('neurossoul_cart');
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, []);

  // Завантаження курсу з API
  useEffect(() => {
    async function loadCourse() {
      if (!courseId) return;

      try {
        const response = await fetch(`/api/courses/${courseId}`);
        if (response.ok) {
          const data = await response.json();
          setCourse(data);
        } else {
          setCourse(null);
        }
      } catch (error) {
        console.error('Failed to load course:', error);
        setCourse(null);
      } finally {
        setLoading(false);
      }
    }
    loadCourse();
  }, [courseId]);

  const addToCart = (course: {id: number, title: string, price: number, image: string}) => {
    const existingItem = cart.find(item => item.id === course.id);
    let newCart;

    if (existingItem) {
      newCart = cart.map(item =>
        item.id === course.id
          ? {...item, quantity: item.quantity + quantity}
          : item
      );
    } else {
      newCart = [...cart, {...course, quantity: quantity}];
    }

    setCart(newCart);
    localStorage.setItem('neurossoul_cart', JSON.stringify(newCart));

    alert(`Курс "${course.title}" додано до корзини!\nКількість: ${quantity}\nЦіна: ₴${course.price}\n\nВ корзині: ${newCart.reduce((sum, item) => sum + item.quantity, 0)} товар(ів)`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-600 mx-auto mb-4"></div>
          <p className="text-xl text-gray-600">Завантаження курсу...</p>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Курс не знайдено</h1>
          <Link href="/shop" className="text-blue-500 hover:underline">
            Повернутися до каталогу
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/90 backdrop-blur-md border-b border-gray-200 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center space-x-4">
              <div className="neurosoul-logo"></div>
              <span className="text-xl font-bold golden-text">NEUROSSOUL DOCTOR</span>
            </Link>
            <div className="flex items-center space-x-6">
              <Link href="/" className="text-gray-700 hover:text-yellow-600 transition-colors">Головна</Link>
              <Link href="/shop" className="text-gray-700 hover:text-yellow-600 transition-colors">Курси</Link>

              {/* Cart Icon */}
              <Link href="/cart" className="relative p-2 text-gray-700 hover:text-yellow-600 transition-colors">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.5 1.5M7 13l1.5 1.5m9.5-1.5H9" />
                </svg>
                {cart.reduce((sum, item) => sum + item.quantity, 0) > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {cart.reduce((sum, item) => sum + item.quantity, 0)}
                  </span>
                )}
              </Link>

              <Link href="/#contact" className="golden-gradient text-white px-4 py-2 rounded text-sm font-medium hover:scale-105 transition-transform">
                ПЕРЕДЗАМОВЛЕННЯ
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Breadcrumbs */}
      <div className="pt-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center space-x-2 text-sm text-gray-500 mb-6">
            <Link href="/" className="hover:text-gray-700">Головна</Link>
            <span>/</span>
            <Link href="/shop" className="hover:text-gray-700">Магазин Курсів</Link>
            <span>/</span>
            <span className="text-gray-900">{course.title}</span>
          </div>
        </div>
      </div>

      {/* Course Content */}
      <div className="max-w-7xl mx-auto px-4 pb-12">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Course Image */}
          <div className="space-y-4">
            <div className="card-3d rounded-lg overflow-hidden shadow-xl group">
              <img
                src={course.image}
                alt={course.title}
                className="w-full h-96 object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="grid grid-cols-4 gap-3">
              <div className="aspect-square rounded-lg overflow-hidden border-2 border-yellow-500 shadow-md">
                <img
                  src={course.image}
                  alt="Thumbnail"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>

          {/* Course Info */}
          <div className="space-y-8">
            <div className="card-3d bg-white p-8 rounded-lg shadow-lg">
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <p className="text-sm text-green-600 font-medium">В НАЯВНОСТІ</p>
              </div>
              <p className="text-sm text-gray-500 mb-4">{course.category}</p>
              <h1 className="text-3xl font-bold text-gray-900 mb-6 leading-tight">
                КУРС: "{course.title}"
              </h1>
              <p className="text-sm text-gray-600 mb-6">Код товару: #{course.id?.toString().padStart(4, '0')}</p>
              <div className="text-4xl font-bold golden-text mb-8">
                ₴{course.price} UAH
              </div>

              {/* Buy Section */}
              <div className="space-y-6">
                <div className="flex items-center space-x-4">
                  <label className="text-lg font-medium">Кількість:</label>
                  <div className="flex items-center border-2 border-gray-300 rounded-lg overflow-hidden">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-4 py-2 hover:bg-gray-100 font-bold text-lg"
                    >
                      −
                    </button>
                    <span className="px-6 py-2 border-x-2 border-gray-300 font-bold text-lg">{quantity}</span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="px-4 py-2 hover:bg-gray-100 font-bold text-lg"
                    >
                      +
                    </button>
                  </div>
                </div>

                <button
                  onClick={() => addToCart({...course, image: course.image})}
                  className="w-full golden-gradient text-white font-bold py-4 px-8 rounded-lg text-lg hover:scale-105 transition-transform pulse-gold"
                >
                  КУПИТИ ЗАРАЗ
                </button>

                <div className="flex space-x-3">
                  <Link
                    href="/shop"
                    className="flex-1 border-2 border-yellow-500 text-yellow-700 hover:bg-yellow-50 py-3 px-4 rounded-lg font-medium text-center transition-colors"
                  >
                    ← Назад до каталогу
                  </Link>
                  <Link
                    href="/#contact"
                    className="flex-1 border-2 border-gray-300 text-gray-700 hover:bg-gray-50 py-3 px-4 rounded-lg font-medium text-center transition-colors"
                  >
                    Є питання?
                  </Link>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="card-3d bg-white p-8 rounded-lg shadow-lg">
              <h3 className="dark-3d-heading mb-6">Опис курсу:</h3>
              <div className="prose prose-lg text-gray-700 leading-relaxed whitespace-pre-line">
                {course.description}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="space-y-4">
              <Link href="/" className="flex items-center space-x-4">
                <div className="neurosoul-logo"></div>
                <h3 className="text-2xl font-bold text-white">NEUROSSOUL DOCTOR</h3>
              </Link>
              <p className="text-gray-400">
                Експерт у сфері гіпнотерапії та трансформації свідомості
              </p>
            </div>

            <div className="space-y-4">
              <h4 className="text-lg font-semibold">Швидкі посилання</h4>
              <div className="space-y-2">
                <Link href="/" className="text-gray-400 hover:text-yellow-400 block transition-colors">
                  Головна сторінка
                </Link>
                <Link href="/shop" className="text-gray-400 hover:text-yellow-400 block transition-colors">
                  Каталог курсів
                </Link>
                <Link href="/#contact" className="text-gray-400 hover:text-yellow-400 block transition-colors">
                  Передзамовлення
                </Link>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-lg font-semibold">Контакти</h4>
              <div className="space-y-2">
                <a href="https://t.me/NeuroSoulDoctor" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 transition-colors block">
                  📱 Telegram: @NeuroSoulDoctor
                </a>
                <a href="https://www.tiktok.com/@souldoctor58" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-gray-300 transition-colors block">
                  🎵 TikTok: @souldoctor58
                </a>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>© 2025 NeuroSoul Doctor. Всі права захищені.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
