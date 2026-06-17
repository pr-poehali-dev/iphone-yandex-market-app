import { useParams, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import Icon from '@/components/ui/icon';
import { PRODUCTS, REVIEWS, fmt } from '@/data/products';

export default function Product() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [fav, setFav] = useState(false);
  const [added, setAdded] = useState(false);
  const product = PRODUCTS.find((p) => p.id === Number(id));

  if (!product) {
    return (
      <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center max-w-md mx-auto gap-4">
        <p className="text-muted-foreground">Товар не найден</p>
        <button onClick={() => navigate('/')} className="px-5 h-11 rounded-2xl gold-gradient text-primary-foreground">
          На главную
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground pb-32 max-w-md mx-auto relative overflow-hidden animate-fade-in">
      <div className="absolute top-0 right-0 w-72 h-72 bg-gold/10 rounded-full blur-[100px] pointer-events-none" />

      <header className="fixed top-0 left-0 right-0 max-w-md mx-auto z-40 flex items-center justify-between px-6 pt-12 pb-3">
        <button onClick={() => navigate(-1)} className="w-11 h-11 rounded-full glass border border-border flex items-center justify-center">
          <Icon name="ChevronLeft" size={22} className="text-foreground" />
        </button>
        <button onClick={() => setFav(!fav)} className="w-11 h-11 rounded-full glass border border-border flex items-center justify-center">
          <Icon name="Heart" size={20} className={fav ? 'text-gold fill-gold' : 'text-foreground'} />
        </button>
      </header>

      <div className="relative h-[420px] w-full">
        <img src={product.img} alt={product.name} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
        {product.isNew && (
          <span className="absolute bottom-6 left-6 text-[11px] font-medium px-3 py-1.5 rounded-full gold-gradient text-primary-foreground">
            NEW
          </span>
        )}
      </div>

      <main className="relative z-10 px-6 -mt-6">
        <p className="text-xs tracking-[0.2em] text-muted-foreground uppercase">{product.brand}</p>
        <h1 className="font-display text-4xl font-semibold leading-tight mt-1">{product.name}</h1>

        <div className="flex items-center gap-3 mt-3">
          <div className="flex items-center gap-1">
            <Icon name="Star" size={16} className="text-gold fill-gold" />
            <span className="text-sm font-medium">{product.rating}</span>
          </div>
          <span className="text-sm text-muted-foreground">{product.reviews} отзывов</span>
        </div>

        <div className="flex items-end gap-3 mt-4">
          <span className="font-display text-3xl font-semibold gold-text">{fmt(product.price)}</span>
          {product.oldPrice > 0 && <span className="text-sm text-muted-foreground line-through mb-1">{fmt(product.oldPrice)}</span>}
        </div>

        <p className="text-sm text-muted-foreground leading-relaxed mt-5">{product.description}</p>

        <h2 className="font-display text-2xl font-semibold mt-7 mb-3">Характеристики</h2>
        <div className="grid grid-cols-2 gap-2">
          {product.features.map((f) => (
            <div key={f} className="flex items-center gap-2 glass border border-border rounded-xl px-3 h-12">
              <Icon name="Check" size={16} className="text-gold shrink-0" />
              <span className="text-xs">{f}</span>
            </div>
          ))}
        </div>

        <h2 className="font-display text-2xl font-semibold mt-7 mb-3">Отзывы</h2>
        <div className="space-y-3">
          {REVIEWS.map((r) => (
            <div key={r.name} className="glass border border-border rounded-2xl p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full gold-gradient flex items-center justify-center text-xs text-primary-foreground font-medium">
                    {r.name[0]}
                  </div>
                  <span className="text-sm font-medium">{r.name}</span>
                </div>
                <span className="text-xs text-muted-foreground">{r.date}</span>
              </div>
              <div className="flex gap-0.5 mt-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Icon key={i} name="Star" size={12} className={i < r.rating ? 'text-gold fill-gold' : 'text-muted'} />
                ))}
              </div>
              <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{r.text}</p>
            </div>
          ))}
        </div>
      </main>

      <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto z-40 glass border-t border-border px-6 pt-4 pb-8 flex items-center gap-3">
        <div>
          <p className="text-[11px] text-muted-foreground">Цена</p>
          <p className="font-semibold gold-text">{fmt(product.price)}</p>
        </div>
        <button
          onClick={() => setAdded(!added)}
          className={`flex-1 h-13 py-4 rounded-2xl font-medium flex items-center justify-center gap-2 transition-all ${
            added ? 'bg-secondary text-gold' : 'gold-gradient text-primary-foreground'
          }`}
        >
          <Icon name={added ? 'Check' : 'ShoppingBag'} size={18} />
          {added ? 'В корзине' : 'В корзину'}
        </button>
      </div>
    </div>
  );
}
