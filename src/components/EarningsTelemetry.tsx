import React, { useState } from 'react';
import { AchievementBadge } from '../types';
import { 
  BarChart3, 
  ShoppingCart, 
  Leaf, 
  UtensilsCrossed, 
  CheckCircle2, 
  Lock, 
  Receipt, 
  Verified, 
  TrendingUp,
  Sparkles
} from 'lucide-react';
import { playAudioFeedback } from '../utils/audio';

interface EarningsTelemetryProps {
  rescuedTotalTL: number;
  rescuedCo2Kg: number;
  rescuedMealsCount: number;
  badges: AchievementBadge[];
  onOpenReceipt: () => void;
}

type PeriodType = 'month' | 'quarter' | 'all';

interface DayTrend {
  day: string;
  amount: number;
  heightPercent: number;
  isPeak?: boolean;
}

export const EarningsTelemetry: React.FC<EarningsTelemetryProps> = ({
  rescuedTotalTL,
  rescuedCo2Kg,
  rescuedMealsCount,
  badges,
  onOpenReceipt,
}) => {
  const [period, setPeriod] = useState<PeriodType>('month');
  const [selectedDay, setSelectedDay] = useState<DayTrend | null>(null);

  const weeklyTrends: DayTrend[] = [
    { day: 'Pzt', amount: 180, heightPercent: 38 },
    { day: 'Sal', amount: 320, heightPercent: 68 },
    { day: 'Çar', amount: 95, heightPercent: 20 },
    { day: 'Per', amount: 240, heightPercent: 52 },
    { day: 'Cum', amount: 410, heightPercent: 88, isPeak: true },
    { day: 'Cmt', amount: 110, heightPercent: 24 },
    { day: 'Paz', amount: 85, heightPercent: 18 },
  ];

  // Dynamic values depending on period
  const getPeriodStats = () => {
    switch (period) {
      case 'month':
        return {
          total: rescuedTotalTL > 0 ? rescuedTotalTL : 1450,
          target: 1500,
          label: 'Bu ay çöpe gitmekten kurtarılan toplam mutfak bütçesi.',
          weeklyGain: '+₺420 / 7G',
        };
      case 'quarter':
        return {
          total: (rescuedTotalTL > 0 ? rescuedTotalTL : 1450) + 2670,
          target: 4500,
          label: 'Son 3 ayda mutfağında kurtarılan kümülatif bütçe.',
          weeklyGain: '+₺1,280 / 3A',
        };
      case 'all':
        return {
          total: (rescuedTotalTL > 0 ? rescuedTotalTL : 1450) + 11440,
          target: 15000,
          label: 'Kalanla sistem başlangıcından itibaren kurtarılan toplam değer.',
          weeklyGain: '+₺12,890 TÜMÜ',
        };
    }
  };

  const stats = getPeriodStats();
  const targetPercent = Math.min(100, Math.round((stats.total / stats.target) * 100));

  return (
    <div className="flex flex-col w-full space-y-4 max-w-md md:max-w-2xl mx-auto">
      {/* 1. Section Header & Period Selector */}
      <section className="flex flex-col w-full bg-[#14141A] border border-[#1F1F23] rounded-sm">
        <div className="p-4 border-b border-[#1F1F23] flex items-center justify-between">
          <h2 className="text-xs font-mono tracking-widest text-zinc-400 uppercase">
            03 // TELEMETRİ: FİŞ & KAZANÇ
          </h2>
          <span className="text-[10px] font-mono border border-zinc-700 text-zinc-400 px-1">
            REPORT READY
          </span>
        </div>

        {/* Period Selector Tabs */}
        <div className="p-4">
          <div className="flex items-center gap-1 bg-[#0A0A0E] p-1 border border-[#2A2A2E] rounded-sm">
            <button
              onClick={() => {
                playAudioFeedback('click');
                setPeriod('month');
              }}
              className={`flex-1 py-1.5 font-mono text-[10px] uppercase tracking-wider transition-colors rounded-sm font-bold ${
                period === 'month'
                  ? 'bg-[#10B981] text-black'
                  : 'text-zinc-500 hover:text-white'
              }`}
            >
              Bu Ay
            </button>

            <button
              onClick={() => {
                playAudioFeedback('click');
                setPeriod('quarter');
              }}
              className={`flex-1 py-1.5 font-mono text-[10px] uppercase tracking-wider transition-colors rounded-sm font-bold ${
                period === 'quarter'
                  ? 'bg-[#10B981] text-black'
                  : 'text-zinc-500 hover:text-white'
              }`}
            >
              3 Ay
            </button>

            <button
              onClick={() => {
                playAudioFeedback('click');
                setPeriod('all');
              }}
              className={`flex-1 py-1.5 font-mono text-[10px] uppercase tracking-wider transition-colors rounded-sm font-bold ${
                period === 'all'
                  ? 'bg-[#10B981] text-black'
                  : 'text-zinc-500 hover:text-white'
              }`}
            >
              Tüm Zamanlar
            </button>
          </div>
        </div>
      </section>

      {/* 2. Hero Impact Metric Card */}
      <div className="relative overflow-hidden rounded-sm bg-[#14141A] border border-[#1F1F23] p-5 flex flex-col">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5">
            <span className="font-mono text-[10px] uppercase text-zinc-500 tracking-wider">
              TELEMETRİ RAPORU // VERIFIED
            </span>
          </div>
          <Verified className="w-4 h-4 text-[#10B981]" />
        </div>

        {/* Tabular Monetary Callout */}
        <div className="my-1 flex items-baseline gap-2">
          <span className="font-mono text-3xl sm:text-4xl text-[#10B981] tracking-tight font-medium">
            ₺{stats.total.toLocaleString('tr-TR')}
          </span>
          <span className="font-mono text-[10px] text-zinc-400 uppercase tracking-widest">
            NET KURTARILAN
          </span>
        </div>

        <p className="font-sans text-xs text-zinc-400 leading-relaxed mt-1 font-light">
          {stats.label}
        </p>

        {/* Target Progress Bar inside Hero */}
        <div className="mt-4 pt-3 flex items-center justify-between bg-[#0A0A0E] -mx-5 -mb-5 px-5 py-3 border-t border-[#1F1F23]">
          <div className="flex items-center gap-1.5 font-mono text-[10px]">
            <span className="text-zinc-500">HEDEF: ₺{stats.target.toLocaleString('tr-TR')}</span>
            <span className="text-[#10B981] font-bold">(%{targetPercent})</span>
          </div>
          <div className="w-28 h-1.5 bg-zinc-800 rounded-none overflow-hidden">
            <div
              className="h-full bg-[#10B981] transition-all duration-500"
              style={{ width: `${targetPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* 3. Physical Thermal Receipt Snapshot & Share Prompt */}
      <div className="rounded-sm bg-[#14141A] border border-[#1F1F23] p-5 flex flex-col items-center justify-center">
        {/* Physical Receipt Look */}
        <div 
          onClick={onOpenReceipt}
          className="w-full max-w-[290px] bg-white text-black p-5 shadow-2xl relative cursor-pointer group hover:scale-[1.01] transition-transform"
          style={{
            clipPath: 'polygon(0% 0%, 100% 0%, 100% calc(100% - 10px), 95% 100%, 90% calc(100% - 10px), 85% 100%, 80% calc(100% - 10px), 75% 100%, 70% calc(100% - 10px), 65% 100%, 60% calc(100% - 10px), 55% 100%, 50% calc(100% - 10px), 45% 100%, 40% calc(100% - 10px), 35% 100%, 30% calc(100% - 10px), 25% 100%, 20% calc(100% - 10px), 15% 100%, 10% calc(100% - 10px), 5% 100%, 0% calc(100% - 10px))',
          }}
        >
          {/* Receipt punched hole */}
          <div className="w-3.5 h-3.5 bg-[#0A0A0E] rounded-full mx-auto -mt-6 mb-3" />
          <div className="text-center border-b border-black pb-2.5">
            <h3 className="font-mono font-bold text-xs tracking-tight uppercase">KALANLA ZERO-WASTE</h3>
            <p className="text-[9px] font-mono text-zinc-600 mt-0.5">TERMINAL #04 • 24.10.2024</p>
          </div>
          <div className="py-2.5 border-b border-dashed border-zinc-400 space-y-1 font-mono text-xs">
            <div className="flex justify-between">
              <span>TAVUK GÖĞSÜ</span>
              <span className="font-bold">₺84.00</span>
            </div>
            <div className="flex justify-between">
              <span>YARIM MANTAR</span>
              <span className="font-bold">₺22.50</span>
            </div>
            <div className="flex justify-between text-zinc-500 text-[10px]">
              <span>TASARRUF ORANI</span>
              <span className="font-bold">%100</span>
            </div>
          </div>
          <div className="py-2.5 border-b border-black font-mono">
            <div className="flex justify-between items-baseline">
              <span className="text-[11px] font-bold">TOPLAM TASARRUF</span>
              <span className="text-sm font-bold text-[#10B981]">₺106.50</span>
            </div>
            <div className="flex justify-between text-[9px] text-zinc-600 mt-0.5">
              <span>CO2 SALINIM ENGELİ</span>
              <span className="font-bold">1.8 kg</span>
            </div>
          </div>
          {/* Barcode mockup */}
          <div className="pt-3 pb-2 text-center">
            <div className="inline-block w-36 h-6 bg-zinc-900" />
            <p className="font-mono text-[8px] tracking-[0.3em] text-zinc-600 mt-1">869000102938</p>
          </div>
        </div>

        <button
          onClick={() => {
            playAudioFeedback('receipt');
            onOpenReceipt();
          }}
          className="w-full mt-4 py-3 border border-[#10B981] text-[#10B981] text-[11px] font-bold uppercase tracking-widest hover:bg-[#10B981] hover:text-black transition-colors rounded-sm"
        >
          Fişi Büyüt & Hikayede Paylaş
        </button>
      </div>

      {/* 4. 7-Day Savings Trend Bar Chart */}
      <div className="rounded-sm bg-[#14141A] border border-[#1F1F23] p-4 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-3.5 h-3.5 text-zinc-400" />
            <span className="font-mono text-xs font-bold text-white uppercase tracking-wider">
              Haftalık Trend Analizi
            </span>
          </div>
          <span className="font-mono text-[10px] text-[#10B981] uppercase font-bold">
            {stats.weeklyGain}
          </span>
        </div>

        {/* Bar Visualizer */}
        <div className="pt-3 pb-1 flex items-end justify-between gap-2 h-28">
          {weeklyTrends.map((t) => (
            <div
              key={t.day}
              onClick={() => {
                playAudioFeedback('click');
                setSelectedDay(t);
              }}
              className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end group cursor-pointer"
            >
              <span
                className={`font-mono text-[9px] transition-opacity ${
                  selectedDay?.day === t.day || t.isPeak
                    ? 'opacity-100 text-[#10B981] font-bold'
                    : 'opacity-0 group-hover:opacity-100 text-zinc-400'
                }`}
              >
                {t.amount}
              </span>
              <div
                className={`w-full rounded-none transition-all duration-200 ${
                  t.isPeak
                    ? 'bg-[#10B981]'
                    : selectedDay?.day === t.day
                    ? 'bg-white'
                    : 'bg-[#2A2A2E] group-hover:bg-zinc-600'
                }`}
                style={{ height: `${t.heightPercent}%` }}
              />
              <span
                className={`font-mono text-[10px] font-bold ${
                  t.isPeak || selectedDay?.day === t.day
                    ? 'text-[#10B981]'
                    : 'text-zinc-500'
                }`}
              >
                {t.day}
              </span>
            </div>
          ))}
        </div>

        <div className="font-mono text-[10px] text-center text-zinc-400 py-0.5 border-t border-[#1F1F23] pt-2">
          {selectedDay
            ? `${selectedDay.day} günü ₺${selectedDay.amount} değerinde gıda kurtarıldı.`
            : 'En yüksek tasarruf Cuma günü sağlandı (₺410).'}
        </div>
      </div>

      {/* 5. Impact Comparison Matrix (3 Bento Cards) */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between px-1">
          <span className="font-mono text-xs font-bold uppercase text-zinc-400">
            Etki Matrisi
          </span>
          <span className="font-mono text-[10px] text-zinc-500">3 GÖSTERGE AKTİF</span>
        </div>

        {/* Bento 1: Grocery Translation */}
        <div className="rounded-sm bg-[#0A0A0E] border border-[#2A2A2E] p-3.5 flex items-start gap-3">
          <div className="w-9 h-9 rounded-sm bg-[#14141A] border border-[#1F1F23] flex items-center justify-center shrink-0 text-base">
            🛒
          </div>
          <div className="flex flex-col min-w-0 flex-1">
            <div className="flex items-center justify-between gap-1">
              <span className="font-sans text-sm font-light text-white truncate">
                3 Market Alışverişi
              </span>
              <span className="font-mono text-[9px] text-[#10B981] border border-[#10B981] px-1 font-bold">
                BEDAVA
              </span>
            </div>
            <span className="font-mono text-xs text-[#10B981] font-bold mt-0.5">
              ₺480 Ort. Sepet
            </span>
            <p className="font-sans text-xs text-zinc-400 mt-0.5 font-light">
              Ortalama ₺480 sepet tutarı tasarruf edildi.
            </p>
          </div>
        </div>

        {/* Bento 2: Carbon Offsetting */}
        <div className="rounded-sm bg-[#0A0A0E] border border-[#2A2A2E] p-3.5 flex items-start gap-3">
          <div className="w-9 h-9 rounded-sm bg-[#14141A] border border-[#1F1F23] flex items-center justify-center shrink-0 text-base">
            🌱
          </div>
          <div className="flex flex-col min-w-0 flex-1">
            <div className="flex items-center justify-between gap-1">
              <span className="font-sans text-sm font-light text-white truncate">
                ~{rescuedCo2Kg > 0 ? rescuedCo2Kg.toFixed(1) : '18.5'} kg CO₂e Karbon
              </span>
              <span className="font-mono text-[9px] text-[#FFB95F] border border-[#FFB95F] px-1 font-bold">
                ÖNLENDİ
              </span>
            </div>
            <span className="font-mono text-xs text-[#FFB95F] font-bold mt-0.5">
              124 km Sürüş Eşdeğeri
            </span>
            <p className="font-sans text-xs text-zinc-400 mt-0.5 font-light">
              124 km benzinli otomobil sürüşüne eşdeğer salım engellendi.
            </p>
          </div>
        </div>

        {/* Bento 3: Rescued Meals */}
        <div className="rounded-sm bg-[#0A0A0E] border border-[#2A2A2E] p-3.5 flex items-start gap-3">
          <div className="w-9 h-9 rounded-sm bg-[#14141A] border border-[#1F1F23] flex items-center justify-center shrink-0 text-base">
            🍳
          </div>
          <div className="flex flex-col min-w-0 flex-1">
            <div className="flex items-center justify-between gap-1">
              <span className="font-sans text-sm font-light text-white truncate">
                {rescuedMealsCount > 0 ? rescuedMealsCount : 12} Öğün Kurtarıldı
              </span>
              <span className="font-mono text-[9px] text-[#10B981] border border-[#10B981] px-1 font-bold">
                0 ATIK
              </span>
            </div>
            <span className="font-mono text-xs text-white font-bold mt-0.5">
              12 Şef Reçetesi
            </span>
            <p className="font-sans text-xs text-zinc-400 mt-0.5 font-light">
              0 atıkla tamamlanan 12 şef tarifi pişirildi.
            </p>
          </div>
        </div>
      </div>

      {/* 6. Badges Rail */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between px-1">
          <span className="font-mono text-xs font-bold uppercase text-zinc-400">
            Başarı Rozetleri
          </span>
          <span className="font-mono text-[10px] text-zinc-500">2/3 AÇIK</span>
        </div>

        {badges.map((badge) => (
          <div
            key={badge.id}
            className={`rounded-sm border p-3 flex items-center justify-between gap-3 ${
              badge.unlocked
                ? 'bg-[#0A0A0E] border-[#2A2A2E]'
                : 'bg-[#0A0A0E]/50 border-zinc-900 opacity-60'
            }`}
          >
            <div className="flex items-center gap-3 min-w-0">
              <div
                className={`w-9 h-9 rounded-sm flex items-center justify-center text-base shrink-0 border ${
                  badge.rank === 'ALTIN'
                    ? 'bg-[#FFB95F]/10 border-[#FFB95F]/40 text-[#FFB95F]'
                    : badge.rank === 'PLATİN'
                    ? 'bg-[#10B981]/10 border-[#10B981]/40 text-[#10B981]'
                    : 'bg-[#14141A] border-[#2A2A2E] text-zinc-400'
                }`}
              >
                {badge.icon}
              </div>
              <div className="flex flex-col min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-sans text-sm font-light text-white truncate">
                    {badge.title}
                  </span>
                  <span className="font-mono text-[8px] border border-zinc-700 text-zinc-400 px-1 uppercase font-bold">
                    {badge.rank}
                  </span>
                </div>
                <span className="font-sans text-xs text-zinc-400 truncate mt-0.5 font-light">
                  {badge.description}
                </span>
              </div>
            </div>

            <div className="shrink-0 flex items-center justify-center">
              {badge.unlocked ? (
                <div className="w-6 h-6 rounded-none text-[#10B981] flex items-center justify-center">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
              ) : (
                <div className="w-6 h-6 rounded-none text-zinc-600 flex items-center justify-center">
                  <Lock className="w-3.5 h-3.5" />
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
