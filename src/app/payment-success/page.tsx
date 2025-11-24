'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function PaymentSuccessPage() {
  const [orderInfo, setOrderInfo] = useState<{
    orderReference: string | null;
    amount: string | null;
    currency: string | null;
  } | null>(null);

  useEffect(() => {
    // Очистити корзину після успішної оплати
    localStorage.removeItem('neurossoul_cart');

    // Отримати параметри з URL
    const urlParams = new URLSearchParams(window.location.search);
    const orderReference = urlParams.get('order') || urlParams.get('orderReference');
    const amount = urlParams.get('amount');
    const currency = urlParams.get('currency') || 'UAH';

    // Якщо є номер замовлення, шукаємо його в localStorage
    if (orderReference) {
      const savedOrders = JSON.parse(localStorage.getItem('neurossoul_orders') || '[]');
      const order = savedOrders.find((o: any) => o.orderReference === orderReference);

      if (order) {
        setOrderInfo({
          orderReference: order.orderReference,
          amount: order.amount.toString(),
          currency: currency
        });
      } else {
        setOrderInfo({
          orderReference,
          amount,
          currency
        });
      }
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/90 backdrop-blur-md border-b border-gray-200 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center space-x-4">
              <div className="neurosoul-logo"></div>
              <h1 className="text-2xl font-bold golden-text">NEUROSSOUL DOCTOR</h1>
            </Link>
            <div className="flex items-center space-x-6">
              <Link href="/" className="text-gray-700 hover:text-yellow-600 transition-colors">Головна</Link>
              <Link href="/shop" className="text-gray-700 hover:text-yellow-600 transition-colors">Курси</Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="pt-24 pb-12 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="card-3d bg-white p-12 rounded-lg shadow-lg">
            {/* Success Icon */}
            <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-8">
              <svg className="w-12 h-12 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>

            <h1 className="dark-3d-heading-medium mb-4">Оплата успішна!</h1>
            <p className="text-xl text-gray-600 mb-8">
              Дякуємо за покупку курсів NeuroSoul Doctor
            </p>

            {orderInfo && (
              <div className="bg-gray-50 p-6 rounded-lg mb-8">
                <h2 className="text-lg font-semibold mb-4">Деталі замовлення:</h2>
                <div className="space-y-2 text-left max-w-md mx-auto">
                  <div className="flex justify-between">
                    <span>Номер замовлення:</span>
                    <span className="font-semibold">{orderInfo.orderReference}</span>
                  </div>
                  {orderInfo.amount && (
                    <div className="flex justify-between">
                      <span>Сума:</span>
                      <span className="font-semibold golden-text">₴{orderInfo.amount}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>Статус:</span>
                    <span className="text-green-600 font-semibold">Оплачено</span>
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-4">
              <p className="text-gray-600">
                На вашу електронну пошту надіслано підтвердження та інструкції з доступу до курсів.
              </p>

              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-blue-800 font-medium">
                  📱 Для отримання доступу до курсів зв'яжіться з нами:
                </p>
                <div className="mt-2 space-y-1">
                  <p>
                    <strong>Telegram:</strong>
                    <a href="https://t.me/NeuroSoulDoctor" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline ml-2">
                      @NeuroSoulDoctor
                    </a>
                  </p>
                  <p>
                    <strong>Email:</strong>
                    <span className="ml-2">support@neurossoul.com</span>
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
              <Link
                href="/shop"
                className="golden-gradient text-white px-8 py-3 rounded-lg font-medium hover:scale-105 transition-transform"
              >
                Продовжити покупки
              </Link>
              <Link
                href="/"
                className="border border-yellow-500 text-yellow-700 hover:bg-yellow-50 px-8 py-3 rounded-lg font-medium transition-colors"
              >
                На головну
              </Link>
            </div>
          </div>

          {/* Додаткова інформація */}
          <div className="mt-12 grid md:grid-cols-3 gap-6">
            <div className="card-3d bg-white p-6 rounded-lg shadow-lg">
              <div className="text-center">
                <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <h3 className="font-semibold mb-2">Доступ до курсів</h3>
                <p className="text-sm text-gray-600">Отримайте посилання на курси протягом 24 годин</p>
              </div>
            </div>

            <div className="card-3d bg-white p-6 rounded-lg shadow-lg">
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M12 12h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="font-semibold mb-2">Підтримка</h3>
                <p className="text-sm text-gray-600">Цілодобова підтримка через Telegram</p>
              </div>
            </div>

            <div className="card-3d bg-white p-6 rounded-lg shadow-lg">
              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="font-semibold mb-2">Гарантія</h3>
                <p className="text-sm text-gray-600">100% гарантія повернення коштів протягом 7 днів</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
