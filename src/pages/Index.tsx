import { useState, useMemo } from 'react';
import Icon from '@/components/ui/icon';

const PRODUCTS = [
  { id: 1, name: 'AURUM Sound One', brand: 'Наушники', price: 38900, oldPrice: 45000, rating: 4.9, reviews: 1243, isNew: true, popularity: 98, category: 'Электроника', img: 'https://cdn.poehali.dev/projects/4852ca01-beec-41f2-84d7-6a385a88588b/files/cf8e2641-8bd8-4e44-87dc-95fa71af8936.jpg' },
  { id: 2, name: 'Chronos Gold', brand: 'Часы', price: 124000, oldPrice: 0, rating: 5.0, reviews: 567, isNew: true, popularity: 95, category: 'Часы', img: 'https://cdn.poehali.dev/projects/4852ca01-beec-41f2-84d7-6a385a88588b/files/6f2b9f6c-8cf4-4adb-9068-d8d1efa6c1ed.jpg' },
  { id: 3, name: 'Emerald Tote', brand: 'Сумка', price: 86500, oldPrice: 99000, rating: 4.8, reviews: 892, isNew: false, popularity: 91, category: 'Аксессуары', img: 'https://cdn.poehali.dev/projects/4852ca01-beec-41f2-84d7-6a385a88588b/files/be2e72d7-e064-4ccf-8ddd-97ca3d6d92a5.jpg' },
  { id: 4, name: 'AURUM Sound Pro', brand: 'Наушники', price: 52400, oldPrice: 0, rating: 4.7, reviews: 432, isNew: false, popularity: 87, category: 'Электроника', img: 'https://cdn.poehali.dev/projects/4852ca01-beec-41f2-84d7-6a385a88588b/files/cf8e2641-8bd8-4e44-87dc-95fa71af8936.jpg' },
  { id: 5, name: 'Chronos Classic', brand: 'Часы', price: 98700, oldPrice: 110000, rating: 4.6, reviews: 321, isNew: false, popularity: 80, category: 'Часы', img: 'https://cdn.poehali.dev/projects/4852ca01-beec-41f2-84d7-6a385a88588b/files/6f2b9f6c-8cf4-4adb-9068-d8d1efa6c1ed.jpg' },
  { id: 6, name: 'Noir Clutch', brand: 'Сумка', price: 64200, oldPrice: 0, rating: 4.9, reviews: 718, isNew: true, popularity: 89, category: 'Аксессуары', img: 'https://cdn.poehali.dev/projects/4852ca01-beec-41f2-84d7-6a385a88588b/files/be2e72d7-e064-4ccf-8ddd-97ca3d6d92a5.jpg' },
];

const CATEGORIES = ['Все', 'Электроника', 'Часы', 'Аксессуары'];
const SORTS = [
  { id: 'popular', label: 'Популярные', icon: 'Flame' },
  { id: 'new', label: 'Новинки', icon: 'Sparkles' },
  { id: 'cheap', label: 'Сначала дешевле', icon: 'ArrowDown' },
  { id: 'expensive', label: 'Сначала дороже', icon: 'ArrowUp' },
  { id: 'rating', label: 'По рейтингу', icon: 'Star' },
];
const NAV = [
  { id: 'home', label: 'Каталог', icon: 'LayoutGrid' },
  { id: 'fav', label: 'Избранное', icon: 'Heart' },
  { id: 'cart', label: 'Корзина', icon: 'ShoppingBag' },
  { id: 'profile', label: 'Профиль', icon: 'User' },
];

const fmt = (n: number) => n.toLocaleString('ru-RU') + ' ₽';

