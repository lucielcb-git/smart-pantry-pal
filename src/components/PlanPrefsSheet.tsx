import { useState } from "react";
import { motion } from "framer-motion";
import { UserProfile } from "@/types/grocery";
import { Sparkles, ChevronDown, ChevronUp } from "lucide-react";

interface PlanPrefsSheetProps {
  profile: UserProfile;
  onStart: (prefs: UserProfile) => void;
}

const macroOptions = [
  { value: "balanced", label: "Balanced", emoji: "⚖️" },
  { value: "high-protein", label: "High Protein", emoji: "💪" },
  { value: "low-carb", label: "Low Carb", emoji: "🥑" },
  { value: "low-fat", label: "Low Fat", emoji: "🥗" },
];

const timeOptions = [
  { value: "15min", label: "<15 min", emoji: "⚡" },
  { value: "30min", label: "15–30 min", emoji: "🕐" },
  { value: "45min", label: "30–45 min", emoji: "👩‍🍳" },
  { value: "60min+", label: "60+ min", emoji: "🍲" },
];

const MiniCounter = ({
  label,
  emoji,
  value,
  max,
  onChange,
}: {
  label: string;
  emoji: string;
  value: number;
  max: number;
  onChange: (v: number) => void;
}) => (
  <div className="flex items-center justify-between bg-card rounded-xl border border-border px-3 py-2.5">
    <div className="flex items-center gap-2">
      <span className="text-base">{emoji}</span>
      <span className="text-xs font-medium text-foreground">{label}</span>
    </div>
    <div className="flex items-center gap-2">
      <button
        onClick={() => onChange(Math.max(0, value - 1))}
        className="w-7 h-7 rounded-full bg-muted flex items-center justify-center text-muted-foreground hover:bg-primary/10 hover:text-primary transition-colors text-sm"
      >−</button>
      <span className="text-sm font-semibold text-foreground w-4 text-center">{value}</span>
      <button
        onClick={() => onChange(Math.min(max, value + 1))}
        className="w-7 h-7 rounded-full bg-muted flex items-center justify-center text-muted-foreground hover:bg-primary/10 hover:text-primary transition-colors text-sm"
      >+</button>
    </div>
  </div>
);

