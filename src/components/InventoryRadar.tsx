import React, { useState, useEffect } from 'react';
import { FoodItem } from '../types';
import { 
  RotateCw, 
  Package, 
  AlertTriangle, 
  Leaf, 
  Bell, 
  ArrowRight, 
  Zap, 
  PlusCircle, 
  Trash2,
  Barcode
} from 'lucide-react';
import { playAudioFeedback } from '../utils/audio';

interface InventoryRadarProps {
  items: FoodItem[];
  rescuedTotalTL: number;
  rescuedCo2Kg: number;
  onDeleteItem: (id: string) => void;
  onNavigateToCook: () => void;
  onOpenAddModal: () => void;
}

type FilterType = 'all' | 'urgent' | 'week' | 'fresh';

export const InventoryRadar: React.FC<InventoryRadarProps> = ({
  items,
  rescuedTotalTL,
  rescuedCo2Kg,
  onDeleteItem,
  onNavigateToCook,
  onOpenAddModal,
}) => {
  const [filter, setFilter] = useState<FilterType>('all');
  const [currentTime, setCurrentTime] = useState<string>('');
  const [isSyncing, setIsSyncing] = useState<boolean>(false);

  // Live telemetry clock
  useEffect(() => {
    const updateTimer = () => {
      const d = new Date();
      const h = String(d.getHours()).padStart(2, '0');
      const m = String(d.getMinutes()).padStart(2, '0');
      const s = String(d.getSeconds()).padStart(2, '0');
      setCurrentTime(`${h}:${m}:${s}`);
    };
    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, []);

  // Filter computations
  const urgentItems = items.filter((item) => item.hoursLeft <= 48);
  const weekItems = items.filter((item) => item.hoursLeft > 48 && item.hoursLeft <= 168);
  const freshItems = items.filter((item) => item.hoursLeft > 168);

  const filteredItems = items.filter((item) => {
    if (filter === 'urgent') return item.hoursLeft <= 48;
    if (filter === 'week') return item.hoursLeft > 48 && item.hoursLeft <= 168;
    if (filter === 'fresh') return item.hoursLeft > 168;
    return true;
  });

  // Radar metrics
  const totalPantryValue = items.reduce((sum, item) => sum + item.priceTL, 0);
  const riskValue48h = urgentItems.reduce((sum, item) => sum + item.priceTL, 0);

  const handleManualSync = () => {
    playAudioFeedback('click');
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      playAudioFeedback('add');
    }, 600);
  };

  const getUrgentTimeBadge = (hours: number) => {
    if (hours <= 24) {
      return (
        <span className="font-mono text-[9px] px-1.5 py-0.5 border border-[#EF4444]/50 bg-[#EF4444]/10 text-[#EF4444] font-bold tracking-wider uppercase">
          CRITICAL // {hours}H LEFT
        </span>
      );
    }
    if (hours <= 48) {
      return (
        <span className="font-mono text-[9px] px-1.5 py-0.5 border border-[#EF4444]/40 bg-[#EF4444]/10 text-[#EF4444] font-bold tracking-wider uppercase">
          CRITICAL // {hours}H LEFT
        </span>
      );
    }
    const days = Math.round(hours / 24);
    if (days <= 7) {
      return (
        <span className="font-mono text-[9px] px-1.5 py-0.5 border border-zinc-700 bg-zinc-900 text-zinc-400 font-bold tracking-wider uppercase">
          WARNING // {days} GÜN
        </span>
      );
    }
    return (
      <span className="font-mono text-[9px] px-1.5 py-0.5 border border-zinc-800 bg-zinc-950 text-zinc-500 font-bold tracking-wider uppercase">
        STABLE // {days} GÜN
      </span>
    );
  };

  const getProgressBarColor = (risk: number) => {
    if (risk >= 70) return 'bg-[#EF4444]';
    if (risk >= 35) return 'bg-[#FFB95F]';
    return 'bg-[#10B981]';
  };

  return (
    <div className="flex flex-col w-full space-y-4 max-w-md md:max-w-2xl mx-auto">
      {/* 1. Telemetry Sub-Header & Live Stamp */}
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse" />
          <span className="font-mono text-[10px] uppercase tracking-widest text-zinc-500">
            SİSTEM AKTİF // {currentTime || '00:48:12'}
          </span>
        </div>
        <button
          onClick={handleManualSync}
          className="flex items-center gap-1.5 bg-[#0D0D12] hover:bg-[#1F1F23] px-2.5 py-1 rounded-sm border border-[#1F1F23] transition-colors active:scale-95"
        >
          <RotateCw className={`w-3 h-3 text-zinc-400 ${isSyncing ? 'animate-spin' : ''}`} />
          <span className="font-mono text-[9px] text-zinc-400 uppercase tracking-widest font-bold">
            {isSyncing ? 'SENK...' : 'OTO-SENK'}
          </span>
        </button>
      </div>

      {/* 2. Mutfak Değer Radarı (01 // GÖR: ENVANTER RADARI) */}
      <section className="flex flex-col w-full bg-[#14141A] border border-[#1F1F23] rounded-sm">
        <div className="p-4 border-b border-[#1F1F23] flex items-center justify-between">
          <h2 className="text-xs font-mono tracking-widest text-zinc-400 uppercase">
            01 // GÖR: ENVANTER RADARI
          </h2>
          <span className="text-[10px] font-mono border border-[#10B981] text-[#10B981] px-1 font-bold">
            TRY // LIVE
          </span>
        </div>

        <div className="p-4">
          <div className="grid grid-cols-3 gap-2">
            {/* Box 1: Total Value */}
            <div className="bg-[#0A0A0E] p-3 border border-[#2A2A2E] rounded-sm flex flex-col justify-between">
              <p className="text-[9px] font-mono text-zinc-500 uppercase tracking-wider">
                Dolap
              </p>
              <div className="my-1">
                <p className="text-base sm:text-lg font-mono text-white tabular-nums tracking-tight">
                  ₺{totalPantryValue.toLocaleString('tr-TR')}
                </p>
              </div>
              <div className="flex items-center gap-1 text-zinc-500">
                <Package className="w-3 h-3" />
                <span className="font-mono text-[9px]">{items.length} Kalem</span>
              </div>
            </div>

            {/* Box 2: 48h Risk */}
            <div className="bg-[#0A0A0E] p-3 border border-[#EF4444]/30 rounded-sm flex flex-col justify-between relative overflow-hidden">
              <div className="flex items-center justify-between">
                <p className="text-[9px] font-mono text-[#EF4444] uppercase tracking-wider font-bold">
                  Risk
                </p>
                <span className="relative flex h-1.5 w-1.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#EF4444] opacity-75" />
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#EF4444]" />
                </span>
              </div>
              <div className="my-1">
                <p className="text-base sm:text-lg font-mono text-[#EF4444] tabular-nums tracking-tight font-medium">
                  ₺{riskValue48h.toLocaleString('tr-TR')}
                </p>
              </div>
              <div className="flex items-center gap-1 text-[#EF4444]/80">
                <AlertTriangle className="w-3 h-3" />
                <span className="font-mono text-[9px]">{urgentItems.length} Madde</span>
              </div>
            </div>

            {/* Box 3: Rescued */}
            <div className="bg-[#0A0A0E] p-3 border border-[#10B981]/30 rounded-sm flex flex-col justify-between">
              <p className="text-[9px] font-mono text-[#10B981] uppercase tracking-wider font-bold">
                Kurtarılan
              </p>
              <div className="my-1">
                <p className="text-base sm:text-lg font-mono text-[#10B981] tabular-nums tracking-tight font-medium">
                  ₺{rescuedTotalTL.toLocaleString('tr-TR')}
                </p>
              </div>
              <div className="flex items-center gap-1 text-[#10B981]/80">
                <Leaf className="w-3 h-3" />
                <span className="font-mono text-[9px]">{rescuedCo2Kg.toFixed(1)} kg CO₂</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Spoilage Imminent Alert Banner */}
      {urgentItems.length > 0 && (
        <div className="bg-[#0D0D12] border border-[#EF4444]/40 rounded-sm p-3.5 flex items-center justify-between gap-3 transition-colors">
          <div className="flex items-start gap-3 min-w-0">
            <div className="w-8 h-8 rounded-sm bg-[#EF4444]/15 border border-[#EF4444]/30 flex items-center justify-center shrink-0">
              <Bell className="w-4 h-4 text-[#EF4444]" />
            </div>
            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="text-[9px] font-mono text-[#EF4444] font-bold uppercase tracking-wider">
                  CRITICAL // 48H RISK
                </span>
              </div>
              <p className="font-sans text-[14px] font-medium tracking-tight truncate text-white mt-0.5">
                {urgentItems.length} Ürünün Son 48 Saati
              </p>
              <span className="font-mono text-[10px] text-zinc-500">
                Tavada Çıtır Ekmek & Fırın Menemen reçetesi hazır
              </span>
            </div>
          </div>
          <button
            onClick={() => {
              playAudioFeedback('click');
              onNavigateToCook();
            }}
            className="shrink-0 py-2 px-3 border border-[#10B981] text-[#10B981] hover:bg-[#10B981] hover:text-black text-[10px] font-mono font-bold uppercase tracking-widest rounded-sm transition-colors flex items-center gap-1.5 active:scale-95"
          >
            <span>PİŞİR</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      )}

      {/* 4. Filter Segment Hardware Selector */}
      <div className="w-full flex items-center gap-1.5 overflow-x-auto py-0.5 no-scrollbar">
        <button
          onClick={() => {
            playAudioFeedback('click');
            setFilter('all');
          }}
          className={`h-7 px-3 rounded-sm font-mono text-[10px] font-bold flex items-center gap-1.5 shrink-0 transition-all uppercase tracking-wider ${
            filter === 'all'
              ? 'bg-[#10B981] text-black font-bold'
              : 'bg-[#14141A] text-zinc-400 border border-[#1F1F23] hover:text-white'
          }`}
        >
          <span>TÜMÜ</span>
          <span className="text-[9px] opacity-80">({items.length})</span>
        </button>

        <button
          onClick={() => {
            playAudioFeedback('click');
            setFilter('urgent');
          }}
          className={`h-7 px-3 rounded-sm font-mono text-[10px] font-bold flex items-center gap-1.5 shrink-0 transition-all uppercase tracking-wider ${
            filter === 'urgent'
              ? 'bg-[#EF4444] text-black font-bold'
              : 'bg-[#14141A] text-[#EF4444] border border-[#EF4444]/30 hover:bg-[#EF4444]/10'
          }`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[#EF4444]" />
          <span>KRİTİK 48S</span>
          <span className="text-[9px] opacity-80">({urgentItems.length})</span>
        </button>

        <button
          onClick={() => {
            playAudioFeedback('click');
            setFilter('week');
          }}
          className={`h-7 px-3 rounded-sm font-mono text-[10px] font-bold flex items-center gap-1.5 shrink-0 transition-all uppercase tracking-wider ${
            filter === 'week'
              ? 'bg-[#FFB95F] text-black font-bold'
              : 'bg-[#14141A] text-zinc-400 border border-[#1F1F23] hover:text-white'
          }`}
        >
          <span>BU HAFTA</span>
          <span className="text-[9px] opacity-80">({weekItems.length})</span>
        </button>

        <button
          onClick={() => {
            playAudioFeedback('click');
            setFilter('fresh');
          }}
          className={`h-7 px-3 rounded-sm font-mono text-[10px] font-bold flex items-center gap-1.5 shrink-0 transition-all uppercase tracking-wider ${
            filter === 'fresh'
              ? 'bg-white text-black font-bold'
              : 'bg-[#14141A] text-zinc-400 border border-[#1F1F23] hover:text-white'
          }`}
        >
          <span>TAZE</span>
          <span className="text-[9px] opacity-80">({freshItems.length})</span>
        </button>
      </div>

      {/* 5. Food Items Radar Feed */}
      <div className="flex flex-col space-y-2.5 w-full">
        {filteredItems.length === 0 ? (
          <div className="py-10 flex flex-col items-center justify-center text-center p-6 rounded-sm bg-[#14141A] border border-dashed border-[#1F1F23]">
            <Package className="w-8 h-8 text-zinc-600 mb-2" />
            <span className="font-sans text-[14px] text-zinc-300">
              Bu kategoride malzeme bulunamadı
            </span>
            <span className="font-mono text-[10px] text-zinc-500 mt-1">
              Dolabınıza yeni malzeme eklemek için aşağıdaki butonu kullanın.
            </span>
          </div>
        ) : (
          filteredItems.map((item) => {
            const isCritical = item.hoursLeft <= 48;
            return (
              <div
                key={item.id}
                className={`group bg-[#0D0D12] border rounded-sm p-3 shadow-sm flex flex-col gap-2 relative overflow-hidden transition-all duration-150 ${
                  isCritical
                    ? 'border-[#EF4444]/40'
                    : 'border-[#2A2A2E] hover:border-zinc-700'
                }`}
              >
                <div className="flex items-center justify-between gap-2.5">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-11 h-11 rounded-sm bg-[#0A0A0E] border border-[#2A2A2E] flex items-center justify-center shrink-0 overflow-hidden relative">
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        className="w-full h-full object-cover opacity-75 group-hover:opacity-100 transition-opacity"
                        loading="lazy"
                      />
                    </div>
                    <div className="flex flex-col min-w-0">
                      <div className="flex items-center gap-1.5 mb-0.5">
                        {isCritical ? (
                          <p className="text-[10px] font-mono text-[#EF4444] leading-none">
                            CRITICAL // {item.hoursLeft}H LEFT
                          </p>
                        ) : item.hoursLeft <= 168 ? (
                          <p className="text-[10px] font-mono text-zinc-500 leading-none">
                            WARNING // {Math.round(item.hoursLeft / 24)} DAYS
                          </p>
                        ) : (
                          <p className="text-[10px] font-mono text-zinc-500 leading-none">
                            STABLE // {Math.round(item.hoursLeft / 24)} DAYS
                          </p>
                        )}
                      </div>
                      <span className="font-sans text-sm tracking-tight text-white truncate leading-tight">
                        {item.name} <span className="text-zinc-500 font-mono text-xs">({item.amount})</span>
                      </span>
                      <span className="font-mono text-[9px] text-zinc-500 mt-0.5">
                        {item.location} // {item.category}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5">
                    <div className="flex flex-col items-end shrink-0">
                      <span className="font-mono text-xs text-white tabular-nums">
                        ₺{item.priceTL.toFixed(2)}
                      </span>
                      {isCritical ? (
                        <span className="text-[9px] bg-[#EF4444] text-black px-1 font-mono font-bold mt-0.5">
                          ATIK RİSKİ
                        </span>
                      ) : (
                        <span className="font-mono text-[9px] text-zinc-500 mt-0.5">
                          %{item.riskPercentage} RİSK
                        </span>
                      )}
                    </div>

                    <button
                      onClick={() => {
                        playAudioFeedback('warning');
                        onDeleteItem(item.id);
                      }}
                      title="Dolaptan çıkar"
                      className="opacity-30 hover:opacity-100 hover:text-[#EF4444] p-1 rounded transition-opacity"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Spoilage Line Bar */}
                <div className="w-full h-1 bg-[#1F1F23] rounded-none overflow-hidden">
                  <div
                    className={`h-full transition-all duration-500 ${getProgressBarColor(
                      item.riskPercentage
                    )}`}
                    style={{ width: `${Math.min(100, item.riskPercentage)}%` }}
                  />
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* 6. Tactical Quick Recovery Tip Banner */}
      <div className="w-full bg-[#14141A] border border-[#1F1F23] rounded-sm p-3 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-7 h-7 rounded-sm bg-[#10B981]/15 text-[#10B981] flex items-center justify-center shrink-0 border border-[#10B981]/30">
            <Zap className="w-3.5 h-3.5" />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="font-mono text-[10px] font-bold text-white uppercase tracking-wider">
              HIZLI KURTARMA ÖNERİSİ
            </span>
            <span className="font-mono text-[10px] text-zinc-500 truncate">
              Kaşar + Bayat Ekmek + Domates = 1 Tost
            </span>
          </div>
        </div>
        <span className="font-mono text-[10px] text-[#10B981] border border-[#10B981] px-1 font-bold tabular-nums shrink-0">
          +₺205 KURTAR
        </span>
      </div>

      {/* 7. Action Button */}
      <div className="pt-2 pb-6 flex justify-center">
        <button
          id="quick-add-btn"
          onClick={() => {
            playAudioFeedback('click');
            onOpenAddModal();
          }}
          className="w-full py-3.5 bg-white text-black text-[11px] font-bold uppercase tracking-widest hover:bg-[#10B981] hover:text-black transition-colors rounded-sm shadow-xl flex items-center justify-center gap-2 active:scale-98"
        >
          <PlusCircle className="w-4 h-4" />
          <span>+ HIZLI MALZEME EKLE</span>
        </button>
      </div>
    </div>
  );
};
