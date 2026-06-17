export interface Product {
  id: number;
  name: string;
  brand: string;
  price: number;
  oldPrice: number;
  rating: number;
  reviews: number;
  isNew: boolean;
  popularity: number;
  category: string;
  img: string;
  description: string;
  features: string[];
}

export interface Review {
  name: string;
  rating: number;
  date: string;
  text: string;
}

export const PRODUCTS: Product[] = [
  { id: 1, name: 'AURUM Sound One', brand: 'Наушники', price: 38900, oldPrice: 45000, rating: 4.9, reviews: 1243, isNew: true, popularity: 98, category: 'Электроника', img: 'https://cdn.poehali.dev/projects/4852ca01-beec-41f2-84d7-6a385a88588b/files/cf8e2641-8bd8-4e44-87dc-95fa71af8936.jpg', description: 'Беспроводные наушники премиум-класса с активным шумоподавлением и кристально чистым звуком. Корпус из анодированного алюминия и натуральной кожи.', features: ['Шумоподавление', 'До 40 ч работы', 'Hi-Res Audio', 'Bluetooth 5.3'] },
  { id: 2, name: 'Chronos Gold', brand: 'Часы', price: 124000, oldPrice: 0, rating: 5.0, reviews: 567, isNew: true, popularity: 95, category: 'Часы', img: 'https://cdn.poehali.dev/projects/4852ca01-beec-41f2-84d7-6a385a88588b/files/6f2b9f6c-8cf4-4adb-9068-d8d1efa6c1ed.jpg', description: 'Механические часы ручной сборки с сапфировым стеклом. Швейцарский механизм, водозащита 100 м и безупречная отделка корпуса.', features: ['Сапфировое стекло', 'Автоподзавод', 'Водозащита 100м', 'Гарантия 5 лет'] },
  { id: 3, name: 'Emerald Tote', brand: 'Сумка', price: 86500, oldPrice: 99000, rating: 4.8, reviews: 892, isNew: false, popularity: 91, category: 'Аксессуары', img: 'https://cdn.poehali.dev/projects/4852ca01-beec-41f2-84d7-6a385a88588b/files/be2e72d7-e064-4ccf-8ddd-97ca3d6d92a5.jpg', description: 'Сумка из натуральной итальянской кожи с золотой фурнитурой. Просторное отделение и фирменная подкладка ручной работы.', features: ['Итальянская кожа', 'Золотая фурнитура', 'Ручная работа', 'Чехол в комплекте'] },
  { id: 4, name: 'AURUM Sound Pro', brand: 'Наушники', price: 52400, oldPrice: 0, rating: 4.7, reviews: 432, isNew: false, popularity: 87, category: 'Электроника', img: 'https://cdn.poehali.dev/projects/4852ca01-beec-41f2-84d7-6a385a88588b/files/cf8e2641-8bd8-4e44-87dc-95fa71af8936.jpg', description: 'Профессиональные накладные наушники для студийной работы. Расширенный частотный диапазон и максимальный комфорт при долгом ношении.', features: ['Студийный звук', 'Съёмный кабель', 'Память формы', 'Кейс премиум'] },
  { id: 5, name: 'Chronos Classic', brand: 'Часы', price: 98700, oldPrice: 110000, rating: 4.6, reviews: 321, isNew: false, popularity: 80, category: 'Часы', img: 'https://cdn.poehali.dev/projects/4852ca01-beec-41f2-84d7-6a385a88588b/files/6f2b9f6c-8cf4-4adb-9068-d8d1efa6c1ed.jpg', description: 'Классические часы с минималистичным дизайном и кожаным ремешком. Идеальное сочетание элегантности и точности.', features: ['Кварцевый механизм', 'Кожаный ремешок', 'Водозащита 50м', 'Гарантия 3 года'] },
  { id: 6, name: 'Noir Clutch', brand: 'Сумка', price: 64200, oldPrice: 0, rating: 4.9, reviews: 718, isNew: true, popularity: 89, category: 'Аксессуары', img: 'https://cdn.poehali.dev/projects/4852ca01-beec-41f2-84d7-6a385a88588b/files/be2e72d7-e064-4ccf-8ddd-97ca3d6d92a5.jpg', description: 'Вечерний клатч из лакированной кожи с фирменной застёжкой. Компактный и роскошный аксессуар для особых случаев.', features: ['Лакированная кожа', 'Съёмная цепочка', 'Атласная подкладка', 'Подарочная упаковка'] },
];

export const REVIEWS: Review[] = [
  { name: 'Дмитрий К.', rating: 5, date: '12 июня', text: 'Качество превзошло все ожидания. Чувствуется премиум в каждой детали.' },
  { name: 'Елена М.', rating: 5, date: '8 июня', text: 'Доставили быстро, упаковка роскошная. Очень довольна покупкой!' },
  { name: 'Артём С.', rating: 4, date: '2 июня', text: 'Отличная вещь, но хотелось бы больше расцветок. В остальном — идеально.' },
];

export const fmt = (n: number) => n.toLocaleString('ru-RU') + ' ₽';
