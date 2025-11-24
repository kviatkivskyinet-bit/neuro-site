import Link from 'next/link';
import Image from 'next/image';

export default function Home() {
  return (
    <div className="min-h-screen relative z-10">
      {/* Hero Section with dark gradient background */}
      <section className="relative min-h-[90vh] flex items-center">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-black to-green-900/20" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <h1 className="text-5xl md:text-7xl font-bold leading-tight">
                  <span className="bg-gradient-to-r from-green-400 via-cyan-400 to-blue-500 bg-clip-text text-transparent">
                    NEUROSOUL
                  </span>
                  <br />
                  <span className="text-white">DOCTOR</span>
                </h1>
                <p className="text-2xl text-gray-300">
                  Гіпноз, вплив, контроль над реальністю.
                </p>
                <p className="text-xl text-green-400">
                  Курси, що змінюють свідомість.
                </p>
              </div>
              
              <p className="text-gray-400 max-w-lg leading-relaxed">
                Експерт у сфері гіпнотерапії, психології впливу та трансформації свідомості.
                Допомагаю змінювати сприйняття світу, виходити за межі нав'язаних обмежень і розкривати справжній потенціал.
              </p>
              
              <div className="flex flex-wrap gap-4">
                <Link 
                  href="/shop" 
                  className="px-8 py-4 bg-gradient-to-r from-green-500 to-cyan-500 text-black font-bold rounded-full hover:shadow-2xl hover:shadow-green-500/50 transition-all duration-300 hover:scale-105"
                >
                  Вибрати Курс
                </Link>
                <Link 
                  href="#courses" 
                  className="px-8 py-4 border-2 border-green-500 text-green-400 font-bold rounded-full hover:bg-green-500/10 transition-all duration-300"
                >
                  Дізнатися більше
                </Link>
              </div>
            </div>
            
            <div className="relative">
              <div className="relative aspect-square rounded-2xl overflow-hidden shadow-2xl bg-gradient-to-br from-purple-900/50 to-green-900/50 border border-green-500/20">
                <div className="absolute inset-0 bg-black/50" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center space-y-4 p-8">
                    <div className="text-6xl font-bold bg-gradient-to-r from-green-400 to-cyan-400 bg-clip-text text-transparent">
                      NS
                    </div>
                    <div className="text-xl text-gray-300">NEUROSOUL</div>
                  </div>
                </div>
              </div>
              {/* Animated glow effect */}
              <div className="absolute -inset-4 bg-gradient-to-r from-green-500/20 to-cyan-500/20 blur-3xl animate-pulse" />
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 relative">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-8">
              Розбираю структури впливу
            </h2>
            <p className="text-xl text-gray-300 leading-relaxed">
              Невидимі алгоритми маніпуляцій і механіка підсвідомих процесів.
              Ви готові увійти в новий рівень усвідомлення?
            </p>
            <p className="text-2xl text-green-400 font-semibold">
              Вітаю, ви вже на порозі.
            </p>
          </div>
        </div>
      </section>

      {/* Courses Preview Section */}
      <section id="courses" className="py-20 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-green-900/10 to-transparent" />
        <div className="container mx-auto px-4 relative z-10">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-12">
            <span className="bg-gradient-to-r from-green-400 to-cyan-400 bg-clip-text text-transparent">
              Курси які змінять вашу свідомість
            </span>
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {/* Course Card 1 */}
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-r from-green-500/20 to-cyan-500/20 blur-xl group-hover:blur-2xl transition-all duration-300" />
              <div className="relative bg-black/50 border border-green-500/30 rounded-2xl p-6 hover:border-green-500 transition-all duration-300">
                <h3 className="text-xl font-bold text-white mb-3">Квантова психологія</h3>
                <p className="text-gray-400 mb-4">Механіки управління реальністю через свідомість</p>
                <div className="text-green-400 font-bold">₴4999</div>
              </div>
            </div>
            
            {/* Course Card 2 */}
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 blur-xl group-hover:blur-2xl transition-all duration-300" />
              <div className="relative bg-black/50 border border-purple-500/30 rounded-2xl p-6 hover:border-purple-500 transition-all duration-300">
                <h3 className="text-xl font-bold text-white mb-3">Гіпнотерапія</h3>
                <p className="text-gray-400 mb-4">Техніки впливу на підсвідомість</p>
                <div className="text-purple-400 font-bold">₴3999</div>
              </div>
            </div>
            
            {/* Course Card 3 */}
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 blur-xl group-hover:blur-2xl transition-all duration-300" />
              <div className="relative bg-black/50 border border-blue-500/30 rounded-2xl p-6 hover:border-blue-500 transition-all duration-300">
                <h3 className="text-xl font-bold text-white mb-3">Нейропластичність</h3>
                <p className="text-gray-400 mb-4">Перепрограмування нейронних зв'язків</p>
                <div className="text-blue-400 font-bold">₴5999</div>
              </div>
            </div>
          </div>
          
          <div className="text-center">
            <Link 
              href="/shop" 
              className="inline-flex items-center gap-2 px-10 py-4 bg-gradient-to-r from-green-500 to-cyan-500 text-black font-bold rounded-full hover:shadow-2xl hover:shadow-green-500/50 transition-all duration-300 hover:scale-105"
            >
              Переглянути всі курси
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 relative">
        <div className="container mx-auto px-4">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-green-500/20 to-cyan-500/20 blur-3xl" />
            <div className="relative bg-black/70 border border-green-500/30 rounded-3xl p-12 text-center">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                Просто натисніть кнопку придбати
              </h2>
              <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
                Заповни форму та будь першим хто отримає мій наступний новий курс!
              </p>
              <Link 
                href="/shop" 
                className="inline-block px-10 py-4 bg-gradient-to-r from-green-500 to-cyan-500 text-black font-bold rounded-full hover:shadow-2xl hover:shadow-green-500/50 transition-all duration-300 hover:scale-105 text-lg"
              >
                Придбати зараз
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
