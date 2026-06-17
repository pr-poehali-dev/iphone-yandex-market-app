import { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '@/components/ui/icon';
import { PRODUCTS, fmt } from '@/data/products';
import SplashScreen from '@/components/SplashScreen';
import OnboardingScreen from '@/components/OnboardingScreen';
import NotificationsPanel from '@/components/NotificationsPanel';
import ComparePanel from '@/components/ComparePanel';

const CATEGORIES = ['Все', 'Электроника', 'Часы', 'Аксессуары'];
const BRANDS = ['Все бренды', 'AURUM', 'Chronos', 'Noir'];
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

const ORDERS = [
  { id: '#AU-1029', date: '14 июня', status: 'Доставлен', name: 'AURUM Sound One', price: 38900 },
  { id: '#AU-1018', date: '2 июня', status: 'Доставлен', name: 'Chronos Classic', price: 98700 },
];

export default function Index() {
  const navigate = useNavigate();

  // App lifecycle
  const [splash, setSplash] = useState(true);
  const [onboarded, setOnboarded] = useState(() => !!localStorage.getItem('aurum_name'));
  const [userName, setUserName] = useState(() => localStorage.getItem('aurum_name') || '');

  // Navigation state with history stack
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
  const [maxPrice, setMaxPrice] = useState(150000);
  const [minRating, setMinRating] = useState(0);
  const [onlyNew, setOnlyNew] = useState(false);
  const [onlySale, setOnlySale] = useState(false);
  const [brand, setBrand] = useState('Все бренды');
  // Draft filters
  const [draftMin, setDraftMin] = useState(0);
  const [draftMax, setDraftMax] = useState(150000);
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
  const [notifOn, setNotifOn] = useState(true);
  const [promoOn, setPromoOn] = useState(false);
  const [chatMsg, setChatMsg] = useState('');
  const [chatHistory, setChatHistory] = useState<{ from: 'user' | 'support'; text: string }[]>([
    { from: 'support', text: 'Здравствуйте! Чем могу помочь?' },
  ]);

  // Swipe handling
  const swipeRef = useRef<HTMLDivElement>(null);
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
    setTimeout(() => setAnimDir(null), 400);
  }, [tab]);

  const goBack = useCallback(() => {
    // If in profile sub-section
    if (profileSection && profileHistory.length > 0) {
      const prev = profileHistory[profileHistory.length - 1];
      setProfileHistory((h) => h.slice(0, -1));
      setProfileSection(prev === '__root__' ? null : prev);
      return;
    }
    if (profileSection) {
      setProfileSection(null);
      return;
    }
    // Navigate back through tab history
    if (tabHistory.length > 1) {
      const newHistory = tabHistory.slice(0, -1);
      const prevTab = newHistory[newHistory.length - 1];
      const curIdx = TAB_ORDER.indexOf(tab);
      const prevIdx = TAB_ORDER.indexOf(prevTab);
      setAnimDir(prevIdx > curIdx ? 'left' : 'right');
      setTabHistory(newHistory);
      setTab(prevTab);
      setTimeout(() => setAnimDir(null), 400);
    }
  }, [profileSection, profileHistory, tabHistory, tab]);

  const openProfileSection = (section: string) => {
    setProfileHistory((h) => [...h, profileSection === null ? '__root__' : profileSection]);
    setProfileSection(section);
  };

  // Swipe gesture
  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    const dy = Math.abs(e.changedTouches[0].clientY - touchStartY.current);
    if (Math.abs(dx) < 50 || dy > 60) return;

    if (dx > 0) {
      // Swipe right — go back or prev tab
      if (profileSection) { goBack(); return; }
      const curIdx = TAB_ORDER.indexOf(tab);
      if (curIdx > 0) navigateTab(TAB_ORDER[curIdx - 1]);
    } else {
      // Swipe left — next tab
      if (profileSection) return;
      const curIdx = TAB_ORDER.indexOf(tab);
      if (curIdx < TAB_ORDER.length - 1) navigateTab(TAB_ORDER[curIdx + 1]);
    }
  };

  // Keyboard back (browser)
  useEffect(() => {
    const handler = (e: PopStateEvent) => { goBack(); };
    window.addEventListener('popstate', handler);
    return () => window.removeEventListener('popstate', handler);
  }, [goBack]);

  const toggle = (arr: number[], set: (v: number[]) => void, id: number) =>
    set(arr.includes(id) ? arr.filter((x) => x !== id) : [...arr, id]);

  const toggleCompare = (id: number) => {
    setCompare((prev) => {
      if (prev.includes(id)) return prev.filter((x) => x !== id);
      if (prev.length >= 3) return prev; // max 3
      const next = [...prev, id];
      if (next.length >= 2) setShowCompare(true);
      return next;
    });
  };

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
    setDraftMin(0); setDraftMax(150000); setDraftRating(0);
    setDraftNew(false); setDraftSale(false);
    setDraftBrand('Все бренды'); setDraftCat('Все');
  };

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
    const msg = chatMsg.trim();
    setChatMsg('');
    setChatHistory((h) => [...h, { from: 'user', text: msg }]);
    setTimeout(() => {
      setChatHistory((h) => [...h, { from: 'support', text: `Получили ваш запрос: «${msg}». Отвечаем в течение 5 минут.` }]);
    }, 900);
  };

  // Splash / Onboarding guard
  if (splash) return <SplashScreen onDone={() => setSplash(false)} />;
  if (!onboarded) return (
    <OnboardingScreen onDone={(name) => {
      localStorage.setItem('aurum_name', name);
      setUserName(name);
      setOnboarded(true);
    }} />
  );

  const canGoBack = tabHistory.length > 1 || !!profileSection;
  const animClass = animDir === 'left' ? 'animate-slide-in-left' : animDir === 'right' ? 'animate-slide-in-right' : 'animate-fade-in';

  return (
    <div
      ref={swipeRef}
      className="min-h-screen bg-background text-foreground pb-28 max-w-md mx-auto relative overflow-hidden swipe-container"
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      <div className="absolute top-0 right-0 w-80 h-80 bg-primary/8 rounded-full blur-[120px] pointer-events-none" />

      {/* HEADER */}
      <header className="px-5 pt-14 pb-3 relative z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {canGoBack && (
              <button
                onClick={goBack}
                className="w-9 h-9 rounded-full glass border border-border flex items-center justify-center animate-scale-in"
              >
                <Icon name="ChevronLeft" size={20} />
              </button>
            )}
            <div>
              {!canGoBack && <p className="text-xs tracking-[0.3em] text-muted-foreground uppercase">Маркетплейс</p>}
              <h1 className="font-display text-4xl font-semibold gold-text leading-none">AURUM</h1>
            </div>
          </div>
          <div className="flex gap-2">
            {compare.length > 0 && (
              <button
                onClick={() => setShowCompare(true)}
                className="h-9 px-3 rounded-full glass border border-primary/40 text-xs text-primary flex items-center gap-1 animate-scale-in"
              >
                <Icon name="BarChart2" size={14} />
                Сравнить ({compare.length})
              </button>
            )}
            <button
              onClick={() => setShowNotifs(true)}
              className="w-10 h-10 rounded-full glass border border-border flex items-center justify-center relative"
            >
              <Icon name="Bell" size={19} className="text-gold" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-primary animate-pulse" />
            </button>
          </div>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <div key={tab + (profileSection || '')} className={animClass}>

        {/* ═══ КАТАЛОГ ═══ */}
        {tab === 'home' && (
          <main className="relative z-10">
            {/* Search */}
            <div className="px-5 flex gap-2.5 mb-5">
              <div className="flex-1 flex items-center gap-3 glass border border-border rounded-2xl px-4 h-12">
                <Icon name="Search" size={17} className="text-muted-foreground" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Поиск товаров"
                  className="bg-transparent outline-none text-sm w-full placeholder:text-muted-foreground"
                />
                {search && (
                  <button onClick={() => setSearch('')}><Icon name="X" size={15} className="text-muted-foreground" /></button>
                )}
              </div>
              <button
                onClick={openFilters}
                className="relative w-12 h-12 rounded-2xl gold-gradient flex items-center justify-center shrink-0"
              >
                <Icon name="SlidersHorizontal" size={19} className="text-white" />
                {activeFilterCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-white text-background text-[10px] font-bold flex items-center justify-center">
                    {activeFilterCount}
                  </span>
                )}
              </button>
            </div>

            {/* Hero */}
            <div className="px-5 mb-5">
              <div
                onClick={() => navigate('/product/2')}
                className="relative rounded-3xl overflow-hidden h-44 border border-primary/20 cursor-pointer"
              >
                <img src={PRODUCTS[1].img} alt="" className="absolute inset-0 w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-r from-background via-background/65 to-transparent" />
                <div className="relative h-full flex flex-col justify-center px-5">
                  <p className="text-[10px] tracking-widest text-gold uppercase mb-1">Коллекция 2026</p>
                  <h2 className="font-display text-3xl font-semibold leading-tight">Эксклюзив<br />для избранных</h2>
                  <span className="mt-3 w-fit text-xs font-medium px-4 py-1.5 rounded-full gold-gradient text-white inline-flex items-center gap-1">
                    Смотреть <Icon name="ArrowRight" size={12} />
                  </span>
                </div>
              </div>
            </div>

            {/* Sort */}
            <div className="flex gap-2 px-5 mb-4 overflow-x-auto no-scrollbar">
              {SORTS.map((s) => (
                <button
                  key={s.id}
                  onClick={() => setSort(s.id)}
                  className={`flex items-center gap-1.5 px-3.5 h-9 rounded-full text-xs whitespace-nowrap transition-all border ${
                    sort === s.id ? 'bg-secondary text-gold border-primary/30' : 'text-muted-foreground border-transparent'
                  }`}
                >
                  <Icon name={s.icon} size={12} />
                  {s.label}
                </button>
              ))}
            </div>

            {/* Count + Reset */}
            <div className="px-5 mb-3 flex items-center justify-between">
              <span className="text-xs text-muted-foreground">
                {filtered.length} товаров
              </span>
              {activeFilterCount > 0 && (
                <button
                  onClick={() => { setMinPrice(0); setMaxPrice(150000); setMinRating(0); setOnlyNew(false); setOnlySale(false); setBrand('Все бренды'); setCat('Все'); }}
                  className="text-xs text-primary flex items-center gap-1"
                >
                  <Icon name="X" size={11} />
                  Сбросить фильтры
                </button>
              )}
            </div>

            {/* Grid */}
            <div className="px-5 grid grid-cols-2 gap-3.5">
              {filtered.map((p, i) => (
                <article
                  key={p.id}
                  className="group animate-scale-in"
                  style={{ animationDelay: `${i * 45}ms`, opacity: 0 }}
                >
                  <div
                    onClick={() => navigate(`/product/${p.id}`)}
                    className="relative rounded-2xl overflow-hidden bg-card border border-border aspect-square cursor-pointer"
                  >
                    <img src={p.img} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute top-2 left-2 flex flex-col gap-1">
                      {p.isNew && <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full gold-gradient text-white">NEW</span>}
                      {p.oldPrice > 0 && <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-primary text-white">-{Math.round((1 - p.price / p.oldPrice) * 100)}%</span>}
                    </div>
                    <div className="absolute top-2 right-2 flex flex-col gap-1.5">
                      <button
                        onClick={(e) => { e.stopPropagation(); toggle(fav, setFav, p.id); }}
                        className="w-8 h-8 rounded-full glass flex items-center justify-center"
                      >
                        <Icon name="Heart" size={14} className={fav.includes(p.id) ? 'text-primary fill-primary' : 'text-foreground'} />
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); toggleCompare(p.id); }}
                        className={`w-8 h-8 rounded-full glass flex items-center justify-center transition-colors ${compare.includes(p.id) ? 'bg-primary/30 border border-primary/50' : ''}`}
                      >
                        <Icon name="BarChart2" size={13} className={compare.includes(p.id) ? 'text-primary' : 'text-foreground'} />
                      </button>
                    </div>
                  </div>
                  <div className="mt-2">
                    <p className="text-[10px] text-muted-foreground">{p.brand}</p>
                    <h3 onClick={() => navigate(`/product/${p.id}`)} className="text-sm font-medium leading-tight cursor-pointer line-clamp-1">{p.name}</h3>
                    <div className="flex items-center gap-1 mt-0.5">
                      <Icon name="Star" size={11} className="text-gold fill-gold" />
                      <span className="text-[11px] text-muted-foreground">{p.rating} · {p.reviews}</span>
                    </div>
                    <div className="flex items-center justify-between mt-1.5">
                      <div>
                        <p className="text-sm font-semibold gold-text">{fmt(p.price)}</p>
                        {p.oldPrice > 0 && <p className="text-[10px] text-muted-foreground line-through">{fmt(p.oldPrice)}</p>}
                      </div>
                      <button
                        onClick={(e) => { e.stopPropagation(); toggle(cart, setCart, p.id); }}
                        className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all active:scale-90 ${
                          cart.includes(p.id) ? 'bg-secondary border border-primary/30 text-gold' : 'gold-gradient text-white'
                        }`}
                      >
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
                <p className="text-muted-foreground text-sm">Ничего не найдено</p>
                <button onClick={() => { setMinPrice(0); setMaxPrice(150000); setMinRating(0); setOnlyNew(false); setOnlySale(false); setBrand('Все бренды'); setCat('Все'); setSearch(''); }} className="mt-3 text-xs text-primary">Сбросить всё</button>
              </div>
            )}
            <div className="h-4" />
          </main>
        )}

        {/* ═══ ИЗБРАННОЕ ═══ */}
        {tab === 'fav' && (
          <main className="relative z-10 px-5">
            <h2 className="font-display text-3xl font-semibold mb-5">Избранное</h2>
            {fav.length === 0 ? (
              <EmptyState icon="Heart" text="Список пуст" sub="Нажмите ♥ на карточке товара" action={{ label: 'Перейти в каталог', fn: () => navigateTab('home') }} />
            ) : (
              <div className="grid grid-cols-2 gap-3.5">
                {fav.map((id) => {
                  const p = PRODUCTS.find((x) => x.id === id)!;
                  return (
                    <div key={id}>
                      <div onClick={() => navigate(`/product/${id}`)} className="rounded-2xl overflow-hidden border border-border aspect-square cursor-pointer relative">
                        <img src={p.img} className="w-full h-full object-cover" alt={p.name} />
                        <button onClick={(e) => { e.stopPropagation(); toggle(fav, setFav, id); }} className="absolute top-2 right-2 w-8 h-8 rounded-full glass flex items-center justify-center">
                          <Icon name="Heart" size={14} className="text-primary fill-primary" />
                        </button>
                      </div>
                      <h3 className="text-sm font-medium mt-2 line-clamp-1">{p.name}</h3>
                      <div className="flex items-center justify-between mt-1">
                        <p className="text-sm font-semibold gold-text">{fmt(p.price)}</p>
                        <button onClick={() => toggle(cart, setCart, id)} className={`text-xs px-2 py-1 rounded-lg ${cart.includes(id) ? 'bg-secondary text-gold' : 'gold-gradient text-white'}`}>
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

        {/* ═══ КОРЗИНА ═══ */}
        {tab === 'cart' && (
          <main className="relative z-10 px-5">
            <h2 className="font-display text-3xl font-semibold mb-5">Корзина</h2>
            {orderDone ? (
              <div className="flex flex-col items-center py-20 text-center animate-scale-in">
                <div className="w-20 h-20 rounded-full gold-gradient flex items-center justify-center mb-4">
                  <Icon name="Check" size={36} className="text-white" />
                </div>
                <h3 className="font-display text-2xl font-semibold mb-2">Заказ оформлен!</h3>
                <p className="text-sm text-muted-foreground mb-6">Свяжемся с вами в течение 15 минут</p>
                <button onClick={() => { setOrderDone(false); setCart([]); navigateTab('home'); }} className="px-6 h-12 rounded-2xl gold-gradient text-white font-medium">
                  Продолжить покупки
                </button>
              </div>
            ) : cart.length === 0 ? (
              <EmptyState icon="ShoppingBag" text="Корзина пуста" sub="Добавьте товары из каталога" action={{ label: 'Перейти в каталог', fn: () => navigateTab('home') }} />
            ) : (
              <>
                <div className="space-y-2.5">
                  {cart.map((id) => {
                    const p = PRODUCTS.find((x) => x.id === id)!;
                    return (
                      <div key={id} className="flex gap-3 glass border border-border rounded-2xl p-3">
                        <img onClick={() => navigate(`/product/${id}`)} src={p.img} className="w-16 h-16 rounded-xl object-cover cursor-pointer shrink-0" alt={p.name} />
                        <div className="flex-1 min-w-0">
                          <p className="text-[10px] text-muted-foreground">{p.brand}</p>
                          <h3 className="text-sm font-medium line-clamp-1">{p.name}</h3>
                          <p className="text-sm font-semibold gold-text mt-1">{fmt(p.price)}</p>
                        </div>
                        <button onClick={() => toggle(cart, setCart, id)} className="self-start p-1 text-muted-foreground active:scale-90 transition-transform">
                          <Icon name="X" size={17} />
                        </button>
                      </div>
                    );
                  })}
                </div>
                <div className="glass border border-primary/20 rounded-2xl p-4 mt-4">
                  <div className="flex justify-between text-sm"><span className="text-muted-foreground">Товаров</span><span>{cart.length} шт.</span></div>
                  <div className="flex justify-between text-sm mt-1"><span className="text-muted-foreground">Итого</span><span className="font-semibold text-lg gold-text">{fmt(cartTotal)}</span></div>
                  <button onClick={() => setOrderDone(true)} className="w-full h-12 rounded-2xl gold-gradient text-white font-medium mt-4 active:scale-[0.98] transition-transform">
                    Оформить заказ
                  </button>
                  <button onClick={() => setCart([])} className="w-full h-10 rounded-2xl text-xs text-muted-foreground mt-1.5">Очистить корзину</button>
                </div>
              </>
            )}
          </main>
        )}

        {/* ═══ ПРОФИЛЬ ═══ */}
        {tab === 'profile' && !profileSection && (
          <main className="relative z-10 px-5">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-20 h-20 rounded-full gold-gradient flex items-center justify-center shrink-0 shadow-lg shadow-primary/30">
                <span className="font-display text-3xl text-white font-semibold">{userName[0]?.toUpperCase() || 'А'}</span>
              </div>
              <div>
                <h2 className="font-display text-2xl font-semibold">{userName}</h2>
                <p className="text-sm text-muted-foreground">Premium участник</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs text-muted-foreground">♥ {fav.length}</span>
                  <span className="text-xs text-muted-foreground">·</span>
                  <span className="text-xs text-muted-foreground">🛍 {cart.length}</span>
                </div>
              </div>
            </div>

            <button onClick={() => navigateTab('home')} className="w-full h-14 rounded-2xl gold-gradient text-white font-medium flex items-center justify-center gap-2 mb-4 shadow-lg shadow-primary/20">
              <Icon name="LayoutGrid" size={19} />
              Перейти в каталог
            </button>

            <div className="space-y-2">
              {[
                { id: 'orders', icon: 'Package', label: 'История заказов', sub: `${ORDERS.length} заказа` },
                { id: 'chat', icon: 'MessageCircle', label: 'Чат с поддержкой', sub: '● Онлайн' },
                { id: 'payment', icon: 'CreditCard', label: 'Способы оплаты', sub: '•••• 4821' },
                { id: 'settings', icon: 'Settings', label: 'Настройки', sub: 'Уведомления, язык' },
              ].map((m) => (
                <button key={m.id} onClick={() => openProfileSection(m.id)} className="w-full flex items-center gap-4 glass border border-border rounded-2xl px-4 h-14 active:scale-[0.98] transition-transform">
                  <Icon name={m.icon} size={20} className="text-gold" />
                  <div className="flex-1 text-left">
                    <p className="text-sm">{m.label}</p>
                    <p className="text-[11px] text-muted-foreground">{m.sub}</p>
                  </div>
                  <Icon name="ChevronRight" size={17} className="text-muted-foreground" />
                </button>
              ))}
            </div>
          </main>
        )}

        {/* ИСТОРИЯ ЗАКАЗОВ */}
        {tab === 'profile' && profileSection === 'orders' && (
          <main className="relative z-10 px-5">
            <h2 className="font-display text-2xl font-semibold mb-5">История заказов</h2>
            <div className="space-y-3">
              {ORDERS.map((o) => (
                <div key={o.id} className="glass border border-border rounded-2xl p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-xs text-muted-foreground">{o.id} · {o.date}</p>
                      <h3 className="text-sm font-medium mt-0.5">{o.name}</h3>
                    </div>
                    <span className="text-xs px-2 py-1 rounded-full bg-green-500/15 text-green-400">{o.status}</span>
                  </div>
                  <div className="flex items-center justify-between mt-3">
                    <span className="text-sm font-semibold gold-text">{fmt(o.price)}</span>
                    <button onClick={() => { setCart((c) => { const pid = PRODUCTS.find(p => p.name === o.name)?.id; return pid && !c.includes(pid) ? [...c, pid] : c; }); navigateTab('cart'); }} className="text-xs text-muted-foreground border border-border px-3 py-1.5 rounded-xl">
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
          <main className="relative z-10 px-5 flex flex-col" style={{ height: 'calc(100dvh - 160px)' }}>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 rounded-full gold-gradient flex items-center justify-center">
                <Icon name="MessageCircle" size={17} className="text-white" />
              </div>
              <div>
                <h2 className="text-base font-semibold">Поддержка AURUM</h2>
                <p className="text-[11px] text-green-400">● Онлайн</p>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto space-y-3 pb-3 no-scrollbar">
              {chatHistory.map((m, i) => (
                <div key={i} className={`flex ${m.from === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${m.from === 'user' ? 'gold-gradient text-white' : 'glass border border-border'}`}>
                    {m.text}
                  </div>
                </div>
              ))}
            </div>
            <div className="flex gap-2 pt-2">
              <input value={chatMsg} onChange={(e) => setChatMsg(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && sendChat()}
                placeholder="Сообщение..." className="flex-1 glass border border-border rounded-2xl px-4 h-11 text-sm outline-none placeholder:text-muted-foreground" />
              <button onClick={sendChat} className="w-11 h-11 rounded-2xl gold-gradient flex items-center justify-center shrink-0">
                <Icon name="Send" size={17} className="text-white" />
              </button>
            </div>
          </main>
        )}

        {/* ОПЛАТА */}
        {tab === 'profile' && profileSection === 'payment' && (
          <main className="relative z-10 px-5">
            <h2 className="font-display text-2xl font-semibold mb-5">Способы оплаты</h2>
            <div className="rounded-3xl gold-gradient p-5 mb-4 relative overflow-hidden shadow-xl shadow-primary/20">
              <div className="absolute top-2 right-3 opacity-15 font-display text-5xl font-bold pointer-events-none">AURUM</div>
              <p className="text-white/60 text-[10px] tracking-widest">PREMIUM CARD</p>
              <p className="text-white font-mono text-lg mt-3 tracking-widest">•••• •••• •••• 4821</p>
              <div className="flex justify-between mt-4">
                <div><p className="text-white/50 text-[10px]">Владелец</p><p className="text-white text-sm">{userName}</p></div>
                <div><p className="text-white/50 text-[10px]">Действует до</p><p className="text-white text-sm">12/28</p></div>
              </div>
            </div>
            <button className="w-full h-12 rounded-2xl glass border border-border text-sm flex items-center justify-center gap-2">
              <Icon name="Plus" size={17} className="text-gold" />
              Добавить карту
            </button>
          </main>
        )}

        {/* НАСТРОЙКИ */}
        {tab === 'profile' && profileSection === 'settings' && (
          <main className="relative z-10 px-5">
            <h2 className="font-display text-2xl font-semibold mb-5">Настройки</h2>
            <div className="space-y-2">
              {[
                { label: 'Push-уведомления', sub: 'Заказы и статусы', state: notifOn, set: setNotifOn },
                { label: 'Акции и скидки', sub: 'Email-рассылка', state: promoOn, set: setPromoOn },
              ].map((s) => (
                <div key={s.label} className="flex items-center justify-between glass border border-border rounded-2xl px-4 h-14">
                  <div><p className="text-sm">{s.label}</p><p className="text-[11px] text-muted-foreground">{s.sub}</p></div>
                  <button onClick={() => s.set(!s.state)} className={`w-12 h-6 rounded-full transition-all relative ${s.state ? 'bg-primary' : 'bg-secondary'}`}>
                    <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all duration-300 ${s.state ? 'left-6' : 'left-0.5'}`} />
                  </button>
                </div>
              ))}
              <button
                onClick={() => { localStorage.removeItem('aurum_name'); setOnboarded(false); setUserName(''); }}
                className="w-full h-12 rounded-2xl glass border border-primary/30 text-primary text-sm mt-2"
              >
                Выйти из аккаунта
              </button>
            </div>
          </main>
        )}

      </div>

      {/* ═══ ФИЛЬТРЫ ═══ */}
      {showFilters && (
        <div className="fixed inset-0 z-50 max-w-md mx-auto" onClick={() => setShowFilters(false)}>
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
          <div onClick={(e) => e.stopPropagation()} className="absolute bottom-0 left-0 right-0 bg-card border-t border-primary/20 rounded-t-3xl animate-slide-up overflow-y-auto no-scrollbar" style={{ maxHeight: '90vh' }}>
            <div className="sticky top-0 bg-card px-5 pt-4 pb-3 border-b border-border z-10">
              <div className="w-12 h-1 bg-border rounded-full mx-auto mb-3" />
              <div className="flex items-center justify-between">
                <h3 className="font-display text-2xl font-semibold">Фильтры</h3>
                <button onClick={resetFilters} className="text-xs text-primary px-3 py-1.5 rounded-xl border border-primary/30">Сбросить</button>
              </div>
            </div>
            <div className="px-5 pb-6 space-y-5 pt-4">
              {/* Категория */}
              <div>
                <p className="text-sm font-medium mb-2.5">Категория</p>
                <div className="flex flex-wrap gap-2">
                  {CATEGORIES.map((c) => (
                    <button key={c} onClick={() => setDraftCat(c)} className={`px-4 h-9 rounded-full text-sm border transition-all ${draftCat === c ? 'gold-gradient text-white border-transparent' : 'border-border text-muted-foreground'}`}>{c}</button>
                  ))}
                </div>
              </div>
              {/* Бренд */}
              <div>
                <p className="text-sm font-medium mb-2.5">Бренд</p>
                <div className="flex flex-wrap gap-2">
                  {BRANDS.map((b) => (
                    <button key={b} onClick={() => setDraftBrand(b)} className={`px-4 h-9 rounded-full text-sm border transition-all ${draftBrand === b ? 'gold-gradient text-white border-transparent' : 'border-border text-muted-foreground'}`}>{b}</button>
                  ))}
                </div>
              </div>
              {/* Цена */}
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <p className="font-medium">Диапазон цен</p>
                  <span className="text-gold text-xs font-medium">{fmt(draftMin)} — {fmt(draftMax)}</span>
                </div>
                <div className="space-y-3">
                  <div><p className="text-xs text-muted-foreground mb-1.5">От {fmt(draftMin)}</p>
                    <input type="range" min={0} max={145000} step={5000} value={draftMin} onChange={(e) => setDraftMin(Math.min(+e.target.value, draftMax - 5000))} className="w-full accent-[hsl(0_78%_53%)]" />
                  </div>
                  <div><p className="text-xs text-muted-foreground mb-1.5">До {fmt(draftMax)}</p>
                    <input type="range" min={5000} max={150000} step={5000} value={draftMax} onChange={(e) => setDraftMax(Math.max(+e.target.value, draftMin + 5000))} className="w-full accent-[hsl(0_78%_53%)]" />
                  </div>
                </div>
                <div className="grid grid-cols-4 gap-1.5 mt-3">
                  {[[0, 50000, 'до 50к'], [50000, 100000, '50–100к'], [100000, 130000, '100–130к'], [0, 150000, 'Любая']].map(([mn, mx, l]) => (
                    <button key={l} onClick={() => { setDraftMin(mn as number); setDraftMax(mx as number); }} className={`h-9 rounded-xl text-xs border transition-all ${draftMin === mn && draftMax === mx ? 'gold-gradient text-white border-transparent' : 'border-border text-muted-foreground'}`}>{l}</button>
                  ))}
                </div>
              </div>
              {/* Рейтинг */}
              <div>
                <p className="text-sm font-medium mb-2.5">Рейтинг</p>
                <div className="flex gap-2">
                  {[0, 4, 4.5, 4.8].map((r) => (
                    <button key={r} onClick={() => setDraftRating(r)} className={`flex-1 h-10 rounded-xl text-sm border transition-all flex items-center justify-center gap-1 ${draftRating === r ? 'gold-gradient text-white border-transparent' : 'border-border text-muted-foreground'}`}>
                      {r > 0 && <Icon name="Star" size={10} className="fill-current" />}
                      {r === 0 ? 'Любой' : `${r}+`}
                    </button>
                  ))}
                </div>
              </div>
              {/* Теги */}
              <div>
                <p className="text-sm font-medium mb-2.5">Дополнительно</p>
                <div className="flex gap-2">
                  <button onClick={() => setDraftNew(!draftNew)} className={`flex items-center gap-2 px-4 h-10 rounded-xl text-sm border transition-all ${draftNew ? 'gold-gradient text-white border-transparent' : 'border-border text-muted-foreground'}`}>
                    <Icon name="Sparkles" size={13} />Новинки
                  </button>
                  <button onClick={() => setDraftSale(!draftSale)} className={`flex items-center gap-2 px-4 h-10 rounded-xl text-sm border transition-all ${draftSale ? 'bg-primary text-white border-transparent' : 'border-border text-muted-foreground'}`}>
                    <Icon name="Tag" size={13} />Скидки
                  </button>
                </div>
              </div>
              <button onClick={applyFilters} className="w-full h-13 py-3.5 rounded-2xl gold-gradient text-white font-medium">
                Показать товары ({PRODUCTS.filter((p) => {
                  const bm = draftBrand === 'Все бренды' || p.name.toLowerCase().includes(draftBrand.toLowerCase());
                  return (draftCat === 'Все' || p.category === draftCat) && p.price >= draftMin && p.price <= draftMax && p.rating >= draftRating && (!draftNew || p.isNew) && (!draftSale || p.oldPrice > 0) && bm;
                }).length})
              </button>
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

      {/* ═══ LIQUID GLASS NAVBAR ═══ */}
      <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto z-40 px-4 pb-7 pt-1">
        <div className="liquid-glass rounded-[30px] px-3 py-2.5">
          <div className="flex justify-around items-center">
            {NAV_TABS.map((n) => {
              const count = n.id === 'cart' ? cart.length : n.id === 'fav' ? fav.length : 0;
              const active = tab === n.id;
              return (
                <button
                  key={n.id}
                  onClick={() => navigateTab(n.id)}
                  className="flex flex-col items-center gap-0.5 relative px-3 py-1 transition-all duration-300"
                >
                  {/* Active pill */}
                  {active && (
                    <span className="absolute inset-0 rounded-2xl bg-primary/15 backdrop-blur-sm border border-primary/20 transition-all duration-300" />
                  )}
                  <div className="relative">
                    <Icon
                      name={n.icon}
                      size={22}
                      className={`relative z-10 transition-all duration-300 ${active ? 'text-primary scale-110' : 'text-white/45'}`}
                    />
                    {count > 0 && (
                      <span className={`absolute -top-1.5 -right-2 min-w-[16px] h-4 px-1 rounded-full bg-primary text-white text-[9px] flex items-center justify-center font-bold z-20 ${active ? '' : 'animate-nav-dot'}`}>
                        {count}
                      </span>
                    )}
                  </div>
                  <span className={`text-[10px] relative z-10 font-medium transition-all duration-300 ${active ? 'text-primary' : 'text-white/35'}`}>
                    {n.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </nav>
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
        <button onClick={action.fn} className="mt-5 px-5 h-10 rounded-2xl gold-gradient text-white text-sm">{action.label}</button>
      )}
    </div>
  );
}
