import React, { useState } from 'react';
import { FoodItem } from '../types';
import { TurkishStapleSuggestion, TURKISH_STAPLES } from '../data/initialData';
import { 
  X, 
  Plus, 
  Minus, 
  Check, 
  Refrigerator, 
  Snowflake, 
  Archive, 
  Timer, 
  Coins, 
  Scale,
  Sparkles,
  Delete
} from 'lucide-react';
import { playAudioFeedback } from '../utils/audio';

interface QuickAddModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddItem: (item: Omit<FoodItem, 'id' | 'addedAt'>) => void;
}

export const QuickAddModal: React.FC<QuickAddModalProps> = ({
  isOpen,
  onClose,
  onAddItem,
}) => {
  const [selectedStaple, setSelectedStaple] = useState<TurkishStapleSuggestion>(TURKISH_STAPLES[0]);
  const [searchQuery, setSearchQuery] = useState<string>(TURKISH_STAPLES[0].name);
  const [days, setDays] = useState<number>(TURKISH_STAPLES[0].defaultDays);
  const [price, setPrice] = useState<number>(TURKISH_STAPLES[0].defaultPrice);
  const [amount, setAmount] = useState<number>(TURKISH_STAPLES[0].defaultAmount);
  const [unit, setUnit] = useState<string>(TURKISH_STAPLES[0].unit);
  const [location, setLocation] = useState<FoodItem['location']>('Buzdolabı');
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleSelectStaple = (staple: TurkishStapleSuggestion) => {
    playAudioFeedback('click');
    setSelectedStaple(staple);
    setSearchQuery(staple.name);
    setDays(staple.defaultDays);
    setPrice(staple.defaultPrice);
    setAmount(staple.defaultAmount);
    setUnit(staple.unit);
    setLocation(staple.location);
  };

  const calculateRiskPercentage = (daysLeft: number) => {
    if (daysLeft <= 1) return 95;
    if (daysLeft === 2) return 85;
    if (daysLeft === 3) return 65;
    if (daysLeft <= 5) return 45;
    if (daysLeft <= 10) return 25;
    return 15;
  };

  const getRiskStatusInfo = (daysLeft: number) => {
    if (daysLeft <= 2) {
      return {
        label: `ACİL RİSK (${daysLeft} GÜN)`,
        colorClass: 'text-[#EF4444]',
      };
    }
    if (daysLeft <= 4) {
      return {
        label: `KRİTİK EŞİK (${daysLeft} GÜN)`,
        colorClass: 'text-[#FFB95F]',
      };
    }
    return {
      label: `GÜVENLİ (${daysLeft} GÜN)`,
      colorClass: 'text-[#10B981]',
    };
  };

  const riskInfo = getRiskStatusInfo(days);

  const handleConfirmAdd = () => {
    playAudioFeedback('add');
    setIsSuccess(true);

    const hours = days * 24;
    const risk = calculateRiskPercentage(days);

    // Pick a high-res image corresponding to the item or staple
    const imageMap: Record<string, string> = {
      'Kaşar Peyniri': 'https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?w=400&auto=format&fit=crop&q=80',
      'Bayat Ekmek': 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&auto=format&fit=crop&q=80',
      'Domates': 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=400&auto=format&fit=crop&q=80',
      'Süzme Yoğurt': 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400&auto=format&fit=crop&q=80',
      'Dana Kıyma': 'https://images.unsplash.com/photo-1603048588665-791ca8aea617?w=400&auto=format&fit=crop&q=80',
      'Taze Maydanoz': 'https://images.unsplash.com/photo-1608797178974-15b35a61dd75?w=400&auto=format&fit=crop&q=80',
      'Köy Yumurtası': 'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=400&auto=format&fit=crop&q=80',
      'Sele Zeytin': 'https://images.unsplash.com/photo-1541014741259-de529411b96a?w=400&auto=format&fit=crop&q=80',
      'Çarliston Biber': 'https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?w=400&auto=format&fit=crop&q=80',
      'Kuru Soğan': 'https://images.unsplash.com/photo-1518977956812-cd3dbadaaf31?w=400&auto=format&fit=crop&q=80',
    };

    const imageUrl =
      imageMap[selectedStaple.name] ||
      'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=400&auto=format&fit=crop&q=80';

    onAddItem({
      name: searchQuery.trim() || selectedStaple.name,
      category: selectedStaple.category,
      amount: `${amount}${unit === 'g' || unit === 'kg' ? unit : ` ${unit}`}`,
      location,
      hoursLeft: hours,
      riskPercentage: risk,
      priceTL: price,
      imageUrl,
    });

    setTimeout(() => {
      setIsSuccess(false);
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-[#0A0A0E]/85 backdrop-blur-sm p-0 sm:p-4 animate-in fade-in duration-200">
      {/* Sheet Card Container */}
      <div className="relative w-full max-w-md bg-[#14141A] border-t sm:border border-[#1F1F23] rounded-t-sm sm:rounded-sm shadow-2xl p-4.5 z-20 pb-8 sm:pb-5 flex flex-col max-h-[92vh] overflow-y-auto no-scrollbar">
        {/* Sheet Header */}
        <div className="flex items-start justify-between pb-3 mb-3 border-b border-[#1F1F23]">
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs tracking-widest text-white uppercase font-bold">
                Yeni Malzeme Ekle
              </span>
              <span className="px-1 py-0.2 border border-[#10B981] text-[#10B981] font-mono text-[9px] uppercase tracking-wider font-bold">
                RADAR_IN
              </span>
            </div>
            <span className="font-mono text-[9px] text-zinc-500 mt-0.5">
              01 // HIZLI ENVANTER VE RAF ÖMRÜ RADARI
            </span>
          </div>
          <button
            onClick={() => {
              playAudioFeedback('click');
              onClose();
            }}
            className="w-7 h-7 rounded-sm bg-[#0A0A0E] border border-[#2A2A2E] flex items-center justify-center text-zinc-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Search / Direct Input Field */}
        <div className="relative mb-3">
          <div className="w-full bg-[#0A0A0E] rounded-sm flex items-center px-3 py-2 border border-[#2A2A2E]">
            <span className="font-mono text-xs text-[#10B981] font-bold select-none mr-2">
              &gt;_
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Malzeme adı girin (Örn: Kaşar, Kıyma)..."
              className="bg-transparent flex-1 text-white font-sans text-xs outline-none placeholder:text-zinc-600"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="flex items-center gap-1 px-1.5 py-0.5 rounded-none bg-zinc-900 border border-zinc-800 text-zinc-400 text-[9px] font-mono uppercase hover:text-white"
              >
                <span>TEMİZLE</span>
                <X className="w-2.5 h-2.5" />
              </button>
            )}
          </div>
        </div>

        {/* Turkish Kitchen Staples Quick Flow */}
        <div className="flex flex-col gap-1.5 mb-3">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[9px] text-zinc-400 uppercase tracking-wider font-bold">
              SIK KULLANILANLAR (TEK DOKUNUŞ)
            </span>
            <span className="font-mono text-[9px] text-[#10B981] font-semibold">
              OTOMATİK TELEMETRİ
            </span>
          </div>

          <div className="flex flex-wrap gap-1 pt-0.5">
            {TURKISH_STAPLES.map((staple) => {
              const isSelected = selectedStaple.name === staple.name;
              return (
                <button
                  key={staple.name}
                  onClick={() => handleSelectStaple(staple)}
                  className={`flex items-center gap-1 px-2 py-1 rounded-sm font-mono text-[10px] transition-colors ${
                    isSelected
                      ? 'bg-[#10B981] text-black font-bold'
                      : 'bg-[#0A0A0E] hover:bg-zinc-800 text-zinc-300 border border-[#2A2A2E]'
                  }`}
                >
                  <span>{staple.icon}</span>
                  <span>{staple.name}</span>
                  {isSelected && <Check className="w-3 h-3 text-black" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Active Item Configurator Plate */}
        <div className="bg-[#0A0A0E] border border-[#2A2A2E] rounded-sm p-3 flex flex-col gap-3 mb-3.5">
          {/* Selected Staple Preview Banner */}
          <div className="flex items-center justify-between bg-[#14141A] px-2.5 py-1.5 rounded-sm border border-[#1F1F23]">
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-7 h-7 rounded-none bg-[#0A0A0E] flex items-center justify-center text-sm border border-[#2A2A2E] shrink-0">
                {selectedStaple.icon}
              </div>
              <div className="flex flex-col min-w-0">
                <span className="font-sans text-xs font-light text-white truncate">
                  {searchQuery || selectedStaple.name}
                </span>
                <span className="font-mono text-[9px] text-zinc-500">
                  {location} // {selectedStaple.category}
                </span>
              </div>
            </div>
            <div className="flex flex-col items-end shrink-0 pl-2">
              <span className="font-mono text-[9px] text-[#FFB95F] uppercase font-bold">
                48S RADAR ETKİN
              </span>
              <span className="font-mono text-[8px] text-zinc-600">ID #0942</span>
            </div>
          </div>

          {/* Parameter 1: Shelf Life Gauge & Stepper */}
          <div className="flex flex-col gap-1.5 bg-[#14141A] p-2.5 rounded-sm border border-[#1F1F23]">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Timer className="w-3 h-3 text-zinc-400" />
                <span className="font-mono text-[10px] text-zinc-300 uppercase tracking-wider">
                  Tahmini Raf Ömrü
                </span>
              </div>
              <span className={`font-mono text-[10px] font-bold ${riskInfo.colorClass}`}>
                {riskInfo.label}
              </span>
            </div>

            {/* Visual Hardware Bar Matrix */}
            <div className="grid grid-cols-6 gap-1 w-full my-1">
              <div
                className={`h-1 rounded-none ${
                  days <= 1 ? 'bg-[#EF4444]' : 'bg-[#EF4444]/30'
                }`}
              />
              <div
                className={`h-1 rounded-none ${
                  days <= 2 ? 'bg-[#EF4444]' : 'bg-[#EF4444]/30'
                }`}
              />
              <div
                className={`h-1 rounded-none ${
                  days <= 3 ? 'bg-[#FFB95F]' : 'bg-[#FFB95F]/30'
                }`}
              />
              <div
                className={`h-1 rounded-none ${
                  days <= 4 ? 'bg-zinc-800' : 'bg-[#10B981]/40'
                }`}
              />
              <div
                className={`h-1 rounded-none ${
                  days <= 5 ? 'bg-zinc-800' : 'bg-[#10B981]/60'
                }`}
              />
              <div
                className={`h-1 rounded-none ${
                  days >= 6 ? 'bg-[#10B981]' : 'bg-zinc-800'
                }`}
              />
            </div>

            <div className="flex items-center justify-between pt-0.5">
              <span className="font-mono text-[9px] text-zinc-500">
                SKT: {days} Gün Sonra
              </span>
              <div className="flex items-center bg-[#0A0A0E] rounded-none p-0.5 border border-[#2A2A2E]">
                <button
                  onClick={() => {
                    playAudioFeedback('click');
                    if (days > 1) setDays(days - 1);
                  }}
                  className="w-6 h-6 rounded-none bg-zinc-900 hover:bg-zinc-800 flex items-center justify-center text-white active:scale-95 transition-colors"
                >
                  <Minus className="w-3 h-3" />
                </button>
                <div className="w-14 flex items-center justify-center">
                  <span className="font-mono text-xs text-white font-bold">
                    {days} Gün
                  </span>
                </div>
                <button
                  onClick={() => {
                    playAudioFeedback('click');
                    if (days < 30) setDays(days + 1);
                  }}
                  className="w-6 h-6 rounded-none bg-zinc-900 hover:bg-zinc-800 flex items-center justify-center text-white active:scale-95 transition-colors"
                >
                  <Plus className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>

          {/* Steppers Dual Grid: Value + Quantity */}
          <div className="grid grid-cols-2 gap-2">
            {/* Price Stepper */}
            <div className="flex flex-col bg-[#14141A] p-2.5 rounded-sm border border-[#1F1F23] justify-between">
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-mono text-[10px] text-zinc-400 uppercase tracking-wider">
                  Piyasa Değeri
                </span>
                <Coins className="w-3 h-3 text-[#10B981]" />
              </div>
              <div className="flex items-center justify-between bg-[#0A0A0E] rounded-none p-0.5 border border-[#2A2A2E]">
                <button
                  onClick={() => {
                    playAudioFeedback('click');
                    if (price > 5) setPrice(price - 5);
                  }}
                  className="w-6 h-6 rounded-none bg-zinc-900 flex items-center justify-center text-white active:scale-95"
                >
                  <Minus className="w-2.5 h-2.5" />
                </button>
                <span className="font-mono text-xs text-[#10B981] font-bold">
                  ₺{price}
                </span>
                <button
                  onClick={() => {
                    playAudioFeedback('click');
                    setPrice(price + 5);
                  }}
                  className="w-6 h-6 rounded-none bg-zinc-900 flex items-center justify-center text-white active:scale-95"
                >
                  <Plus className="w-2.5 h-2.5" />
                </button>
              </div>
              <span className="font-mono text-[8px] text-zinc-500 mt-1 text-center">
                Çöp olursa kayıp tutar
              </span>
            </div>

            {/* Quantity Stepper */}
            <div className="flex flex-col bg-[#14141A] p-2.5 rounded-sm border border-[#1F1F23] justify-between">
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-mono text-[10px] text-zinc-400 uppercase tracking-wider">
                  Miktar / Adet
                </span>
                <Scale className="w-3 h-3 text-zinc-400" />
              </div>
              <div className="flex items-center justify-between bg-[#0A0A0E] rounded-none p-0.5 border border-[#2A2A2E]">
                <button
                  onClick={() => {
                    playAudioFeedback('click');
                    if (unit === 'g' && amount > 50) setAmount(amount - 50);
                    else if (amount > 1) setAmount(amount - 1);
                  }}
                  className="w-6 h-6 rounded-none bg-zinc-900 flex items-center justify-center text-white active:scale-95"
                >
                  <Minus className="w-2.5 h-2.5" />
                </button>
                <span className="font-mono text-xs text-white font-bold">
                  {amount} {unit}
                </span>
                <button
                  onClick={() => {
                    playAudioFeedback('click');
                    if (unit === 'g') setAmount(amount + 50);
                    else setAmount(amount + 1);
                  }}
                  className="w-6 h-6 rounded-none bg-zinc-900 flex items-center justify-center text-white active:scale-95"
                >
                  <Plus className="w-2.5 h-2.5" />
                </button>
              </div>
              <span className="font-mono text-[8px] text-zinc-500 mt-1 text-center">
                Paket/adet ölçümü
              </span>
            </div>
          </div>

          {/* Quick Location Selector */}
          <div className="flex flex-col gap-1.5 pt-0.5">
            <span className="font-mono text-[9px] text-zinc-400 uppercase tracking-wider font-bold">
              SAKLAMA KONUMU
            </span>
            <div className="grid grid-cols-3 gap-1.5">
              <button
                onClick={() => {
                  playAudioFeedback('click');
                  setLocation('Buzdolabı');
                }}
                className={`flex items-center justify-center gap-1.5 py-1.5 rounded-sm font-mono text-[10px] transition-colors ${
                  location === 'Buzdolabı'
                    ? 'bg-[#10B981] text-black font-bold'
                    : 'bg-[#14141A] text-zinc-400 border border-[#1F1F23] hover:text-white'
                }`}
              >
                <Refrigerator className="w-3 h-3" />
                <span>Buzdolabı</span>
              </button>

              <button
                onClick={() => {
                  playAudioFeedback('click');
                  setLocation('Dondurucu');
                }}
                className={`flex items-center justify-center gap-1.5 py-1.5 rounded-sm font-mono text-[10px] transition-colors ${
                  location === 'Dondurucu'
                    ? 'bg-[#10B981] text-black font-bold'
                    : 'bg-[#14141A] text-zinc-400 border border-[#1F1F23] hover:text-white'
                }`}
              >
                <Snowflake className="w-3 h-3" />
                <span>Dondurucu</span>
              </button>

              <button
                onClick={() => {
                  playAudioFeedback('click');
                  setLocation('Kiler');
                }}
                className={`flex items-center justify-center gap-1.5 py-1.5 rounded-sm font-mono text-[10px] transition-colors ${
                  location === 'Kiler'
                    ? 'bg-[#10B981] text-black font-bold'
                    : 'bg-[#14141A] text-zinc-400 border border-[#1F1F23] hover:text-white'
                }`}
              >
                <Archive className="w-3 h-3" />
                <span>Kiler</span>
              </button>
            </div>
          </div>
        </div>

        {/* Primary Action Button */}
        <div className="flex flex-col gap-2">
          <button
            onClick={handleConfirmAdd}
            disabled={isSuccess}
            className={`w-full py-3 rounded-sm font-mono text-[11px] font-bold uppercase tracking-widest flex items-center justify-between px-4 active:scale-98 transition-colors ${
              isSuccess
                ? 'bg-emerald-600 text-white'
                : 'bg-[#10B981] hover:bg-emerald-400 text-black'
            }`}
          >
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4" />
              <span>
                {isSuccess ? 'ENVANTERE İŞLENDİ ✓' : 'DOLABA EKLE'}
              </span>
            </div>
            <div className="flex items-center gap-1 bg-black/20 px-2 py-0.5 rounded-none">
              <span className="font-mono text-[10px]">₺{price}</span>
            </div>
          </button>

          <div className="flex items-center justify-between px-1">
            <span className="font-mono text-[8px] text-zinc-500 uppercase">
              TEL: 48S ISIL KAYIP SENSÖRÜ AKTİF
            </span>
            <span className="font-mono text-[8px] text-[#10B981] uppercase font-bold flex items-center gap-1">
              CANLI SENKRONİZE
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
