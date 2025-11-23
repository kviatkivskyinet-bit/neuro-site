export interface Course {
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

export const coursesData: Course[] = [
  {
    id: 1,
    title: "КОД КАБАЛИ: УПРАВЛІННЯ РЕАЛЬНІСТЮ ЧЕРЕЗ СТАРОДАВНІ ЗНАННЯ",
    price: 1600,
    image: "https://ext.same-assets.com/916447887/3575399428.jpeg",
    isNew: true,
    isDiscount: true,
    isActive: true,
    category: "Цифровий товар",
    sales: 45,
    description: "Відкрийте для себе потужні техніки управління реальністю..."
  },
  // ... тут можуть бути інші курси, або залиш хоча б цей один для старту
];