const PlanPrefsSheet = ({ profile, onStart }: PlanPrefsSheetProps) => {
  const [prefs, setPrefs] = useState<UserProfile>({ ...profile });
  const [showMore, setShowMore] = useState(false);

  const update = (changes: Partial<UserProfile>) => {
    setPrefs((prev) => ({ ...prev, ...changes }));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-5"
    >
      <div>
        <h2 className="text-2xl font-display font-bold text-foreground">New Plan</h2>
        <p className="text-sm text-muted-foreground mt-0.5">
          Review your preferences or just hit go
        </p>
      </div>

      {/* Quick summary card */}
      <div className="bg-card rounded-2xl border border-border p-4 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Quick Summary</span>
          <span className="text-xs text-primary font-medium">{prefs.calorieGoal} cal/day</span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {prefs.macroPreferences.map((mp) => (
            <span key={mp} className="text-xs bg-primary/10 text-primary px-2.5 py-1 rounded-full font-medium">
              {macroOptions.find(m => m.value === mp)?.emoji} {mp}
            </span>
          ))}
          <span className="text-xs bg-secondary text-secondary-foreground px-2.5 py-1 rounded-full">
            👥 {prefs.householdSize} {prefs.householdSize === 1 ? "person" : "people"}
          </span>
          <span className="text-xs bg-secondary text-secondary-foreground px-2.5 py-1 rounded-full">
            📅 {prefs.planDays} days
          </span>
          <span className="text-xs bg-secondary text-secondary-foreground px-2.5 py-1 rounded-full">
            {timeOptions.find(t => t.value === prefs.cookingTime)?.emoji} {prefs.cookingTime}
          </span>
        </div>
      </div>

      {/* Meal counts - always visible */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">Meals this week</label>
        <MiniCounter label="Breakfasts" emoji="🥣" value={prefs.breakfastsAtHome} max={7} onChange={(v) => update({ breakfastsAtHome: v })} />
        <MiniCounter label="Lunches" emoji="🥗" value={prefs.lunchesAtHome} max={7} onChange={(v) => update({ lunchesAtHome: v })} />
        <MiniCounter label="Dinners" emoji="🍝" value={prefs.dinnersAtHome} max={7} onChange={(v) => update({ dinnersAtHome: v })} />
      </div>

      {/* Expand for more settings */}
      <button
        onClick={() => setShowMore(!showMore)}
        className="flex items-center gap-2 text-sm text-primary font-medium hover:text-primary/80 transition-colors w-full justify-center py-1"
      >
        {showMore ? "Show less" : "Modify more settings"}
        {showMore ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
      </button>

      {showMore && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="space-y-4 overflow-hidden"
        >
          {/* Calorie slider */}
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">Daily Calories</label>
            <div className="flex items-center gap-3">
              <input
                type="range"
                min={1200}
                max={4000}
                step={50}
                value={prefs.calorieGoal}
                onChange={(e) => update({ calorieGoal: Number(e.target.value) })}
                className="flex-1 accent-primary h-2"
              />
              <span className="text-lg font-semibold text-primary min-w-[60px] text-right">{prefs.calorieGoal}</span>
            </div>
          </div>

          {/* Macro preferences */}
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">Macro Preferences</label>
            <div className="grid grid-cols-2 gap-2">
              {macroOptions.map((opt) => {
                const isSelected = prefs.macroPreferences.includes(opt.value);
                return (
                  <button
                    key={opt.value}
                    onClick={() => {
                      const updated = isSelected
                        ? prefs.macroPreferences.filter((v) => v !== opt.value)
                        : [...prefs.macroPreferences, opt.value];
                      update({ macroPreferences: updated.length > 0 ? updated : [opt.value] });
                    }}
                    className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border-2 transition-all text-xs font-medium ${
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

          {/* Cook time */}
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">Cook Time</label>
            <div className="grid grid-cols-2 gap-2">
              {timeOptions.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => update({ cookingTime: opt.value })}
                  className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border-2 transition-all text-xs font-medium ${
                    prefs.cookingTime === opt.value
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

          {/* Household & days */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-foreground mb-1.5 block">Household</label>
              <div className="flex items-center gap-2 bg-card rounded-xl border border-border px-3 py-2.5">
                <button onClick={() => update({ householdSize: Math.max(1, prefs.householdSize - 1) })} className="text-lg text-muted-foreground hover:text-primary">−</button>
                <span className="text-sm font-semibold text-foreground flex-1 text-center">{prefs.householdSize}</span>
                <button onClick={() => update({ householdSize: prefs.householdSize + 1 })} className="text-lg text-muted-foreground hover:text-primary">+</button>
              </div>
            </div>
            <div>
              <label className="text-xs font-medium text-foreground mb-1.5 block">Days to plan</label>
              <div className="flex items-center gap-2 bg-card rounded-xl border border-border px-3 py-2.5">
                <button onClick={() => update({ planDays: Math.max(1, prefs.planDays - 1) })} className="text-lg text-muted-foreground hover:text-primary">−</button>
                <span className="text-sm font-semibold text-foreground flex-1 text-center">{prefs.planDays}</span>
                <button onClick={() => update({ planDays: Math.min(14, prefs.planDays + 1) })} className="text-lg text-muted-foreground hover:text-primary">+</button>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Action buttons */}
      <div className="pt-2 space-y-2">
        <button
          onClick={() => onStart(prefs)}
          className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-gradient-primary text-primary-foreground font-semibold text-sm"
        >
          <Sparkles size={16} />
          Generate Plan
        </button>
      </div>
    </motion.div>
  );
};

export default PlanPrefsSheet;
