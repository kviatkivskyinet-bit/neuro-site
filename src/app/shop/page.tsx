'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { coursesData, Course } from '@/lib/courses-data';

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [activeTab, setActiveTab] = useState('courses');
  
  // Локальний стан даних
  const [courses, setCourses] = useState<Course[]>([]);
  
  // Стан для редагування
  const [showCreateCourse, setShowCreateCourse] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  
  // Порожній шаблон
  const emptyCourse = {
    id: 0,
    title: '',
    price: 0,
    image: '',
    category: 'Цифровий товар',
    description: '',
    isActive: true,
    isNew: true,
    isDiscount: false,
    sales: 0
  };
  
  const [newCourse, setNewCourse] = useState(emptyCourse);

  const handleLogin = () => {
    if (password === 'admin123') {
      setIsAuthenticated(true);
      localStorage.setItem('admin_authenticated', 'true');
    } else {
      alert('Невірний пароль!');
    }
  };

  useEffect(() => {
    if (localStorage.getItem('admin_authenticated') === 'true') {
      setIsAuthenticated(true);
    }
    // ВАЖЛИВО: Завантажуємо дані прямо з файлу
    setCourses(coursesData);
  }, []);

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('admin_authenticated');
  };

  // --- ЛОГІКА ---
  const createCourse = () => {
    const maxId = Math.max(...courses.map(c => c.id), 0);
    const courseToAdd = { ...newCourse, id: maxId + 1 };
    setCourses([...courses, courseToAdd]);
    setShowCreateCourse(false);
    setNewCourse(emptyCourse);
  };

  const updateCourse = () => {
    if (!editingCourse) return;
    setCourses(courses.map(c => (c.id === editingCourse.id ? editingCourse : c)));
    setEditingCourse(null);
  };

  const deleteCourse = (id: number) => {
    if (confirm('Видалити цей курс?')) {
      setCourses(courses.filter(c => c.id !== id));
    }
  };

  const updateField = (id: number, field: keyof Course, value: any) => {
    setCourses(courses.map(c => (c.id === id ? { ...c, [field]: value } : c)));
  };

  // --- ГЕНЕРАЦІЯ КОДУ ---
  const generateCode = () => {
    const jsonContent = JSON.stringify(courses, null, 2);
    const fileContent = `export interface Course {
  id: number;
  title: string;
  price: number;
  image: string;
  isNew?: boolean;
  isDiscount?: boolean;
  isActive: boolean;
  category: string;
  description: string;
  sales: number;
}

export const coursesData: Course[] = ${jsonContent};`;

    navigator.clipboard.writeText(fileContent);
    alert('✅ КОД СКОПІЙОВАНО!\n\nТепер йди на GitHub -> src/lib/courses-data.ts\nНатисни "Edit", видали все і встав цей код.');
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full text-center">
          <h1 className="text-2xl font-bold mb-4">Вхід в Адмінку</h1>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border p-2 rounded mb-4"
            placeholder="Пароль (admin123)"
          />
          <button onClick={handleLogin} className="w-full bg-yellow-600 text-white p-2 rounded">Увійти</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 pb-24">
      <header className="bg-white shadow mb-8">
        <div className="max-w-7xl mx-auto px-4 h-16 flex justify-between items-center">
          <span className="text-xl font-bold text-gray-800">Адмін-Панель v2.0 (Автономна)</span>
          <div className="flex gap-4">
            <Link href="/" className="text-blue-600">На сайт</Link>
            <button onClick={handleLogout} className="text-red-600">Вийти</button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Курси ({courses.length})</h2>
          <button onClick={() => setShowCreateCourse(true)} className="bg-green-600 text-white px-4 py-2 rounded">
            + Додати курс
          </button>
        </div>

        <div className="grid gap-4">
          {courses.map(course => (
            <div key={course.id} className="bg-white p-4 rounded shadow flex gap-4 items-start">
              <img src={course.image} alt="img" className="w-20 h-20 object-cover rounded bg-gray-200" 
                   onError={(e) => {e.currentTarget.src = "https://placehold.co/100"}}/>
              <div className="flex-1">
                <div className="flex justify-between">
                  <h3 className="font-bold text-lg">{course.title}</h3>
                  <div>
                    <button onClick={() => setEditingCourse(course)} className="text-blue-600 mr-3">Ред.</button>
                    <button onClick={() => deleteCourse(course.id)} className="text-red-600">Вид.</button>
                  </div>
                </div>
                <div className="flex gap-4 mt-2 text-sm items-center">
                  <input type="number" value={course.price} onChange={(e) => updateField(course.id, 'price', Number(e.target.value))} className="border w-20 p-1 rounded"/>
                  <span>грн</span>
                  <button onClick={() => updateField(course.id, 'isActive', !course.isActive)} className={`px-2 py-1 rounded ${course.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {course.isActive ? 'Активний' : 'Прихований'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* КНОПКА ЗБЕРЕЖЕННЯ */}
      <div className="fixed bottom-6 right-6 z-50">
        <button onClick={generateCode} className="bg-yellow-600 text-white px-6 py-4 rounded-full shadow-2xl font-bold text-lg border-4 border-white hover:scale-105 transition-transform">
          💾 ЗБЕРЕГТИ ЗМІНИ У ФАЙЛ
        </button>
      </div>

      {/* Модалка створення */}
      {showCreateCourse && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded w-full max-w-md">
            <h3 className="text-xl font-bold mb-4">Новий курс</h3>
            <div className="space-y-3">
              <input className="w-full border p-2" placeholder="Назва" value={newCourse.title} onChange={e => setNewCourse({...newCourse, title: e.target.value})} />
              <input className="w-full border p-2" type="number" placeholder="Ціна" value={newCourse.price} onChange={e => setNewCourse({...newCourse, price: Number(e.target.value)})} />
              <input className="w-full border p-2" placeholder="Фото URL" value={newCourse.image} onChange={e => setNewCourse({...newCourse, image: e.target.value})} />
              <div className="flex justify-end gap-2 mt-4">
                <button onClick={() => setShowCreateCourse(false)} className="px-4 py-2 text-gray-600">Скасувати</button>
                <button onClick={createCourse} className="px-4 py-2 bg-green-600 text-white rounded">Додати</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
