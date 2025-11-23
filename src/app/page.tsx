'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Course } from '@/lib/courses-data';

interface SocialMedia {
  id: string;
  name: string;
  url: string;
  icon: string;
  enabled: boolean;
}

export default function HomePage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: ''
  });

  const [cart, setCart] = useState<Array<{id: number, title: string, price: number, quantity: number, image: string}>>([]);
  const [showCart, setShowCart] = useState(false);
  const [allCourses, setAllCourses] = useState<Course[]>([]);
  const [socialMedia, setSocialMedia] = useState<SocialMedia[]>([]);

  // Завантаження корзини з localStorage при завантаженні сторінки
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
          const courses = await response.json();
          setAllCourses(courses.filter((course: Course) => course.isActive));
        }
      } catch (error) {
        console.error('Failed to load courses:', error);
      }
    }
    loadCourses();
  }, []);

  // Завантаження налаштувань соцмереж
  useEffect(() => {
    try {
      const response = fetch('/api/settings');
      response.then(res => res.json()).then(data => {
        if (data.socialMedia) {
          setSocialMedia(data.socialMedia.filter((social: SocialMedia) => social.enabled));
        }
      }).catch(() => {
        // Fallback до дефолтних соцмереж якщо API не працює
        const defaultSocial = [
          {
            id: "telegram",
            name: "Telegram",
            url: "https://t.me/NeuroSoulDoctor",
            icon: "telegram",
            enabled: true
          },
          {
            id: "tiktok",
            name: "TikTok",
            url: "https://www.tiktok.com/@souldoctor58",
            icon: "tiktok",
            enabled: true
          }
        ];
        setSocialMedia(defaultSocial);
      });
    } catch (error) {
      console.error('Failed to load social media settings:', error);
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Дякуємо, ${formData.name}! Ваша заявка прийнята. Ми зв'яжемося з вами найближчим часом через Telegram: @NeuroSoulDoctor`);
    setFormData({ name: '', email: '', phone: '' });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value
    });
  };

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

    // Створюємо замовлення одразу при додаванні в корзину
    const orderReference = `CART_${Date.now()}_${course.id}`;
    const newOrder = {
      id: Date.now(),
      orderReference: orderReference,
      customerName: 'Не вказано',
      customerEmail: 'Не вказано',
      customerPhone: 'Не вказано',
      amount: course.price * (existingItem ? existingItem.quantity + 1 : 1),
      status: 'В корзині',
      createdDate: new Date().toISOString(),
      items: [{
        title: course.title,
        price: course.price,
        quantity: existingItem ? existingItem.quantity + 1 : 1
      }]
    };

    // Зберігаємо замовлення
    const existingOrders = JSON.parse(localStorage.getItem('neurossoul_orders') || '[]');
    const updatedOrders = [newOrder, ...existingOrders];
    localStorage.setItem('neurossoul_orders', JSON.stringify(updatedOrders));

    alert(`Курс "${course.title}" додано до корзини!\nЦіна: ₴${course.price}\n\nВ корзині: ${newCart.reduce((sum, item) => sum + item.quantity, 0)} товар(ів)\n\nЗамовлення створено: ${orderReference}`);
  };

  const removeFromCart = (courseId: number) => {
    const newCart = cart.filter(item => item.id !== courseId);
    setCart(newCart);
    localStorage.setItem('neurossoul_cart', JSON.stringify(newCart));
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const checkout = () => {
    if (cart.length === 0) {
      alert('Корзина порожня!');
      return;
    }

    // Перенаправлення на сторінку корзини для оформлення замовлення
    window.location.href = '/cart';
  };

  // Функція для рендерингу іконки соцмережі
  const renderSocialIcon = (icon: string) => {
    switch (icon) {
      case 'telegram':
        return (
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
          </svg>
        );
      case 'tiktok':
        return (
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
          </svg>
        );
      case 'instagram':
        return (
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
          </svg>
        );
      case 'youtube':
        return (
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
          </svg>
        );
      case 'facebook':
        return (
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
          </svg>
        );
      default:
        return (
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H6.9C4.29 7 2.9 8.39 2.9 11s1.39 4 4 4h3V14H6.9c-1.71 0-3.1-1.39-3.1-3.1zM8 13h8v-2H8v2zm9.1-6H14v1.9h3.1c1.71 0 3.1 1.39 3.1 3.1s-1.39 3.1-3.1 3.1H14V17h3.1c2.61 0 4-1.39 4-4s-1.39-4-4-4z"/>
          </svg>
        );
    }
  };

  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/90 backdrop-blur-md border-b border-gray-200 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <img
                src="https://ugc.same-assets.com/fupLQPfM_wu2d_t81dlMvKSNRo8HdOKO.png"
                alt="NeuroSoul Doctor Logo"
                className="neurosoul-logo"
                onError={(e) => {
                  e.currentTarget.src = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMjgiIGZpbGw9InVybCgjZ3JhZGllbnQwX3JhZGlhbF8xXzIpIiBzdHJva2U9IiNENEFGMzciIHN0cm9rZS13aWR0aD0iNCIvPgo8ZGVmcz4KPHJhZGlhbEdyYWRpZW50IGlkPSJncmFkaWVudDBfcmFkaWFsXzFfMiIgY3g9IjAiIGN5PSIwIiByPSIxIiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSIgZ3JhZGllbnRUcmFuc2Zvcm09InRyYW5zbGF0ZSgzMCAzMCkgcm90YXRlKDkwKSBzY2FsZSgzMCkiPgo8c3RvcCBzdG9wLWNvbG9yPSIjRkZENzAwIi8+CjxzdG9wIG9mZnNldD0iMC41IiBzdG9wLWNvbG9yPSIjRkZBNTAwIi8+CjxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iI0Q0QUYzNyIvPgo8L3JhZGlhbEdyYWRpZW50Pgo8L2RlZnM+Cjwvc3ZnPgo=";
                }}
              />
              <h1 className="text-2xl font-bold dark-3d-heading">NEUROSSOUL DOCTOR</h1>
            </div>
            <div className="hidden md:flex space-x-8 items-center">
              <a href="#home" className="text-gray-700 hover:text-yellow-600 transition-colors">Головна</a>
              <a href="#courses" className="text-gray-700 hover:text-yellow-600 transition-colors">Курси</a>
              <a href="#about" className="text-gray-700 hover:text-yellow-600 transition-colors">Про мене</a>
              <a href="#contact" className="text-gray-700 hover:text-yellow-600 transition-colors">Контакти</a>

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

      {/* Cart Sidebar */}
      {showCart && (
        <div className="fixed right-0 top-16 h-full w-80 bg-white shadow-lg z-40 border-l border-gray-200">
          <div className="p-4">
            <h3 className="text-lg font-semibold mb-4">Корзина ({cart.length})</h3>
            {cart.length === 0 ? (
              <p className="text-gray-500">Корзина порожня</p>
            ) : (
              <div className="space-y-4">
                {cart.map(item => (
                  <div key={item.id} className="flex justify-between items-center p-3 border rounded">
                    <div className="flex-1">
                      <p className="text-sm font-medium">{item.title.substring(0, 40)}...</p>
                      <p className="text-sm text-gray-500">₴{item.price} x {item.quantity}</p>
                    </div>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      ✕
                    </button>
                  </div>
                ))}
                <div className="border-t pt-4">
                  <div className="flex justify-between font-semibold text-lg">
                    <span>Загальна сума:</span>
                    <span className="golden-text">₴{getTotalPrice()}</span>
                  </div>
                  <button
                    onClick={checkout}
                    className="w-full mt-4 golden-gradient text-white py-3 rounded-lg font-medium hover:scale-105 transition-transform"
                  >
                    Оформити замовлення
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section id="home" className="pt-24 pb-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-6">
                <h2 className="dark-3d-heading-large leading-tight">
                  Простір, де твій розум
                  <br />
                  перестане грати проти тебе
                </h2>
                <p className="text-xl text-gray-600 leading-relaxed">
                  Гіпноз, вплив, контроль над реальністю. Курси, що змінюють свідомість.
                </p>
              </div>

              <div className="space-y-6">
                <h3 className="text-2xl font-semibold golden-text">SoulDoctor</h3>
                <div className="space-y-4 text-gray-700 leading-relaxed">
                  <p>Експерт у сфері гіпнотерапії, психології впливу та трансформації свідомості.</p>
                  <p>Гіпнотерапевт, фахівець з квантової психології та механізмами управління реальністю.</p>
                  <p>Допомагаю змінювати сприйняття світу, виходити за межі нав'язаних обмежень і розкривати справжній потенціал.</p>
                  <p>Розбираю структури впливу, невидимі алгоритми маніпуляцій і механіку підсвідомих процесів.</p>
                  <p className="font-semibold text-yellow-700">Ви готові увійти в новий рівень усвідомлення? Вітаю, ви вже на порозі.</p>
                </div>
              </div>

              <div className="flex space-x-4">
                <button
                  onClick={() => {
                    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="golden-gradient text-white hover:scale-105 transition-transform px-8 py-3 text-lg rounded-lg font-medium"
                >
                  Розпочати навчання
                </button>
                <button
                  onClick={() => {
                    document.getElementById('courses')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="border border-yellow-500 text-yellow-700 hover:bg-yellow-50 px-8 py-3 text-lg rounded-lg font-medium transition-colors"
                >
                  Дізнатися більше
                </button>
              </div>

              <div className="flex items-center space-x-6">
                <Link href="/admin" className="bg-red-600 text-white px-3 py-1 rounded text-sm font-bold hover:bg-red-700 transition-colors">
                  АДМІН
                </Link>
                {socialMedia.length > 0 && (
                  <>
                    <span className="text-gray-600 font-medium">Підписуйся:</span>
                    <div className="flex space-x-4">
                      {socialMedia.map((social) => (
                        <a
                          key={social.id}
                          href={social.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`transition-colors ${
                            social.icon === 'telegram' ? 'text-blue-500 hover:text-blue-600' :
                            social.icon === 'tiktok' ? 'text-gray-800 hover:text-gray-600' :
                            social.icon === 'instagram' ? 'text-pink-500 hover:text-pink-600' :
                            social.icon === 'youtube' ? 'text-red-500 hover:text-red-600' :
                            social.icon === 'facebook' ? 'text-blue-600 hover:text-blue-700' :
                            'text-gray-600 hover:text-gray-700'
                          }`}
                          title={social.name}
                        >
                          {renderSocialIcon(social.icon)}
                        </a>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>

            <div className="relative">
              <div className="floating">
                <img
                  src="https://ext.same-assets.com/916447887/1091564370.webp"
                  alt="Психолог"
                  className="w-full h-auto rounded-3xl shadow-2xl"
                />
              </div>
              <div className="absolute -top-6 -right-6 w-32 h-32 golden-gradient rounded-full opacity-20 blur-xl"></div>
              <div className="absolute -bottom-6 -left-6 w-24 h-24 bg-blue-500 rounded-full opacity-20 blur-xl"></div>
            </div>
          </div>
        </div>
      </section>

      {/* All Courses Section */}
      <section id="courses" className="py-16 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="dark-3d-heading-medium mb-4">
              КУРСИ ЯКІ МОЖНА ПРИДБАТИ
            </h2>
            <p className="text-xl text-gray-600">просто натисніть кнопку придбати</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {allCourses.map((course) => (
              <div key={course.id} className="card-3d bg-white border-0 shadow-lg rounded-lg overflow-hidden group">
                <div className="relative">
                  {course.isNew && (
                    <div className="absolute top-3 left-3 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium z-10">
                      Новинка
                    </div>
                  )}
                  {course.isDiscount && (
                    <div className="absolute top-3 right-3 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-medium z-10">
                      Знижка
                    </div>
                  )}
                  <div className="relative overflow-hidden">
                    <img
                      src={course.image}
                      alt={course.title}
                      className="w-full h-40 object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                  </div>
                </div>
                <div className="p-4 space-y-3">
                  <Link href={`/course/${course.id}`}>
                    <h3 className="text-xs leading-tight min-h-[48px] flex items-center font-semibold hover:text-yellow-600 transition-colors cursor-pointer">
                      КУРС: "{course.title}"
                    </h3>
                  </Link>
                  <div className="text-lg font-bold golden-text">
                    ₴{course.price} UAH
                  </div>
                  <div className="flex space-x-2">
                    <Link
                      href={`/course/${course.id}`}
                      className="flex-1 border border-yellow-500 text-yellow-700 hover:bg-yellow-50 py-2 px-3 rounded-lg font-medium text-sm text-center transition-colors"
                    >
                      ДЕТАЛЬНІШЕ
                    </Link>
                    <button
                      onClick={() => addToCart({...course, image: course.image})}
                      className="flex-1 golden-gradient text-white hover:scale-105 transition-transform group-hover:shadow-lg py-2 px-3 rounded-lg font-medium text-sm"
                    >
                      КУПИТИ
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              href="/shop"
              className="inline-block golden-gradient text-white hover:scale-105 transition-transform px-8 py-4 text-lg rounded-lg font-medium"
            >
              Детальніше про курси →
            </Link>
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section id="contact" className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="dark-3d-heading-medium mb-4">
              БУДЬ ПЕРШИМ ХТО ОТРИМАЄ НОВИЙ КУРС!
            </h2>
            <p className="text-xl text-gray-600">
              Заповни форму та будь першим хто отримає мій наступний новий курс!
            </p>
          </div>

          <div className="card-3d bg-white border-0 shadow-2xl max-w-2xl mx-auto rounded-lg">
            <div className="p-8">
              <form className="space-y-6" onSubmit={handleSubmit}>
                <div className="space-y-2">
                  <label htmlFor="name" className="text-lg font-medium block">ТВОЄ ІМ'Я*</label>
                  <input
                    id="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Enter your full name*"
                    className="w-full h-12 text-lg border border-gray-300 rounded-md px-3 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500 focus:outline-none"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="email" className="text-lg font-medium block">ПОШТА*</label>
                  <input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Enter your e-mail*"
                    className="w-full h-12 text-lg border border-gray-300 rounded-md px-3 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500 focus:outline-none"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="phone" className="text-lg font-medium block">ТЕЛЕФОН</label>
                  <input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="Enter your phone"
                    className="w-full h-12 text-lg border border-gray-300 rounded-md px-3 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500 focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full h-14 text-lg golden-gradient text-white hover:scale-105 transition-transform pulse-gold rounded-lg font-medium"
                >
                  ПЕРЕДЗАМОВЛЕННЯ
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <img
                  src="https://ext.same-assets.com/916447887/logo-neurosoul.png"
                  alt="NeuroSoul Doctor Logo"
                  className="neurosoul-logo"
                  onError={(e) => {
                    e.currentTarget.src = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMjgiIGZpbGw9InVybCgjZ3JhZGllbnQwX3JhZGlhbF8xXzIpIiBzdHJva2U9IiNENEFGMzciIHN0cm9rZS13aWR0aD0iNCIvPgo8ZGVmcz4KPHJhZGlhbEdyYWRpZW50IGlkPSJncmFkaWVudDBfcmFkaWFsXzFfMiIgY3g9IjAiIGN5PSIwIiByPSIxIiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSIgZ3JhZGllbnRUcmFuc2Zvcm09InRyYW5zbGF0ZSgzMCAzMCkgcm90YXRlKDkwKSBzY2FsZSgzMCkiPgo8c3RvcCBzdG9wLWNvbG9yPSIjRkZENzAwIi8+CjxzdG9wIG9mZnNldD0iMC41IiBzdG9wLWNvbG9yPSIjRkZBNTAwIi8+CjxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iI0Q0QUYzNyIvPgo8L3JhZGlhbEdyYWRpZW50Pgo8L2RlZnM+Cjwvc3ZnPgo=";
                  }}
                />
                <h3 className="text-2xl font-bold text-white">NEUROSSOUL DOCTOR</h3>
              </div>
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
              {socialMedia.length > 0 && (
                <div className="flex space-x-4">
                  {socialMedia.map((social) => (
                    <a
                      key={social.id}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`transition-colors ${
                        social.icon === 'telegram' ? 'text-blue-400 hover:text-blue-300' :
                        social.icon === 'tiktok' ? 'text-gray-400 hover:text-gray-300' :
                        social.icon === 'instagram' ? 'text-pink-400 hover:text-pink-300' :
                        social.icon === 'youtube' ? 'text-red-400 hover:text-red-300' :
                        social.icon === 'facebook' ? 'text-blue-400 hover:text-blue-300' :
                        'text-gray-400 hover:text-gray-300'
                      }`}
                    >
                      {social.name}
                    </a>
                  ))}
                </div>
              )}
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