export default function Index() {
  const [tab, setTab] = useState('home');
  const [cat, setCat] = useState('Все');
  const [sort, setSort] = useState('popular');
  const [search, setSearch] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [maxPrice, setMaxPrice] = useState(150000);
  const [minRating, setMinRating] = useState(0);
  const [fav, setFav] = useState<number[]>([]);
  const [cart, setCart] = useState<number[]>([]);

  const toggle = (arr: number[], set: (v: number[]) => void, id: number) =>
    set(arr.includes(id) ? arr.filter((x) => x !== id) : [...arr, id]);

  const filtered = useMemo(() => {
    const list = PRODUCTS.filter((p) =>
      (cat === 'Все' || p.category === cat) &&
      p.price <= maxPrice &&
      p.rating >= minRating &&
      p.name.toLowerCase().includes(search.toLowerCase())
    );
    const sorters: Record<string, (a: typeof PRODUCTS[0], b: typeof PRODUCTS[0]) => number> = {
      popular: (a, b) => b.popularity - a.popularity,
      new: (a, b) => Number(b.isNew) - Number(a.isNew),
      cheap: (a, b) => a.price - b.price,
      expensive: (a, b) => b.price - a.price,
      rating: (a, b) => b.rating - a.rating,
    };
    return [...list].sort(sorters[sort]);
  }, [cat, sort, search, maxPrice, minRating]);

  const cartTotal = cart.reduce((s, id) => s + (PRODUCTS.find((p) => p.id === id)?.price || 0), 0);

  return (
    <div className="min-h-screen bg-background text-foreground pb-28 max-w-md mx-auto relative overflow-hidden">
      <div className="absolute top-0 right-0 w-72 h-72 bg-gold/10 rounded-full blur-[100px] pointer-events-none" />

      <header className="px-6 pt-14 pb-4 relative z-10">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs tracking-[0.3em] text-muted-foreground uppercase">Маркетплейс</p>
            <h1 className="font-display text-4xl font-semibold gold-text leading-none mt-1">AURUM</h1>
          </div>
          <button className="w-11 h-11 rounded-full glass border border-border flex items-center justify-center">
            <Icon name="Bell" size={20} className="text-gold" />
          </button>
        </div>
      </header>

      {tab === 'home' && (
        <main className="relative z-10 animate-fade-in">
          <div className="px-6 flex gap-3 mb-5">
            <div className="flex-1 flex items-center gap-3 glass border border-border rounded-2xl px-4 h-12">
              <Icon name="Search" size={18} className="text-muted-foreground" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Поиск товаров"
                className="bg-transparent outline-none text-sm w-full placeholder:text-muted-foreground"
              />
            </div>
            <button
              onClick={() => setShowFilters(true)}
              className="w-12 h-12 rounded-2xl gold-gradient flex items-center justify-center shrink-0"
            >
              <Icon name="SlidersHorizontal" size={20} className="text-primary-foreground" />
            </button>
          </div>

          <div className="px-6 mb-6">
            <div className="relative rounded-3xl overflow-hidden h-44 border border-gold/20">
              <img src={PRODUCTS[1].img} alt="" className="absolute inset-0 w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-r from-background via-background/70 to-transparent" />
              <div className="relative h-full flex flex-col justify-center px-6">
                <p className="text-xs tracking-widest text-gold uppercase mb-1">Коллекция 2026</p>
                <h2 className="font-display text-3xl font-semibold leading-tight">Эксклюзив<br />для избранных</h2>
                <button className="mt-3 w-fit text-xs font-medium px-4 py-2 rounded-full gold-gradient text-primary-foreground">
                  Смотреть
                </button>
              </div>
            </div>
          </div>

          <div className="flex gap-2 px-6 mb-4 overflow-x-auto no-scrollbar">
            {CATEGORIES.map((c) => (
              <button
                key={c}
                onClick={() => setCat(c)}
                className={`px-5 h-10 rounded-full text-sm whitespace-nowrap transition-all border ${
                  cat === c ? 'gold-gradient text-primary-foreground border-transparent' : 'border-border text-muted-foreground'
                }`}
              >
                {c}
              </button>
            ))}
          </div>

          <div className="flex gap-2 px-6 mb-5 overflow-x-auto no-scrollbar">
            {SORTS.map((s) => (
              <button
                key={s.id}
                onClick={() => setSort(s.id)}
                className={`flex items-center gap-1.5 px-3.5 h-9 rounded-full text-xs whitespace-nowrap transition-all ${
                  sort === s.id ? 'bg-secondary text-gold' : 'text-muted-foreground'
                }`}
              >
                <Icon name={s.icon} size={14} />
                {s.label}
              </button>
            ))}
          </div>

          <div className="px-6 grid grid-cols-2 gap-4">
            {filtered.map((p, i) => (
              <article
                key={p.id}
                className="group animate-scale-in"
                style={{ animationDelay: `${i * 60}ms`, opacity: 0 }}
              >
                <div className="relative rounded-2xl overflow-hidden bg-card border border-border aspect-square">
                  <img src={p.img} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  {p.isNew && (
                    <span className="absolute top-2 left-2 text-[10px] font-medium px-2 py-1 rounded-full gold-gradient text-primary-foreground">
                      NEW
                    </span>
                  )}
                  <button
                    onClick={() => toggle(fav, setFav, p.id)}
                    className="absolute top-2 right-2 w-8 h-8 rounded-full glass flex items-center justify-center"
                  >
                    <Icon name="Heart" size={15} className={fav.includes(p.id) ? 'text-gold fill-gold' : 'text-foreground'} />
                  </button>
                </div>
                <div className="mt-2.5">
                  <p className="text-[11px] text-muted-foreground">{p.brand}</p>
                  <h3 className="text-sm font-medium leading-tight">{p.name}</h3>
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
                      onClick={() => toggle(cart, setCart, p.id)}
                      className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all ${
                        cart.includes(p.id) ? 'bg-secondary text-gold' : 'gold-gradient text-primary-foreground'
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
            <p className="text-center text-muted-foreground mt-12 text-sm">Ничего не найдено</p>
          )}
        </main>
      )}

      {tab === 'fav' && <SimpleList title="Избранное" ids={fav} icon="Heart" empty="Здесь появятся любимые товары" />}

      {tab === 'cart' && (
        <main className="relative z-10 px-6 animate-fade-in">
          <h2 className="font-display text-3xl font-semibold mb-5">Корзина</h2>
          {cart.length === 0 ? (
            <EmptyState icon="ShoppingBag" text="Корзина пуста" />
          ) : (
            <>
              <div className="space-y-3">
                {cart.map((id) => {
                  const p = PRODUCTS.find((x) => x.id === id)!;
                  return (
                    <div key={id} className="flex gap-3 glass border border-border rounded-2xl p-3">
                      <img src={p.img} className="w-16 h-16 rounded-xl object-cover" alt={p.name} />
                      <div className="flex-1">
                        <p className="text-[11px] text-muted-foreground">{p.brand}</p>
                        <h3 className="text-sm font-medium">{p.name}</h3>
                        <p className="text-sm font-semibold gold-text mt-1">{fmt(p.price)}</p>
                      </div>
                      <button onClick={() => toggle(cart, setCart, id)} className="self-start text-muted-foreground">
                        <Icon name="X" size={18} />
                      </button>
                    </div>
                  );
                })}
              </div>
              <div className="glass border border-gold/20 rounded-2xl p-4 mt-5">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-muted-foreground">Итого</span>
                  <span className="font-semibold text-lg gold-text">{fmt(cartTotal)}</span>
                </div>
                <button className="w-full h-12 rounded-2xl gold-gradient text-primary-foreground font-medium mt-3">
                  Оформить заказ
                </button>
              </div>
            </>
          )}
        </main>
      )}

      {tab === 'profile' && (
        <main className="relative z-10 px-6 animate-fade-in">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-20 h-20 rounded-full gold-gradient flex items-center justify-center">
              <span className="font-display text-3xl text-primary-foreground font-semibold">А</span>
            </div>
            <div>
              <h2 className="font-display text-2xl font-semibold">Александр</h2>
              <p className="text-sm text-muted-foreground">Premium участник</p>
            </div>
          </div>
          <div className="space-y-2">
            {[
              { icon: 'Package', label: 'История заказов' },
              { icon: 'Heart', label: 'Избранное' },
              { icon: 'MessageCircle', label: 'Чат с поддержкой' },
              { icon: 'CreditCard', label: 'Способы оплаты' },
              { icon: 'Settings', label: 'Настройки' },
            ].map((m) => (
              <button key={m.label} className="w-full flex items-center gap-4 glass border border-border rounded-2xl px-4 h-14">
                <Icon name={m.icon} size={20} className="text-gold" />
                <span className="text-sm flex-1 text-left">{m.label}</span>
                <Icon name="ChevronRight" size={18} className="text-muted-foreground" />
              </button>
            ))}
          </div>
        </main>
      )}

      {showFilters && (
        <div className="fixed inset-0 z-50 max-w-md mx-auto" onClick={() => setShowFilters(false)}>
          <div className="absolute inset-0 bg-black/60" />
          <div
            onClick={(e) => e.stopPropagation()}
            className="absolute bottom-0 left-0 right-0 bg-card border-t border-gold/20 rounded-t-3xl p-6 animate-slide-up"
          >
            <div className="w-12 h-1 bg-border rounded-full mx-auto mb-5" />
            <h3 className="font-display text-2xl font-semibold mb-5">Фильтры</h3>

            <div className="mb-6">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-muted-foreground">Цена до</span>
                <span className="text-gold font-medium">{fmt(maxPrice)}</span>
              </div>
              <input type="range" min={30000} max={150000} step={5000} value={maxPrice}
                onChange={(e) => setMaxPrice(+e.target.value)}
                className="w-full accent-[hsl(42_60%_60%)]" />
            </div>

            <div className="mb-6">
              <p className="text-sm text-muted-foreground mb-2">Минимальный рейтинг</p>
              <div className="flex gap-2">
                {[0, 4, 4.5, 4.8].map((r) => (
                  <button key={r} onClick={() => setMinRating(r)}
                    className={`flex-1 h-10 rounded-xl text-sm border ${minRating === r ? 'gold-gradient text-primary-foreground border-transparent' : 'border-border text-muted-foreground'}`}>
                    {r === 0 ? 'Любой' : r + '+'}
                  </button>
                ))}
              </div>
            </div>

            <button onClick={() => setShowFilters(false)} className="w-full h-12 rounded-2xl gold-gradient text-primary-foreground font-medium">
              Показать товары
            </button>
          </div>
        </div>
      )}

      <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto z-40 glass border-t border-border px-6 pt-3 pb-8">
        <div className="flex justify-between">
          {NAV.map((n) => {
            const count = n.id === 'cart' ? cart.length : n.id === 'fav' ? fav.length : 0;
            return (
              <button key={n.id} onClick={() => setTab(n.id)} className="flex flex-col items-center gap-1 relative">
                <div className="relative">
                  <Icon name={n.icon} size={24} className={tab === n.id ? 'text-gold' : 'text-muted-foreground'} />
                  {count > 0 && (
                    <span className="absolute -top-1.5 -right-2 min-w-[16px] h-4 px-1 rounded-full gold-gradient text-primary-foreground text-[10px] flex items-center justify-center font-medium">
                      {count}
                    </span>
                  )}
                </div>
                <span className={`text-[10px] ${tab === n.id ? 'text-gold' : 'text-muted-foreground'}`}>{n.label}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}

function EmptyState({ icon, text }: { icon: string; text: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center mb-4">
        <Icon name={icon} size={28} className="text-muted-foreground" />
      </div>
      <p className="text-muted-foreground text-sm">{text}</p>
    </div>
  );
}

function SimpleList({ title, ids, icon, empty }: { title: string; ids: number[]; icon: string; empty: string }) {
  return (
    <main className="relative z-10 px-6 animate-fade-in">
      <h2 className="font-display text-3xl font-semibold mb-5">{title}</h2>
      {ids.length === 0 ? (
        <EmptyState icon={icon} text={empty} />
      ) : (
        <div className="grid grid-cols-2 gap-4">
          {ids.map((id) => {
            const p = PRODUCTS.find((x) => x.id === id)!;
            return (
              <div key={id}>
                <div className="rounded-2xl overflow-hidden border border-border aspect-square">
                  <img src={p.img} className="w-full h-full object-cover" alt={p.name} />
                </div>
                <h3 className="text-sm font-medium mt-2">{p.name}</h3>
                <p className="text-sm font-semibold gold-text">{fmt(p.price)}</p>
              </div>
            );
          })}
        </div>
      )}
    </main>
  );
}
