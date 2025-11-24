import Link from 'next/link';
import Image from 'next/image';

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 md:py-24 grid md:grid-cols-2 gap-12 items-center">
        <div className="space-y-6">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 leading-tight">
            Простір, де твій розум <br/>
            <span className="text-amber-600">грає за тебе</span>
          </h1>
          <p className="text-lg text-gray-600 max-w-lg">
            Гіпноз, вплив, контроль над реальністю. Опануй навички, які змінять твоє життя назавжди.
          </p>
          <div className="flex gap-4">
            <Link 
              href="/shop" 
              className="px-8 py-4 bg-amber-600 text-white font-bold rounded-lg hover:bg-amber-700 transition shadow-lg"
            >
              Вибрати Курс
            </Link>
            <Link 
              href="#courses" 
              className="px-8 py-4 bg-white text-amber-600 font-bold rounded-lg border-2 border-amber-600 hover:bg-amber-50 transition"
            >
              Дізнатися більше
            </Link>
          </div>
        </div>
        
        <div className="relative aspect-square rounded-2xl overflow-hidden shadow-2xl bg-gray-100">
          <Image 
            src="/images/hero.jpg" 
            alt="NeuroSoul Hero"
            fill
            className="object-cover"
            priority
          />
        </div>
      </section>

      {/* Courses Section */}
      <section id="courses" className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-4">
            Курси які можна придбати
          </h2>
          <p className="text-center text-gray-600 mb-12">
            Оберіть курс, який змінить ваше життя
          </p>
          
          <div className="grid md:grid-cols-3 gap-8">
            {/* Course Cards will be dynamically loaded from /shop */}
            <Link href="/shop" className="block">
              <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all transform hover:-translate-y-2">
                <div className="relative h-48 bg-gradient-to-br from-amber-400 to-amber-600">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-white text-6xl">🧠</span>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    Гіпноз та НЛП
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Опануйте техніки впливу та трансформації свідомості
                  </p>
                  <div className="flex justify-between items-center">
                    <span className="text-2xl font-bold text-amber-600">Переглянути</span>
                    <span className="text-amber-600">→</span>
                  </div>
                </div>
              </div>
            </Link>

            <Link href="/shop" className="block">
              <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all transform hover:-translate-y-2">
                <div className="relative h-48 bg-gradient-to-br from-purple-400 to-purple-600">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-white text-6xl">💰</span>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    Фінансова свобода
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Навчіться керувати грошима та створювати багатство
                  </p>
                  <div className="flex justify-between items-center">
                    <span className="text-2xl font-bold text-purple-600">Переглянути</span>
                    <span className="text-purple-600">→</span>
                  </div>
                </div>
              </div>
            </Link>

            <Link href="/shop" className="block">
              <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all transform hover:-translate-y-2">
                <div className="relative h-48 bg-gradient-to-br from-blue-400 to-blue-600">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-white text-6xl">⚡</span>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    Особиста сила
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Розкрийте свій потенціал та досягніть цілей
                  </p>
                  <div className="flex justify-between items-center">
                    <span className="text-2xl font-bold text-blue-600">Переглянути</span>
                    <span className="text-blue-600">→</span>
                  </div>
                </div>
              </div>
            </Link>
          </div>

          <div className="text-center mt-12">
            <Link 
              href="/shop" 
              className="inline-block px-8 py-4 bg-amber-600 text-white font-bold rounded-lg hover:bg-amber-700 transition shadow-lg"
            >
              Переглянути всі курси
            </Link>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            Про SoulDoctor
          </h2>
          <p className="text-lg text-gray-600 mb-6">
            Експерт у сфері гіпнотерапії, психології впливу та трансформації свідомості.
          </p>
          <p className="text-gray-600 mb-6">
            Гіпнотерапевт, фахівець з квантової психології та механізмів управління реальністю.
          </p>
          <p className="text-gray-600 mb-8">
            Допомагаю змінювати стрижневі світу, виходити за межі звичайних обмежень і розкривати справжній потенціал.
          </p>
          <p className="text-gray-600
