import { useState } from 'react';
import Icon from '@/components/ui/icon';

interface Props {
  onDone: (name: string) => void;
}

const SLIDES = [
  {
    icon: 'LayoutGrid',
    title: 'Премиальный каталог',
    desc: 'Тысячи эксклюзивных товаров с фильтрами по цене, бренду и рейтингу',
    color: 'from-primary/30 to-transparent',
  },
  {
    icon: 'ShieldCheck',
    title: 'Гарантия подлинности',
    desc: 'Каждый товар проверен и сертифицирован нашими экспертами',
    color: 'from-rose-900/40 to-transparent',
  },
  {
    icon: 'Truck',
    title: 'Доставка за 24 часа',
    desc: 'Курьер в белых перчатках доставит заказ в фирменной упаковке',
    color: 'from-zinc-800/60 to-transparent',
  },
];

export default function OnboardingScreen({ onDone }: Props) {
  const [step, setStep] = useState(0);
  const [name, setName] = useState('');
  const [leaving, setLeaving] = useState(false);

  const isLast = step === SLIDES.length;

  const next = () => {
    if (step < SLIDES.length - 1) setStep(step + 1);
    else setStep(SLIDES.length);
  };

  const finish = () => {
    if (!name.trim()) return;
    setLeaving(true);
    setTimeout(() => onDone(name.trim()), 400);
  };

  return (
    <div className={`fixed inset-0 z-[90] bg-background flex flex-col max-w-md mx-auto transition-all duration-400 ${leaving ? 'opacity-0 translate-y-4' : 'opacity-100'}`}>

      {/* Background glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className={`absolute top-0 left-0 right-0 h-96 bg-gradient-to-b ${SLIDES[Math.min(step, SLIDES.length - 1)].color} transition-all duration-700`} />
      </div>

      {!isLast ? (
        <>
          {/* Skip */}
          <div className="relative z-10 flex justify-end px-6 pt-14">
            <button onClick={() => setStep(SLIDES.length)} className="text-xs text-muted-foreground">
              Пропустить
            </button>
          </div>

          {/* Content */}
          <div key={step} className="relative z-10 flex-1 flex flex-col items-center justify-center px-8 text-center animate-fade-in">
            <div className="w-28 h-28 rounded-3xl gold-gradient flex items-center justify-center mb-8 shadow-2xl shadow-primary/30">
              <Icon name={SLIDES[step].icon} size={48} className="text-white" />
            </div>
            <h2 className="font-display text-3xl font-semibold mb-3">{SLIDES[step].title}</h2>
            <p className="text-muted-foreground text-sm leading-relaxed max-w-xs">{SLIDES[step].desc}</p>
          </div>

          {/* Dots + Next */}
          <div className="relative z-10 px-8 pb-16 flex flex-col items-center gap-6">
            <div className="flex gap-2">
              {SLIDES.map((_, i) => (
                <button key={i} onClick={() => setStep(i)}>
                  <div className={`h-1.5 rounded-full transition-all duration-300 ${i === step ? 'w-6 bg-primary' : 'w-1.5 bg-border'}`} />
                </button>
              ))}
            </div>
            <button onClick={next} className="w-full h-14 rounded-2xl gold-gradient text-white font-medium text-base flex items-center justify-center gap-2">
              Далее
              <Icon name="ArrowRight" size={18} />
            </button>
          </div>
        </>
      ) : (
        /* Name input screen */
        <div className="relative z-10 flex-1 flex flex-col px-6 pt-14">
          <div className="absolute top-0 left-0 right-0 h-64 bg-gradient-to-b from-primary/20 to-transparent" />

          <div className="relative z-10 flex-1 flex flex-col justify-center animate-fade-in">
            <div className="w-20 h-20 rounded-full gold-gradient flex items-center justify-center mb-6 shadow-xl shadow-primary/30">
              <Icon name="User" size={36} className="text-white" />
            </div>
            <h2 className="font-display text-4xl font-semibold mb-2">Добро<br />пожаловать</h2>
            <p className="text-muted-foreground text-sm mb-8">Как вас зовут?</p>

            <input
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && finish()}
              placeholder="Ваше имя"
              className="w-full glass border border-border rounded-2xl px-5 h-14 text-lg outline-none placeholder:text-muted-foreground focus:border-primary/50 transition-colors mb-4"
            />

            <button
              onClick={finish}
              disabled={!name.trim()}
              className={`w-full h-14 rounded-2xl font-medium text-base transition-all ${name.trim() ? 'gold-gradient text-white' : 'bg-secondary text-muted-foreground'}`}
            >
              Войти в AURUM
            </button>
          </div>

          <div className="relative z-10 pb-12">
            <p className="text-center text-xs text-muted-foreground">
              Продолжая, вы соглашаетесь с условиями использования
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
