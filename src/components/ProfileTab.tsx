import { motion } from "framer-motion";
import logo from "@/assets/logo.png";
import { UserProfile, ExploreRecipe, ArchivedList } from "@/types/grocery";
import { User, Target, ShoppingBag, Heart, ChevronRight, Utensils, Archive, Bookmark, Clock, Flame, Trash2, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";

interface ProfileTabProps {
  profile: UserProfile;
  onEditProfile: () => void;
  savedRecipes: ExploreRecipe[];
  archivedLists: ArchivedList[];
  onRemoveSavedRecipe: (id: string) => void;
}

const recipeEmojis: Record<string, string> = {
  "e1": "🍜", "e2": "🥚", "e3": "🍋", "e4": "🫘",
  "e5": "🌈", "e6": "🍣", "e7": "🥬", "e8": "🥡",
};

const ProfileTab = ({ profile, onEditProfile, savedRecipes, archivedLists, onRemoveSavedRecipe }: ProfileTabProps) => {
  const [expandedArchive, setExpandedArchive] = useState<string | null>(null);

  const sections = [
    {
      icon: Target,
      label: "Nutrition Goals",
      value: `${profile.calorieGoal} cal · ${profile.macroPreferences.join(", ")}`,
    },
    {
      icon: Utensils,
      label: "Dietary Type",
      value: profile.dietaryType === "none" ? "No restrictions" : profile.dietaryType,
    },
    {
      icon: User,
      label: "Household",
      value: `${profile.householdSize} ${profile.householdSize === 1 ? "person" : "people"}`,
    },
    {
      icon: ShoppingBag,
      label: "Shopping",
      value: `${(profile.preferredRetailers || [profile.preferredRetailer]).join(", ")} · ${(profile.shoppingMethods || [profile.shoppingMethod]).join(", ")}`,
    },
    {
      icon: Heart,
      label: "Restrictions",
      value: [...profile.allergies, ...profile.restrictions].join(", ") || "None",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <img src={logo} alt="GrocerEase" className="h-8 w-8 object-contain" />
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground"><span className="text-primary">Grocer</span>Ease</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Manage your preferences</p>
        </div>
      </div>

      {/* Avatar */}
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 rounded-2xl bg-gradient-primary flex items-center justify-center">
          <User size={28} className="text-primary-foreground" />
        </div>
        <div>
          <p className="text-lg font-semibold text-foreground">My Profile</p>
          <p className="text-sm text-muted-foreground">{profile.planDays}-day meal plans</p>
        </div>
      </div>

      {/* Settings */}
      <div className="space-y-2">
        {sections.map((section, i) => (
          <motion.button
            key={section.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            onClick={onEditProfile}
            className="w-full flex items-center gap-3 bg-card rounded-xl border border-border p-4 text-left hover:border-primary/30 transition-colors"
          >
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <section.icon size={18} className="text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground">{section.label}</p>
              <p className="text-xs text-muted-foreground truncate">{section.value}</p>
            </div>
            <ChevronRight size={16} className="text-muted-foreground" />
          </motion.button>
        ))}
      </div>

      {/* Saved Recipes */}
      <div>
        <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
          <Bookmark size={16} className="text-primary" /> Saved Recipes ({savedRecipes.length})
        </h3>
        {savedRecipes.length === 0 ? (
          <div className="bg-card rounded-xl border border-border p-4 text-center">
            <p className="text-sm text-muted-foreground">No saved recipes yet. Explore the feed to save some!</p>
          </div>
        ) : (
          <div className="space-y-2">
            {savedRecipes.map((recipe) => (
              <div
                key={recipe.id}
                className="flex items-center gap-3 bg-card rounded-xl border border-border p-3"
              >
                <div className="w-10 h-10 rounded-lg bg-gradient-primary flex items-center justify-center text-lg">
                  {recipeEmojis[recipe.id] || "🍽️"}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{recipe.title}</p>
                  <p className="text-xs text-muted-foreground flex items-center gap-2">
                    <span className="flex items-center gap-0.5"><Flame size={10} /> {recipe.calories} cal</span>
                    <span className="flex items-center gap-0.5"><Clock size={10} /> {recipe.prepTime} min</span>
                  </p>
                </div>
                <button
                  onClick={() => onRemoveSavedRecipe(recipe.id)}
                  className="p-1.5 rounded-md text-muted-foreground hover:text-destructive hover:bg-destructive/5 transition-colors"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Archived Lists */}
      <div>
        <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
          <Archive size={16} className="text-primary" /> Archived Grocery Lists ({archivedLists.length})
        </h3>
        {archivedLists.length === 0 ? (
          <div className="bg-card rounded-xl border border-border p-4 text-center">
            <p className="text-sm text-muted-foreground">No archived lists yet. Complete a grocery list to archive it.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {archivedLists.map((list) => (
              <div key={list.id} className="bg-card rounded-xl border border-border overflow-hidden">
                <button
                  onClick={() => setExpandedArchive(expandedArchive === list.id ? null : list.id)}
                  className="w-full flex items-center gap-3 p-3 text-left"
                >
                  <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center text-sm">
                    📋
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">{list.date}</p>
                    <p className="text-xs text-muted-foreground">{list.itemCount} items · {list.retailer}</p>
                  </div>
                  {expandedArchive === list.id ? (
                    <ChevronUp size={16} className="text-muted-foreground" />
                  ) : (
                    <ChevronDown size={16} className="text-muted-foreground" />
                  )}
                </button>
                {expandedArchive === list.id && (
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: "auto" }}
                    className="border-t border-border px-3 pb-3 pt-2 space-y-1"
                  >
                    {list.items.map((item) => (
                      <div key={item.id} className="flex items-center gap-2 text-xs text-muted-foreground py-1">
                        <span>{item.emoji || "•"}</span>
                        <span className="flex-1">{item.name}</span>
                        <span>{item.quantity}</span>
                      </div>
                    ))}
                  </motion.div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileTab;
