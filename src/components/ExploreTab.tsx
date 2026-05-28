import { useState } from "react";
import { motion } from "framer-motion";
import { ExploreRecipe } from "@/types/grocery";
import { sampleExploreRecipes } from "@/data/sampleMeals";
import { Heart, Clock, Flame, Plus, Search, Dumbbell } from "lucide-react";
import logo from "@/assets/logo.png";
import { exploreImages } from "@/assets/explore";

const tags = ["All", "🔥 Trending", "💪 High Protein", "💰 Budget", "⚡ Quick Dinner", "👶 Kid-Friendly", "🍂 Seasonal", "🌱 Plant-Based"];

interface ExploreTabProps {
  savedRecipes: ExploreRecipe[];
  onSaveRecipe: (recipe: ExploreRecipe) => void;
}

const ExploreTab = ({ savedRecipes, onSaveRecipe }: ExploreTabProps) => {
  const [activeTag, setActiveTag] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [mealTypePickFor, setMealTypePickFor] = useState<string | null>(null);

  const recipes = sampleExploreRecipes.map((r) => ({
    ...r,
    saved: savedRecipes.some((s) => s.id === r.id),
  }));

  const filtered = recipes.filter((r) => {
    const matchTag = activeTag === "All" || r.tag === activeTag;
    const matchSearch = r.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchTag && matchSearch;
  });

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-2">
        <img src={logo} alt="GrocerEase" className="h-8 w-8 object-contain" />
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground"><span className="text-primary">Grocer</span>Ease</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Discover new recipes & meal ideas</p>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search recipes..."
          className="w-full bg-muted rounded-xl pl-9 pr-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-primary/20"
        />
      </div>

      {/* Tags */}
      <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1 scrollbar-hide">
        {tags.map((tag) => (
          <button
            key={tag}
            onClick={() => setActiveTag(tag)}
            className={`whitespace-nowrap px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
              activeTag === tag
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:bg-primary/10"
            }`}
          >
            {tag}
          </button>
        ))}
      </div>

      {/* Recipe cards */}
      <div className="grid grid-cols-1 gap-3">
        {filtered.map((recipe, i) => {
          const image = exploreImages[recipe.id];
          return (
            <motion.div
              key={recipe.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-card rounded-xl border border-border overflow-hidden"
            >
              {image ? (
                <div className="h-36 relative overflow-hidden">
                  <img src={image} alt={recipe.title} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                  <span className="absolute bottom-2 left-3 text-[10px] font-semibold text-white bg-white/20 backdrop-blur-sm px-2 py-0.5 rounded-full">
                    {recipe.tag}
                  </span>
                </div>
              ) : (
                <div className="h-24 bg-gradient-primary flex items-center justify-center">
                  <span className="text-5xl">{recipe.tag.split(" ")[0]}</span>
                </div>
              )}
              <div className="p-4 space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    {!image && (
                      <span className="text-[10px] font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                        {recipe.tag}
                      </span>
                    )}
                    <h3 className="text-sm font-semibold text-foreground mt-1.5 truncate">
                      {recipe.title}
                    </h3>
                    <p className="text-xs text-muted-foreground mt-0.5">{recipe.description}</p>
                  </div>
                </div>

                {/* Macro breakdown */}
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1 text-xs">
                    <Dumbbell size={11} className="text-primary" />
                    <span className="font-medium text-foreground">{recipe.protein}g</span>
                    <span className="text-muted-foreground">P</span>
                  </div>
                  <div className="flex items-center gap-1 text-xs">
                    <span className="w-2 h-2 rounded-full bg-accent" />
                    <span className="font-medium text-foreground">{recipe.carbs}g</span>
                    <span className="text-muted-foreground">C</span>
                  </div>
                  <div className="flex items-center gap-1 text-xs">
                    <span className="w-2 h-2 rounded-full bg-warning" />
                    <span className="font-medium text-foreground">{recipe.fat}g</span>
                    <span className="text-muted-foreground">F</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Flame size={12} /> {recipe.calories} cal
                    </span>
                    <span className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock size={12} /> {recipe.prepTime} min
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => onSaveRecipe(recipe)}
                      className={`p-2 rounded-lg transition-colors ${
                        recipe.saved ? "text-destructive bg-destructive/10" : "text-muted-foreground hover:text-destructive hover:bg-destructive/5"
                      }`}
                    >
                      <Heart size={16} fill={recipe.saved ? "currentColor" : "none"} />
                    </button>
                    <div className="relative">
                      <button
                        onClick={() => setMealTypePickFor(mealTypePickFor === recipe.id ? null : recipe.id)}
                        className="p-2 rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/5 transition-colors"
                      >
                        <Plus size={16} />
                      </button>
                      {mealTypePickFor === recipe.id && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="absolute right-0 bottom-10 z-10 bg-card border border-border rounded-xl shadow-elevated p-1 min-w-[140px]"
                        >
                          {["🌅 Breakfast", "☀️ Lunch", "🌙 Dinner"].map((option) => (
                            <button
                              key={option}
                              onClick={() => {
                                setMealTypePickFor(null);
                                // TODO: add to plan as selected meal type
                              }}
                              className="w-full text-left text-sm px-3 py-2 rounded-lg hover:bg-muted transition-colors text-foreground"
                            >
                              {option}
                            </button>
                          ))}
                        </motion.div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default ExploreTab;
