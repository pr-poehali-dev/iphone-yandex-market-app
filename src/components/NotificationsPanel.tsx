import { useState } from 'react';
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

const INITIAL_NOTIFS: Notif[] = [
  { id: 1, icon: 'Package', title: 'Заказ #AU-1029 доставлен', body: 'AURUM Sound One ждёт вас у двери. Приятного использования!', time: 'Сейчас', read: false, color: 'bg-green-500/20 text-green-400' },
  { id: 2, icon: 'Tag', title: 'Скидка 15% на часы', body: 'Только сегодня — коллекция Chronos по специальной цене. Успейте!', time: '2 ч назад', read: false, color: 'bg-primary/20 text-primary' },
  { id: 3, icon: 'Heart', title: 'Товар из избранного подешевел', body: 'Noir Tote Bag — новая цена 86 500 ₽ вместо 99 000 ₽', time: '5 ч назад', read: false, color: 'bg-rose-500/20 text-rose-400' },
  { id: 4, icon: 'Star', title: 'Оцените покупку', body: 'Как вам Chronos Classic? Ваш отзыв поможет другим покупателям', time: '1 день', read: true, color: 'bg-yellow-500/20 text-yellow-400' },
  { id: 5, icon: 'Gift', title: 'Бонус за покупку', body: 'На ваш счёт начислено 1 200 бонусных баллов AURUM Gold', time: '3 дня', read: true, color: 'bg-purple-500/20 text-purple-400' },
  { id: 6, icon: 'Truck', title: 'Заказ отправлен', body: 'iPhone 15 Pro Max передан курьеру. Ожидайте сегодня до 18:00', time: '5 дней', read: true, color: 'bg-blue-500/20 text-blue-400' },
];

interface Props {
  onClose: () => void;
}

export default function NotificationsPanel({ onClose }: Props) {
  const [notifs, setNotifs] = useState<Notif[]>(INITIAL_NOTIFS);

  const markAllRead = () => {
    setNotifs((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const markRead = (id: number) => {
    setNotifs((prev) => prev.map((n) => n.id === id ? { ...n, read: true } : n));
  };

  const deleteNotif = (id: number) => {
    setNotifs((prev) => prev.filter((n) => n.id !== id));
  };

  const unread = notifs.filter((n) => !n.read).length;

  return (
    <div className="fixed inset-0 z-50 max-w-md mx-auto" onClick={onClose}>
      <div className="absolute inset-0 bg-black/65 backdrop-blur-sm" />
      <div
        onClick={(e) => e.stopPropagation()}
        className="absolute top-0 left-0 right-0 bg-card rounded-b-3xl shadow-2xl overflow-hidden"
        style={{ animation: 'notif-slide-down 0.4s cubic-bezier(0.16,1,0.3,1) forwards', maxHeight: '80vh' }}
      >
        {/* Drag handle */}
        <div className="w-10 h-1 bg-border rounded-full mx-auto mt-3 mb-1" />

        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-10 pb-3 border-b border-border">
          <div className="flex items-center gap-3">
            <h2 className="font-display text-2xl font-semibold">Уведомления</h2>
            {unread > 0 && (
              <span className="px-2 py-0.5 rounded-full bg-primary text-white text-xs font-bold">{unread}</span>
            )}
          </div>
          <div className="flex items-center gap-2">
            {unread > 0 && (
              <button
                onClick={markAllRead}
                className="text-xs text-primary px-3 py-1.5 rounded-xl border border-primary/30 active:bg-primary/10 transition-colors"
              >
                Все прочитаны
              </button>
            )}
            <button onClick={onClose} className="w-8 h-8 rounded-full glass border border-border flex items-center justify-center">
              <Icon name="X" size={16} />
            </button>
          </div>
        </div>

        {/* List */}
        <div className="overflow-y-auto no-scrollbar" style={{ maxHeight: '60vh' }}>
          {notifs.length === 0 ? (
            <div className="flex flex-col items-center py-12 text-center">
              <Icon name="Bell" size={32} className="text-muted-foreground mb-3" />
              <p className="text-muted-foreground text-sm">Уведомлений нет</p>
            </div>
          ) : (
            notifs.map((n) => (
              <div
                key={n.id}
                onClick={() => markRead(n.id)}
                className={`flex gap-3 px-5 py-3.5 border-b border-border/40 transition-all cursor-pointer active:bg-secondary/30 ${n.read ? 'opacity-55' : 'bg-primary/3'}`}
              >
                <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 ${n.color}`}>
                  <Icon name={n.icon} size={17} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <p className={`text-sm leading-tight ${n.read ? 'text-muted-foreground' : 'text-foreground font-medium'}`}>{n.title}</p>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <span className="text-[10px] text-muted-foreground">{n.time}</span>
                      <button onClick={(e) => { e.stopPropagation(); deleteNotif(n.id); }} className="opacity-0 group-hover:opacity-100">
                        <Icon name="X" size={12} className="text-muted-foreground" />
                      </button>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed line-clamp-2">{n.body}</p>
                </div>
                {!n.read && <div className="w-2 h-2 rounded-full bg-primary shrink-0 mt-1.5" />}
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {notifs.length > 0 && (
          <div className="px-5 py-3 border-t border-border">
            <button
              onClick={() => setNotifs([])}
              className="w-full h-10 rounded-xl glass border border-border text-xs text-muted-foreground"
            >
              Очистить все уведомления
            </button>
          </div>
        )}
      </div>

      <style>{`
        @keyframes notif-slide-down {
          from { transform: translateY(-100%); opacity: 0; }
          to   { transform: translateY(0);     opacity: 1; }
        }
      `}</style>
    </div>
  );
}
