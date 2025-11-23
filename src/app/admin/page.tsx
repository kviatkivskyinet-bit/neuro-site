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

interface Order {
  id: number;
  orderReference: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  amount: number;
  status: string;
  createdDate: string;
  items: Array<{title: string, price: number, quantity: number}>;
}

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [activeTab, setActiveTab] = useState('dashboard');
  const [orders, setOrders] = useState<Order[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [settings, setSettings] = useState({
    siteName: "NeuroSoul Doctor",
    supportEmail: "support@neurossoul.com",
    telegram: "@NeuroSoulDoctor",
    tiktok: "@souldoctor58",
    socialMedia: [
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
      },
      {
        id: "instagram",
        name: "Instagram",
        url: "",
        icon: "instagram",
        enabled: false
      },
      {
        id: "youtube",
        name: "YouTube",
        url: "",
        icon: "youtube",
        enabled: false
      }
    ] as SocialMedia[],
    wayforpay: {
      merchantId: "ec441493c6962e485811edafbb0bedcf0b585f4e",
      secretKey: "2055864c0f5d94c6b03616b4ebe7dec3"
    }
  });
  const [showCreateCourse, setShowCreateCourse] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [uploadedImage, setUploadedImage] = useState<string>('');
  const [newCourse, setNewCourse] = useState({
    title: '',
    price: 0,
    image: '',
    category: 'Цифровий товар',
    description: '',
    isActive: true,
    isNew: true,
    isDiscount: false
  });

  const handleLogin = () => {
    // Простий пароль для демо (в продакшені використовуйте proper authentication)
    if (password === 'admin123') {
      setIsAuthenticated(true);
      localStorage.setItem('admin_authenticated', 'true');
    } else {
      alert('Невірний пароль!');
    }
  };

  useEffect(() => {
    const authenticated = localStorage.getItem('admin_authenticated');
    if (authenticated === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  // Завантаження курсів та налаштувань з API
  useEffect(() => {
    if (isAuthenticated) {
      loadCourses();
      loadSettings();
      loadOrders();
    }
  }, [isAuthenticated]);

  const loadCourses = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/courses');
      if (response.ok) {
        const data = await response.json();
        setCourses(data);
      }
    } catch (error) {
      console.error('Failed to load courses:', error);
      alert('Помилка завантаження курсів');
    } finally {
      setLoading(false);
    }
  };

  const loadSettings = async () => {
    try {
      const response = await fetch('/api/settings');
      if (response.ok) {
        const data = await response.json();
        setSettings(data);
      }
    } catch (error) {
      console.error('Failed to load settings:', error);
    }
  };

  const loadOrders = () => {
    // Завантаження замовлень з localStorage (в реальному проекті з бази даних)
    const savedOrders = localStorage.getItem('neurossoul_orders');
    if (savedOrders) {
      setOrders(JSON.parse(savedOrders));
    }
  };

  const saveSettings = async () => {
    try {
      const response = await fetch('/api/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(settings),
      });

      if (response.ok) {
        alert('Налаштування збережено успішно!');
      } else {
        alert('Помилка збереження налаштувань');
      }
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('Помилка збереження налаштувань');
    }
  };

  const createCourse = async () => {
    try {
      const courseData = {
        ...newCourse,
        image: uploadedImage || newCourse.image
      };

      const response = await fetch('/api/courses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(courseData),
      });

      if (response.ok) {
        const createdCourse = await response.json();
        setCourses([...courses, createdCourse]);
        setShowCreateCourse(false);
        setNewCourse({
          title: '',
          price: 0,
          image: '',
          category: 'Цифровий товар',
          description: '',
          isActive: true,
          isNew: true,
          isDiscount: false
        });
        setUploadedImage('');
        alert('Курс створено успішно!');
      } else {
        alert('Помилка створення курсу');
      }
    } catch (error) {
      console.error('Error creating course:', error);
      alert('Помилка створення курсу');
    }
  };

  const updateCourse = async (courseId: number, updates: Partial<Course>) => {
    try {
      const response = await fetch(`/api/courses/${courseId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      });

      if (response.ok) {
        const updatedCourse = await response.json();
        setCourses(courses.map(course =>
          course.id === courseId ? updatedCourse : course
        ));
        setEditingCourse(null);
        alert('Курс оновлено успішно!');
      } else {
        alert('Помилка оновлення курсу');
      }
    } catch (error) {
      console.error('Error updating course:', error);
      alert('Помилка оновлення курсу');
    }
  };

  const deleteCourse = async (courseId: number) => {
    if (!confirm('Ви впевнені, що хочете видалити цей курс?')) return;

    try {
      const response = await fetch(`/api/courses/${courseId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setCourses(courses.filter(course => course.id !== courseId));
        alert('Курс видалено успішно!');
      } else {
        alert('Помилка видалення курсу');
      }
    } catch (error) {
      console.error('Error deleting course:', error);
      alert('Помилка видалення курсу');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('admin_authenticated');
  };

  const updateCoursePrice = async (courseId: number, newPrice: number) => {
    try {
      const response = await fetch(`/api/courses/${courseId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ price: newPrice }),
      });

      if (response.ok) {
        const updatedCourse = await response.json();
        setCourses(courses.map(course =>
          course.id === courseId ? updatedCourse : course
        ));
        alert('Ціну оновлено успішно!');
      } else {
        alert('Помилка оновлення ціни');
      }
    } catch (error) {
      console.error('Error updating price:', error);
      alert('Помилка оновлення ціни');
    }
  };

  const toggleCourseStatus = async (courseId: number) => {
    try {
      const course = courses.find(c => c.id === courseId);
      if (!course) return;

      const response = await fetch(`/api/courses/${courseId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isActive: !course.isActive }),
      });

      if (response.ok) {
        const updatedCourse = await response.json();
        setCourses(courses.map(course =>
          course.id === courseId ? updatedCourse : course
        ));
        alert(`Курс ${updatedCourse.isActive ? 'активовано' : 'деактивовано'}!`);
      } else {
        alert('Помилка оновлення статусу');
      }
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Помилка оновлення статусу');
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const formData = new FormData();
      formData.append('file', file);
      try {
        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });
        if (response.ok) {
          const data = await response.json();
          setUploadedImage(data.url);
          setNewCourse({...newCourse, image: data.url});
          alert('Зображення завантажено успішно!');
        }
      } catch (error) {
        console.error('Upload error:', error);
        alert('Помилка завантаження зображення');
      }
    }
  };

  const addSocialMedia = () => {
    const newId = `social_${Date.now()}`;
    setSettings({
      ...settings,
      socialMedia: [...settings.socialMedia, {
        id: newId,
        name: '',
        url: '',
        icon: 'link',
        enabled: false
      }]
    });
  };

  const updateSocialMedia = (id: string, field: keyof SocialMedia, value: string | boolean) => {
    setSettings({
      ...settings,
      socialMedia: settings.socialMedia.map(social =>
        social.id === id ? {...social, [field]: value} : social
      )
    });
  };

  const deleteSocialMedia = (id: string) => {
    setSettings({
      ...settings,
      socialMedia: settings.socialMedia.filter(social => social.id !== id)
    });
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
          <div className="text-center mb-8">
            <img
              src="https://ugc.same-assets.com/XuHdx7WuY4T5bI79IGfMP_ZQmdzlBYM8.png"
              alt="NeuroSoul Doctor Logo"
              className="neurosoul-logo mx-auto mb-4"
              onError={(e) => {
                e.currentTarget.src = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMjgiIGZpbGw9InVybCgjZ3JhZGllbnQwX3JhZGlhbF8xXzIpIiBzdHJva2U9IiNENEFGMzciIHN0cm9rZS13aWR0aD0iNCIvPgo8ZGVmcz4KPHJhZGlhbEdyYWRpZW50IGlkPSJncmFkaWVudDBfcmFkaWFsXzFfMiIgY3g9IjAiIGN5PSIwIiByPSIxIiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSIgZ3JhZGllbnRUcmFuc2Zvcm09InRyYW5zbGF0ZSgzMCAzMCkgcm90YXRlKDkwKSBzY2FsZSgzMCkiPgo8c3RvcCBzdG9wLWNvbG9yPSIjRkZENzAwIi8+CjxzdG9wIG9mZnNldD0iMC41IiBzdG9wLWNvbG9yPSIjRkZBNTAwIi8+CjxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iI0Q0QUYzNyIvPgo8L3JhZGlhbEdyYWRpZW50Pgo8L2RlZnM+Cjwvc3ZnPgo=";
              }}
            />
            <h1 className="dark-3d-heading">Адмін-панель</h1>
            <p className="text-gray-600">NeuroSoul Doctor</p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Пароль:</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:border-yellow-500 focus:outline-none"
                placeholder="Введіть пароль"
                onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
              />
            </div>

            <button
              onClick={handleLogin}
              className="w-full golden-gradient text-white py-3 rounded-lg font-medium hover:scale-105 transition-transform"
            >
              Увійти
            </button>

            <p className="text-xs text-gray-500 text-center">
              Демо пароль: admin123
            </p>
          </div>
        </div>
      </div>
    );
  }

  const totalRevenue = orders.reduce((sum, order) => sum + order.amount, 0);
  const totalOrders = orders.length;
  const activeCourses = courses.filter(course => course.isActive).length;

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Link href="/" className="flex items-center space-x-2">
                <img
                  src="https://ext.same-assets.com/916447887/logo-neurosoul.png"
                  alt="NeuroSoul Doctor Logo"
                  className="neurosoul-logo"
                  onError={(e) => {
                    e.currentTarget.src = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMjgiIGZpbGw9InVybCojZ3JhZGllbnQwX3JhZGlhbF8xXzIpIiBzdHJva2U9IiNENEFGMzciIHN0cm9rZS13aWR0aD0iNCIvPgo8ZGVmcz4KPHJhZGlhbEdyYWRpZW50IGlkPSJncmFkaWVudDBfcmFkaWFsXzFfMiIgY3g9IjAiIGN5PSIwIiByPSIxIiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSIgZ3JhZGllbnRUcmFuc2Zvcm09InRyYW5zbGF0ZSgzMCAzMCkgcm90YXRlKDkwKSBzY2FsZSgzMCkiPgo8c3RvcCBzdG9wLWNvbG9yPSIjRkZENzAwIi8+CjxzdG9wIG9mZnNldD0iMC41IiBzdG9wLWNvbG9yPSIjRkZBNTAwIi8+CjxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iI0Q0QUYzNyIvPgo8L3JhZGlhbEdyYWRpZW50Pgo8L2RlZnM+Cjwvc3ZnPgo=";
                  }}
                />
                <span className="text-xl font-bold dark-3d-heading">Адмін-панель</span>
              </Link>
            </div>

            <div className="flex items-center space-x-4">
              <Link href="/" className="text-gray-600 hover:text-gray-900">
                Переглянути сайт
              </Link>
              <button
                onClick={handleLogout}
                className="text-red-600 hover:text-red-800"
              >
                Вийти
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation Tabs */}
        <div className="flex space-x-8 border-b border-gray-200 mb-8">
          {[
            { id: 'dashboard', label: 'Дашборд' },
            { id: 'orders', label: 'Замовлення' },
            { id: 'courses', label: 'Курси' },
            { id: 'social', label: 'Соцмережі' },
            { id: 'settings', label: 'Налаштування' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? 'border-yellow-500 text-yellow-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Dashboard */}
        {activeTab === 'dashboard' && (
          <div className="space-y-8">
            <h1 className="dark-3d-heading-medium">Дашборд</h1>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex items-center">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-600">Загальний дохід</p>
                    <p className="text-3xl font-bold golden-text">₴{totalRevenue}</p>
                  </div>
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex items-center">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-600">Замовлень</p>
                    <p className="text-3xl font-bold text-blue-600">{totalOrders}</p>
                  </div>
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex items-center">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-600">Активних курсів</p>
                    <p className="text-3xl font-bold text-purple-600">{activeCourses}</p>
                  </div>
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Orders */}
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold">Останні замовлення</h2>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {orders.slice(0, 3).map((order) => (
                    <div key={order.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <p className="font-medium">{order.customerName}</p>
                        <p className="text-sm text-gray-600">{order.orderReference}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold golden-text">₴{order.amount}</p>
                        <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                          {order.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <div className="space-y-6">
            <h1 className="dark-3d-heading-medium">Замовлення</h1>

            <div className="bg-white rounded-lg shadow overflow-hidden">
              {orders.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                  <p>Замовлень поки немає</p>
                  <p className="text-sm mt-2">Замовлення будуть з'являтися тут після оплати клієнтами</p>
                </div>
              ) : (
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Замовлення
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Клієнт
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Сума
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Статус
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Дія
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {orders.map((order) => (
                      <tr key={order.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">{order.orderReference}</div>
                            <div className="text-sm text-gray-500">
                              {order.items.length} товар(ів)
                            </div>
                            <div className="text-xs text-gray-400">
                              {new Date(order.createdDate).toLocaleDateString('uk-UA')}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">{order.customerName}</div>
                            <div className="text-sm text-gray-500">{order.customerEmail}</div>
                            <div className="text-sm text-gray-500">{order.customerPhone}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-bold golden-text">₴{order.amount}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                            {order.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <button
                            onClick={() => setSelectedOrder(order)}
                            className="text-blue-600 hover:text-blue-800 text-sm bg-blue-100 px-3 py-1 rounded"
                          >
                            Переглянути
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

            {/* Order Details Modal */}
            {selectedOrder && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold">Деталі замовлення {selectedOrder.orderReference}</h2>
                    <button
                      onClick={() => setSelectedOrder(null)}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      ✕
                    </button>
                  </div>

                  <div className="space-y-6">
                    {/* Customer Info */}
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h3 className="font-semibold mb-2">Контактні дані клієнта:</h3>
                      <div className="space-y-1">
                        <p><strong>Ім'я:</strong> {selectedOrder.customerName}</p>
                        <p><strong>Email:</strong> <a href={`mailto:${selectedOrder.customerEmail}`} className="text-blue-600 hover:underline">{selectedOrder.customerEmail}</a></p>
                        <p><strong>Телефон:</strong> <a href={`tel:${selectedOrder.customerPhone}`} className="text-blue-600 hover:underline">{selectedOrder.customerPhone}</a></p>
                      </div>
                    </div>

                    {/* Order Info */}
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h3 className="font-semibold mb-2">Інформація про замовлення:</h3>
                      <div className="space-y-1">
                        <p><strong>Номер замовлення:</strong> {selectedOrder.orderReference}</p>
                        <p><strong>Дата замовлення:</strong> {new Date(selectedOrder.createdDate).toLocaleString('uk-UA')}</p>
                        <p><strong>Статус:</strong> <span className="px-2 py-1 bg-green-100 text-green-800 rounded">{selectedOrder.status}</span></p>
                        <p><strong>Загальна сума:</strong> <span className="font-bold golden-text">₴{selectedOrder.amount}</span></p>
                      </div>
                    </div>

                    {/* Order Items */}
                    <div className="bg-yellow-50 p-4 rounded-lg">
                      <h3 className="font-semibold mb-2">Замовлені курси:</h3>
                      <div className="space-y-2">
                        {selectedOrder.items.map((item, index) => (
                          <div key={index} className="flex justify-between items-center p-2 bg-white rounded border">
                            <div>
                              <p className="font-medium">{item.title}</p>
                              <p className="text-sm text-gray-600">Кількість: {item.quantity}</p>
                            </div>
                            <p className="font-bold">₴{item.price * item.quantity}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="bg-green-50 p-4 rounded-lg">
                      <h3 className="font-semibold mb-2">Швидкі дії:</h3>
                      <div className="flex space-x-2">
                        <a
                          href={`mailto:${selectedOrder.customerEmail}?subject=Щодо замовлення ${selectedOrder.orderReference}&body=Вітаю! Пишу щодо вашого замовлення ${selectedOrder.orderReference}.`}
                          className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
                        >
                          📧 Написати email
                        </a>
                        <a
                          href={`tel:${selectedOrder.customerPhone}`}
                          className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700"
                        >
                          📞 Подзвонити
                        </a>
                        <a
                          href={`https://t.me/${selectedOrder.customerPhone.replace('+', '')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600"
                        >
                          💬 Telegram
                        </a>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end mt-6">
                    <button
                      onClick={() => setSelectedOrder(null)}
                      className="bg-gray-300 text-gray-700 px-4 py-2 rounded"
                    >
                      Закрити
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Courses Tab */}
        {activeTab === 'courses' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h1 className="dark-3d-heading-medium">Управління курсами</h1>
              <button
                onClick={() => setShowCreateCourse(true)}
                className="golden-gradient text-white px-4 py-2 rounded-lg font-medium hover:scale-105 transition-transform"
              >
                Додати курс
              </button>
            </div>

            {loading ? (
              <div className="text-center py-8 text-gray-500">Завантаження курсів...</div>
            ) : (
              <div className="grid gap-6">
                {courses.map((course) => (
                  <div key={course.id} className="bg-white p-6 rounded-lg shadow">
                    <div className="flex items-center space-x-4">
                      <img
                        src={course.image}
                        alt={course.title}
                        className="w-20 h-20 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg">{course.title}</h3>
                        <p className="text-gray-600">Продажів: {course.sales}</p>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div>
                          <label className="block text-sm font-medium mb-1">Ціна (₴):</label>
                          <input
                            type="number"
                            value={course.price}
                            onChange={(e) => updateCoursePrice(course.id, parseInt(e.target.value))}
                            className="w-24 border border-gray-300 rounded px-2 py-1 text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1">Статус:</label>
                          <button
                            onClick={() => toggleCourseStatus(course.id)}
                            className={`px-3 py-1 rounded text-sm font-medium ${
                              course.isActive
                                ? 'bg-green-100 text-green-800'
                                : 'bg-red-100 text-red-800'
                            }`}
                          >
                            {course.isActive ? 'Активний' : 'Неактивний'}
                          </button>
                        </div>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => setEditingCourse(course)}
                            className="text-blue-600 hover:text-blue-800 text-sm bg-blue-100 px-3 py-1 rounded"
                          >
                            Редагувати
                          </button>
                          <button
                            onClick={() => deleteCourse(course.id)}
                            className="text-red-600 hover:text-red-800 text-sm bg-red-100 px-3 py-1 rounded"
                          >
                            Видалити
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Модальне вікно створення курсу */}
            {showCreateCourse && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-96 overflow-y-auto">
                  <h2 className="text-xl font-bold mb-4">Створити новий курс</h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Назва курсу:</label>
                      <input
                        type="text"
                        value={newCourse.title}
                        onChange={(e) => setNewCourse({...newCourse, title: e.target.value})}
                        className="w-full border border-gray-300 rounded px-3 py-2"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-1">Ціна (₴):</label>
                        <input
                          type="number"
                          value={newCourse.price}
                          onChange={(e) => setNewCourse({...newCourse, price: parseInt(e.target.value)})}
                          className="w-full border border-gray-300 rounded px-3 py-2"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Категорія:</label>
                        <select
                          value={newCourse.category}
                          onChange={(e) => setNewCourse({...newCourse, category: e.target.value})}
                          className="w-full border border-gray-300 rounded px-3 py-2"
                        >
                          <option value="Цифровий товар">Цифровий товар</option>
                          <option value="Відеокурс">Відеокурс</option>
                          <option value="Аудіокурс">Аудіокурс</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Зображення курсу:</label>
                      <div className="space-y-2">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleFileUpload}
                          className="w-full border border-gray-300 rounded px-3 py-2"
                        />
                        {uploadedImage && (
                          <div className="flex items-center space-x-2">
                            <img src={uploadedImage} alt="Uploaded" className="w-16 h-16 object-cover rounded" />
                            <span className="text-green-600 text-sm">✓ Зображення завантажено</span>
                          </div>
                        )}
                        <input
                          type="url"
                          value={newCourse.image}
                          onChange={(e) => setNewCourse({...newCourse, image: e.target.value})}
                          className="w-full border border-gray-300 rounded px-3 py-2"
                          placeholder="Або введіть URL зображення"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Опис курсу:</label>
                      <textarea
                        value={newCourse.description}
                        onChange={(e) => setNewCourse({...newCourse, description: e.target.value})}
                        rows={4}
                        className="w-full border border-gray-300 rounded px-3 py-2"
                      />
                    </div>
                    <div className="flex space-x-4">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={newCourse.isNew}
                          onChange={(e) => setNewCourse({...newCourse, isNew: e.target.checked})}
                          className="mr-2"
                        />
                        Новинка
                      </label>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={newCourse.isDiscount}
                          onChange={(e) => setNewCourse({...newCourse, isDiscount: e.target.checked})}
                          className="mr-2"
                        />
                        Знижка
                      </label>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={newCourse.isActive}
                          onChange={(e) => setNewCourse({...newCourse, isActive: e.target.checked})}
                          className="mr-2"
                        />
                        Активний
                      </label>
                    </div>
                  </div>
                  <div className="flex space-x-4 mt-6">
                    <button
                      onClick={createCourse}
                      className="golden-gradient text-white px-4 py-2 rounded font-medium"
                    >
                      Створити курс
                    </button>
                    <button
                      onClick={() => {
                        setShowCreateCourse(false);
                        setUploadedImage('');
                      }}
                      className="border border-gray-300 px-4 py-2 rounded"
                    >
                      Скасувати
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Модальне вікно редагування курсу */}
            {editingCourse && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                  <h2 className="text-xl font-bold mb-4">Редагувати курс</h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Назва курсу:</label>
                      <input
                        type="text"
                        value={editingCourse.title}
                        onChange={(e) => setEditingCourse({...editingCourse, title: e.target.value})}
                        className="w-full border border-gray-300 rounded px-3 py-2"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-1">Ціна (₴):</label>
                        <input
                          type="number"
                          value={editingCourse.price}
                          onChange={(e) => setEditingCourse({...editingCourse, price: parseInt(e.target.value)})}
                          className="w-full border border-gray-300 rounded px-3 py-2"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Категорія:</label>
                        <select
                          value={editingCourse.category || 'Цифровий товар'}
                          onChange={(e) => setEditingCourse({...editingCourse, category: e.target.value})}
                          className="w-full border border-gray-300 rounded px-3 py-2"
                        >
                          <option value="Цифровий товар">Цифровий товар</option>
                          <option value="Відеокурс">Відеокурс</option>
                          <option value="Аудіокурс">Аудіокурс</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Зображення курсу:</label>
                      <div className="space-y-2">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={async (e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const formData = new FormData();
                              formData.append('file', file);
                              try {
                                const response = await fetch('/api/upload', {
                                  method: 'POST',
                                  body: formData,
                                });
                                if (response.ok) {
                                  const data = await response.json();
                                  setEditingCourse({...editingCourse, image: data.url});
                                  alert('Зображення завантажено успішно!');
                                }
                              } catch (error) {
                                console.error('Upload error:', error);
                                alert('Помилка завантаження зображення');
                              }
                            }
                          }}
                          className="w-full border border-gray-300 rounded px-3 py-2"
                        />
                        {editingCourse.image && (
                          <div className="flex items-center space-x-2">
                            <img src={editingCourse.image} alt="Course" className="w-16 h-16 object-cover rounded" />
                            <span className="text-green-600 text-sm">Поточне зображення</span>
                          </div>
                        )}
                        <input
                          type="url"
                          value={editingCourse.image}
                          onChange={(e) => setEditingCourse({...editingCourse, image: e.target.value})}
                          className="w-full border border-gray-300 rounded px-3 py-2"
                          placeholder="Або введіть URL зображення"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Опис курсу:</label>
                      <textarea
                        value={editingCourse.description || ''}
                        onChange={(e) => setEditingCourse({...editingCourse, description: e.target.value})}
                        rows={4}
                        className="w-full border border-gray-300 rounded px-3 py-2"
                      />
                    </div>
                    <div className="flex space-x-4">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={editingCourse.isNew || false}
                          onChange={(e) => setEditingCourse({...editingCourse, isNew: e.target.checked})}
                          className="mr-2"
                        />
                        Новинка
                      </label>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={editingCourse.isDiscount || false}
                          onChange={(e) => setEditingCourse({...editingCourse, isDiscount: e.target.checked})}
                          className="mr-2"
                        />
                        Знижка
                      </label>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={editingCourse.isActive}
                          onChange={(e) => setEditingCourse({...editingCourse, isActive: e.target.checked})}
                          className="mr-2"
                        />
                        Активний
                      </label>
                    </div>
                  </div>
                  <div className="flex space-x-4 mt-6">
                    <button
                      onClick={() => updateCourse(editingCourse.id, editingCourse)}
                      className="golden-gradient text-white px-4 py-2 rounded font-medium"
                    >
                      Зберегти зміни
                    </button>
                    <button
                      onClick={() => setEditingCourse(null)}
                      className="border border-gray-300 px-4 py-2 rounded"
                    >
                      Скасувати
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Social Media Tab */}
        {activeTab === 'social' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h1 className="dark-3d-heading-medium">Управління соціальними мережами</h1>
              <button
                onClick={addSocialMedia}
                className="golden-gradient text-white px-4 py-2 rounded-lg font-medium hover:scale-105 transition-transform"
              >
                Додати соцмережу
              </button>
            </div>

            <div className="grid gap-4">
              {settings.socialMedia.map((social) => (
                <div key={social.id} className="bg-white p-6 rounded-lg shadow">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                    <div>
                      <label className="block text-sm font-medium mb-1">Назва:</label>
                      <input
                        type="text"
                        value={social.name}
                        onChange={(e) => updateSocialMedia(social.id, 'name', e.target.value)}
                        className="w-full border border-gray-300 rounded px-3 py-2"
                        placeholder="Наприклад: Instagram"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Іконка:</label>
                      <select
                        value={social.icon}
                        onChange={(e) => updateSocialMedia(social.id, 'icon', e.target.value)}
                        className="w-full border border-gray-300 rounded px-3 py-2"
                      >
                        <option value="telegram">📱 Telegram</option>
                        <option value="tiktok">🎵 TikTok</option>
                        <option value="instagram">📷 Instagram</option>
                        <option value="youtube">📺 YouTube</option>
                        <option value="facebook">📘 Facebook</option>
                        <option value="twitter">🐦 Twitter</option>
                        <option value="whatsapp">💬 WhatsApp</option>
                        <option value="linkedin">💼 LinkedIn</option>
                        <option value="link">🔗 Посилання</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">URL:</label>
                      <input
                        type="url"
                        value={social.url}
                        onChange={(e) => updateSocialMedia(social.id, 'url', e.target.value)}
                        className="w-full border border-gray-300 rounded px-3 py-2"
                        placeholder="https://example.com"
                      />
                    </div>
                    <div className="flex items-center space-x-2">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={social.enabled}
                          onChange={(e) => updateSocialMedia(social.id, 'enabled', e.target.checked)}
                          className="mr-2"
                        />
                        Активна
                      </label>
                      <button
                        onClick={() => deleteSocialMedia(social.id)}
                        className="text-red-600 hover:text-red-800 p-1"
                        title="Видалити"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h3 className="font-semibold text-yellow-800 mb-2">ℹ️ Як це працює:</h3>
              <ul className="text-sm text-yellow-700 space-y-1">
                <li>• Активні соцмережі відображаються на головній сторінці сайту</li>
                <li>• Ви можете додавати, редагувати та вимикати соцмережі</li>
                <li>• Зміни автоматично зберігаються в налаштуваннях</li>
              </ul>
            </div>

            <div className="flex justify-center">
              <button
                onClick={saveSettings}
                className="golden-gradient text-white px-8 py-3 rounded-lg font-medium hover:scale-105 transition-transform"
              >
                💾 Зберегти налаштування соцмереж
              </button>
            </div>
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <div className="space-y-6">
            <h1 className="dark-3d-heading-medium">Налаштування</h1>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-lg shadow">
                <h2 className="text-lg font-semibold mb-4">Платіжні налаштування WayForPay</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Merchant ID:</label>
                    <input
                      type="text"
                      value={settings.wayforpay.merchantId}
                      onChange={(e) => setSettings({
                        ...settings,
                        wayforpay: {...settings.wayforpay, merchantId: e.target.value}
                      })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Secret Key:</label>
                    <input
                      type="password"
                      value={settings.wayforpay.secretKey}
                      onChange={(e) => setSettings({
                        ...settings,
                        wayforpay: {...settings.wayforpay, secretKey: e.target.value}
                      })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    />
                  </div>
                  <p className="text-sm text-gray-600">
                    ℹ️ Ці ключі використовуються для інтеграції з платіжною системою WayForPay
                  </p>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow">
                <h2 className="text-lg font-semibold mb-4">Загальні налаштування</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Назва сайту:</label>
                    <input
                      type="text"
                      value={settings.siteName}
                      onChange={(e) => setSettings({...settings, siteName: e.target.value})}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Email підтримки:</label>
                    <input
                      type="email"
                      value={settings.supportEmail}
                      onChange={(e) => setSettings({...settings, supportEmail: e.target.value})}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Telegram:</label>
                    <input
                      type="text"
                      value={settings.telegram}
                      onChange={(e) => setSettings({...settings, telegram: e.target.value})}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2"
                      placeholder="@username"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">TikTok:</label>
                    <input
                      type="text"
                      value={settings.tiktok}
                      onChange={(e) => setSettings({...settings, tiktok: e.target.value})}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2"
                      placeholder="@username"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-center">
              <button
                onClick={saveSettings}
                className="golden-gradient text-white px-8 py-3 rounded-lg font-medium hover:scale-105 transition-transform"
              >
                💾 Зберегти всі налаштування
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
