/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { TabType, FoodItem, RescueRecipe, ThermalReceiptData, AchievementBadge } from './types';
import { INITIAL_FOOD_ITEMS, INITIAL_RECIPES, INITIAL_BADGES } from './data/initialData';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { InventoryRadar } from './components/InventoryRadar';
import { RescueKitchen } from './components/RescueKitchen';
import { EarningsTelemetry } from './components/EarningsTelemetry';
import { QuickAddModal } from './components/QuickAddModal';
import { ThermalReceiptModal } from './components/ThermalReceiptModal';
import { RecipeDetailModal } from './components/RecipeDetailModal';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>('gor');
  const [foodItems, setFoodItems] = useState<FoodItem[]>(INITIAL_FOOD_ITEMS);
  const [recipes] = useState<RescueRecipe[]>(INITIAL_RECIPES);
  const [badges, setBadges] = useState<AchievementBadge[]>(INITIAL_BADGES);
  
  // Rescued metrics
  const [rescuedTotalTL, setRescuedTotalTL] = useState<number>(1120);
  const [rescuedCo2Kg, setRescuedCo2Kg] = useState<number>(2.4);
  const [rescuedMealsCount, setRescuedMealsCount] = useState<number>(12);

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [activeReceipt, setActiveReceipt] = useState<ThermalReceiptData | null>(null);
  const [activeDetailRecipe, setActiveDetailRecipe] = useState<RescueRecipe | null>(null);

  const urgentCount = foodItems.filter((i) => i.hoursLeft <= 48).length;

  // Handle Tab Switch (if 'ekle' is clicked, open modal directly)
  const handleTabChange = (tab: TabType) => {
    if (tab === 'ekle') {
      setIsAddModalOpen(true);
    } else {
      setActiveTab(tab);
    }
  };

  // Add Item to Inventory
  const handleAddItem = (newItem: Omit<FoodItem, 'id' | 'addedAt'>) => {
    const itemWithId: FoodItem = {
      ...newItem,
      id: `item-${Date.now()}`,
      addedAt: 'Şimdi',
    };
    setFoodItems((prev) => [itemWithId, ...prev]);
  };

  // Delete item from Inventory
  const handleDeleteItem = (id: string) => {
    setFoodItems((prev) => prev.filter((i) => i.id !== id));
  };

  // Cooking Recipe Interaction: Deducts items, increases savings, creates thermal receipt
  const handleCookRecipe = (recipe: RescueRecipe) => {
    // Determine which inventory items match and will be deducted
    const matchedItemsToRemove: FoodItem[] = [];
    recipe.requiredItemNames.forEach((req) => {
      if (!req.isPantry) {
        const found = foodItems.find(
          (item) =>
            item.name.toLowerCase().includes(req.name.toLowerCase()) ||
            req.name.toLowerCase().includes(item.name.toLowerCase())
        );
        if (found && !matchedItemsToRemove.some((m) => m.id === found.id)) {
          matchedItemsToRemove.push(found);
        }
      }
    });

    // Remove matched items from fridge
    if (matchedItemsToRemove.length > 0) {
      setFoodItems((prev) =>
        prev.filter((item) => !matchedItemsToRemove.some((m) => m.id === item.id))
      );
    }

    // Update cumulative savings
    setRescuedTotalTL((prev) => prev + recipe.savedTL);
    setRescuedCo2Kg((prev) => prev + recipe.co2SavedKg);
    setRescuedMealsCount((prev) => prev + 1);

    // Build authentic thermal receipt data matching reference
    const now = new Date();
    const formattedDate = `${String(now.getDate()).padStart(2, '0')}.${String(
      now.getMonth() + 1
    ).padStart(2, '0')}.${now.getFullYear()}`;
    const formattedTime = `${String(now.getHours()).padStart(2, '0')}:${String(
      now.getMinutes()
    ).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;

    const receiptItems = matchedItemsToRemove.map((item) => ({
      name: item.name,
      amount: item.amount,
      priceTL: item.priceTL,
    }));

    // If no exact match was found, use recipe's ingredient definition
    if (receiptItems.length === 0) {
      receiptItems.push(
        { name: 'Bayat Ekmek', amount: '250g', priceTL: 25 },
        { name: 'Kaşar Peyniri', amount: '200g', priceTL: 120 },
        { name: 'Salkım Domates', amount: '3 Adet', priceTL: 60 }
      );
    }

    const newReceipt: ThermalReceiptData = {
      id: `rcp-${Date.now()}`,
      date: formattedDate,
      time: formattedTime,
      txCode: `TR-IST-034 // #${Math.floor(1000 + Math.random() * 9000)}`,
      recipeTitle: recipe.title,
      items: receiptItems,
      totalSavedTL: recipe.savedTL,
      co2SavedKg: recipe.co2SavedKg,
      durationMinutes: recipe.durationMinutes,
      barcodeNumber: '8 690123 456789',
    };

    setActiveReceipt(newReceipt);

    // Unlock achievements if reached
    setBadges((prev) =>
      prev.map((badge) => {
        if (badge.id === 'badge-3') {
          return {
            ...badge,
            unlocked: true,
            progress: '4/5 İLERLEME',
          };
        }
        return badge;
      })
    );
  };

  // Open receipt preview from Earnings tab
  const handleOpenReceiptFromEarnings = () => {
    const now = new Date();
    const formattedDate = `${String(now.getDate()).padStart(2, '0')}.${String(
      now.getMonth() + 1
    ).padStart(2, '0')}.${now.getFullYear()}`;
    const formattedTime = `${String(now.getHours()).padStart(2, '0')}:${String(
      now.getMinutes()
    ).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;

    setActiveReceipt({
      id: 'rcp-historical',
      date: formattedDate,
      time: formattedTime,
      txCode: 'TR-IST-034 // #8821',
      recipeTitle: 'TAVADA ÇITIR KAŞARLI EKMEK',
      items: [
        { name: 'Bayat Ekmek', amount: '250g', priceTL: 25 },
        { name: 'Kaşar Peyniri', amount: '200g', priceTL: 120 },
        { name: 'Salkım Domates', amount: '3 Adet', priceTL: 60 },
      ],
      totalSavedTL: 205,
      co2SavedKg: 1.24,
      durationMinutes: 9,
      barcodeNumber: '8 690123 456789',
    });
  };

  return (
    <div className="min-h-screen bg-[#0A0A0E] text-[#F4F4F5] flex flex-col antialiased selection:bg-[#10B981] selection:text-black">
      {/* Fixed Rynia OS Top Header */}
      <Header activeTab={activeTab} urgentCount={urgentCount} />

      {/* Main Screen Content Viewport */}
      <main className="flex-1 flex flex-col w-full px-4 pt-20 pb-28 min-h-screen">
        {activeTab === 'gor' && (
          <InventoryRadar
            items={foodItems}
            rescuedTotalTL={rescuedTotalTL}
            rescuedCo2Kg={rescuedCo2Kg}
            onDeleteItem={handleDeleteItem}
            onNavigateToCook={() => setActiveTab('pisir')}
            onOpenAddModal={() => setIsAddModalOpen(true)}
          />
        )}

        {activeTab === 'pisir' && (
          <RescueKitchen
            recipes={recipes}
            inventory={foodItems}
            onCookRecipe={handleCookRecipe}
            onViewRecipeDetail={(recipe) => setActiveDetailRecipe(recipe)}
          />
        )}

        {activeTab === 'kazancin' && (
          <EarningsTelemetry
            rescuedTotalTL={rescuedTotalTL}
            rescuedCo2Kg={rescuedCo2Kg}
            rescuedMealsCount={rescuedMealsCount}
            badges={badges}
            onOpenReceipt={handleOpenReceiptFromEarnings}
          />
        )}
      </main>

      {/* Fixed Bottom Tab Navigation */}
      <BottomNav
        activeTab={activeTab}
        onTabChange={handleTabChange}
        urgentCount={urgentCount}
      />

      {/* Quick Add Ingredient Bottom Sheet */}
      <QuickAddModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddItem={handleAddItem}
      />

      {/* Recipe Detail / Step-by-Step Instructions Modal */}
      <RecipeDetailModal
        recipe={activeDetailRecipe}
        onClose={() => setActiveDetailRecipe(null)}
        onCookRecipe={handleCookRecipe}
      />

      {/* Realistic Photorealistic Digital Thermal Receipt Modal */}
      <ThermalReceiptModal
        receipt={activeReceipt}
        onClose={() => setActiveReceipt(null)}
      />
    </div>
  );
}
