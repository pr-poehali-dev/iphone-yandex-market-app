import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '@/components/ui/icon';
import { PRODUCTS, fmt } from '@/data/products';

const CATEGORIES = ['Все', 'Электроника', 'Часы', 'Аксессуары'];
const BRANDS = ['Все бренды', 'AURUM', 'Chronos', 'Noir'];
const SORTS = [
  { id: 'popular', label: 'Популярные', icon: 'Flame' },
  { id: 'new', label: 'Новинки', icon: 'Sparkles' },
  { id: 'cheap', label: 'Дешевле', icon: 'ArrowDown' },
  { id: 'expensive', label: 'Дороже', icon: 'ArrowUp' },
  { id: 'rating', label: 'Рейтинг', icon: 'Star' },
];
const NAV = [
  { id: 'home', label: 'Каталог', icon: 'LayoutGrid' },
  { id: 'fav', label: 'Избранное', icon: 'Heart' },
  { id: 'cart', label: 'Корзина', icon: 'ShoppingBag' },
  { id: 'profile', label: 'Профиль', icon: 'User' },
];

const ORDERS = [
  { id: '#AU-1029', date: '14 июня', status: 'Доставлен', name: 'AURUM Sound One', price: 38900 },
  { id: '#AU-1018', date: '2 июня', status: 'Доставлен', name: 'Chronos Classic', price: 98700 },
];

