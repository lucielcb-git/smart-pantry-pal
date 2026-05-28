import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Meal } from "@/types/grocery";
import MealSwipeCard from "./MealSwipeCard";
import { ListChecks, MessageCircle, Trash2, RefreshCw, X } from "lucide-react";
import { mealImages } from "@/assets/meals";
import { sampleMeals } from "@/data/sampleMeals";

interface MealPlanViewProps {
  meals: Meal[];
  onFinalize: (accepted: Meal[]) => void;
  onOpenChat: () => void;
  accepted: Meal[];
  currentIndex: number;
  onSwipe: (direction: "left" | "right") => void;
  onUpdateAccepted: (meals: Meal[]) => void;
}

// Alternatives filtered by meal type
const getAlternativesForMeal = (meal: Meal, accepted: Meal[], allMeals: Meal[]) =>
  allMeals.filter((m) => m.type === meal.type && !accepted.some((a) => a.id === m.id));

const MealPlanView = ({ meals, onFinalize, onOpenChat, accepted, currentIndex, onSwipe, onUpdateAccepted }: MealPlanViewProps) => {
  const [swapForId, setSwapForId] = useState<string | null>(null);
  const [showSwipeAlts, setShowSwipeAlts] = useState(false);
  const done = currentIndex >= meals.length;

  const handleRemove = (id: string) => {
    onUpdateAccepted(accepted.filter((m) => m.id !== id));
  };

  const handleSwap = (oldId: string, newMeal: Meal) => {
    onUpdateAccepted(accepted.map((m) => m.id === oldId ? newMeal : m));
    setSwapForId(null);
  };

  if (done) {

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        <div className="text-center space-y-2">
          <div className="text-4xl">🎉</div>
          <h2 className="text-2xl font-display font-bold text-foreground">
            Your meal plan is ready!
          </h2>
          <p className="text-muted-foreground">
            {accepted.length} meals selected for the week
          </p>
        </div>

        {/* Insights */}
        <div className="flex flex-wrap gap-1.5">
          {[
            "✅ Hits your protein goal daily",
            "🛒 One shop trip this week",
            "🚫 Avoids your disliked ingredients",
          ].map((insight) => (
            <span
              key={insight}
              className="bg-secondary/50 border border-border rounded-full px-3 py-1 text-xs text-foreground"
            >
              {insight}
            </span>
          ))}
        </div>

        {/* Weekly overview with edit actions */}
        <div className="space-y-2">
          {accepted.map((meal) => (
            <div key={meal.id} className="space-y-1">
              <div className="flex items-center gap-3 bg-card rounded-xl border border-border p-3">
                {mealImages[meal.id] ? (
                  <img
                    src={mealImages[meal.id]}
                    alt={meal.name}
                    className="w-12 h-12 rounded-lg object-cover"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-lg bg-gradient-primary flex items-center justify-center text-primary-foreground text-sm font-bold">
                    {meal.day?.[0]}
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{meal.name}</p>
                  <p className="text-xs text-muted-foreground">{meal.day} · {meal.type} · {meal.calories} cal</p>
                </div>
                <div className="flex gap-1">
                  <button
                    onClick={() => setSwapForId(swapForId === meal.id ? null : meal.id)}
                    className="p-1.5 rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/5 transition-colors"
                    title="Swap meal"
                  >
                    <RefreshCw size={14} />
                  </button>
                  <button
                    onClick={() => handleRemove(meal.id)}
                    className="p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/5 transition-colors"
                    title="Remove meal"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>

              {/* Swap alternatives */}
              <AnimatePresence>
                {swapForId === meal.id && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="ml-4 space-y-1 overflow-hidden"
                  >
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-medium text-muted-foreground">Replace with:</p>
                      <button onClick={() => setSwapForId(null)} className="text-xs text-muted-foreground hover:text-foreground">
                        <X size={12} />
                      </button>
                    </div>
                    {(() => {
                      const alts = getAlternativesForMeal(meal, accepted, sampleMeals);
                      return alts.length === 0 ? (
                        <p className="text-xs text-muted-foreground italic py-2">No alternatives available</p>
                      ) : (
                        alts.slice(0, 4).map((alt) => (
                        <button
                          key={alt.id}
                          onClick={() => handleSwap(meal.id, alt)}
                          className="w-full flex items-center gap-2 bg-muted rounded-lg px-3 py-2 text-left hover:bg-primary/10 transition-colors"
                        >
                          {mealImages[alt.id] ? (
                            <img src={mealImages[alt.id]} alt={alt.name} className="w-8 h-8 rounded-md object-cover" />
                          ) : (
                            <div className="w-8 h-8 rounded-md bg-gradient-primary flex items-center justify-center text-primary-foreground text-xs font-bold">
                              {alt.day?.[0]}
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-medium text-foreground truncate">{alt.name}</p>
                            <p className="text-[10px] text-muted-foreground">{alt.calories} cal · {alt.prepTime} min</p>
                          </div>
                        </button>
                        ))
                      );
                    })()}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>

        <div className="flex gap-3">
          <button
            onClick={onOpenChat}
            className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-border text-foreground font-medium text-sm hover:bg-muted transition-colors flex-1"
          >
            <MessageCircle size={16} />
            Edit with AI
          </button>
          <button
            onClick={() => onFinalize(accepted)}
            disabled={accepted.length === 0}
            className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gradient-primary text-primary-foreground font-semibold text-sm flex-1 disabled:opacity-40"
          >
            <ListChecks size={16} />
            Get Grocery List
          </button>
        </div>
      </motion.div>
    );
  }

  const currentMeal = meals[currentIndex];
  const swipeAlternatives = currentMeal
    ? sampleMeals.filter(
        (m) =>
          m.id !== currentMeal.id &&
          m.type === currentMeal.type &&
          !accepted.some((a) => a.id === m.id)
      )
    : [];

  return (
    <div className="space-y-6">
      <div className="text-center space-y-1">
        <h2 className="text-xl font-display font-semibold text-foreground">
          Review Your Meals
        </h2>
        <p className="text-sm text-muted-foreground">
          Swipe right to keep, left to skip · {currentIndex + 1}/{meals.length}
        </p>
        <p className="text-xs text-primary/70 mt-1 italic">
          ✨ Showing options based on your preferences and past history
        </p>
      </div>

      <div className="relative h-[420px]">
        <AnimatePresence>
          {!showSwipeAlts && meals.slice(currentIndex, currentIndex + 2).reverse().map((meal, i) => (
            <MealSwipeCard
              key={meal.id}
              meal={meal}
              onSwipe={i === meals.slice(currentIndex, currentIndex + 2).length - 1 ? onSwipe : () => {}}
            />
          ))}
        </AnimatePresence>

        {/* Alternatives overlay */}
        <AnimatePresence>
          {showSwipeAlts && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="absolute inset-0 bg-card rounded-2xl border border-border shadow-elevated overflow-hidden flex flex-col z-20"
            >
              <div className="flex items-center justify-between px-4 py-3 border-b border-border">
                <p className="text-sm font-semibold text-foreground">
                  Replace "{currentMeal?.name}" with:
                </p>
                <button
                  onClick={() => setShowSwipeAlts(false)}
                  className="p-1.5 rounded-lg hover:bg-muted transition-colors"
                >
                  <X size={16} className="text-muted-foreground" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-3 space-y-2">
                {swipeAlternatives.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-8">No alternatives available for this meal type</p>
                ) : (
                  swipeAlternatives.map((alt) => (
                    <button
                      key={alt.id}
                      onClick={() => {
                        // Replace current meal in the meals array and auto-accept
                        onSwipe("right");
                        onUpdateAccepted([...accepted, alt]);
                        setShowSwipeAlts(false);
                      }}
                      className="w-full flex items-center gap-3 bg-muted rounded-xl px-3 py-3 text-left hover:bg-primary/10 transition-colors"
                    >
                      {mealImages[alt.id] ? (
                        <img src={mealImages[alt.id]} alt={alt.name} className="w-12 h-12 rounded-lg object-cover" />
                      ) : (
                        <div className="w-12 h-12 rounded-lg bg-gradient-primary flex items-center justify-center text-primary-foreground text-sm font-bold">
                          {alt.type[0].toUpperCase()}
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">{alt.name}</p>
                        <p className="text-xs text-muted-foreground">{alt.calories} cal · {alt.prepTime} min · {alt.protein}g protein</p>
                      </div>
                      <RefreshCw size={14} className="text-primary shrink-0" />
                    </button>
                  ))
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="flex justify-center gap-6">
        <button
          onClick={() => onSwipe("left")}
          className="w-14 h-14 rounded-full border-2 border-destructive text-destructive flex items-center justify-center text-2xl hover:bg-destructive/5 transition-colors"
        >
          ✗
        </button>
        <button
          onClick={() => setShowSwipeAlts(!showSwipeAlts)}
          className="w-12 h-12 rounded-full border-2 border-primary text-primary flex items-center justify-center hover:bg-primary/5 transition-colors"
          title="See alternatives"
        >
          <RefreshCw size={18} />
        </button>
        <button
          onClick={() => onSwipe("right")}
          className="w-14 h-14 rounded-full border-2 border-success text-success flex items-center justify-center text-2xl hover:bg-success/5 transition-colors"
        >
          ✓
        </button>
      </div>
    </div>
  );
};

export default MealPlanView;
