'use client';

import Link from "next/link";
import { useState, useEffect } from 'react';
import { Course } from '@/lib/courses-data';

export default function ShopPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState<Array<{id: number, title: string, price: number, quantity: number, image: string}>>([]);

  // Завантаження корзини з localStorage
  useEffect(() => {
    const savedCart = localStorage.getItem('neurossoul_cart');
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, []);

  // Завантаження курсів з API
  useEffect(() => {
    async function loadCourses() {
      try {
        const response = await fetch('/api/courses');
        if (response.ok) {
          const data = await response.json();
          setCourses(data.filter((course: Course) => course.isActive));
        }
      } catch (error) {
        console.error('Failed to load courses:', error);
      } finally {
        setLoading(false);
      }
    }
    loadCourses();
  }, []);

  const addToCart = (course: {id: number, title: string, price: number, image: string}) => {
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
    localStorage.setItem('neurossoul_cart', JSON.stringify(newCart));

    alert(`Курс "${course.title}" додано до корзини!\nЦіна: ₴${course.price}\n\nВ корзині: ${newCart.reduce((sum, item) => sum + item.quantity, 0)} товар(ів)`);
  };

  const handleContactClick = () => {
    window.location.href = "/#contact";
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/90 backdrop-blur-md border-b border-gray-200 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center space-x-4">
              <img
                src="https://ext.same-assets.com/916447887/logo-neurosoul.png"
                alt="NeuroSoul Doctor Logo"
                className="neurosoul-logo"
                onError={(e) => {
                  e.currentTarget.src = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMjgiIGZpbGw9InVybCgjZ3JhZGllbnQwX3JhZGlhbF8xXzIpIiBzdHJva2U9IiNENEFGMzciIHN0cm9rZS13aWR0aD0iNCIvPgo8ZGVmcz4KPHJhZGlhbEdyYWRpZW50IGlkPSJncmFkaWVudDBfcmFkaWFsXzFfMiIgY3g9IjAiIGN5PSIwIiByPSIxIiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSIgZ3JhZGllbnRUcmFuc2Zvcm09InRyYW5zbGF0ZSgzMCAzMCkgcm90YXRlKDkwKSBzY2FsZSgzMCkiPgo8c3RvcCBzdG9wLWNvbG9yPSIjRkZENzAwIi8+CjxzdG9wIG9mZnNldD0iMC41IiBzdG9wLWNvbG9yPSIjRkZBNTAwIi8+CjxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iI0Q0QUYzNyIvPgo8L3JhZGlhbEdyYWRpZW50Pgo8L2RlZnM+Cjwvc3ZnPgo=";
                }}
              />
              <h1 className="text-2xl font-bold dark-3d-heading">NEUROSSOUL DOCTOR</h1>
            </Link>
            <div className="hidden md:flex space-x-8">
              <Link href="/" className="text-gray-700 hover:text-yellow-600 transition-colors">Головна</Link>
              <Link href="/shop" className="text-yellow-600 font-semibold">Курси</Link>
              <Link href="/" className="text-gray-700 hover:text-yellow-600 transition-colors">Про мене</Link>
              <Link href="/" className="text-gray-700 hover:text-yellow-600 transition-colors">Контакти</Link>

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
            </div>
          </div>
        </div>
      </nav>

      {/* Header */}
      <section className="pt-24 pb-12 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <div className="relative">
            <h1 className="dark-3d-heading-large mb-6">
              Магазин Курсів
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Трансформуйте свою свідомість з професійними курсами від NeuroSoul Doctor
            </p>
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-32 h-32 golden-gradient rounded-full opacity-10 blur-3xl"></div>
          </div>
        </div>
      </section>

      {/* Courses Grid */}
      <section className="pb-16 px-4">
        <div className="max-w-7xl mx-auto">
          {loading ? (
            <div className="text-center py-16 text-xl text-gray-500">Завантаження курсів...</div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {courses.length === 0 ? (
                <div className="col-span-full text-center text-gray-500 text-lg py-12">
                  Курси не знайдено.
                </div>
              ) : (
                courses.map((course) => (
                  <div key={course.id} className="card-3d bg-white border-0 shadow-lg group rounded-lg overflow-hidden">
                    <div className="relative">
                      {course.isNew && (
                        <div className="absolute top-4 left-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium z-10">
                          Новинка
                        </div>
                      )}
                      {course.isDiscount && (
                        <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium z-10">
                          Знижка
                        </div>
                      )}
                      <div className="relative overflow-hidden">
                        <img
                          src={course.image}
                          alt={course.title}
                          className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                      </div>
                    </div>
                    <div className="p-6 space-y-4">
                      <Link href={`/course/${course.id}`}>
                        <h3 className="text-sm leading-tight min-h-[60px] flex items-center font-semibold hover:text-yellow-600 transition-colors cursor-pointer">
                          КУРС: "{course.title}"
                        </h3>
                      </Link>
                      <div className="text-2xl font-bold golden-text">
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
                          onClick={() => addToCart({...course, image: course.image})}
                          className="flex-1 golden-gradient text-white hover:scale-105 transition-transform group-hover:shadow-lg py-3 px-4 rounded-lg font-medium"
                        >
                          КУПИТИ
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* Pagination */}
          <div className="flex justify-center items-center space-x-4 mt-12">
            <button
              onClick={() => alert('Це перша сторінка')}
              className="border border-gray-300 text-gray-400 px-4 py-2 rounded-lg text-sm"
              disabled
            >
              ← Попередня
            </button>
            <div className="flex space-x-2">
              <button className="golden-gradient text-white px-4 py-2 rounded-lg text-sm">1</button>
              <button
                onClick={() => alert('Всі курси вже показані на цій сторінці')}
                className="border border-gray-300 text-gray-700 hover:bg-gray-50 px-4 py-2 rounded-lg text-sm"
              >
                2
              </button>
            </div>
            <button
              onClick={() => alert('Всі курси вже показані на цій сторінці')}
              className="border border-yellow-500 text-yellow-700 hover:bg-yellow-50 px-4 py-2 rounded-lg text-sm"
            >
              Наступна →
            </button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="dark-3d-heading-medium mb-6">
            Готові почати трансформацію?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Оберіть курс, який резонує з вашими цілями, та почніть подорож до нового рівня свідомості
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={handleContactClick}
              className="golden-gradient text-white hover:scale-105 transition-transform px-8 py-3 text-lg rounded-lg font-medium"
            >
              Зв'язатися з нами
            </button>
            <Link
              href="/"
              className="border border-yellow-500 text-yellow-700 hover:bg-yellow-50 px-8 py-3 text-lg rounded-lg font-medium transition-colors inline-block"
            >
              Дізнатися більше
            </Link>
          </div>
        </div>
      </section>

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
              <h4 className="text-lg font-semibold">Корисні посилання</h4>
              <div className="space-y-2">
                <button
                  onClick={() => alert('Юридична сторінка буде додана в повній версії')}
                  className="text-gray-400 hover:text-yellow-400 block transition-colors"
                >
                  Публічна оферта
                </button>
                <button
                  onClick={() => alert('Юридична сторінка буде додана в повній версії')}
                  className="text-gray-400 hover:text-yellow-400 block transition-colors"
                >
                  Правова інформація
                </button>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-lg font-semibold">Контакти</h4>
              <div className="flex space-x-4">
                <a href="https://t.me/NeuroSoulDoctor" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 transition-colors">
                  Telegram
                </a>
                <a href="https://www.tiktok.com/@souldoctor58" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-gray-300 transition-colors">
                  TikTok
                </a>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>© 2025 NeuroSoul Doctor. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
