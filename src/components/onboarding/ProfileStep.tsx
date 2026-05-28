import { motion } from "framer-motion";
import { UserProfile } from "@/types/grocery";

interface ProfileStepProps {
  profile: UserProfile;
  onChange: (updates: Partial<UserProfile>) => void;
}

const macroOptions = [
  { value: "balanced", label: "Balanced", emoji: "⚖️" },
  { value: "high-protein", label: "High Protein", emoji: "💪" },
  { value: "low-carb", label: "Low Carb", emoji: "🥑" },
  { value: "low-fat", label: "Low Fat", emoji: "🥗" },
];

const dietOptions = [
  { value: "none", label: "No Preference", emoji: "🍽️" },
  { value: "vegetarian", label: "Vegetarian", emoji: "🥬" },
  { value: "vegan", label: "Vegan", emoji: "🌱" },
  { value: "pescatarian", label: "Pescatarian", emoji: "🐟" },
  { value: "keto", label: "Keto", emoji: "🥓" },
  { value: "paleo", label: "Paleo", emoji: "🦴" },
];

const ProfileStep = ({ profile, onChange }: ProfileStepProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div>
        <h2 className="text-2xl font-display font-semibold text-foreground">
          Let's personalize your plan
        </h2>
        <p className="text-muted-foreground mt-1">
          Tell us about your nutrition goals
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="text-sm font-medium text-foreground mb-2 block">
            Daily Calorie Goal
          </label>
          <div className="flex items-center gap-3">
            <input
              type="range"
              min={1200}
              max={4000}
              step={50}
              value={profile.calorieGoal}
              onChange={(e) => onChange({ calorieGoal: Number(e.target.value) })}
              className="flex-1 accent-primary h-2"
            />
            <span className="text-lg font-semibold text-primary min-w-[60px] text-right">
              {profile.calorieGoal}
            </span>
          </div>
        </div>

        <div>
          <label className="text-sm font-medium text-foreground mb-2 block">
            Macro Preference
          </label>
          <div className="grid grid-cols-2 gap-2">
            {macroOptions.map((opt) => {
              const isSelected = profile.macroPreferences.includes(opt.value);
              return (
                <button
                  key={opt.value}
                  onClick={() => {
                    const updated = isSelected
                      ? profile.macroPreferences.filter((v) => v !== opt.value)
                      : [...profile.macroPreferences, opt.value];
                    onChange({ macroPreferences: updated.length > 0 ? updated : [opt.value] });
                  }}
                  className={`flex items-center gap-2 px-4 py-3 rounded-xl border-2 transition-all text-sm font-medium ${
                    isSelected
                      ? "border-primary bg-primary/5 text-primary"
                      : "border-border bg-card text-foreground hover:border-primary/30"
                  }`}
                >
                  <span>{opt.emoji}</span>
                  {opt.label}
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <label className="text-sm font-medium text-foreground mb-2 block">
            Dietary Type
          </label>
          <div className="grid grid-cols-2 gap-2">
            {dietOptions.map((opt) => (
              <button
                key={opt.value}
                onClick={() => onChange({ dietaryType: opt.value })}
                className={`flex items-center gap-2 px-4 py-3 rounded-xl border-2 transition-all text-sm font-medium ${
                  profile.dietaryType === opt.value
                    ? "border-primary bg-primary/5 text-primary"
                    : "border-border bg-card text-foreground hover:border-primary/30"
                }`}
              >
                <span>{opt.emoji}</span>
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">
              Household Size
            </label>
            <div className="flex items-center gap-3 bg-card rounded-xl border border-border px-4 py-3">
              <button
                onClick={() => onChange({ householdSize: Math.max(1, profile.householdSize - 1) })}
                className="text-xl text-muted-foreground hover:text-primary"
              >−</button>
              <span className="text-lg font-semibold text-foreground flex-1 text-center">
                {profile.householdSize}
              </span>
              <button
                onClick={() => onChange({ householdSize: profile.householdSize + 1 })}
                className="text-xl text-muted-foreground hover:text-primary"
              >+</button>
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">
              Days to Plan
            </label>
            <div className="flex items-center gap-3 bg-card rounded-xl border border-border px-4 py-3">
              <button
                onClick={() => onChange({ planDays: Math.max(1, profile.planDays - 1) })}
                className="text-xl text-muted-foreground hover:text-primary"
              >−</button>
              <span className="text-lg font-semibold text-foreground flex-1 text-center">
                {profile.planDays}
              </span>
              <button
                onClick={() => onChange({ planDays: Math.min(14, profile.planDays + 1) })}
                className="text-xl text-muted-foreground hover:text-primary"
              >+</button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ProfileStep;
