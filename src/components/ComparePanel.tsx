import Icon from '@/components/ui/icon';
import { PRODUCTS, fmt } from '@/data/products';

interface Props {
  ids: number[];
  onClose: () => void;
  onRemove: (id: number) => void;
}

const COMPARE_ROWS = [
  { key: 'price', label: 'Цена', render: (p: typeof PRODUCTS[0]) => fmt(p.price) },
  { key: 'rating', label: 'Рейтинг', render: (p: typeof PRODUCTS[0]) => `★ ${p.rating} (${p.reviews})` },
  { key: 'category', label: 'Категория', render: (p: typeof PRODUCTS[0]) => p.category },
  { key: 'f0', label: 'Характеристика 1', render: (p: typeof PRODUCTS[0]) => p.features[0] || '—' },
  { key: 'f1', label: 'Характеристика 2', render: (p: typeof PRODUCTS[0]) => p.features[1] || '—' },
  { key: 'f2', label: 'Характеристика 3', render: (p: typeof PRODUCTS[0]) => p.features[2] || '—' },
  { key: 'f3', label: 'Характеристика 4', render: (p: typeof PRODUCTS[0]) => p.features[3] || '—' },
  { key: 'isNew', label: 'Новинка', render: (p: typeof PRODUCTS[0]) => p.isNew ? '✓ Да' : '—' },
  { key: 'sale', label: 'Скидка', render: (p: typeof PRODUCTS[0]) => p.oldPrice > 0 ? `-${Math.round((1 - p.price / p.oldPrice) * 100)}%` : '—' },
];

export default function ComparePanel({ ids, onClose, onRemove }: Props) {
  const products = ids.map((id) => PRODUCTS.find((p) => p.id === id)!).filter(Boolean);

  if (products.length === 0) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 max-w-md mx-auto flex flex-col" onClick={onClose}>
      <div className="absolute inset-0 bg-black/75 backdrop-blur-sm" />
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative z-10 flex flex-col mt-auto bg-card rounded-t-3xl border-t border-primary/20 animate-slide-up"
        style={{ maxHeight: '92vh' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-4 pb-3 border-b border-border shrink-0">
          <div className="w-12 h-1 bg-border rounded-full absolute top-3 left-1/2 -translate-x-1/2" />
          <h2 className="font-display text-xl font-semibold mt-3">Сравнение товаров</h2>
          <button onClick={onClose} className="w-9 h-9 rounded-full glass border border-border flex items-center justify-center mt-3">
            <Icon name="X" size={16} />
          </button>
        </div>

        {/* Hint if only 1 product */}
        {products.length < 2 && (
          <div className="px-5 py-3 bg-primary/10 border-b border-border shrink-0">
            <p className="text-xs text-primary">Добавьте ещё один товар для сравнения — нажмите ⚖ на карточке</p>
          </div>
        )}

        <div className="overflow-auto no-scrollbar flex-1">
          {/* Product headers */}
          <div className="flex gap-0 sticky top-0 bg-card z-10 border-b border-border">
            <div className="w-32 shrink-0 p-3" />
            {products.map((p) => (
              <div key={p.id} className="flex-1 min-w-0 p-3 flex flex-col items-center text-center border-l border-border">
                <div className="relative w-full">
                  <button
                    onClick={() => onRemove(p.id)}
                    className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-secondary border border-border flex items-center justify-center z-10"
                  >
                    <Icon name="X" size={10} />
                  </button>
                  <img src={p.img} alt={p.name} className="w-16 h-16 rounded-xl object-cover mx-auto" />
                </div>
                <p className="text-[11px] font-medium mt-2 leading-tight line-clamp-2">{p.name}</p>
              </div>
            ))}
          </div>

          {/* Rows */}
          {COMPARE_ROWS.map((row, ri) => {
            const values = products.map((p) => row.render(p));
            const allSame = values.every((v) => v === values[0]);
            return (
              <div key={row.key} className={`flex border-b border-border/50 ${ri % 2 === 0 ? 'bg-secondary/30' : ''}`}>
                <div className="w-32 shrink-0 px-3 py-3 flex items-center">
                  <span className="text-[11px] text-muted-foreground leading-tight">{row.label}</span>
                </div>
                {products.map((p, pi) => {
                  const val = row.render(p);
                  const isBest = row.key === 'price'
                    ? val === values.reduce((a, b) => (parseFloat(a.replace(/\D/g,'')) < parseFloat(b.replace(/\D/g,'')) ? a : b))
                    : row.key === 'rating'
                    ? val === values.reduce((a, b) => (parseFloat(a) > parseFloat(b) ? a : b))
                    : false;
                  return (
                    <div key={pi} className="flex-1 min-w-0 px-3 py-3 flex items-center justify-center border-l border-border">
                      <span className={`text-xs text-center leading-tight ${
                        isBest && !allSame ? 'text-green-400 font-semibold' :
                        val === '—' ? 'text-muted-foreground' : 'text-foreground'
                      }`}>
                        {val}
                      </span>
                    </div>
                  );
                })}
              </div>
            );
          })}
          <div className="h-4" />
        </div>
      </div>
    </div>
  );
}
