import Icon from '@/components/ui/icon';

interface Notif {
  id: number;
  icon: string;
  title: string;
  body: string;
  time: string;
  read: boolean;
  color: string;
}

const NOTIFS: Notif[] = [
  { id: 1, icon: 'Package', title: 'Заказ #AU-1029 доставлен', body: 'AURUM Sound One ждёт вас. Приятного использования!', time: 'Сейчас', read: false, color: 'bg-green-500/20 text-green-400' },
  { id: 2, icon: 'Tag', title: 'Скидка 15% на часы', body: 'Только сегодня — коллекция Chronos по специальной цене', time: '2 ч назад', read: false, color: 'bg-primary/20 text-primary' },
  { id: 3, icon: 'Heart', title: 'Товар из избранного подешевел', body: 'Emerald Tote — новая цена 86 500 ₽', time: '5 ч назад', read: true, color: 'bg-rose-500/20 text-rose-400' },
  { id: 4, icon: 'Star', title: 'Оцените покупку', body: 'Как вам Chronos Classic? Оставьте отзыв', time: '1 день', read: true, color: 'bg-yellow-500/20 text-yellow-400' },
  { id: 5, icon: 'Gift', title: 'Бонус за покупку', body: 'На ваш счёт начислено 1 200 бонусных баллов', time: '3 дня', read: true, color: 'bg-purple-500/20 text-purple-400' },
];

interface Props {
  onClose: () => void;
}

export default function NotificationsPanel({ onClose }: Props) {
  const unread = NOTIFS.filter((n) => !n.read).length;

  return (
    <div className="fixed inset-0 z-50 max-w-md mx-auto" onClick={onClose}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <div
        onClick={(e) => e.stopPropagation()}
        className="absolute top-0 left-0 right-0 bg-card border-b border-border rounded-b-3xl animate-slide-up shadow-2xl"
        style={{ transform: 'translateY(0)', animation: 'slide-down 0.4s cubic-bezier(0.16,1,0.3,1) forwards' }}
      >
        <div className="px-6 pt-14 pb-4 flex items-center justify-between border-b border-border">
          <div>
            <h2 className="font-display text-2xl font-semibold">Уведомления</h2>
            {unread > 0 && <p className="text-xs text-muted-foreground mt-0.5">{unread} непрочитанных</p>}
          </div>
          <button onClick={onClose} className="w-9 h-9 rounded-full glass border border-border flex items-center justify-center">
            <Icon name="X" size={18} />
          </button>
        </div>

        <div className="max-h-[70vh] overflow-y-auto no-scrollbar">
          {NOTIFS.map((n) => (
            <div
              key={n.id}
              className={`flex gap-3 px-6 py-4 border-b border-border/50 transition-colors ${n.read ? 'opacity-60' : 'bg-primary/3'}`}
            >
              <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 ${n.color}`}>
                <Icon name={n.icon} size={18} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <p className={`text-sm font-medium leading-tight ${!n.read ? 'text-foreground' : 'text-muted-foreground'}`}>{n.title}</p>
                  <span className="text-[10px] text-muted-foreground whitespace-nowrap shrink-0">{n.time}</span>
                </div>
                <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed line-clamp-2">{n.body}</p>
              </div>
              {!n.read && <div className="w-2 h-2 rounded-full bg-primary shrink-0 mt-1.5" />}
            </div>
          ))}
        </div>

        <div className="px-6 py-4">
          <button onClick={onClose} className="w-full h-11 rounded-2xl glass border border-border text-sm text-muted-foreground">
            Отметить все как прочитанные
          </button>
        </div>
      </div>

      <style>{`
        @keyframes slide-down {
          from { transform: translateY(-100%); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
