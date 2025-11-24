import Link from 'next/link';
import Image from 'next/image';

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
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

      <footer className="py-8 text-center text-gray-500 text-sm border-t">
        © 2025 NeuroSoul. Всі права захищено.
      </footer>
    </main>
  );
}
