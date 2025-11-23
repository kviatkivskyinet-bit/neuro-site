'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function CartPage() {
  const [cart, setCart] = useState<any[]>([]);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const saved = localStorage.getItem('neurossoul_cart');
    if (saved) setCart(JSON.parse(saved));
  }, []);

  const updateQty = (id: number, delta: number) => {
    const newCart = cart.map(i => i.id === id ? { ...i, quantity: Math.max(1, i.quantity + delta) } : i);
    setCart(newCart);
    localStorage.setItem('neurossoul_cart', JSON.stringify(newCart));
  };

  const removeItem = (id: number) => {
    const newCart = cart.filter(i => i.id !== id);
    setCart(newCart);
    localStorage.setItem('neurossoul_cart', JSON.stringify(newCart));
  };

  const handlePayment = async () => {
    if (cart.length === 0) return;
    const orderRef = `ORDER_${Date.now()}`;
    
    // Зберігаємо замовлення в історію браузера (для адмінки)
    const newOrder = {
      id: Date.now(), orderReference: orderRef, createdDate: new Date().toISOString(),
      amount: cart.reduce((s, i) => s + i.price * i.quantity, 0),
      items: cart, customerName: 'Клієнт сайту'
    };
    const existingOrders = JSON.parse(localStorage.getItem('neurossoul_orders') || '[]');
    localStorage.setItem('neurossoul_orders', JSON.stringify([newOrder, ...existingOrders]));

    try {
      const res = await fetch('/api/wayforpay', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderReference: orderRef,
          orderDate: Math.floor(Date.now() / 1000),
          amount: newOrder.amount,
          currency: "UAH",
          productNames: cart.map(i => i.title),
          productPrices: cart.map(i => i.price),
          productCounts: cart.map(i => i.quantity)
        })
      });

      if (!res.ok) throw new Error('Підпис не отримано');
      const { signature, login } = await res.json();

      const form = document.createElement('form');
      form.method = 'POST';
      form.action = 'https://secure.wayforpay.com/pay';
      form.target = '_self';

      const add = (n: string, v: any) => {
        if (Array.isArray(v)) v.forEach(val => { const i = document.createElement('input'); i.type='hidden'; i.name=n+'[]'; i.value=String(val); form.appendChild(i); });
        else { const i = document.createElement('input'); i.type='hidden'; i.name=n; i.value=String(v); form.appendChild(i); }
      };

      add('merchantAccount', login);
      add('merchantAuthType', 'SimpleSignature');
      add('merchantDomainName', 'neuro-soul.netlify.app');
      add('orderReference', orderRef);
      add('orderDate', Math.floor(Date.now() / 1000));
      add('amount', newOrder.amount);
      add('currency', 'UAH');
      add('productName', cart.map(i => i.title));
      add('productPrice', cart.map(i => i.price));
      add('productCount', cart.map(i => i.quantity));
      add('merchantSignature', signature);
      add('defaultPaymentSystem', 'card');

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