export default function Index() {
  const navigate = useNavigate();
  const [tab, setTab] = useState('home');
  const [cat, setCat] = useState('Все');
  const [sort, setSort] = useState('popular');
  const [search, setSearch] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  // filter state
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(150000);
  const [minRating, setMinRating] = useState(0);
  const [onlyNew, setOnlyNew] = useState(false);
  const [onlySale, setOnlySale] = useState(false);
  const [brand, setBrand] = useState('Все бренды');

  // draft filter (applied only on "Показать")
  const [draftMin, setDraftMin] = useState(0);
  const [draftMax, setDraftMax] = useState(150000);
  const [draftRating, setDraftRating] = useState(0);
  const [draftNew, setDraftNew] = useState(false);
  const [draftSale, setDraftSale] = useState(false);
  const [draftBrand, setDraftBrand] = useState('Все бренды');
  const [draftCat, setDraftCat] = useState('Все');

  const [fav, setFav] = useState<number[]>([]);
  const [cart, setCart] = useState<number[]>([]);
  const [orderDone, setOrderDone] = useState(false);
  const [profileSection, setProfileSection] = useState<string | null>(null);
  const [notifOn, setNotifOn] = useState(true);
  const [promoOn, setPromoOn] = useState(false);
  const [chatMsg, setChatMsg] = useState('');
  const [chatHistory, setChatHistory] = useState<{ from: 'user' | 'support'; text: string }[]>([
    { from: 'support', text: 'Здравствуйте! Чем могу помочь?' },
  ]);

  const openFilters = () => {
    setDraftMin(minPrice); setDraftMax(maxPrice);
    setDraftRating(minRating); setDraftNew(onlyNew);
    setDraftSale(onlySale); setDraftBrand(brand);
    setDraftCat(cat);
    setShowFilters(true);
  };

  const applyFilters = () => {
    setMinPrice(draftMin); setMaxPrice(draftMax);
    setMinRating(draftRating); setOnlyNew(draftNew);
    setOnlySale(draftSale); setBrand(draftBrand);
    setCat(draftCat);
    setShowFilters(false);
  };

  const resetFilters = () => {
    setDraftMin(0); setDraftMax(150000);
    setDraftRating(0); setDraftNew(false);
    setDraftSale(false); setDraftBrand('Все бренды');
    setDraftCat('Все');
  };

  const toggle = (arr: number[], set: (v: number[]) => void, id: number) =>
    set(arr.includes(id) ? arr.filter((x) => x !== id) : [...arr, id]);

  const activeFilterCount = [
    minPrice > 0, maxPrice < 150000, minRating > 0,
    onlyNew, onlySale, brand !== 'Все бренды', cat !== 'Все',
  ].filter(Boolean).length;

  const filtered = useMemo(() => {
    const list = PRODUCTS.filter((p) => {
      const brandMatch = brand === 'Все бренды' || p.name.toLowerCase().includes(brand.toLowerCase());
      return (
        (cat === 'Все' || p.category === cat) &&
        p.price >= minPrice && p.price <= maxPrice &&
        p.rating >= minRating &&
        (!onlyNew || p.isNew) &&
        (!onlySale || p.oldPrice > 0) &&
        brandMatch &&
        p.name.toLowerCase().includes(search.toLowerCase())
      );
    });
    const sorters: Record<string, (a: typeof PRODUCTS[0], b: typeof PRODUCTS[0]) => number> = {
      popular: (a, b) => b.popularity - a.popularity,
      new: (a, b) => Number(b.isNew) - Number(a.isNew),
      cheap: (a, b) => a.price - b.price,
      expensive: (a, b) => b.price - a.price,
      rating: (a, b) => b.rating - a.rating,
    };
    return [...list].sort(sorters[sort]);
  }, [cat, sort, search, minPrice, maxPrice, minRating, onlyNew, onlySale, brand]);

  const cartTotal = cart.reduce((s, id) => s + (PRODUCTS.find((p) => p.id === id)?.price || 0), 0);

  const sendChat = () => {
    if (!chatMsg.trim()) return;
    setChatHistory((h) => [...h, { from: 'user', text: chatMsg }]);
    const reply = chatMsg;
    setChatMsg('');
    setTimeout(() => {
      setChatHistory((h) => [...h, { from: 'support', text: `Получили ваше сообщение: «${reply}». Ответим в течение 5 минут.` }]);
    }, 800);
  };

  return (
    <div className="min-h-screen bg-background text-foreground pb-28 max-w-md mx-auto relative overflow-hidden">
      <div className="absolute top-0 right-0 w-80 h-80 bg-primary/8 rounded-full blur-[120px] pointer-events-none" />

      {/* HEADER */}
      <header className="px-6 pt-14 pb-4 relative z-10">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs tracking-[0.3em] text-muted-foreground uppercase">Маркетплейс</p>
            <h1 className="font-display text-4xl font-semibold gold-text leading-none mt-1">AURUM</h1>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setTab('profile')}
              className="w-11 h-11 rounded-full glass border border-border flex items-center justify-center"
            >
              <Icon name="User" size={20} className="text-muted-foreground" />
            </button>
            <button className="w-11 h-11 rounded-full glass border border-border flex items-center justify-center relative">
              <Icon name="Bell" size={20} className="text-gold" />
              <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-primary" />
            </button>
          </div>
        </div>
      </header>

      {/* КАТАЛОГ */}
      {tab === 'home' && (
        <main className="relative z-10 animate-fade-in">
          {/* Search */}
          <div className="px-6 flex gap-3 mb-5">
            <div className="flex-1 flex items-center gap-3 glass border border-border rounded-2xl px-4 h-12">
              <Icon name="Search" size={18} className="text-muted-foreground" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Поиск товаров"
                className="bg-transparent outline-none text-sm w-full placeholder:text-muted-foreground"
              />
              {search && (
                <button onClick={() => setSearch('')}>
                  <Icon name="X" size={16} className="text-muted-foreground" />
                </button>
              )}
            </div>
            <button
              onClick={openFilters}
              className="relative w-12 h-12 rounded-2xl gold-gradient flex items-center justify-center shrink-0"
            >
              <Icon name="SlidersHorizontal" size={20} className="text-primary-foreground" />
              {activeFilterCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-foreground text-background text-[10px] font-bold flex items-center justify-center">
                  {activeFilterCount}
                </span>
              )}
            </button>
          </div>

          {/* Hero */}
          <div className="px-6 mb-6">
            <div
              onClick={() => navigate(`/product/2`)}
              className="relative rounded-3xl overflow-hidden h-44 border border-primary/20 cursor-pointer"
            >
              <img src={PRODUCTS[1].img} alt="" className="absolute inset-0 w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-r from-background via-background/70 to-transparent" />
              <div className="relative h-full flex flex-col justify-center px-6">
                <p className="text-xs tracking-widest text-gold uppercase mb-1">Коллекция 2026</p>
                <h2 className="font-display text-3xl font-semibold leading-tight">Эксклюзив<br />для избранных</h2>
                <span className="mt-3 w-fit text-xs font-medium px-4 py-2 rounded-full gold-gradient text-primary-foreground inline-block">
                  Смотреть →
                </span>
              </div>
            </div>
          </div>

          {/* Sort */}
          <div className="flex gap-2 px-6 mb-5 overflow-x-auto no-scrollbar">
            {SORTS.map((s) => (
              <button
                key={s.id}
                onClick={() => setSort(s.id)}
                className={`flex items-center gap-1.5 px-3.5 h-9 rounded-full text-xs whitespace-nowrap transition-all ${
                  sort === s.id ? 'bg-secondary text-gold border border-primary/30' : 'text-muted-foreground border border-transparent'
                }`}
              >
                <Icon name={s.icon} size={13} />
                {s.label}
              </button>
            ))}
          </div>

          {/* Count */}
          <div className="px-6 mb-3 flex items-center justify-between">
            <span className="text-sm text-muted-foreground">
              {filtered.length} {filtered.length === 1 ? 'товар' : filtered.length < 5 ? 'товара' : 'товаров'}
            </span>
            {activeFilterCount > 0 && (
              <button
                onClick={() => { setMinPrice(0); setMaxPrice(150000); setMinRating(0); setOnlyNew(false); setOnlySale(false); setBrand('Все бренды'); setCat('Все'); }}
                className="text-xs text-primary flex items-center gap-1"
              >
                <Icon name="X" size={12} />
                Сбросить фильтры
              </button>
            )}
          </div>

          {/* Grid */}
          <div className="px-6 grid grid-cols-2 gap-4">
            {filtered.map((p, i) => (
              <article
                key={p.id}
                className="group animate-scale-in"
                style={{ animationDelay: `${i * 50}ms`, opacity: 0 }}
              >
                <div
                  onClick={() => navigate(`/product/${p.id}`)}
                  className="relative rounded-2xl overflow-hidden bg-card border border-border aspect-square cursor-pointer"
                >
                  <img src={p.img} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute top-2 left-2 flex flex-col gap-1">
                    {p.isNew && (
                      <span className="text-[10px] font-medium px-2 py-0.5 rounded-full gold-gradient text-primary-foreground">NEW</span>
                    )}
                    {p.oldPrice > 0 && (
                      <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-primary text-primary-foreground">
                        -{Math.round((1 - p.price / p.oldPrice) * 100)}%
                      </span>
                    )}
                  </div>
                  <button
                    onClick={(e) => { e.stopPropagation(); toggle(fav, setFav, p.id); }}
                    className="absolute top-2 right-2 w-8 h-8 rounded-full glass flex items-center justify-center"
                  >
                    <Icon name="Heart" size={15} className={fav.includes(p.id) ? 'text-primary fill-primary' : 'text-foreground'} />
                  </button>
                </div>
                <div className="mt-2.5">
                  <p className="text-[11px] text-muted-foreground">{p.brand}</p>
                  <h3 onClick={() => navigate(`/product/${p.id}`)} className="text-sm font-medium leading-tight cursor-pointer line-clamp-1">{p.name}</h3>
                  <div className="flex items-center gap-1 mt-1">
                    <Icon name="Star" size={12} className="text-gold fill-gold" />
                    <span className="text-xs text-muted-foreground">{p.rating} · {p.reviews}</span>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <div>
                      <p className="text-sm font-semibold gold-text">{fmt(p.price)}</p>
                      {p.oldPrice > 0 && <p className="text-[10px] text-muted-foreground line-through">{fmt(p.oldPrice)}</p>}
                    </div>
                    <button
                      onClick={(e) => { e.stopPropagation(); toggle(cart, setCart, p.id); }}
                      className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all active:scale-90 ${
                        cart.includes(p.id) ? 'bg-secondary border border-primary/40 text-gold' : 'gold-gradient text-primary-foreground'
                      }`}
                    >
                      <Icon name={cart.includes(p.id) ? 'Check' : 'Plus'} size={18} />
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
          {filtered.length === 0 && (
            <div className="flex flex-col items-center py-16">
              <Icon name="SearchX" size={40} className="text-muted-foreground mb-3" />
              <p className="text-muted-foreground text-sm">Ничего не найдено</p>
              <button onClick={() => { setMinPrice(0); setMaxPrice(150000); setMinRating(0); setOnlyNew(false); setOnlySale(false); setBrand('Все бренды'); setCat('Все'); setSearch(''); }} className="mt-3 text-xs text-primary">Сбросить всё</button>
            </div>
          )}
          <div className="h-4" />
        </main>
      )}

      {/* ИЗБРАННОЕ */}
      {tab === 'fav' && (
        <main className="relative z-10 px-6 animate-fade-in">
          <h2 className="font-display text-3xl font-semibold mb-5">Избранное</h2>
          {fav.length === 0 ? (
            <EmptyState icon="Heart" text="Добавьте товары в избранное" sub="Нажмите ♥ на карточке товара" />
          ) : (
            <div className="grid grid-cols-2 gap-4">
              {fav.map((id) => {
                const p = PRODUCTS.find((x) => x.id === id)!;
                return (
                  <div key={id}>
                    <div onClick={() => navigate(`/product/${id}`)} className="rounded-2xl overflow-hidden border border-border aspect-square cursor-pointer relative">
                      <img src={p.img} className="w-full h-full object-cover" alt={p.name} />
                      <button
                        onClick={(e) => { e.stopPropagation(); toggle(fav, setFav, id); }}
                        className="absolute top-2 right-2 w-8 h-8 rounded-full glass flex items-center justify-center"
                      >
                        <Icon name="Heart" size={15} className="text-primary fill-primary" />
                      </button>
                    </div>
                    <h3 className="text-sm font-medium mt-2 line-clamp-1">{p.name}</h3>
                    <div className="flex items-center justify-between mt-1">
                      <p className="text-sm font-semibold gold-text">{fmt(p.price)}</p>
                      <button
                        onClick={() => toggle(cart, setCart, id)}
                        className={`text-xs px-2 py-1 rounded-lg ${cart.includes(id) ? 'bg-secondary text-gold' : 'gold-gradient text-primary-foreground'}`}
                      >
                        {cart.includes(id) ? 'В корзине' : 'В корзину'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </main>
      )}

      {/* КОРЗИНА */}
      {tab === 'cart' && (
        <main className="relative z-10 px-6 animate-fade-in">
          <h2 className="font-display text-3xl font-semibold mb-5">Корзина</h2>
          {orderDone ? (
            <div className="flex flex-col items-center py-20 text-center animate-scale-in">
              <div className="w-20 h-20 rounded-full gold-gradient flex items-center justify-center mb-4">
                <Icon name="Check" size={36} className="text-primary-foreground" />
              </div>
              <h3 className="font-display text-2xl font-semibold mb-2">Заказ оформлен!</h3>
              <p className="text-sm text-muted-foreground mb-6">Мы свяжемся с вами в течение 15 минут</p>
              <button onClick={() => { setOrderDone(false); setCart([]); setTab('home'); }} className="px-6 h-12 rounded-2xl gold-gradient text-primary-foreground font-medium">
                Продолжить покупки
              </button>
            </div>
          ) : cart.length === 0 ? (
            <EmptyState icon="ShoppingBag" text="Корзина пуста" sub="Добавьте товары из каталога" action={{ label: 'Перейти в каталог', fn: () => setTab('home') }} />
          ) : (
            <>
              <div className="space-y-3">
                {cart.map((id) => {
                  const p = PRODUCTS.find((x) => x.id === id)!;
                  return (
                    <div key={id} className="flex gap-3 glass border border-border rounded-2xl p-3">
                      <img
                        onClick={() => navigate(`/product/${id}`)}
                        src={p.img}
                        className="w-16 h-16 rounded-xl object-cover cursor-pointer shrink-0"
                        alt={p.name}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-[11px] text-muted-foreground">{p.brand}</p>
                        <h3 className="text-sm font-medium line-clamp-1">{p.name}</h3>
                        <p className="text-sm font-semibold gold-text mt-1">{fmt(p.price)}</p>
                      </div>
                      <button onClick={() => toggle(cart, setCart, id)} className="self-start p-1 text-muted-foreground active:scale-90 transition-transform">
                        <Icon name="X" size={18} />
                      </button>
                    </div>
                  );
                })}
              </div>
              <div className="glass border border-primary/20 rounded-2xl p-4 mt-5">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Товаров</span>
                  <span>{cart.length} шт.</span>
                </div>
                <div className="flex justify-between text-sm mt-1">
                  <span className="text-muted-foreground">Итого</span>
                  <span className="font-semibold text-lg gold-text">{fmt(cartTotal)}</span>
                </div>
                <button
                  onClick={() => setOrderDone(true)}
                  className="w-full h-12 rounded-2xl gold-gradient text-primary-foreground font-medium mt-4 active:scale-[0.98] transition-transform"
                >
                  Оформить заказ
                </button>
                <button
                  onClick={() => setCart([])}
                  className="w-full h-10 rounded-2xl text-sm text-muted-foreground mt-2"
                >
                  Очистить корзину
                </button>
              </div>
            </>
          )}
        </main>
      )}

      {/* ПРОФИЛЬ */}
      {tab === 'profile' && !profileSection && (
        <main className="relative z-10 px-6 animate-fade-in">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-20 h-20 rounded-full gold-gradient flex items-center justify-center shrink-0">
              <span className="font-display text-3xl text-primary-foreground font-semibold">А</span>
            </div>
            <div>
              <h2 className="font-display text-2xl font-semibold">Александр</h2>
              <p className="text-sm text-muted-foreground">Premium участник</p>
              <div className="flex items-center gap-1 mt-1">
                <Icon name="Star" size={12} className="text-gold fill-gold" />
                <span className="text-xs text-muted-foreground">{fav.length} в избранном · {cart.length} в корзине</span>
              </div>
            </div>
          </div>

          {/* Кнопка Каталог */}
          <button
            onClick={() => setTab('home')}
            className="w-full h-14 rounded-2xl gold-gradient text-primary-foreground font-medium flex items-center justify-center gap-2 mb-4"
          >
            <Icon name="LayoutGrid" size={20} />
            Перейти в каталог
          </button>

          <div className="space-y-2">
            {[
              { id: 'orders', icon: 'Package', label: 'История заказов', sub: `${ORDERS.length} заказа` },
              { id: 'chat', icon: 'MessageCircle', label: 'Чат с поддержкой', sub: 'Онлайн' },
              { id: 'payment', icon: 'CreditCard', label: 'Способы оплаты', sub: '•••• 4821' },
              { id: 'settings', icon: 'Settings', label: 'Настройки', sub: 'Уведомления, язык' },
            ].map((m) => (
              <button
                key={m.id}
                onClick={() => setProfileSection(m.id)}
                className="w-full flex items-center gap-4 glass border border-border rounded-2xl px-4 h-14 active:scale-[0.98] transition-transform"
              >
                <Icon name={m.icon} size={20} className="text-gold" />
                <div className="flex-1 text-left">
                  <p className="text-sm">{m.label}</p>
                  <p className="text-[11px] text-muted-foreground">{m.sub}</p>
                </div>
                <Icon name="ChevronRight" size={18} className="text-muted-foreground" />
              </button>
            ))}
          </div>
        </main>
      )}

      {/* ИСТОРИЯ ЗАКАЗОВ */}
      {tab === 'profile' && profileSection === 'orders' && (
        <main className="relative z-10 px-6 animate-fade-in">
          <div className="flex items-center gap-3 mb-5">
            <button onClick={() => setProfileSection(null)} className="w-9 h-9 rounded-full glass border border-border flex items-center justify-center">
              <Icon name="ChevronLeft" size={20} />
            </button>
            <h2 className="font-display text-2xl font-semibold">История заказов</h2>
          </div>
          <div className="space-y-3">
            {ORDERS.map((o) => (
              <div key={o.id} className="glass border border-border rounded-2xl p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-xs text-muted-foreground">{o.id} · {o.date}</p>
                    <h3 className="text-sm font-medium mt-0.5">{o.name}</h3>
                  </div>
                  <span className="text-xs px-2 py-1 rounded-full bg-primary/15 text-primary">{o.status}</span>
                </div>
                <div className="flex items-center justify-between mt-3">
                  <span className="text-sm font-semibold gold-text">{fmt(o.price)}</span>
                  <button className="text-xs text-muted-foreground border border-border px-3 py-1.5 rounded-xl">
                    Повторить заказ
                  </button>
                </div>
              </div>
            ))}
          </div>
        </main>
      )}

      {/* ЧАТ */}
      {tab === 'profile' && profileSection === 'chat' && (
        <main className="relative z-10 px-6 animate-fade-in flex flex-col" style={{ height: 'calc(100dvh - 112px)' }}>
          <div className="flex items-center gap-3 mb-4">
            <button onClick={() => setProfileSection(null)} className="w-9 h-9 rounded-full glass border border-border flex items-center justify-center">
              <Icon name="ChevronLeft" size={20} />
            </button>
            <div>
              <h2 className="font-display text-xl font-semibold">Поддержка</h2>
              <p className="text-xs text-green-400">● Онлайн</p>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto space-y-3 pb-3">
            {chatHistory.map((m, i) => (
              <div key={i} className={`flex ${m.from === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[78%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                  m.from === 'user' ? 'gold-gradient text-primary-foreground' : 'glass border border-border'
                }`}>
                  {m.text}
                </div>
              </div>
            ))}
          </div>
          <div className="flex gap-2 pt-2">
            <input
              value={chatMsg}
              onChange={(e) => setChatMsg(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && sendChat()}
              placeholder="Сообщение..."
              className="flex-1 glass border border-border rounded-2xl px-4 h-11 text-sm outline-none placeholder:text-muted-foreground"
            />
            <button onClick={sendChat} className="w-11 h-11 rounded-2xl gold-gradient flex items-center justify-center shrink-0">
              <Icon name="Send" size={18} className="text-primary-foreground" />
            </button>
          </div>
        </main>
      )}

      {/* ОПЛАТА */}
      {tab === 'profile' && profileSection === 'payment' && (
        <main className="relative z-10 px-6 animate-fade-in">
          <div className="flex items-center gap-3 mb-5">
            <button onClick={() => setProfileSection(null)} className="w-9 h-9 rounded-full glass border border-border flex items-center justify-center">
              <Icon name="ChevronLeft" size={20} />
            </button>
            <h2 className="font-display text-2xl font-semibold">Оплата</h2>
          </div>
          <div className="rounded-3xl gold-gradient p-5 mb-4 relative overflow-hidden">
            <div className="absolute top-3 right-4 opacity-20 font-display text-5xl font-bold">AURUM</div>
            <p className="text-primary-foreground/70 text-xs tracking-widest">ПРЕМИУМ КАРТА</p>
            <p className="text-primary-foreground font-mono text-lg mt-3 tracking-widest">•••• •••• •••• 4821</p>
            <div className="flex justify-between mt-4">
              <div>
                <p className="text-primary-foreground/60 text-[10px]">Владелец</p>
                <p className="text-primary-foreground text-sm">Александр</p>
              </div>
              <div>
                <p className="text-primary-foreground/60 text-[10px]">Действует до</p>
                <p className="text-primary-foreground text-sm">12/28</p>
              </div>
            </div>
          </div>
          <button className="w-full h-12 rounded-2xl glass border border-border text-sm flex items-center justify-center gap-2">
            <Icon name="Plus" size={18} className="text-gold" />
            Добавить карту
          </button>
        </main>
      )}

      {/* НАСТРОЙКИ */}
      {tab === 'profile' && profileSection === 'settings' && (
        <main className="relative z-10 px-6 animate-fade-in">
          <div className="flex items-center gap-3 mb-5">
            <button onClick={() => setProfileSection(null)} className="w-9 h-9 rounded-full glass border border-border flex items-center justify-center">
              <Icon name="ChevronLeft" size={20} />
            </button>
            <h2 className="font-display text-2xl font-semibold">Настройки</h2>
          </div>
          <div className="space-y-2">
            {[
              { label: 'Push-уведомления', sub: 'Заказы и обновления', state: notifOn, set: setNotifOn },
              { label: 'Акции и скидки', sub: 'Рассылка об акциях', state: promoOn, set: setPromoOn },
            ].map((s) => (
              <div key={s.label} className="flex items-center justify-between glass border border-border rounded-2xl px-4 h-14">
                <div>
                  <p className="text-sm">{s.label}</p>
                  <p className="text-[11px] text-muted-foreground">{s.sub}</p>
                </div>
                <button
                  onClick={() => s.set(!s.state)}
                  className={`w-12 h-6 rounded-full transition-all relative ${s.state ? 'bg-primary' : 'bg-secondary'}`}
                >
                  <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-all ${s.state ? 'left-6' : 'left-0.5'}`} />
                </button>
              </div>
            ))}
            <button className="w-full h-12 rounded-2xl glass border border-primary/30 text-primary text-sm mt-2">
              Выйти из аккаунта
            </button>
          </div>
        </main>
      )}

      {/* РАСШИРЕННЫЙ ФИЛЬТР */}
      {showFilters && (
        <div className="fixed inset-0 z-50 max-w-md mx-auto" onClick={() => setShowFilters(false)}>
          <div className="absolute inset-0 bg-black/70" />
          <div
            onClick={(e) => e.stopPropagation()}
            className="absolute bottom-0 left-0 right-0 bg-card border-t border-primary/20 rounded-t-3xl animate-slide-up overflow-y-auto"
            style={{ maxHeight: '88vh' }}
          >
            <div className="sticky top-0 bg-card pt-4 pb-3 px-6 border-b border-border z-10">
              <div className="w-12 h-1 bg-border rounded-full mx-auto mb-4" />
              <div className="flex items-center justify-between">
                <h3 className="font-display text-2xl font-semibold">Фильтры</h3>
                <button onClick={resetFilters} className="text-xs text-primary px-3 py-1.5 rounded-xl border border-primary/30">
                  Сбросить
                </button>
              </div>
            </div>

            <div className="px-6 pb-6 space-y-6 pt-5">

              {/* Категория */}
              <div>
                <p className="text-sm font-medium mb-2">Категория</p>
                <div className="flex flex-wrap gap-2">
                  {CATEGORIES.map((c) => (
                    <button
                      key={c}
                      onClick={() => setDraftCat(c)}
                      className={`px-4 h-9 rounded-full text-sm border transition-all ${
                        draftCat === c ? 'gold-gradient text-primary-foreground border-transparent' : 'border-border text-muted-foreground'
                      }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>

              {/* Бренд */}
              <div>
                <p className="text-sm font-medium mb-2">Бренд</p>
                <div className="flex flex-wrap gap-2">
                  {BRANDS.map((b) => (
                    <button
                      key={b}
                      onClick={() => setDraftBrand(b)}
                      className={`px-4 h-9 rounded-full text-sm border transition-all ${
                        draftBrand === b ? 'gold-gradient text-primary-foreground border-transparent' : 'border-border text-muted-foreground'
                      }`}
                    >
                      {b}
                    </button>
                  ))}
                </div>
              </div>

              {/* Цена */}
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="font-medium">Цена</span>
                  <span className="text-gold font-medium">{fmt(draftMin)} — {fmt(draftMax)}</span>
                </div>
                <div className="space-y-3">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">От</p>
                    <input type="range" min={0} max={150000} step={5000} value={draftMin}
                      onChange={(e) => setDraftMin(Math.min(+e.target.value, draftMax - 5000))}
                      className="w-full accent-[hsl(0_78%_53%)]" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">До</p>
                    <input type="range" min={0} max={150000} step={5000} value={draftMax}
                      onChange={(e) => setDraftMax(Math.max(+e.target.value, draftMin + 5000))}
                      className="w-full accent-[hsl(0_78%_53%)]" />
                  </div>
                </div>
                <div className="grid grid-cols-4 gap-2 mt-3">
                  {[[0, 50000], [50000, 100000], [100000, 130000], [0, 150000]].map(([mn, mx]) => (
                    <button
                      key={`${mn}-${mx}`}
                      onClick={() => { setDraftMin(mn); setDraftMax(mx); }}
                      className="h-9 rounded-xl text-xs border border-border text-muted-foreground"
                    >
                      {mn === 0 && mx === 150000 ? 'Любая' : mn === 0 ? `до ${mx / 1000}к` : `${mn / 1000}–${mx / 1000}к`}
                    </button>
                  ))}
                </div>
              </div>

              {/* Рейтинг */}
              <div>
                <p className="text-sm font-medium mb-2">Рейтинг</p>
                <div className="flex gap-2">
                  {[0, 4, 4.5, 4.8].map((r) => (
                    <button
                      key={r}
                      onClick={() => setDraftRating(r)}
                      className={`flex-1 h-10 rounded-xl text-sm border transition-all flex items-center justify-center gap-1 ${
                        draftRating === r ? 'gold-gradient text-primary-foreground border-transparent' : 'border-border text-muted-foreground'
                      }`}
                    >
                      {r > 0 && <Icon name="Star" size={11} className="fill-current" />}
                      {r === 0 ? 'Любой' : r + '+'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Теги */}
              <div>
                <p className="text-sm font-medium mb-2">Дополнительно</p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setDraftNew(!draftNew)}
                    className={`flex items-center gap-2 px-4 h-10 rounded-xl text-sm border transition-all ${
                      draftNew ? 'gold-gradient text-primary-foreground border-transparent' : 'border-border text-muted-foreground'
                    }`}
                  >
                    <Icon name="Sparkles" size={14} />
                    Только новинки
                  </button>
                  <button
                    onClick={() => setDraftSale(!draftSale)}
                    className={`flex items-center gap-2 px-4 h-10 rounded-xl text-sm border transition-all ${
                      draftSale ? 'bg-primary text-primary-foreground border-transparent' : 'border-border text-muted-foreground'
                    }`}
                  >
                    <Icon name="Tag" size={14} />
                    Со скидкой
                  </button>
                </div>
              </div>

              <button
                onClick={applyFilters}
                className="w-full h-13 py-3.5 rounded-2xl gold-gradient text-primary-foreground font-medium text-sm"
              >
                Показать товары
              </button>
            </div>
          </div>
        </div>
      )}

      {/* LIQUID GLASS NAVBAR */}
      <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto z-40 px-5 pb-8 pt-0">
        <div
          className="flex justify-around items-center rounded-[28px] px-2 py-3"
          style={{
            background: 'rgba(18, 8, 8, 0.55)',
            backdropFilter: 'blur(32px) saturate(180%)',
            WebkitBackdropFilter: 'blur(32px) saturate(180%)',
            border: '1px solid rgba(255,255,255,0.10)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.08)',
          }}
        >
          {NAV.map((n) => {
            const count = n.id === 'cart' ? cart.length : n.id === 'fav' ? fav.length : 0;
            const active = tab === n.id;
            return (
              <button
                key={n.id}
                onClick={() => { setTab(n.id); if (n.id !== 'profile') setProfileSection(null); }}
                className="flex flex-col items-center gap-1 relative px-3 py-1"
              >
                <div className="relative">
                  {active && (
                    <span className="absolute inset-0 -m-2 rounded-2xl bg-primary/15 blur-sm" />
                  )}
                  <Icon
                    name={n.icon}
                    size={24}
                    className={`relative transition-all duration-200 ${active ? 'text-primary scale-110' : 'text-white/50'}`}
                  />
                  {count > 0 && (
                    <span className="absolute -top-1.5 -right-2 min-w-[16px] h-4 px-1 rounded-full bg-primary text-primary-foreground text-[10px] flex items-center justify-center font-bold">
                      {count}
                    </span>
                  )}
                </div>
                <span className={`text-[10px] transition-all duration-200 ${active ? 'text-primary font-medium' : 'text-white/40'}`}>
                  {n.label}
                </span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}

function EmptyState({ icon, text, sub, action }: { icon: string; text: string; sub?: string; action?: { label: string; fn: () => void } }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center mb-4">
        <Icon name={icon} size={28} className="text-muted-foreground" />
      </div>
      <p className="text-foreground font-medium text-sm">{text}</p>
      {sub && <p className="text-muted-foreground text-xs mt-1">{sub}</p>}
      {action && (
        <button onClick={action.fn} className="mt-5 px-5 h-10 rounded-2xl gold-gradient text-primary-foreground text-sm">
          {action.label}
        </button>
      )}
    </div>
  );
}
