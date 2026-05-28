import { motion } from "framer-motion";
import { UserProfile } from "@/types/grocery";
import { X, Plus } from "lucide-react";
import { useState } from "react";

interface FoodPrefsStepProps {
  profile: UserProfile;
  onChange: (updates: Partial<UserProfile>) => void;
}

const commonAllergies = ["Peanuts", "Tree Nuts", "Dairy", "Eggs", "Shellfish", "Soy", "Wheat", "Fish"];
const commonDislikes = ["Mushrooms", "Olives", "Cilantro", "Onions", "Bell Peppers", "Tomatoes", "Eggplant", "Beets"];
const commonRestrictions = ["Pork", "Beef", "Gluten", "Alcohol", "Processed Sugar", "Soy Sauce"];

const ChipSelect = ({
  options,
  selected,
  onToggle,
  allowCustom,
  onAddCustom,
}: {
  options: string[];
  selected: string[];
  onToggle: (item: string) => void;
  allowCustom?: boolean;
  onAddCustom?: (item: string) => void;
}) => {
  const [customInput, setCustomInput] = useState("");
  const [showInput, setShowInput] = useState(false);

  const handleAddCustom = () => {
    const trimmed = customInput.trim();
    if (trimmed && onAddCustom) {
      onAddCustom(trimmed);
      setCustomInput("");
      setShowInput(false);
    }
  };

  // Show custom items that aren't in the preset options
  const customItems = selected.filter((s) => !options.includes(s));

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2">
        {options.map((item) => {
          const isSelected = selected.includes(item);
          return (
            <button
              key={item}
              onClick={() => onToggle(item)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                isSelected
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-primary/10 hover:text-primary"
              }`}
            >
              {item}
              {isSelected && <X size={12} className="inline ml-1" />}
            </button>
          );
        })}
        {customItems.map((item) => (
          <button
            key={item}
            onClick={() => onToggle(item)}
            className="px-3 py-1.5 rounded-full text-sm font-medium bg-primary text-primary-foreground transition-all"
          >
            {item}
            <X size={12} className="inline ml-1" />
          </button>
        ))}
        {allowCustom && !showInput && (
          <button
            onClick={() => setShowInput(true)}
            className="px-3 py-1.5 rounded-full text-sm font-medium bg-muted text-muted-foreground hover:bg-primary/10 hover:text-primary transition-all flex items-center gap-1"
          >
            <Plus size={12} /> Add other
          </button>
        )}
      </div>
      {allowCustom && showInput && (
        <div className="flex gap-2">
          <input
            autoFocus
            value={customInput}
            onChange={(e) => setCustomInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAddCustom()}
            placeholder="Type allergy or restriction..."
            className="flex-1 bg-muted rounded-xl px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-primary/20"
          />
          <button
            onClick={handleAddCustom}
            className="px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-medium"
          >
            Add
          </button>
          <button
            onClick={() => { setShowInput(false); setCustomInput(""); }}
            className="px-3 py-2 rounded-xl bg-muted text-muted-foreground text-sm"
          >
            ✕
          </button>
        </div>
      )}
    </div>
  );
};

const cuisineOptions = ["Italian", "Mexican", "Asian", "Mediterranean", "Indian", "American", "Japanese", "Thai", "Middle Eastern", "Korean", "French", "Caribbean"];

const FoodPrefsStep = ({ profile, onChange }: FoodPrefsStepProps) => {
  const toggle = (key: "allergies" | "dislikedFoods" | "restrictions" | "cuisinePreferences", item: string) => {
    const current = profile[key];
    onChange({
      [key]: current.includes(item)
        ? current.filter((i) => i !== item)
        : [...current, item],
    });
  };

  const addCustom = (key: "allergies" | "dislikedFoods" | "restrictions", item: string) => {
    if (!profile[key].includes(item)) {
      onChange({ [key]: [...profile[key], item] });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div>
        <h2 className="text-2xl font-display font-semibold text-foreground">
          Any food restrictions?
        </h2>
        <p className="text-muted-foreground mt-1">
          We'll make sure your meals avoid these
        </p>
      </div>

      <div className="space-y-5">
        <div>
          <label className="text-sm font-medium text-foreground mb-2 block">
            🌍 Cuisine Preferences
          </label>
          <p className="text-xs text-muted-foreground mb-2">Select cuisines you enjoy</p>
          <ChipSelect
            options={cuisineOptions}
            selected={profile.cuisinePreferences}
            onToggle={(item) => toggle("cuisinePreferences", item)}
          />
        </div>

        <div>
          <label className="text-sm font-medium text-foreground mb-2 block">
            🚨 Allergies
          </label>
          <ChipSelect
            options={commonAllergies}
            selected={profile.allergies}
            onToggle={(item) => toggle("allergies", item)}
            allowCustom
            onAddCustom={(item) => addCustom("allergies", item)}
          />
        </div>

        <div>
          <label className="text-sm font-medium text-foreground mb-2 block">
            👎 Foods you dislike
          </label>
          <ChipSelect
            options={commonDislikes}
            selected={profile.dislikedFoods}
            onToggle={(item) => toggle("dislikedFoods", item)}
            allowCustom
            onAddCustom={(item) => addCustom("dislikedFoods", item)}
          />
        </div>

        <div>
          <label className="text-sm font-medium text-foreground mb-2 block">
            🚫 Ingredient restrictions
          </label>
          <ChipSelect
            options={commonRestrictions}
            selected={profile.restrictions}
            onToggle={(item) => toggle("restrictions", item)}
            allowCustom
            onAddCustom={(item) => addCustom("restrictions", item)}
          />
        </div>
      </div>
    </motion.div>
  );
};

export default FoodPrefsStep;
