'use client';

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

      // Get payment signature
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
    } finally {
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

      document.body.appendChild(form);
      form.submit();
    } catch (e) { alert('Помилка оплати'); }
  };

  if (!isClient) return <div>Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50 pt-24 px-4">
      <div className="max-w-4xl mx-auto bg-white p-8 rounded shadow">
        <h1 className="text-2xl font-bold mb-6">Кошик</h1>
        {cart.length === 0 ? <p>Пусто. <Link href="/shop" className="text-blue-500">В магазин</Link></p> : (
          <>
            {cart.map(item => (
              <div key={item.id} className="flex justify-between items-center border-b py-4">
                <div><b>{item.title}</b><br/>{item.price} грн</div>
                <div className="flex items-center gap-2">
                  <button onClick={() => updateQty(item.id, -1)} className="px-2 border">-</button>
                  {item.quantity}
                  <button onClick={() => updateQty(item.id, 1)} className="px-2 border">+</button>
                  <button onClick={() => removeItem(item.id)} className="text-red-500 ml-2">✕</button>
                </div>
              </div>
            ))}
            <div className="mt-6 flex justify-between items-center">
              <div className="text-xl font-bold">Всього: {cart.reduce((s, i) => s + i.price * i.quantity, 0)} грн</div>
              <button onClick={handlePayment} className="bg-green-600 text-white px-6 py-3 rounded hover:bg-green-700">ОПЛАТИТИ</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
