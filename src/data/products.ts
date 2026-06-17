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
  {
    id: 1, name: 'AURUM Sound One', brand: 'AURUM', price: 38900, oldPrice: 45000,
    rating: 4.9, reviews: 1243, isNew: true, popularity: 98, category: 'Электроника',
    img: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&q=80',
    description: 'Беспроводные наушники премиум-класса с активным шумоподавлением и кристально чистым звуком. Корпус из анодированного алюминия.',
    features: ['Шумоподавление ANC', 'До 40 ч работы', 'Hi-Res Audio', 'Bluetooth 5.3'],
  },
  {
    id: 2, name: 'Chronos Gold', brand: 'Chronos', price: 124000, oldPrice: 0,
    rating: 5.0, reviews: 567, isNew: true, popularity: 95, category: 'Часы',
    img: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=80',
    description: 'Механические часы ручной сборки с сапфировым стеклом. Швейцарский механизм, водозащита 100 м.',
    features: ['Сапфировое стекло', 'Автоподзавод', 'Водозащита 100м', 'Гарантия 5 лет'],
  },
  {
    id: 3, name: 'Noir Tote Bag', brand: 'Noir', price: 86500, oldPrice: 99000,
    rating: 4.8, reviews: 892, isNew: false, popularity: 91, category: 'Аксессуары',
    img: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&q=80',
    description: 'Сумка из натуральной итальянской кожи с золотой фурнитурой. Просторное отделение.',
    features: ['Итальянская кожа', 'Золотая фурнитура', 'Ручная работа', 'Чехол в комплекте'],
  },
  {
    id: 4, name: 'AURUM Sound Pro', brand: 'AURUM', price: 52400, oldPrice: 0,
    rating: 4.7, reviews: 432, isNew: false, popularity: 87, category: 'Электроника',
    img: 'https://images.unsplash.com/photo-1572536147248-ac59a8abfa4b?w=600&q=80',
    description: 'Профессиональные накладные наушники для студийной работы. Расширенный частотный диапазон.',
    features: ['Студийный звук', 'Съёмный кабель', 'Память формы', 'Кейс премиум'],
  },
  {
    id: 5, name: 'Chronos Classic', brand: 'Chronos', price: 98700, oldPrice: 110000,
    rating: 4.6, reviews: 321, isNew: false, popularity: 80, category: 'Часы',
    img: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=600&q=80',
    description: 'Классические часы с минималистичным дизайном и кожаным ремешком.',
    features: ['Кварцевый механизм', 'Кожаный ремешок', 'Водозащита 50м', 'Гарантия 3 года'],
  },
  {
    id: 6, name: 'Noir Clutch', brand: 'Noir', price: 64200, oldPrice: 0,
    rating: 4.9, reviews: 718, isNew: true, popularity: 89, category: 'Аксессуары',
    img: 'https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?w=600&q=80',
    description: 'Вечерний клатч из лакированной кожи с фирменной застёжкой.',
    features: ['Лакированная кожа', 'Съёмная цепочка', 'Атласная подкладка', 'Подарочная упаковка'],
  },
  {
    id: 7, name: 'Samsung Galaxy S24 Ultra', brand: 'Samsung', price: 129990, oldPrice: 149990,
    rating: 4.8, reviews: 3421, isNew: true, popularity: 96, category: 'Смартфоны',
    img: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=600&q=80',
    description: 'Флагманский смартфон с встроенным стилусом S Pen и профессиональной камерой 200 МП.',
    features: ['200 МП камера', 'Snapdragon 8 Gen 3', 'S Pen в комплекте', '5000 мАч'],
  },
  {
    id: 8, name: 'Apple MacBook Pro 14"', brand: 'Apple', price: 219900, oldPrice: 249900,
    rating: 4.9, reviews: 2100, isNew: false, popularity: 94, category: 'Электроника',
    img: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&q=80',
    description: 'Ноутбук с чипом M3 Pro, Liquid Retina XDR дисплеем и автономностью до 18 часов.',
    features: ['Apple M3 Pro', '18 ч автономности', 'MiniLED XDR', '36 ГБ RAM'],
  },
  {
    id: 9, name: 'AirPods Pro 2', brand: 'Apple', price: 24990, oldPrice: 27990,
    rating: 4.8, reviews: 5432, isNew: false, popularity: 93, category: 'Электроника',
    img: 'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=600&q=80',
    description: 'Беспроводные наушники с адаптивным шумоподавлением и персонализированным пространственным звуком.',
    features: ['Адаптивный ANC', 'USB-C зарядка', 'IP54 защита', '30 ч с кейсом'],
  },
  {
    id: 10, name: 'Rolex Submariner', brand: 'Rolex', price: 890000, oldPrice: 0,
    rating: 5.0, reviews: 234, isNew: false, popularity: 85, category: 'Часы',
    img: 'https://images.unsplash.com/photo-1547996160-81dfa63595aa?w=600&q=80',
    description: 'Легендарные дайверские часы из стали Oystersteel с автоматическим механизмом Calibre 3235.',
    features: ['Сталь Oystersteel', 'Водозащита 300м', 'Calibre 3235', 'Гарантия 5 лет'],
  },
  {
    id: 11, name: 'Ray-Ban Aviator Classic', brand: 'Ray-Ban', price: 18900, oldPrice: 22000,
    rating: 4.7, reviews: 987, isNew: false, popularity: 82, category: 'Аксессуары',
    img: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=600&q=80',
    description: 'Классические авиаторы из металла с поляризованными линзами G-15. Иконический силуэт.',
    features: ['Поляризация', 'UV400 защита', 'Оправа из металла', 'Футляр в комплекте'],
  },
  {
    id: 12, name: 'Nike Air Jordan 1 Retro', brand: 'Nike', price: 32500, oldPrice: 0,
    rating: 4.9, reviews: 2341, isNew: true, popularity: 97, category: 'Обувь',
    img: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80',
    description: 'Культовые кроссовки в ретро расцветке Chicago. Натуральная кожа, Air-подошва.',
    features: ['Натуральная кожа', 'Air-подошва', 'Высокий борт', 'Оригинал Nike'],
  },
  {
    id: 13, name: 'Gucci Ophidia Bag', brand: 'Gucci', price: 185000, oldPrice: 210000,
    rating: 4.9, reviews: 445, isNew: false, popularity: 88, category: 'Аксессуары',
    img: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=600&q=80',
    description: 'Сумка из канваса GG с деталями из натуральной кожи. Знаковое оформление от Gucci.',
    features: ['Канвас GG', 'Кожаная отделка', 'Золотая фурнитура', 'Аутентификация'],
  },
  {
    id: 14, name: 'Sony WH-1000XM5', brand: 'Sony', price: 29990, oldPrice: 34990,
    rating: 4.8, reviews: 4123, isNew: false, popularity: 92, category: 'Электроника',
    img: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=600&q=80',
    description: 'Наушники с лучшим в классе шумоподавлением и 30 часами автономной работы.',
    features: ['30 ч работы', 'LDAC кодек', 'Quick Charge', 'Multipoint'],
  },
  {
    id: 15, name: 'iPhone 15 Pro Max', brand: 'Apple', price: 169990, oldPrice: 189990,
    rating: 4.9, reviews: 6780, isNew: true, popularity: 99, category: 'Смартфоны',
    img: 'https://images.unsplash.com/photo-1632633173522-47456de71b76?w=600&q=80',
    description: 'Профессиональный смартфон с камерой 48 МП, чипом A17 Pro и корпусом из титана.',
    features: ['Чип A17 Pro', 'Камера 48 МП', 'Titanium корпус', 'USB-C'],
  },
  {
    id: 16, name: 'Adidas Ultraboost 23', brand: 'Adidas', price: 21900, oldPrice: 26000,
    rating: 4.7, reviews: 1890, isNew: false, popularity: 83, category: 'Обувь',
    img: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=600&q=80',
    description: 'Кроссовки для бега с технологией Boost и верхом из переработанного Primeknit.',
    features: ['Boost подошва', 'Primeknit верх', 'Continental резина', 'Eco-материалы'],
  },
  {
    id: 17, name: 'Bulgari Serpenti', brand: 'Bulgari', price: 340000, oldPrice: 0,
    rating: 5.0, reviews: 123, isNew: true, popularity: 84, category: 'Украшения',
    img: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=600&q=80',
    description: 'Браслет-змея из розового золота 18K с бриллиантами. Символ дерзости и элегантности.',
    features: ['Розовое золото 18К', 'Бриллианты', 'Сертификат GIA', 'Фирменная упаковка'],
  },
  {
    id: 18, name: 'Chanel N°5 Parfum', brand: 'Chanel', price: 32000, oldPrice: 0,
    rating: 4.9, reviews: 3456, isNew: false, popularity: 90, category: 'Парфюмерия',
    img: 'https://images.unsplash.com/photo-1541643600914-78b084683702?w=600&q=80',
    description: 'Легендарный цветочно-альдегидный парфюм, созданный в 1921 году. 100 мл.',
    features: ['100 мл', 'Цветочно-альдегидный', 'Стойкость 8+ ч', 'Оригинал Chanel'],
  },
  {
    id: 19, name: 'iPad Pro 12.9"', brand: 'Apple', price: 149990, oldPrice: 169990,
    rating: 4.9, reviews: 1234, isNew: true, popularity: 91, category: 'Электроника',
    img: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600&q=80',
    description: 'Самый мощный iPad с чипом M2, Liquid Retina XDR дисплеем и поддержкой Apple Pencil Pro.',
    features: ['Чип Apple M2', 'Liquid Retina XDR', 'Thunderbolt/USB4', 'Face ID'],
  },
  {
    id: 20, name: 'Balenciaga Triple S', brand: 'Balenciaga', price: 89000, oldPrice: 105000,
    rating: 4.6, reviews: 678, isNew: false, popularity: 81, category: 'Обувь',
    img: 'https://images.unsplash.com/photo-1529810313688-44ea1c2d81d3?w=600&q=80',
    description: 'Массивные кроссовки с многослойной подошвой. Икона уличного стиля от Balenciaga.',
    features: ['Многослойная подошва', 'Кожа + сетка', 'Оверсайз дизайн', 'Оригинал'],
  },
];

export const REVIEWS: Review[] = [
  { name: 'Дмитрий К.', rating: 5, date: '12 июня', text: 'Качество превзошло все ожидания. Чувствуется премиум в каждой детали.' },
  { name: 'Елена М.', rating: 5, date: '8 июня', text: 'Доставили быстро, упаковка роскошная. Очень довольна покупкой!' },
  { name: 'Артём С.', rating: 4, date: '2 июня', text: 'Отличная вещь, хотелось бы больше расцветок. В остальном — идеально.' },
  { name: 'Ирина В.', rating: 5, date: '28 мая', text: 'Использую каждый день. Лучшая покупка за последние годы!' },
];

export const fmt = (n: number) => n.toLocaleString('ru-RU') + ' ₽';
