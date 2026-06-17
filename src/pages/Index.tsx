import { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '@/components/ui/icon';
import { PRODUCTS, fmt } from '@/data/products';
import SplashScreen from '@/components/SplashScreen';
import OnboardingScreen from '@/components/OnboardingScreen';
import NotificationsPanel from '@/components/NotificationsPanel';
import ComparePanel from '@/components/ComparePanel';
import { useScrollReveal } from '@/hooks/useScrollReveal';

const CATEGORIES = ['Все', 'Электроника', 'Смартфоны', 'Часы', 'Аксессуары', 'Обувь', 'Украшения', 'Парфюмерия'];
const BRANDS = ['Все бренды', 'Apple', 'Samsung', 'Sony', 'AURUM', 'Chronos', 'Nike', 'Adidas', 'Gucci', 'Rolex', 'Bulgari', 'Chanel', 'Noir', 'Ray-Ban', 'Balenciaga'];
const SORTS = [
  { id: 'popular', label: 'Популярные', icon: 'Flame' },
  { id: 'new', label: 'Новинки', icon: 'Sparkles' },
  { id: 'cheap', label: 'Дешевле', icon: 'ArrowDown' },
  { id: 'expensive', label: 'Дороже', icon: 'ArrowUp' },
  { id: 'rating', label: 'Рейтинг', icon: 'Star' },
];
const NAV_TABS = [
  { id: 'home', label: 'Каталог', icon: 'LayoutGrid' },
  { id: 'fav', label: 'Избранное', icon: 'Heart' },
  { id: 'cart', label: 'Корзина', icon: 'ShoppingBag' },
  { id: 'profile', label: 'Профиль', icon: 'User' },
];
const TAB_ORDER = ['home', 'fav', 'cart', 'profile'];

const PAYMENT_METHODS = [
  { id: 'card', icon: 'CreditCard', label: 'Банковская карта', sub: '•••• 4821', emoji: '💳', active: true },
  { id: 'sbp', icon: 'Zap', label: 'СБП', sub: 'Быстрые платежи', emoji: '⚡', active: false },
  { id: 'mir', icon: 'Shield', label: 'Mir Pay', sub: 'Через NFC', emoji: '🏦', active: false },
  { id: 'ykassa', icon: 'Wallet', label: 'ЮKassa', sub: 'Онлайн-оплата', emoji: '💰', active: false },
  { id: 'cash', icon: 'Banknote', label: 'Наличными', sub: 'При получении', emoji: '💵', active: false },
  { id: 'installment', icon: 'Calendar', label: 'Рассрочка 0%', sub: 'До 12 месяцев', emoji: '📅', active: false },
];

const ORDERS = [
  { id: '#AU-1029', date: '14 июня 2026', status: 'Доставлен', name: 'AURUM Sound One', price: 38900, img: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=120&q=80' },
  { id: '#AU-1018', date: '2 июня 2026', status: 'Доставлен', name: 'Chronos Classic', price: 98700, img: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=120&q=80' },
  { id: '#AU-1007', date: '18 мая 2026', status: 'Отменён', name: 'Ray-Ban Aviator', price: 18900, img: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=120&q=80' },
];

export default function Index() {
  const navigate = useNavigate();
  const catalogRef = useScrollReveal();

  // Lifecycle
  const [splash, setSplash] = useState(true);
  const [onboarded, setOnboarded] = useState(() => !!localStorage.getItem('aurum_name'));
  const [showAuth, setShowAuth] = useState(false);
  const [userName, setUserName] = useState(() => localStorage.getItem('aurum_name') || '');
  const [userPhone, setUserPhone] = useState(() => localStorage.getItem('aurum_phone') || '');

  // Navigation
  const [tab, setTab] = useState('home');
  const [tabHistory, setTabHistory] = useState<string[]>(['home']);
  const [profileSection, setProfileSection] = useState<string | null>(null);
  const [profileHistory, setProfileHistory] = useState<string[]>([]);
  const [animDir, setAnimDir] = useState<'left' | 'right' | null>(null);

  // Filters
  const [showFilters, setShowFilters] = useState(false);
  const [cat, setCat] = useState('Все');
  const [sort, setSort] = useState('popular');
  const [search, setSearch] = useState('');
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(900000);
  const [minRating, setMinRating] = useState(0);
  const [onlyNew, setOnlyNew] = useState(false);
  const [onlySale, setOnlySale] = useState(false);
  const [brand, setBrand] = useState('Все бренды');
  const [draftMin, setDraftMin] = useState(0);
  const [draftMax, setDraftMax] = useState(900000);
  const [draftRating, setDraftRating] = useState(0);
  const [draftNew, setDraftNew] = useState(false);
  const [draftSale, setDraftSale] = useState(false);
  const [draftBrand, setDraftBrand] = useState('Все бренды');
  const [draftCat, setDraftCat] = useState('Все');

  // App state
  const [fav, setFav] = useState<number[]>([]);
  const [cart, setCart] = useState<number[]>([]);
  const [compare, setCompare] = useState<number[]>([]);
  const [orderDone, setOrderDone] = useState(false);
  const [showNotifs, setShowNotifs] = useState(false);
  const [showCompare, setShowCompare] = useState(false);
  const [activePayment, setActivePayment] = useState('card');
  const [notifOn, setNotifOn] = useState(true);
  const [promoOn, setPromoOn] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const [chatMsg, setChatMsg] = useState('');
  const [chatHistory, setChatHistory] = useState<{ from: 'user' | 'support'; text: string }[]>([
    { from: 'support', text: '👋 Здравствуйте! Я помогу вам с любым вопросом о заказе, доставке или товаре.' },
  ]);

  // Swipe
  const touchStartX = useRef(0);
  const touchStartY = useRef(0);

  const navigateTab = useCallback((newTab: string) => {
    if (newTab === tab) return;
    const curIdx = TAB_ORDER.indexOf(tab);
    const newIdx = TAB_ORDER.indexOf(newTab);
    setAnimDir(newIdx > curIdx ? 'left' : 'right');
    setTabHistory((h) => [...h, newTab]);
    setTab(newTab);
    setProfileSection(null);
    setProfileHistory([]);
    setTimeout(() => setAnimDir(null), 350);
  }, [tab]);

  const goBack = useCallback(() => {
    if (profileSection && profileHistory.length > 0) {
      const prev = profileHistory[profileHistory.length - 1];
      setProfileHistory((h) => h.slice(0, -1));
      setProfileSection(prev === '__root__' ? null : prev);
      return;
    }
    if (profileSection) { setProfileSection(null); return; }
    if (tabHistory.length > 1) {
      const newHistory = tabHistory.slice(0, -1);
      const prevTab = newHistory[newHistory.length - 1];
      const curIdx = TAB_ORDER.indexOf(tab);
      const prevIdx = TAB_ORDER.indexOf(prevTab);
      setAnimDir(prevIdx > curIdx ? 'left' : 'right');
      setTabHistory(newHistory);
      setTab(prevTab);
      setTimeout(() => setAnimDir(null), 350);
    }
  }, [profileSection, profileHistory, tabHistory, tab]);

  const openProfileSection = (section: string) => {
    setProfileHistory((h) => [...h, profileSection === null ? '__root__' : profileSection]);
    setProfileSection(section);
  };

  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    const dy = Math.abs(e.changedTouches[0].clientY - touchStartY.current);
    if (Math.abs(dx) < 55 || dy > 70) return;
    if (dx > 0) {
      if (profileSection) { goBack(); return; }
      const curIdx = TAB_ORDER.indexOf(tab);
      if (curIdx > 0) navigateTab(TAB_ORDER[curIdx - 1]);
    } else {
      if (profileSection) return;
      const curIdx = TAB_ORDER.indexOf(tab);
      if (curIdx < TAB_ORDER.length - 1) navigateTab(TAB_ORDER[curIdx + 1]);
    }
  };

  const toggle = (arr: number[], set: (v: number[]) => void, id: number) =>
    set(arr.includes(id) ? arr.filter((x) => x !== id) : [...arr, id]);

  const toggleCompare = (id: number) => {
    setCompare((prev) => {
      if (prev.includes(id)) return prev.filter((x) => x !== id);
      if (prev.length >= 3) return prev;
      const next = [...prev, id];
      if (next.length >= 2) setTimeout(() => setShowCompare(true), 300);
      return next;
    });
  };

  const openFilters = () => {
    setDraftMin(minPrice); setDraftMax(maxPrice); setDraftRating(minRating);
    setDraftNew(onlyNew); setDraftSale(onlySale); setDraftBrand(brand); setDraftCat(cat);
    setShowFilters(true);
  };

  const applyFilters = () => {
    setMinPrice(draftMin); setMaxPrice(draftMax); setMinRating(draftRating);
    setOnlyNew(draftNew); setOnlySale(draftSale); setBrand(draftBrand); setCat(draftCat);
    setShowFilters(false);
  };

  const resetFilters = () => {
    setDraftMin(0); setDraftMax(900000); setDraftRating(0);
    setDraftNew(false); setDraftSale(false); setDraftBrand('Все бренды'); setDraftCat('Все');
  };

  const resetAllFilters = () => {
    setMinPrice(0); setMaxPrice(900000); setMinRating(0);
    setOnlyNew(false); setOnlySale(false); setBrand('Все бренды'); setCat('Все'); setSearch('');
  };

  const activeFilterCount = [
    minPrice > 0, maxPrice < 900000, minRating > 0,
    onlyNew, onlySale, brand !== 'Все бренды', cat !== 'Все',
  ].filter(Boolean).length;

  const filtered = useMemo(() => {
    const list = PRODUCTS.filter((p) => {
      const brandMatch = brand === 'Все бренды' || p.brand === brand;
      return (
        (cat === 'Все' || p.category === cat) &&
        p.price >= minPrice && p.price <= maxPrice &&
        p.rating >= minRating &&
        (!onlyNew || p.isNew) &&
        (!onlySale || p.oldPrice > 0) &&
        brandMatch &&
        (p.name.toLowerCase().includes(search.toLowerCase()) ||
         p.brand.toLowerCase().includes(search.toLowerCase()) ||
         p.category.toLowerCase().includes(search.toLowerCase()))
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
    const msg = chatMsg.trim();
    setChatMsg('');
    setChatHistory((h) => [...h, { from: 'user', text: msg }]);
    setTimeout(() => {
      const replies = [
        'Конечно! Помогу разобраться с этим вопросом.',
        'Передаю информацию специалисту — ответим в течение 5 минут.',
        'Спасибо за обращение! Ваш запрос принят в работу.',
        'Отличный вопрос! Уточняю детали у нашей команды.',
      ];
      setChatHistory((h) => [...h, { from: 'support', text: replies[Math.floor(Math.random() * replies.length)] }]);
    }, 900);
  };

  const logout = () => {
    localStorage.removeItem('aurum_name');
    localStorage.removeItem('aurum_phone');
    setOnboarded(false);
    setUserName('');
    setUserPhone('');
    setTab('home');
    setProfileSection(null);
  };

  // Splash / Onboarding guards
  if (splash) return <SplashScreen onDone={() => setSplash(false)} />;
  if (!onboarded) return (
    <OnboardingScreen onDone={(name, phone) => {
      localStorage.setItem('aurum_name', name);
      localStorage.setItem('aurum_phone', phone);
      setUserName(name); setUserPhone(phone); setOnboarded(true);
    }} />
  );
  if (showAuth) return (
    <OnboardingScreen existingUser onDone={(name, phone) => {
      localStorage.setItem('aurum_name', name);
      localStorage.setItem('aurum_phone', phone);
      setUserName(name); setUserPhone(phone); setShowAuth(false);
    }} />
  );

  const canGoBack = tabHistory.length > 1 || !!profileSection;
  const animClass = animDir === 'left' ? 'animate-slide-in-left' : animDir === 'right' ? 'animate-slide-in-right' : 'animate-fade-in';

  const draftFilteredCount = PRODUCTS.filter((p) => {
    const bm = draftBrand === 'Все бренды' || p.brand === draftBrand;
    return (draftCat === 'Все' || p.category === draftCat) &&
      p.price >= draftMin && p.price <= draftMax &&
      p.rating >= draftRating &&
      (!draftNew || p.isNew) && (!draftSale || p.oldPrice > 0) && bm;
  }).length;

  return (
    <div
      className="min-h-screen bg-background text-foreground max-w-md mx-auto relative overflow-x-hidden screen-border"
      style={{ paddingBottom: 112 }}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      {/* Ambient BG */}
      <div className="fixed top-0 right-0 w-72 h-72 bg-primary/6 rounded-full blur-[100px] pointer-events-none z-0" />
      <div className="fixed bottom-32 left-0 w-48 h-48 bg-primary/4 rounded-full blur-[80px] pointer-events-none z-0" />

      {/* ═══ HEADER ═══ */}
      <header className="sticky top-0 z-30 px-5 pt-12 pb-3 bg-background/80 backdrop-blur-xl border-b border-border/40">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {canGoBack && (
              <button onClick={goBack} className="w-9 h-9 rounded-full glass border border-border flex items-center justify-center animate-scale-in shrink-0">
                <Icon name="ChevronLeft" size={20} />
              </button>
            )}
            <h1 className="font-display text-3xl font-bold gold-text leading-none">AURUM</h1>
          </div>
          <div className="flex gap-2 items-center">
            {compare.length > 0 && (
              <button onClick={() => setShowCompare(true)} className="h-8 px-2.5 rounded-full glass border border-primary/40 text-[11px] text-primary flex items-center gap-1">
                <Icon name="BarChart2" size={13} />
                {compare.length}
              </button>
            )}
            <button onClick={() => setShowNotifs(true)} className="w-10 h-10 rounded-full glass border border-border flex items-center justify-center relative">
              <Icon name="Bell" size={19} className="text-gold" />
              <span className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-primary" />
            </button>
          </div>
        </div>
      </header>

      {/* ═══ CONTENT ═══ */}
      <div key={tab + (profileSection || '')} className={`relative z-10 ${animClass}`}>

        {/* ══════ КАТАЛОГ ══════ */}
        {tab === 'home' && (
          <main>
            {/* Search */}
            <div className="px-5 pt-4 flex gap-2.5 mb-4">
              <div className="flex-1 flex items-center gap-2.5 glass border border-border rounded-2xl px-4 h-12 focus-within:border-primary/40 transition-colors">
                <Icon name="Search" size={17} className="text-muted-foreground shrink-0" />
                <input value={search} onChange={(e) => setSearch(e.target.value)}
                  placeholder="Найти товар, бренд..."
                  className="bg-transparent outline-none text-sm w-full placeholder:text-muted-foreground" />
                {search && <button onClick={() => setSearch('')}><Icon name="X" size={14} className="text-muted-foreground" /></button>}
              </div>
              <button onClick={openFilters} className="relative w-12 h-12 rounded-2xl gold-gradient flex items-center justify-center shrink-0 shadow-lg shadow-primary/20">
                <Icon name="SlidersHorizontal" size={19} className="text-white" />
                {activeFilterCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-white text-background text-[10px] font-bold flex items-center justify-center">{activeFilterCount}</span>
                )}
              </button>
            </div>

            {/* Hero */}
            <div className="px-5 mb-4">
              <div onClick={() => navigate('/product/15')} className="relative rounded-3xl overflow-hidden h-44 border border-primary/25 cursor-pointer group">
                <img src={PRODUCTS.find(p=>p.id===15)!.img} alt="" className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/60 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-t from-background/40 to-transparent" />
                <div className="relative h-full flex flex-col justify-center px-5">
                  <span className="text-[10px] tracking-[0.3em] text-primary uppercase font-medium">Хит продаж</span>
                  <h2 className="font-display text-2xl font-bold leading-tight mt-1">iPhone 15<br />Pro Max</h2>
                  <p className="text-xs text-muted-foreground mt-1">от {fmt(169990)}</p>
                  <span className="mt-3 w-fit text-xs font-semibold px-4 py-1.5 rounded-full gold-gradient text-white inline-flex items-center gap-1">
                    Смотреть <Icon name="ArrowRight" size={11} />
                  </span>
                </div>
              </div>
            </div>

            {/* Category chips */}
            <div className="flex gap-2 px-5 mb-3 overflow-x-auto no-scrollbar">
              {CATEGORIES.map((c) => (
                <button key={c} onClick={() => setCat(c)}
                  className={`px-4 h-8 rounded-full text-xs whitespace-nowrap transition-all border shrink-0 ${cat === c ? 'gold-gradient text-white border-transparent shadow-md shadow-primary/20' : 'border-border text-muted-foreground'}`}>
                  {c}
                </button>
              ))}
            </div>

            {/* Sort chips */}
            <div className="flex gap-1.5 px-5 mb-3 overflow-x-auto no-scrollbar">
              {SORTS.map((s) => (
                <button key={s.id} onClick={() => setSort(s.id)}
                  className={`flex items-center gap-1.5 px-3 h-8 rounded-full text-[11px] whitespace-nowrap transition-all border shrink-0 ${sort === s.id ? 'bg-secondary text-gold border-primary/30' : 'text-muted-foreground border-transparent'}`}>
                  <Icon name={s.icon} size={11} />{s.label}
                </button>
              ))}
            </div>

            {/* Count + reset */}
            <div className="px-5 mb-3 flex items-center justify-between">
              <span className="text-xs text-muted-foreground">{filtered.length} товаров</span>
              {activeFilterCount > 0 && (
                <button onClick={resetAllFilters} className="text-xs text-primary flex items-center gap-1">
                  <Icon name="X" size={11} />Сбросить
                </button>
              )}
            </div>

            {/* Grid */}
            <div ref={catalogRef} className="px-5 grid grid-cols-2 gap-3.5">
              {filtered.map((p) => (
                <article key={p.id} className="card-reveal group">
                  <div onClick={() => navigate(`/product/${p.id}`)} className="relative rounded-2xl overflow-hidden bg-card border border-border aspect-square cursor-pointer">
                    <img src={p.img} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    {/* badges */}
                    <div className="absolute top-2 left-2 flex flex-col gap-1">
                      {p.isNew && <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full gold-gradient text-white shadow">NEW</span>}
                      {p.oldPrice > 0 && <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-primary text-white shadow">-{Math.round((1-p.price/p.oldPrice)*100)}%</span>}
                    </div>
                    {/* action buttons */}
                    <div className="absolute top-2 right-2 flex flex-col gap-1.5">
                      <button onClick={(e)=>{e.stopPropagation();toggle(fav,setFav,p.id);}}
                        className="w-8 h-8 rounded-full glass border border-white/10 flex items-center justify-center">
                        <Icon name="Heart" size={14} className={fav.includes(p.id) ? 'text-primary fill-primary' : 'text-white/70'} />
                      </button>
                      <button onClick={(e)=>{e.stopPropagation();toggleCompare(p.id);}}
                        className={`w-8 h-8 rounded-full glass border flex items-center justify-center transition-colors ${compare.includes(p.id) ? 'border-primary/60 bg-primary/20' : 'border-white/10'}`}>
                        <Icon name="BarChart2" size={13} className={compare.includes(p.id) ? 'text-primary' : 'text-white/70'} />
                      </button>
                    </div>
                  </div>
                  <div className="mt-2">
                    <p className="text-[10px] text-muted-foreground">{p.brand}</p>
                    <h3 onClick={() => navigate(`/product/${p.id}`)} className="text-sm font-medium leading-tight cursor-pointer line-clamp-1">{p.name}</h3>
                    <div className="flex items-center gap-1 mt-0.5">
                      <Icon name="Star" size={10} className="text-gold fill-gold" />
                      <span className="text-[11px] text-muted-foreground">{p.rating} · {p.reviews.toLocaleString('ru-RU')}</span>
                    </div>
                    <div className="flex items-center justify-between mt-1.5">
                      <div>
                        <p className="text-sm font-semibold gold-text">{fmt(p.price)}</p>
                        {p.oldPrice > 0 && <p className="text-[10px] text-muted-foreground line-through">{fmt(p.oldPrice)}</p>}
                      </div>
                      <button onClick={(e)=>{e.stopPropagation();toggle(cart,setCart,p.id);}}
                        className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all active:scale-90 ${cart.includes(p.id) ? 'bg-secondary border border-primary/30 text-gold' : 'gold-gradient text-white shadow-md shadow-primary/20'}`}>
                        <Icon name={cart.includes(p.id) ? 'Check' : 'Plus'} size={17} />
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
            {filtered.length === 0 && (
              <div className="flex flex-col items-center py-16 px-5">
                <Icon name="SearchX" size={40} className="text-muted-foreground mb-3" />
                <p className="text-muted-foreground text-sm mb-3">Ничего не найдено</p>
                <button onClick={resetAllFilters} className="text-xs text-white px-4 h-9 rounded-full gold-gradient">Сбросить все фильтры</button>
              </div>
            )}
            <div className="h-6" />
          </main>
        )}

        {/* ══════ ИЗБРАННОЕ ══════ */}
        {tab === 'fav' && (
          <main className="px-5 pt-4">
            <h2 className="font-display text-3xl font-bold mb-5">Избранное</h2>
            {fav.length === 0 ? (
              <EmptyState icon="Heart" text="Список пуст" sub="Нажмите ♥ на любом товаре" action={{ label: 'Перейти в каталог', fn: () => navigateTab('home') }} />
            ) : (
              <div className="grid grid-cols-2 gap-3.5">
                {fav.map((id) => {
                  const p = PRODUCTS.find((x) => x.id === id)!;
                  if (!p) return null;
                  return (
                    <div key={id} className="card-reveal">
                      <div onClick={() => navigate(`/product/${id}`)} className="rounded-2xl overflow-hidden border border-border aspect-square cursor-pointer relative group">
                        <img src={p.img} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt={p.name} />
                        <button onClick={(e)=>{e.stopPropagation();toggle(fav,setFav,id);}} className="absolute top-2 right-2 w-8 h-8 rounded-full glass border border-white/10 flex items-center justify-center">
                          <Icon name="Heart" size={14} className="text-primary fill-primary" />
                        </button>
                      </div>
                      <h3 className="text-sm font-medium mt-2 line-clamp-1">{p.name}</h3>
                      <div className="flex items-center justify-between mt-1">
                        <p className="text-sm font-semibold gold-text">{fmt(p.price)}</p>
                        <button onClick={() => toggle(cart, setCart, id)} className={`text-xs px-2.5 py-1.5 rounded-xl transition-all ${cart.includes(id) ? 'bg-secondary text-gold border border-primary/20' : 'gold-gradient text-white'}`}>
                          {cart.includes(id) ? '✓ В корзине' : '+ Корзина'}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </main>
        )}

        {/* ══════ КОРЗИНА ══════ */}
        {tab === 'cart' && (
          <main className="px-5 pt-4">
            <h2 className="font-display text-3xl font-bold mb-5">Корзина</h2>
            {orderDone ? (
              <div className="flex flex-col items-center py-16 text-center animate-scale-in">
                <div className="w-24 h-24 rounded-full gold-gradient flex items-center justify-center mb-5 shadow-2xl shadow-primary/40">
                  <Icon name="Check" size={40} className="text-white" />
                </div>
                <h3 className="font-display text-2xl font-bold mb-2">Заказ оформлен!</h3>
                <p className="text-sm text-muted-foreground mb-2">Номер заказа: #AU-{Math.floor(1000+Math.random()*9000)}</p>
                <p className="text-xs text-muted-foreground mb-8">Свяжемся в течение 15 минут</p>
                <button onClick={() => { setOrderDone(false); setCart([]); navigateTab('home'); }} className="px-8 h-12 rounded-2xl gold-gradient text-white font-semibold shadow-lg shadow-primary/20">
                  Продолжить покупки
                </button>
              </div>
            ) : cart.length === 0 ? (
              <EmptyState icon="ShoppingBag" text="Корзина пуста" sub="Добавьте товары из каталога" action={{ label: 'В каталог', fn: () => navigateTab('home') }} />
            ) : (
              <>
                <div className="space-y-2.5 mb-4">
                  {cart.map((id) => {
                    const p = PRODUCTS.find((x) => x.id === id);
                    if (!p) return null;
                    return (
                      <div key={id} className="flex gap-3 glass border border-border rounded-2xl p-3">
                        <img onClick={() => navigate(`/product/${id}`)} src={p.img} className="w-16 h-16 rounded-xl object-cover cursor-pointer shrink-0" alt={p.name} />
                        <div className="flex-1 min-w-0">
                          <p className="text-[10px] text-muted-foreground">{p.brand}</p>
                          <h3 className="text-sm font-medium line-clamp-1">{p.name}</h3>
                          <p className="text-sm font-semibold gold-text mt-0.5">{fmt(p.price)}</p>
                        </div>
                        <button onClick={() => toggle(cart, setCart, id)} className="self-start p-1 text-muted-foreground active:scale-90 transition-transform">
                          <Icon name="X" size={17} />
                        </button>
                      </div>
                    );
                  })}
                </div>

                {/* Payment selector */}
                <div className="glass border border-border rounded-2xl p-4 mb-3">
                  <p className="text-xs text-muted-foreground mb-3">Способ оплаты</p>
                  <div className="space-y-2">
                    {PAYMENT_METHODS.map((pm) => (
                      <button key={pm.id} onClick={() => setActivePayment(pm.id)}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl border transition-all ${activePayment === pm.id ? 'border-primary/50 bg-primary/8' : 'border-border'}`}>
                        <span className="text-lg">{pm.emoji}</span>
                        <div className="flex-1 text-left">
                          <p className="text-sm">{pm.label}</p>
                          <p className="text-[10px] text-muted-foreground">{pm.sub}</p>
                        </div>
                        <div className={`w-4 h-4 rounded-full border-2 transition-all ${activePayment === pm.id ? 'border-primary bg-primary' : 'border-border'}`}>
                          {activePayment === pm.id && <div className="w-full h-full rounded-full bg-white scale-50" />}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Summary */}
                <div className="glass border border-primary/20 rounded-2xl p-4">
                  <div className="flex justify-between text-sm mb-1"><span className="text-muted-foreground">Товаров</span><span>{cart.length} шт.</span></div>
                  <div className="flex justify-between text-sm mb-1"><span className="text-muted-foreground">Доставка</span><span className="text-green-400">Бесплатно</span></div>
                  <div className="flex justify-between text-sm border-t border-border/50 pt-2 mt-2">
                    <span className="text-muted-foreground">Итого</span>
                    <span className="font-bold text-lg gold-text">{fmt(cartTotal)}</span>
                  </div>
                  <button onClick={() => setOrderDone(true)} className="w-full h-13 py-3.5 rounded-2xl gold-gradient text-white font-semibold mt-4 active:scale-[0.98] transition-transform shadow-lg shadow-primary/20">
                    Оформить заказ
                  </button>
                  <button onClick={() => setCart([])} className="w-full h-9 rounded-xl text-xs text-muted-foreground mt-2">Очистить корзину</button>
                </div>
              </>
            )}
          </main>
        )}

        {/* ══════ ПРОФИЛЬ ══════ */}
        {tab === 'profile' && !profileSection && (
          <main className="px-5 pt-4">
            {/* User card */}
            <div className="glass border border-border rounded-3xl p-5 mb-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full gold-gradient flex items-center justify-center shrink-0 shadow-lg shadow-primary/30">
                  <span className="font-display text-2xl text-white font-bold">{userName[0]?.toUpperCase() || 'А'}</span>
                </div>
                <div className="flex-1">
                  <h2 className="font-display text-xl font-bold">{userName}</h2>
                  <p className="text-xs text-muted-foreground">{userPhone || 'Телефон не указан'}</p>
                  <div className="flex items-center gap-1 mt-1">
                    <span className="text-xs px-2 py-0.5 rounded-full bg-primary/15 text-primary font-medium">Premium</span>
                  </div>
                </div>
                <button onClick={() => openProfileSection('settings')} className="w-9 h-9 rounded-full glass border border-border flex items-center justify-center">
                  <Icon name="Settings" size={17} className="text-muted-foreground" />
                </button>
              </div>
              {/* Stats */}
              <div className="grid grid-cols-3 gap-2 mt-4 pt-4 border-t border-border/50">
                {[
                  { label: 'Заказов', val: ORDERS.length },
                  { label: 'Избранное', val: fav.length },
                  { label: 'Корзина', val: cart.length },
                ].map((s) => (
                  <div key={s.label} className="text-center">
                    <p className="text-lg font-bold gold-text">{s.val}</p>
                    <p className="text-[10px] text-muted-foreground">{s.label}</p>
                  </div>
                ))}
              </div>
            </div>

            <button onClick={() => navigateTab('home')} className="w-full h-12 rounded-2xl gold-gradient text-white font-semibold flex items-center justify-center gap-2 mb-4 shadow-lg shadow-primary/20">
              <Icon name="LayoutGrid" size={18} />
              Перейти в каталог
            </button>

            <div className="space-y-2">
              {[
                { id: 'orders', icon: 'Package', label: 'История заказов', sub: `${ORDERS.length} заказа` },
                { id: 'chat', icon: 'MessageCircle', label: 'Чат с поддержкой', sub: '● Онлайн сейчас' },
                { id: 'payment', icon: 'CreditCard', label: 'Способы оплаты', sub: 'Карта, СБП, Mir Pay' },
                { id: 'addresses', icon: 'MapPin', label: 'Адреса доставки', sub: '1 адрес сохранён' },
                { id: 'settings', icon: 'Settings', label: 'Настройки', sub: 'Уведомления, безопасность' },
              ].map((m) => (
                <button key={m.id} onClick={() => openProfileSection(m.id)} className="w-full flex items-center gap-4 glass border border-border rounded-2xl px-4 h-14 active:scale-[0.98] transition-transform">
                  <Icon name={m.icon} size={19} className="text-gold" />
                  <div className="flex-1 text-left">
                    <p className="text-sm">{m.label}</p>
                    <p className="text-[11px] text-muted-foreground">{m.sub}</p>
                  </div>
                  <Icon name="ChevronRight" size={16} className="text-muted-foreground" />
                </button>
              ))}
            </div>
          </main>
        )}

        {/* ИСТОРИЯ ЗАКАЗОВ */}
        {tab === 'profile' && profileSection === 'orders' && (
          <main className="px-5 pt-4">
            <h2 className="font-display text-2xl font-bold mb-5">История заказов</h2>
            <div className="space-y-3">
              {ORDERS.map((o) => (
                <div key={o.id} className="glass border border-border rounded-2xl p-4">
                  <div className="flex gap-3">
                    <img src={o.img} className="w-14 h-14 rounded-xl object-cover shrink-0" alt={o.name} />
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-xs text-muted-foreground">{o.id} · {o.date}</p>
                          <h3 className="text-sm font-medium mt-0.5">{o.name}</h3>
                        </div>
                        <span className={`text-xs px-2 py-0.5 rounded-full shrink-0 ml-2 ${o.status === 'Доставлен' ? 'bg-green-500/15 text-green-400' : 'bg-red-500/15 text-red-400'}`}>{o.status}</span>
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-sm font-semibold gold-text">{fmt(o.price)}</span>
                        {o.status === 'Доставлен' && (
                          <button onClick={() => { const p = PRODUCTS.find(pr => pr.name.includes(o.name.split(' ')[0])); if(p) { setCart(c => c.includes(p.id) ? c : [...c, p.id]); navigateTab('cart'); }}} className="text-xs text-muted-foreground border border-border px-3 py-1 rounded-xl active:scale-95 transition-transform">
                            Повторить
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </main>
        )}

        {/* ЧАТ */}
        {tab === 'profile' && profileSection === 'chat' && (
          <main className="px-5 pt-4 flex flex-col" style={{ height: 'calc(100dvh - 200px)' }}>
            <div className="flex items-center gap-3 mb-4 pb-3 border-b border-border">
              <div className="w-9 h-9 rounded-full gold-gradient flex items-center justify-center shrink-0">
                <Icon name="MessageCircle" size={17} className="text-white" />
              </div>
              <div>
                <h2 className="text-sm font-semibold">Поддержка AURUM</h2>
                <p className="text-[11px] text-green-400">● Онлайн</p>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto space-y-2.5 pb-3 no-scrollbar">
              {chatHistory.map((m, i) => (
                <div key={i} className={`flex ${m.from === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[82%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${m.from === 'user' ? 'gold-gradient text-white' : 'glass border border-border'}`}>
                    {m.text}
                  </div>
                </div>
              ))}
            </div>
            <div className="flex gap-2 pt-2">
              <input value={chatMsg} onChange={(e) => setChatMsg(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && sendChat()}
                placeholder="Ваш вопрос..."
                className="flex-1 glass border border-border rounded-2xl px-4 h-11 text-sm outline-none placeholder:text-muted-foreground focus:border-primary/40 transition-colors" />
              <button onClick={sendChat} disabled={!chatMsg.trim()} className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 transition-all ${chatMsg.trim() ? 'gold-gradient text-white shadow-md shadow-primary/20' : 'bg-secondary text-muted-foreground'}`}>
                <Icon name="Send" size={17} />
              </button>
            </div>
          </main>
        )}

        {/* ОПЛАТА */}
        {tab === 'profile' && profileSection === 'payment' && (
          <main className="px-5 pt-4">
            <h2 className="font-display text-2xl font-bold mb-5">Способы оплаты</h2>

            {/* Card visual */}
            <div className="rounded-3xl gold-gradient p-5 mb-5 relative overflow-hidden shadow-2xl shadow-primary/30">
              <div className="absolute top-0 right-0 w-40 h-40 rounded-full bg-white/5 -translate-y-10 translate-x-10 pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-32 h-32 rounded-full bg-black/10 translate-y-8 -translate-x-8 pointer-events-none" />
              <p className="text-white/60 text-[10px] tracking-[0.3em] uppercase">AURUM Premium</p>
              <p className="text-white font-mono text-lg mt-4 tracking-[0.2em]">•••• •••• •••• 4821</p>
              <div className="flex justify-between mt-5 items-end">
                <div><p className="text-white/50 text-[10px]">Владелец</p><p className="text-white text-sm font-medium">{userName}</p></div>
                <div className="text-right"><p className="text-white/50 text-[10px]">Действует до</p><p className="text-white text-sm font-medium">12/28</p></div>
              </div>
            </div>

            {/* Payment methods */}
            <p className="text-xs text-muted-foreground mb-3">Все способы оплаты</p>
            <div className="space-y-2 mb-4">
              {PAYMENT_METHODS.map((pm) => (
                <button key={pm.id} onClick={() => setActivePayment(pm.id)}
                  className={`w-full flex items-center gap-3 px-4 h-14 rounded-2xl border transition-all ${activePayment === pm.id ? 'border-primary/50 bg-primary/8' : 'glass border-border'}`}>
                  <span className="text-2xl">{pm.emoji}</span>
                  <div className="flex-1 text-left">
                    <p className="text-sm">{pm.label}</p>
                    <p className="text-[11px] text-muted-foreground">{pm.sub}</p>
                  </div>
                  {activePayment === pm.id && <Icon name="Check" size={18} className="text-primary" />}
                </button>
              ))}
            </div>

            <button className="w-full h-12 rounded-2xl glass border border-border text-sm flex items-center justify-center gap-2">
              <Icon name="Plus" size={17} className="text-gold" />
              Добавить карту или счёт
            </button>
          </main>
        )}

        {/* АДРЕСА */}
        {tab === 'profile' && profileSection === 'addresses' && (
          <main className="px-5 pt-4">
            <h2 className="font-display text-2xl font-bold mb-5">Адреса доставки</h2>
            <div className="glass border border-border rounded-2xl p-4 mb-3">
              <div className="flex items-start gap-3">
                <Icon name="MapPin" size={20} className="text-gold mt-0.5 shrink-0" />
                <div className="flex-1">
                  <p className="text-sm font-medium">Домашний адрес</p>
                  <p className="text-xs text-muted-foreground mt-0.5">г. Москва, ул. Тверская, д. 1, кв. 42</p>
                  <p className="text-xs text-muted-foreground">Индекс: 125009</p>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary/15 text-primary">Основной</span>
              </div>
            </div>
            <button className="w-full h-12 rounded-2xl glass border border-border text-sm flex items-center justify-center gap-2">
              <Icon name="Plus" size={17} className="text-gold" />
              Добавить адрес
            </button>
          </main>
        )}

        {/* НАСТРОЙКИ */}
        {tab === 'profile' && profileSection === 'settings' && (
          <main className="px-5 pt-4">
            <h2 className="font-display text-2xl font-bold mb-5">Настройки</h2>
            <div className="space-y-2 mb-4">
              {[
                { label: 'Push-уведомления', sub: 'Заказы, доставка, акции', state: notifOn, set: setNotifOn },
                { label: 'Рассылка о скидках', sub: 'Email и SMS', state: promoOn, set: setPromoOn },
                { label: 'Тёмная тема', sub: 'Текущая тема оформления', state: darkMode, set: setDarkMode },
              ].map((s) => (
                <div key={s.label} className="flex items-center justify-between glass border border-border rounded-2xl px-4 h-14">
                  <div><p className="text-sm">{s.label}</p><p className="text-[11px] text-muted-foreground">{s.sub}</p></div>
                  <button onClick={() => s.set(!s.state)} className={`w-12 h-6 rounded-full transition-all duration-300 relative ${s.state ? 'bg-primary' : 'bg-secondary'}`}>
                    <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all duration-300 ${s.state ? 'left-6' : 'left-0.5'}`} />
                  </button>
                </div>
              ))}
            </div>

            <button onClick={() => setShowAuth(true)} className="w-full h-12 rounded-2xl glass border border-border text-sm flex items-center justify-center gap-2 mb-2">
              <Icon name="Smartphone" size={17} className="text-gold" />
              Изменить номер телефона
            </button>
            <button onClick={logout} className="w-full h-12 rounded-2xl glass border border-primary/30 text-primary text-sm flex items-center justify-center gap-2">
              <Icon name="LogOut" size={17} />
              Выйти из аккаунта
            </button>
          </main>
        )}

      </div>

      {/* ══════ ФИЛЬТРЫ ══════ */}
      {showFilters && (
        <div className="fixed inset-0 z-50 max-w-md mx-auto" onClick={() => setShowFilters(false)}>
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
          <div onClick={(e) => e.stopPropagation()} className="absolute bottom-0 left-0 right-0 bg-card border-t border-primary/20 rounded-t-3xl animate-slide-up overflow-hidden" style={{ maxHeight: '92vh' }}>
            <div className="sticky top-0 bg-card px-5 pt-4 pb-3 border-b border-border z-10">
              <div className="w-12 h-1 bg-border rounded-full mx-auto mb-3" />
              <div className="flex items-center justify-between">
                <h3 className="font-display text-2xl font-bold">Фильтры</h3>
                <button onClick={resetFilters} className="text-xs text-primary px-3 py-1.5 rounded-xl border border-primary/30">Сбросить</button>
              </div>
            </div>
            <div className="overflow-y-auto no-scrollbar pb-6" style={{ maxHeight: 'calc(92vh - 80px)' }}>
              <div className="px-5 pt-4 space-y-5">
                {/* Категория */}
                <div>
                  <p className="text-sm font-semibold mb-2.5">Категория</p>
                  <div className="flex flex-wrap gap-2">
                    {CATEGORIES.map((c) => (
                      <button key={c} onClick={() => setDraftCat(c)} className={`px-3.5 h-8 rounded-full text-xs border transition-all ${draftCat === c ? 'gold-gradient text-white border-transparent' : 'border-border text-muted-foreground'}`}>{c}</button>
                    ))}
                  </div>
                </div>
                {/* Бренд */}
                <div>
                  <p className="text-sm font-semibold mb-2.5">Бренд</p>
                  <div className="flex flex-wrap gap-2">
                    {BRANDS.map((b) => (
                      <button key={b} onClick={() => setDraftBrand(b)} className={`px-3.5 h-8 rounded-full text-xs border transition-all ${draftBrand === b ? 'gold-gradient text-white border-transparent' : 'border-border text-muted-foreground'}`}>{b}</button>
                    ))}
                  </div>
                </div>
                {/* Цена */}
                <div>
                  <div className="flex justify-between text-sm mb-2.5">
                    <p className="font-semibold">Диапазон цен</p>
                    <span className="text-gold text-xs font-medium">{fmt(draftMin)} — {fmt(draftMax)}</span>
                  </div>
                  <div className="space-y-3">
                    <div><p className="text-xs text-muted-foreground mb-1.5">От: {fmt(draftMin)}</p>
                      <input type="range" min={0} max={890000} step={5000} value={draftMin} onChange={(e) => setDraftMin(Math.min(+e.target.value, draftMax - 5000))} className="w-full accent-[hsl(0_78%_53%)]" />
                    </div>
                    <div><p className="text-xs text-muted-foreground mb-1.5">До: {fmt(draftMax)}</p>
                      <input type="range" min={5000} max={900000} step={5000} value={draftMax} onChange={(e) => setDraftMax(Math.max(+e.target.value, draftMin + 5000))} className="w-full accent-[hsl(0_78%_53%)]" />
                    </div>
                  </div>
                  <div className="grid grid-cols-4 gap-1.5 mt-3">
                    {[[0,30000,'до 30к'],[30000,100000,'30–100к'],[100000,300000,'100–300к'],[0,900000,'Любая']].map(([mn,mx,l])=>(
                      <button key={l} onClick={()=>{setDraftMin(mn as number);setDraftMax(mx as number);}} className={`h-8 rounded-xl text-[11px] border transition-all ${draftMin===mn&&draftMax===mx?'gold-gradient text-white border-transparent':'border-border text-muted-foreground'}`}>{l}</button>
                    ))}
                  </div>
                </div>
                {/* Рейтинг */}
                <div>
                  <p className="text-sm font-semibold mb-2.5">Минимальный рейтинг</p>
                  <div className="flex gap-2">
                    {[0,4,4.5,4.8].map((r)=>(
                      <button key={r} onClick={()=>setDraftRating(r)} className={`flex-1 h-10 rounded-xl text-sm border transition-all flex items-center justify-center gap-1 ${draftRating===r?'gold-gradient text-white border-transparent':'border-border text-muted-foreground'}`}>
                        {r>0&&<Icon name="Star" size={10} className="fill-current"/>}
                        {r===0?'Любой':`${r}+`}
                      </button>
                    ))}
                  </div>
                </div>
                {/* Доп */}
                <div>
                  <p className="text-sm font-semibold mb-2.5">Дополнительно</p>
                  <div className="flex gap-2 flex-wrap">
                    <button onClick={()=>setDraftNew(!draftNew)} className={`flex items-center gap-2 px-4 h-10 rounded-xl text-sm border transition-all ${draftNew?'gold-gradient text-white border-transparent':'border-border text-muted-foreground'}`}>
                      <Icon name="Sparkles" size={13}/>Новинки
                    </button>
                    <button onClick={()=>setDraftSale(!draftSale)} className={`flex items-center gap-2 px-4 h-10 rounded-xl text-sm border transition-all ${draftSale?'bg-primary text-white border-transparent':'border-border text-muted-foreground'}`}>
                      <Icon name="Tag" size={13}/>Скидки
                    </button>
                  </div>
                </div>
                <button onClick={applyFilters} className="w-full h-13 py-3.5 rounded-2xl gold-gradient text-white font-semibold shadow-lg shadow-primary/20">
                  Показать {draftFilteredCount} товаров
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* УВЕДОМЛЕНИЯ */}
      {showNotifs && <NotificationsPanel onClose={() => setShowNotifs(false)} />}

      {/* СРАВНЕНИЕ */}
      {showCompare && compare.length > 0 && (
        <ComparePanel ids={compare} onClose={() => setShowCompare(false)} onRemove={(id) => setCompare((p) => p.filter((x) => x !== id))} />
      )}

      {/* ══════ LIQUID GLASS NAVBAR ══════ */}
      <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto z-40">
        <nav className="liquid-glass mx-3 mb-3 rounded-[28px] px-2 py-2">
          <div className="flex justify-around items-center">
            {NAV_TABS.map((n) => {
              const count = n.id === 'cart' ? cart.length : 0;
              const active = tab === n.id;
              return (
                <button key={n.id} onClick={() => navigateTab(n.id)}
                  className="flex flex-col items-center gap-0.5 relative px-3.5 py-1.5 rounded-2xl transition-all duration-300"
                  style={active ? { background: 'rgba(200,30,30,0.18)' } : {}}>
                  <div className="relative">
                    <Icon name={n.icon} size={22}
                      className={`transition-all duration-300 ${active ? 'text-primary scale-110 drop-shadow-[0_0_6px_rgba(200,30,30,0.6)]' : 'text-white/40'}`} />
                    {count > 0 && (
                      <span className="absolute -top-1.5 -right-2 min-w-[16px] h-4 px-1 rounded-full bg-primary text-white text-[9px] flex items-center justify-center font-bold">
                        {count}
                      </span>
                    )}
                  </div>
                  <span className={`text-[10px] font-medium transition-all duration-300 ${active ? 'text-primary' : 'text-white/35'}`}>
                    {n.label}
                  </span>
                </button>
              );
            })}
          </div>
        </nav>
      </div>
    </div>
  );
}

function EmptyState({ icon, text, sub, action }: { icon: string; text: string; sub?: string; action?: { label: string; fn: () => void } }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center mb-4">
        <Icon name={icon} size={26} className="text-muted-foreground" />
      </div>
      <p className="text-foreground font-medium text-sm">{text}</p>
      {sub && <p className="text-muted-foreground text-xs mt-1">{sub}</p>}
      {action && (
        <button onClick={action.fn} className="mt-5 px-5 h-10 rounded-2xl gold-gradient text-white text-sm shadow-md shadow-primary/20">{action.label}</button>
      )}
    </div>
  );
}
