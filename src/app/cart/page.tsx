'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';

interface CartItem {
  id: number;
  title: string;
  price: number;
  quantity: number;
  image: string;
}

export default function CartPage() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    email: '',
    phone: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  // Завантаження корзини з localStorage
  useEffect(() => {
    const savedCart = localStorage.getItem('neurossoul_cart');
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, []);

  // Збереження корзини в localStorage
  const saveCart = (newCart: CartItem[]) => {
    setCart(newCart);
    localStorage.setItem('neurossoul_cart', JSON.stringify(newCart));
  };

  const updateQuantity = (id: number, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(id);
      return;
    }

    const updatedCart = cart.map(item =>
      item.id === id ? { ...item, quantity: newQuantity } : item
    );
    saveCart(updatedCart);
  };

  const removeFromCart = (id: number) => {
    const updatedCart = cart.filter(item => item.id !== id);
    saveCart(updatedCart);
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomerInfo({
      ...customerInfo,
      [e.target.name]: e.target.value
    });
  };

  // WayForPay інтеграція та збереження замовлення
  const processPayment = async () => {
    if (cart.length === 0) {
      alert('Корзина порожня!');
      return;
    }

    if (!customerInfo.name || !customerInfo.email || !customerInfo.phone) {
      alert('Будь ласка, заповніть всі поля!');
      return;
    }

    setIsLoading(true);

    try {
      const orderReference = `ORDER_${Date.now()}`;

      const merchantAccount = 'ec441493c6962e485811edafbb0bedcf0b585f4e';
      const merchantDomainName = window.location.hostname;
      const orderDate = Math.floor(Date.now() / 1000);
      const amount = getTotalPrice();
      const currency = 'UAH';

      // Підготовка товарів
      const productName = cart.map(item => item.title);
      const productPrice = cart.map(item => item.price);
      const productCount = cart.map(item => item.quantity);

      const clientFirstName = customerInfo.name.split(' ')[0] || customerInfo.name;
      const clientLastName = customerInfo.name.split(' ')[1] || '';
      const clientEmail = customerInfo.email;
      const clientPhone = customerInfo.phone;

      const returnUrl = `${window.location.origin}/payment-success`;
      const serviceUrl = `${window.location.origin}/api/payment-callback`;

      // Збереження замовлення як "Pending" (очікує оплати)
      const pendingOrder = {
        id: Date.now(),
        orderReference: orderReference,
        customerName: customerInfo.name,
        customerEmail: customerInfo.email,
        customerPhone: customerInfo.phone,
        amount: amount,
        status: 'Pending',
        createdDate: new Date().toISOString(),
        items: cart.map(item => ({
          title: item.title,
          price: item.price,
          quantity: item.quantity
        }))
      };

      // Зберігаємо pending замовлення
      const existingOrders = JSON.parse(localStorage.getItem('neurossoul_orders') || '[]');
      const updatedOrders = [pendingOrder, ...existingOrders];
      localStorage.setItem('neurossoul_orders', JSON.stringify(updatedOrders));

      // Відправляємо дані на сервер для створення платіжної форми
      const paymentData = {
        merchantAccount,
        merchantDomainName,
        orderReference,
        orderDate,
        amount,
        currency,
        productName,
        productPrice,
        productCount,
        clientFirstName,
        clientLastName,
        clientEmail,
        clientPhone,
        returnUrl,
        serviceUrl
      };

      const response = await fetch('/api/create-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(paymentData),
      });

      if (!response.ok) {
        throw new Error('Помилка створення платежу');
      }

      const { paymentUrl, formData } = await response.json();

      // Перевіряємо чи отримали правильні дані
      if (!paymentUrl || !formData) {
        throw new Error('Не отримано правильні дані для оплати');
      }

      // Створення форми для WayForPay
      const form = document.createElement('form');
      form.method = 'POST';
      form.action = paymentUrl;
      form.target = '_self';

      // Додаємо всі поля форми з сервера
      Object.entries(formData).forEach(([key, value]) => {
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = key;
        input.value = Array.isArray(value) ? value.join(';') : String(value);
        form.appendChild(input);
      });

      // Тимчасово додаємо форму до body
      document.body.appendChild(form);

      console.log('Submitting form to:', paymentUrl);
      console.log('Form data:', formData);
      console.log('Form HTML:', form.outerHTML);

      // Перенаправляємо на WayForPay
      setTimeout(() => {
        form.submit();
      }, 100);

    } catch (error) {
      console.error('Помилка оплати:', error);
      alert('Помилка при оформленні оплати. Спробуйте ще раз.');
    } finally {
      setIsLoading(false);
    }
  };



  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 pt-24">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center py-16">
            <img
              src="https://ugc.same-assets.com/XcjFdE_iBjRqj5CnxT9PVpoO06X-YSow.png"
              alt="NeuroSoul Doctor Logo"
              className="neurosoul-logo mx-auto mb-8"
              onError={(e) => {
                e.currentTarget.src = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMjgiIGZpbGw9InVybCgjZ3JhZGllbnQwX3JhZGlhbF8xXzIpIiBzdHJva2U9IiNENEFGMzciIHN0cm9rZS13aWR0aD0iNCIvPgo8ZGVmcz4KPHJhZGlhbEdyYWRpZW50IGlkPSJncmFkaWVudDBfcmFkaWFsXzFfMiIgY3g9IjAiIGN5PSIwIiByPSIxIiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSIgZ3JhZGllbnRUcmFuc2Zvcm09InRyYW5zbGF0ZSgzMCAzMCkgcm90YXRlKDkwKSBzY2FsZSgzMCkiPgo8c3RvcCBzdG9wLWNvbG9yPSIjRkZENzAwIi8+CjxzdG9wIG9mZnNldD0iMC41IiBzdG9wLWNvbG9yPSIjRkZBNTAwIi8+CjxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iI0Q0QUYzNyIvPgo8L3JhZGlhbEdyYWRpZW50Pgo8L2RlZnM+Cjwvc3ZnPgo=";
              }}
            />
            <h1 className="dark-3d-heading-medium mb-4">Корзина порожня</h1>
            <p className="text-gray-600 mb-8">Додайте курси для продовження покупок</p>
            <Link
              href="/shop"
              className="golden-gradient text-white px-8 py-3 rounded-lg font-medium hover:scale-105 transition-transform inline-block"
            >
              Перейти до каталогу курсів
            </Link>
          </div>
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
            <div className="flex items-center space-x-6">
              <Link href="/" className="text-gray-700 hover:text-yellow-600 transition-colors">Головна</Link>
              <Link href="/shop" className="text-gray-700 hover:text-yellow-600 transition-colors">Курси</Link>
              <Link href="/cart" className="text-yellow-600 font-semibold">Корзина ({cart.length})</Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="pt-24 pb-12 px-4">
        <div className="max-w-6xl mx-auto">
          <h1 className="dark-3d-heading-medium mb-8 text-center">Корзина покупок</h1>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Список товарів */}
            <div className="lg:col-span-2 space-y-4">
              {cart.map((item) => (
                <div key={item.id} className="card-3d bg-white p-6 rounded-lg shadow-lg">
                  <div className="flex items-center space-x-4">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-20 h-20 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <Link href={`/course/${item.id}`} className="hover:text-yellow-600 transition-colors">
                        <h3 className="font-semibold text-lg leading-tight">
                          {item.title.length > 60 ? item.title.substring(0, 60) + '...' : item.title}
                        </h3>
                      </Link>
                      <p className="text-2xl font-bold golden-text mt-2">₴{item.price}</p>
                    </div>
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100"
                      >
                        −
                      </button>
                      <span className="text-lg font-semibold w-12 text-center">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100"
                      >
                        +
                      </button>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="ml-4 text-red-500 hover:text-red-700 p-2"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Оформлення замовлення */}
            <div className="card-3d bg-white p-6 rounded-lg shadow-lg h-fit">
              <h2 className="dark-3d-heading mb-6">Оформлення замовлення</h2>

              {/* Підсумок */}
              <div className="border-b pb-4 mb-6">
                <div className="flex justify-between text-lg mb-2">
                  <span>Товарів: {cart.reduce((sum, item) => sum + item.quantity, 0)}</span>
                </div>
                <div className="flex justify-between text-2xl font-bold golden-text">
                  <span>До сплати:</span>
                  <span>₴{getTotalPrice()}</span>
                </div>
              </div>

              {/* Форма клієнта */}
              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Ім'я та прізвище*</label>
                  <input
                    type="text"
                    name="name"
                    value={customerInfo.name}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500 focus:outline-none"
                    placeholder="Введіть ваше повне ім'я"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Email*</label>
                  <input
                    type="email"
                    name="email"
                    value={customerInfo.email}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500 focus:outline-none"
                    placeholder="your@email.com"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Телефон*</label>
                  <input
                    type="tel"
                    name="phone"
                    value={customerInfo.phone}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500 focus:outline-none"
                    placeholder="+380XXXXXXXXX"
                    required
                  />
                </div>
              </div>

              {/* Кнопка оплати */}
              <button
                onClick={processPayment}
                disabled={isLoading}
                className={`w-full golden-gradient text-white py-4 rounded-lg font-bold text-lg transition-transform ${
                  isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'
                }`}
              >
                {isLoading ? 'Перенаправлення...' : `Оплатити ₴${getTotalPrice()}`}
              </button>

              <p className="text-xs text-gray-500 mt-4 text-center">
                Натискаючи "Оплатити", ви погоджуєтесь з умовами публічної оферти
              </p>
            </div>
          </div>

          {/* Рекомендовані курси */}
          <div className="mt-12">
            <h2 className="dark-3d-heading-medium mb-8 text-center">Рекомендуємо також</h2>
            <div className="text-center">
              <Link
                href="/shop"
                className="golden-gradient text-white px-8 py-3 rounded-lg font-medium hover:scale-105 transition-transform inline-block"
              >
                Переглянути всі курси
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function CartPage() {
  const [cart, setCart] = useState<any[]>([]);
  const [isClient, setIsClient] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const saved = localStorage.getItem('cart');
    if (saved) setCart(JSON.parse(saved));
  }, []);

  const updateQty = (id: number, delta: number) => {
    const newCart = cart.map(i => i.id === id ? { ...i, quantity: Math.max(1, i.quantity + delta) } : i);
    setCart(newCart);
    localStorage.setItem('cart', JSON.stringify(newCart));
    window.dispatchEvent(new Event('cart-updated'));
  };

  const removeItem = (id: number) => {
    const newCart = cart.filter(i => i.id !== id);
    setCart(newCart);
    localStorage.setItem('cart', JSON.stringify(newCart));
    window.dispatchEvent(new Event('cart-updated'));
  };

  const total = cart.reduce((s, i) => s + i.price * i.quantity, 0);

  const handlePayment = async () => {
    if (cart.length === 0) return;
    setIsProcessing(true);
    
    try {
      const orderRef = `ORDER_${Date.now()}`;
      
      // Save order to history
      const newOrder = {
        id: Date.now(),
        orderReference: orderRef,
        createdDate: new Date().toISOString(),
        amount: total,
        items: cart,
        customerName: 'Клієнт сайту'
      };
      
      const existingOrders = JSON.parse(localStorage.getItem('orders') || '[]');
      localStorage.setItem('orders', JSON.stringify([newOrder, ...existingOrders]));

      // Get payment signature from API
      const res = await fetch('/api/wayforpay', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderReference: orderRef,
          orderDate: Math.floor(Date.now() / 1000),
          amount: total,
          currency: "UAH",
          productName: cart.map(i => i.title),
          productPrice: cart.map(i => i.price),
          productCount: cart.map(i => i.quantity)
        })
      });

      if (!res.ok) {
        throw new Error('Payment signature failed');
      }
      
      const paymentData = await res.json();
      
      // Create and submit payment form
      const form = document.createElement('form');
      form.method = 'POST';
      form.action = 'https://secure.wayforpay.com/pay';
      
      Object.entries(paymentData).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          value.forEach(val => {
            const input = document.createElement('input');
            input.type = 'hidden';
            input.name = `${key}[]`;
            input.value = String(val);
            form.appendChild(input);
          });
        } else {
          const input = document.createElement('input');
          input.type = 'hidden';
          input.name = key;
          input.value = String(value);
          form.appendChild(input);
        }
      });
      
      document.body.appendChild(form);
      form.submit();
      
      // Clear cart after successful submission
      localStorage.setItem('cart', '[]');
      window.dispatchEvent(new Event('cart-updated'));
      
    } catch (error) {
      console.error('Payment error:', error);
      alert('Помилка оплати. Спробуйте пізніше.');
      setIsProcessing(false);
    }
  };

  if (!isClient) return null;

  return (
    <div className="min-h-screen bg-black pt-24 px-4 pb-20">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">
          <span className="bg-gradient-to-r from-green-400 to-cyan-400 bg-clip-text text-transparent">
            Кошик
          </span>
        </h1>

        {cart.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-400 text-xl mb-6">Кошик порожній</p>
            <Link 
              href="/shop" 
              className="inline-block bg-gradient-to-r from-green-500 to-cyan-500 text-black px-8 py-3 rounded-full font-bold hover:shadow-lg hover:shadow-green-500/50 transition-all"
            >
              Перейти до магазину
            </Link>
          </div>
        ) : (
          <>
            <div className="space-y-4 mb-8">
              {cart.map((item) => (
                <div key={item.id} className="bg-black/50 border border-green-500/30 rounded-2xl p-6 flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-white mb-2">{item.title}</h3>
                    <p className="text-green-400 text-lg">₴{item.price}</p>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => updateQty(item.id, -1)} 
                        className="w-8 h-8 rounded-full bg-green-500/20 text-green-400 hover:bg-green-500/30 transition-colors"
                      >
                        -
                      </button>
                      <span className="text-white w-10 text-center">{item.quantity}</span>
                      <button 
                        onClick={() => updateQty(item.id, 1)} 
                        className="w-8 h-8 rounded-full bg-green-500/20 text-green-400 hover:bg-green-500/30 transition-colors"
                      >
                        +
                      </button>
                    </div>
                    
                    <button 
                      onClick={() => removeItem(item.id)} 
                      className="text-red-400 hover:text-red-300 transition-colors"
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-gradient-to-r from-green-900/30 to-cyan-900/30 border border-green-500/30 rounded-2xl p-8">
              <div className="flex justify-between items-center mb-6">
                <span className="text-2xl text-white">Загальна сума:</span>
                <span className="text-3xl font-bold text-green-400">₴{total}</span>
              </div>
              
              <button
                onClick={handlePayment}
                disabled={isProcessing}
                className={`w-full py-4 rounded-full font-bold text-black transition-all duration-300 ${
                  isProcessing 
                    ? 'bg-gray-500 cursor-not-allowed' 
                    : 'bg-gradient-to-r from-green-500 to-cyan-500 hover:shadow-lg hover:shadow-green-500/50 hover:scale-105'
                }`}
              >
                {isProcessing ? 'Обробка...' : 'Оформити замовлення'}
              </button>
              
              <p className="text-center text-gray-500 mt-4 text-sm">
                Безпечна оплата через WayForPay
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
