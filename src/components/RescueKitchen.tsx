import React from 'react';
import { RescueRecipe, FoodItem } from '../types';
import { 
  Flame, 
  Clock, 
  Coins, 
  CheckCircle2, 
  ArrowRight, 
  ChefHat, 
  UtensilsCrossed, 
  Sparkles,
  Layers,
  ChevronRight
} from 'lucide-react';
import { playAudioFeedback } from '../utils/audio';

interface RescueKitchenProps {
  recipes: RescueRecipe[];
  inventory: FoodItem[];
  onCookRecipe: (recipe: RescueRecipe) => void;
  onViewRecipeDetail: (recipe: RescueRecipe) => void;
}

export const RescueKitchen: React.FC<RescueKitchenProps> = ({
  recipes,
  inventory,
  onCookRecipe,
  onViewRecipeDetail,
}) => {
  // Check which pantry items exist
  const checkInventoryAvailability = (recipe: RescueRecipe) => {
    return recipe.requiredItemNames.map((req) => {
      if (req.isPantry) {
        return { ...req, available: true };
      }
      // Check if food exists in inventory
      const exists = inventory.some((inv) =>
        inv.name.toLowerCase().includes(req.name.toLowerCase()) ||
        req.name.toLowerCase().includes(inv.name.toLowerCase())
      );
      return { ...req, available: exists };
    });
  };

  const heroRecipe = recipes[0];
  const otherRecipes = recipes.slice(1);

  return (
    <div className="flex flex-col w-full space-y-4 max-w-md md:max-w-2xl mx-auto">
      {/* 1. Header & Live Telemetry Cockpit */}
      <section className="flex flex-col w-full bg-[#14141A] border border-[#1F1F23] rounded-sm">
        <div className="p-4 border-b border-[#1F1F23] flex items-center justify-between">
          <h2 className="text-xs font-mono tracking-widest text-zinc-400 uppercase">
            02 // PİŞİR: SIFIR ZİYAN REÇETELERİ
          </h2>
          <span className="text-[10px] font-mono border border-[#10B981] text-[#10B981] px-1 font-bold">
            RADAR AKTİF
          </span>
        </div>

        <div className="p-4 flex flex-col space-y-3">
          <p className="font-sans text-xs text-zinc-400 font-light leading-relaxed">
            Dolabındaki kritik malzemelerle 10-15 dakikada hazırlayabileceğin şef reçeteleri:
          </p>

          {/* Quick Rescue Stats Banner */}
          <div className="flex items-center justify-between p-3 bg-[#0A0A0E] border border-[#2A2A2E] rounded-sm">
            <div className="flex items-center space-x-2 min-w-0">
              <Sparkles className="w-3.5 h-3.5 text-[#10B981] shrink-0" />
              <span className="font-mono text-xs text-zinc-300 truncate">
                {inventory.filter((i) => i.hoursLeft <= 48).length} Kritik Malzeme Eşleşti
              </span>
            </div>
            <span className="text-[10px] font-mono border border-[#10B981] text-[#10B981] px-1.5 py-0.5 font-bold shrink-0">
              +₺{heroRecipe ? heroRecipe.savedTL : 205} KURTARILABİLİR
            </span>
          </div>

          {/* Telemetry Bar Gauge */}
          <div className="p-3 bg-[#0A0A0E] border border-[#2A2A2E] rounded-sm flex flex-col space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-1.5">
                <Layers className="w-3.5 h-3.5 text-[#10B981]" />
                <span className="font-mono text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
                  KRİTİK STOK DÖNÜŞÜM ORANI
                </span>
              </div>
              <span className="font-mono text-[10px] text-[#10B981] font-bold">%100 ÇÖZÜM</span>
            </div>

            <div className="w-full h-1.5 bg-zinc-800 rounded-none overflow-hidden flex">
              <div
                className="h-full bg-[#10B981] transition-all duration-500"
                style={{ width: '72%' }}
              />
              <div
                className="h-full bg-[#FFB95F] transition-all duration-500"
                style={{ width: '28%' }}
              />
            </div>
            <div className="flex justify-between font-mono text-[9px] text-zinc-500 uppercase tracking-wider">
              <span>TAVADA ÇITIR EKMEK (₺205)</span>
              <span>OMLET MENEMEN (₺180)</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Hero Recommended Recipe Card */}
      {heroRecipe && (
        <div className="flex flex-col bg-[#14141A] border border-[#1F1F23] rounded-sm overflow-hidden relative group">
          {/* Card Hero Image */}
          <div
            className="relative w-full h-40 sm:h-48 bg-zinc-800 overflow-hidden cursor-pointer"
            onClick={() => onViewRecipeDetail(heroRecipe)}
          >
            <img
              src={heroRecipe.imageUrl}
              alt={heroRecipe.title}
              className="w-full h-full object-cover opacity-85 group-hover:opacity-100 transition-all duration-300 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0E] via-transparent to-black/60" />

            {/* Badges Cluster Overlay */}
            <div className="absolute top-2.5 right-2.5 flex items-center gap-2 pointer-events-none">
              <div className="bg-black/80 backdrop-blur-sm px-2 py-1 flex items-center gap-1 border border-[#2A2A2E]">
                <span className="text-[10px] font-mono text-[#10B981] font-bold">
                  +₺{heroRecipe.savedTL} KURTARILDI
                </span>
              </div>
            </div>

            <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 pointer-events-none">
              <span className="px-2 py-0.5 bg-black/80 backdrop-blur-sm text-zinc-300 font-mono text-[10px] border border-zinc-800">
                {heroRecipe.durationMinutes} DAKİKA
              </span>
              <span className="px-2 py-0.5 bg-[#EF4444]/80 text-black font-mono text-[10px] font-bold">
                %{heroRecipe.matchPercentage} UYUM
              </span>
            </div>

            {/* Macro Stats */}
            <div className="absolute bottom-2.5 right-3">
              <span className="px-2 py-0.5 bg-black/80 font-mono text-[9px] text-zinc-400 border border-zinc-800">
                {heroRecipe.calories} kcal • {heroRecipe.protein}
              </span>
            </div>
          </div>

          {/* Card Body */}
          <div className="p-4 flex flex-col space-y-3">
            <div>
              <div className="flex items-center space-x-1.5 mb-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]" />
                <span className="font-mono text-[9px] text-[#10B981] uppercase tracking-wider font-bold">
                  SIFIR ZİYAN // REÇETE 01
                </span>
              </div>
              <h3
                onClick={() => onViewRecipeDetail(heroRecipe)}
                className="text-lg font-light text-white tracking-wide hover:text-[#10B981] transition-colors cursor-pointer"
              >
                {heroRecipe.title}
              </h3>
              <p className="text-xs text-zinc-400 mt-1 font-light leading-relaxed line-clamp-2">
                {heroRecipe.description}
              </p>
            </div>

            {/* Matched Ingredients Chips */}
            <div className="flex flex-col space-y-1.5 pt-1">
              <span className="font-mono text-[9px] text-zinc-500 uppercase font-bold tracking-wider">
                Eşleşen Riskli Malzemeler:
              </span>
              <div className="flex flex-wrap gap-1">
                {checkInventoryAvailability(heroRecipe).map((ing, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center space-x-1 text-[9px] font-mono bg-zinc-900 text-zinc-300 px-2 py-0.5 border border-zinc-800"
                  >
                    <CheckCircle2 className="w-2.5 h-2.5 text-[#10B981]" />
                    <span>{ing.name}</span>
                    <span className="text-[#10B981] font-bold">(Kurtarıldı)</span>
                  </span>
                ))}
              </div>
            </div>

            {/* Primary Rescue Action Button */}
            <button
              id="hero-cook-btn"
              onClick={() => {
                playAudioFeedback('success');
                onCookRecipe(heroRecipe);
              }}
              className="w-full py-3 bg-white text-black text-[11px] font-bold uppercase tracking-widest hover:bg-[#10B981] hover:text-black transition-colors rounded-sm shadow-md flex items-center justify-center space-x-2 active:scale-98 mt-2"
            >
              <UtensilsCrossed className="w-4 h-4 text-black" />
              <span>Yemeği Yaptım & Kurtardım</span>
              <span className="font-mono text-[10px] bg-black text-[#10B981] px-1.5 py-0.5 rounded-none font-bold">
                +₺{heroRecipe.savedTL}
              </span>
            </button>
          </div>
        </div>
      )}

      {/* 3. Alternative Quick Dishes */}
      <div className="flex flex-col space-y-2.5">
        <h4 className="text-[10px] font-mono uppercase tracking-widest text-zinc-500 px-1">
          DİĞER UYGUN REÇETELER ({otherRecipes.length})
        </h4>

        {otherRecipes.map((recipe) => {
          const ingList = checkInventoryAvailability(recipe);
          return (
            <div
              key={recipe.id}
              className="bg-[#14141A] border border-[#1F1F23] p-3.5 flex flex-col gap-3 rounded-sm hover:border-zinc-700 transition-colors"
            >
              <div className="flex items-start justify-between gap-3">
                <div
                  onClick={() => onViewRecipeDetail(recipe)}
                  className="w-14 h-14 bg-zinc-800 rounded-sm shrink-0 overflow-hidden border border-[#2A2A2E] cursor-pointer"
                >
                  <img
                    src={recipe.imageUrl}
                    alt={recipe.title}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-light text-white truncate">
                      {recipe.title}
                    </h4>
                    <span className="text-[9px] font-mono text-[#10B981] border border-[#10B981] px-1 font-bold shrink-0">
                      +₺{recipe.savedTL}
                    </span>
                  </div>
                  <p className="text-[10px] text-zinc-500 font-mono mt-0.5">
                    {recipe.durationMinutes} DK • %{recipe.matchPercentage} UYUM • {recipe.calories} KCAL
                  </p>
                  <p className="text-xs text-zinc-400 mt-1 font-light line-clamp-1">
                    {recipe.description}
                  </p>
                </div>
              </div>

              {/* Matched chips & Action */}
              <div className="flex items-center justify-between pt-1 border-t border-[#1F1F23]">
                <div className="flex flex-wrap gap-1">
                  {ingList.slice(0, 2).map((ing, idx) => (
                    <span
                      key={idx}
                      className="text-[9px] font-mono bg-zinc-900 text-zinc-400 px-1.5 py-0.2 border border-zinc-800"
                    >
                      {ing.name}
                    </span>
                  ))}
                  {ingList.length > 2 && (
                    <span className="text-[9px] font-mono text-zinc-600">
                      +{ingList.length - 2}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      playAudioFeedback('click');
                      onViewRecipeDetail(recipe);
                    }}
                    className="text-zinc-400 hover:text-white border border-[#1F1F23] px-2 py-1 text-[10px] font-mono uppercase tracking-wider rounded-sm transition-colors"
                  >
                    Detay
                  </button>
                  <button
                    onClick={() => {
                      playAudioFeedback('success');
                      onCookRecipe(recipe);
                    }}
                    className="border border-[#10B981] text-[#10B981] text-[10px] font-bold px-3 py-1 uppercase tracking-wider hover:bg-[#10B981] hover:text-black transition-colors rounded-sm"
                  >
                    Pişir
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
