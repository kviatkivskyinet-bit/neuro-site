'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { coursesData, Course } from '@/lib/courses-data';

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [activeTab, setActiveTab] = useState('dashboard');
  
  // ДАНІ
  const [courses, setCourses] = useState<Course[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  
  // СТАНИ ДЛЯ КУРСІВ
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [showCreateCourse, setShowCreateCourse] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  
  const emptyCourse = {
    id: 0, title: '', price: 0, image: '', category: 'Цифровий товар',
    description: '', isActive: true, isNew: true, isDiscount: false, sales: 0
  };
  const [newCourse, setNewCourse] = useState(emptyCourse);

  // ІНІЦІАЛІЗАЦІЯ
  useEffect(() => {
    if (localStorage.getItem('admin_authenticated') === 'true') setIsAuthenticated(true);
    
    // 1. Завантажуємо курси з файлу
    setCourses(coursesData);

    // 2. Завантажуємо замовлення з пам'яті браузера
    const savedOrders = localStorage.getItem('neurossoul_orders');
    if (savedOrders) {
      setOrders(JSON.parse(savedOrders));
    }
  }, []);

  const handleLogin = () => {
    if (password === 'admin123') {
      setIsAuthenticated(true);
      localStorage.setItem('admin_authenticated', 'true');
    } else alert('Невірний пароль!');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('admin_authenticated');
  };

  // --- ЛОГІКА КУРСІВ ---
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, target: 'new' | 'edit') => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    try {
      const res = await fetch('/api/admin/upload', { method: 'POST', body: formData });
      if (!res.ok) throw new Error('Upload failed');
      const data = await res.json();
      if (target === 'new') setNewCourse({ ...newCourse, image: data.url });
      else if (editingCourse) setEditingCourse({ ...editingCourse, image: data.url });
    } catch (err) { alert('Помилка завантаження фото.'); } 
    finally { setIsUploading(false); }
  };

  const createCourse = () => {
    const maxId = Math.max(...courses.map(c => c.id), 0);
    setCourses([...courses, { ...newCourse, id: maxId + 1 }]);
    setShowCreateCourse(false);
    setNewCourse(emptyCourse);
  };

  const updateCourse = () => {
    if (!editingCourse) return;
    setCourses(courses.map(c => (c.id === editingCourse.id ? editingCourse : c)));
    setEditingCourse(null);
  };

  const deleteCourse = (id: number) => {
    if (confirm('Видалити?')) setCourses(courses.filter(c => c.id !== id));
  };

  const saveToCloud = async () => {
    setIsSaving(true);
    try {
      const content = `export interface Course {
  id: number; title: string; price: number; image: string;
  isNew?: boolean; isDiscount?: boolean; isActive: boolean;
  category: string; description: string; sales: number;
}
export const coursesData: Course[] = ${JSON.stringify(courses, null, 2)};`;

      const response = await fetch('/api/admin/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content })
      });

      if (!response.ok) throw new Error('Error');
      alert('✅ САЙТ ОНОВЛЕНО! Зміни з\'являться за 1 хвилину.');
    } catch (error) {
      alert('❌ Помилка збереження.');
    } finally {
      setIsSaving(false);
    }
  };

  // --- СТАТИСТИКА ---
  const totalRevenue = orders.reduce((sum, order) => sum + order.amount, 0);

  if (!isAuthenticated) return (
    <div className="flex h-screen items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded shadow text-center">
        <h1 className="text-2xl font-bold mb-4">Вхід в Адмінку</h1>
        <input type="password" value={password} onChange={e => setPassword(e.target.value)} className="border p-2 rounded mb-4 w-full" placeholder="admin123" />
        <button onClick={handleLogin} className="bg-yellow-600 text-white p-2 rounded w-full">Увійти</button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100 pb-24">
      {/* HEADER */}
      <div className="bg-white shadow p-4 flex justify-between items-center sticky top-0 z-40">
        <span className="text-xl font-bold">Адмінка v5.0 (Full)</span>
        <div className="flex gap-4">
          <Link href="/" className="text-blue-600">На сайт</Link>
          <button onClick={handleLogout} className="text-red-600">Вийти</button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* TABS */}
        <div className="flex gap-6 border-b mb-6">
          {['dashboard', 'orders', 'courses', 'settings'].map(tab => (
            <button 
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-2 px-2 uppercase font-bold text-sm ${activeTab === tab ? 'border-b-2 border-yellow-600 text-yellow-700' : 'text-gray-500'}`}
            >
              {tab === 'dashboard' ? 'Дашборд' : tab === 'orders' ? 'Замовлення' : tab === 'courses' ? 'Курси' : 'Налаштування'}
            </button>
          ))}
        </div>

        {/* === DASHBOARD === */}
        {activeTab === 'dashboard' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded shadow border-l-4 border-green-500">
              <div className="text-gray-500">Дохід (WayForPay)</div>
              <div className="text-3xl font-bold">₴{totalRevenue}</div>
            </div>
            <div className="bg-white p-6 rounded shadow border-l-4 border-blue-500">
              <div className="text-gray-500">Замовлень</div>
              <div className="text-3xl font-bold">{orders.length}</div>
            </div>
            <div className="bg-white p-6 rounded shadow border-l-4 border-purple-500">
              <div className="text-gray-500">Активних курсів</div>
              <div className="text-3xl font-bold">{courses.filter(c => c.isActive).length}</div>
            </div>
          </div>
        )}

        {/* === ORDERS === */}
        {activeTab === 'orders' && (
          <div className="bg-white rounded shadow overflow-hidden">
            {orders.length === 0 ? (
              <div className="p-8 text-center text-gray-500">Замовлень поки немає</div>
            ) : (
              <table className="w-full text-left">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="p-3">ID</th>
                    <th className="p-3">Дата</th>
                    <th className="p-3">Сума</th>
                    <th className="p-3">Статус</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order, i) => (
                    <tr key={i} className="border-b hover:bg-gray-50">
                      <td className="p-3 font-mono text-sm">{order.orderReference || `ORDER-${order.id}`}</td>
                      <td className="p-3 text-sm">{new Date(order.createdDate || Date.now()).toLocaleString()}</td>
                      <td className="p-3 font-bold text-yellow-600">₴{order.amount}</td>
                      <td className="p-3"><span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">Створено</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {/* === COURSES (Наша робоча конячка) === */}
        {activeTab === 'courses' && (
          <div>
            <div className="flex justify-between mb-6">
              <h2 className="text-xl font-bold">Список курсів</h2>
              <button onClick={() => setShowCreateCourse(true)} className="bg-green-600 text-white px-4 py-2 rounded shadow hover:bg-green-700">+ Додати курс</button>
            </div>
            <div className="grid gap-4">
              {courses.map(c => (
                <div key={c.id} className="bg-white p-4 rounded shadow flex gap-4 items-start">
                  <img src={c.image} className="w-24 h-24 object-cover rounded bg-gray-200" onError={(e:any)=>{e.target.src='https://placehold.co/100'}}/>
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <h3 className="font-bold text-lg">{c.title}</h3>
                      <div className="flex gap-2">
                        <button onClick={() => setEditingCourse(c)} className="text-blue-600 border px-3 py-1 rounded hover:bg-blue-50">Ред.</button>
                        <button onClick={() => deleteCourse(c.id)} className="text-red-600 border px-3 py-1 rounded hover:bg-red-50">Вид.</button>
                      </div>
                    </div>
                    <div className="mt-2 text-sm text-gray-600">
                      Ціна: <span className="font-bold text-black">{c.price} грн</span> | 
                      Статус: <span className={c.isActive ? 'text-green-600' : 'text-red-600'}>{c.isActive ? 'Активний' : 'Прихований'}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {/* КНОПКА ЗБЕРЕЖЕННЯ */}
            <div className="fixed bottom-6 right-6">
              <button onClick={saveToCloud} disabled={isSaving} className={`${isSaving ? 'bg-gray-500' : 'bg-green-600'} text-white px-6 py-4 rounded-full shadow-2xl font-bold border-4 border-white hover:scale-105 flex items-center gap-2 transition-all`}>
                {isSaving ? '⏳ ЗБЕРЕЖЕННЯ...' : '☁️ ОНОВИТИ САЙТ'}
              </button>
            </div>
          </div>
        )}

        {/* === SETTINGS === */}
        {activeTab === 'settings' && (
          <div className="bg-white p-8 rounded shadow text-center">
            <h3 className="text-lg font-bold mb-2">Налаштування ключів</h3>
            <p className="text-gray-600 mb-4">Ключі WayForPay та GitHub налаштовуються через панель Netlify (Environment Variables).</p>
            <a href="https://app.netlify.com" target="_blank" className="text-blue-600 underline">Перейти в Netlify</a>
          </div>
        )}
      </div>

      {/* МОДАЛКИ (Створення / Редагування) */}
      {(showCreateCourse || editingCourse) && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-6 rounded w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl">
            <h3 className="text-xl font-bold mb-4">{showCreateCourse ? 'Новий курс' : 'Редагування'}</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-600 mb-1">Назва</label>
                <input className="border w-full p-2 rounded" 
                  value={showCreateCourse ? newCourse.title : editingCourse?.title} 
                  onChange={e => showCreateCourse ? setNewCourse({...newCourse, title: e.target.value}) : editingCourse && setEditingCourse({...editingCourse, title: e.target.value})} 
                />
              </div>
              
              <div>
                <label className="block text-sm text-gray-600 mb-1">Ціна (грн)</label>
                <input type="number" className="border w-full p-2 rounded" 
                  value={showCreateCourse ? newCourse.price : editingCourse?.price} 
                  onChange={e => showCreateCourse ? setNewCourse({...newCourse, price: +e.target.value}) : editingCourse && setEditingCourse({...editingCourse, price: +e.target.value})} 
                />
              </div>

              <div className="bg-gray-50 p-3 rounded border">
                <label className="block text-sm text-gray-600 mb-2">Фото курсу</label>
                <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, showCreateCourse ? 'new' : 'edit')} className="w-full text-sm" />
                {isUploading && <div className="text-blue-500 text-sm mt-1">Завантаження на сервер...</div>}
                <input className="border w-full p-2 mt-2 text-xs bg-white text-gray-500" readOnly 
                  value={showCreateCourse ? newCourse.image : editingCourse?.image} placeholder="URL з'явиться тут автоматично" 
                />
                {(showCreateCourse ? newCourse.image : editingCourse?.image) && (
                  <img src={showCreateCourse ? newCourse.image : editingCourse?.image} className="h-24 mt-2 rounded object-cover" />
                )}
              </div>

              <div>
                <label className="block text-sm text-gray-600 mb-1">Опис</label>
                <textarea className="border w-full p-2 rounded" rows={4} 
                  value={showCreateCourse ? newCourse.description : editingCourse?.description} 
                  onChange={e => showCreateCourse ? setNewCourse({...newCourse, description: e.target.value}) : editingCourse && setEditingCourse({...editingCourse, description: e.target.value})} 
                />
              </div>

              <div className="flex gap-4">
                 <label className="flex items-center gap-2">
                    <input type="checkbox" checked={showCreateCourse ? newCourse.isActive : editingCourse?.isActive} 
                      onChange={e => showCreateCourse ? setNewCourse({...newCourse, isActive: e.target.checked}) : editingCourse && setEditingCourse({...editingCourse, isActive: e.target.checked})} 
                    /> Активний
                 </label>
                 <label className="flex items-center gap-2">
                    <input type="checkbox" checked={showCreateCourse ? newCourse.isNew : editingCourse?.isNew} 
                      onChange={e => showCreateCourse ? setNewCourse({...newCourse, isNew: e.target.checked}) : editingCourse && setEditingCourse({...editingCourse, isNew: e.target.checked})} 
                    /> Новинка
                 </label>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
              <button onClick={() => {setShowCreateCourse(false); setEditingCourse(null)}} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded">Скасувати</button>
              <button onClick={showCreateCourse ? createCourse : updateCourse} className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 font-bold">
                {showCreateCourse ? 'Додати' : 'Зберегти'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
