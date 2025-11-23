'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { coursesData, Course } from '@/lib/courses-data';

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [courses, setCourses] = useState<Course[]>([]);
  
  const [showCreateCourse, setShowCreateCourse] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  
  const emptyCourse = {
    id: 0, title: '', price: 0, image: '', category: 'Цифровий товар',
    description: '', isActive: true, isNew: true, isDiscount: false, sales: 0
  };
  const [newCourse, setNewCourse] = useState(emptyCourse);

  useEffect(() => {
    if (localStorage.getItem('admin_authenticated') === 'true') setIsAuthenticated(true);
    setCourses(coursesData); // ЗАВАНТАЖЕННЯ ДАНИХ З ФАЙЛУ
  }, []);

  const handleLogin = () => {
    if (password === 'admin123') {
      setIsAuthenticated(true);
      localStorage.setItem('admin_authenticated', 'true');
    } else alert('Невірний пароль!');
  };

  const createCourse = () => {
    const maxId = Math.max(...courses.map(c => c.id), 0);
    setCourses([...courses, { ...newCourse, id: maxId + 1 }]);
    setShowCreateCourse(false);
    setNewCourse(emptyCourse);
  };

  const deleteCourse = (id: number) => {
    if (confirm('Видалити?')) setCourses(courses.filter(c => c.id !== id));
  };

  const generateCode = () => {
    const content = `export interface Course {
  id: number; title: string; price: number; image: string;
  isNew?: boolean; isDiscount?: boolean; isActive: boolean;
  category: string; description: string; sales: number;
}
export const coursesData: Course[] = ${JSON.stringify(courses, null, 2)};`;
    navigator.clipboard.writeText(content);
    alert('✅ КОД СКОПІЙОВАНО! Вставте його у src/lib/courses-data.ts на GitHub');
  };

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
      <div className="bg-white shadow p-4 mb-8 flex justify-between items-center">
        <span className="text-xl font-bold">Адмін-Панель v2.0 (Автономна)</span>
        <Link href="/" className="text-blue-600">На сайт</Link>
      </div>

      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between mb-6">
          <h2 className="text-2xl font-bold">Курси: {courses.length}</h2>
          <button onClick={() => setShowCreateCourse(true)} className="bg-green-600 text-white px-4 py-2 rounded">+ Додати</button>
        </div>

        <div className="grid gap-4">
          {courses.map(c => (
            <div key={c.id} className="bg-white p-4 rounded shadow flex justify-between items-center">
              <div className="flex items-center gap-4">
                <img src={c.image} className="w-16 h-16 object-cover rounded bg-gray-200" onError={(e)=>{e.currentTarget.src='https://placehold.co/100'}}/>
                <div>
                  <div className="font-bold">{c.title}</div>
                  <div className="text-sm text-gray-500">{c.price} грн | {c.isActive ? 'Активний' : 'Прихований'}</div>
                </div>
              </div>
              <button onClick={() => deleteCourse(c.id)} className="text-red-600 border px-2 py-1 rounded">Видалити</button>
            </div>
          ))}
        </div>
      </div>

      <div className="fixed bottom-6 right-6">
        <button onClick={generateCode} className="bg-yellow-600 text-white px-6 py-4 rounded-full shadow-2xl font-bold border-4 border-white hover:scale-105">
          💾 ЗБЕРЕГТИ ЗМІНИ У ФАЙЛ
        </button>
      </div>

      {showCreateCourse && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-white p-6 rounded w-96 space-y-3">
            <h3>Новий курс</h3>
            <input className="border w-full p-2" placeholder="Назва" value={newCourse.title} onChange={e => setNewCourse({...newCourse, title: e.target.value})} />
            <input className="border w-full p-2" type="number" placeholder="Ціна" value={newCourse.price || ''} onChange={e => setNewCourse({...newCourse, price: +e.target.value})} />
            <input className="border w-full p-2" placeholder="Фото URL" value={newCourse.image} onChange={e => setNewCourse({...newCourse, image: e.target.value})} />
            <div className="flex justify-end gap-2">
              <button onClick={() => setShowCreateCourse(false)} className="text-gray-500">Скасувати</button>
              <button onClick={createCourse} className="bg-green-600 text-white px-4 py-2 rounded">Додати</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
