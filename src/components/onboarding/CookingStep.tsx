import { motion } from "framer-motion";
import { UserProfile } from "@/types/grocery";

interface CookingStepProps {
  profile: UserProfile;
  onChange: (updates: Partial<UserProfile>) => void;
}

const timeOptions = [
  { value: "15min", label: "Under 15 min", emoji: "⚡" },
  { value: "30min", label: "15–30 min", emoji: "🕐" },
  { value: "45min", label: "30–45 min", emoji: "👩‍🍳" },
  { value: "60min+", label: "60+ min", emoji: "🍲" },
];

const MealCounter = ({
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
  <div className="flex items-center justify-between bg-card rounded-xl border border-border px-4 py-3">
    <div className="flex items-center gap-2">
      <span className="text-xl">{emoji}</span>
      <span className="text-sm font-medium text-foreground">{label}</span>
    </div>
    <div className="flex items-center gap-3">
      <button
        onClick={() => onChange(Math.max(0, value - 1))}
        className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-muted-foreground hover:bg-primary/10 hover:text-primary transition-colors"
      >−</button>
      <span className="text-lg font-semibold text-foreground w-6 text-center">{value}</span>
      <button
        onClick={() => onChange(Math.min(max, value + 1))}
        className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-muted-foreground hover:bg-primary/10 hover:text-primary transition-colors"
      >+</button>
    </div>
  </div>
);

const CookingStep = ({ profile, onChange }: CookingStepProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div>
        <h2 className="text-2xl font-display font-semibold text-foreground">
          What does your week look like?
        </h2>
        <p className="text-muted-foreground mt-1">
          How many meals do you cook at home?
        </p>
      </div>

      <div className="space-y-3">
        <MealCounter
          label="Breakfasts at home"
          emoji="🥣"
          value={profile.breakfastsAtHome}
          max={7}
          onChange={(v) => onChange({ breakfastsAtHome: v })}
        />
        <MealCounter
          label="Lunches at home"
          emoji="🥗"
          value={profile.lunchesAtHome}
          max={7}
          onChange={(v) => onChange({ lunchesAtHome: v })}
        />
        <MealCounter
          label="Dinners at home"
          emoji="🍝"
          value={profile.dinnersAtHome}
          max={7}
          onChange={(v) => onChange({ dinnersAtHome: v })}
        />
      </div>

      <div>
        <label className="text-sm font-medium text-foreground mb-2 block">
          Time to cook per meal
        </label>
        <div className="grid grid-cols-2 gap-2">
          {timeOptions.map((opt) => (
            <button
              key={opt.value}
              onClick={() => onChange({ cookingTime: opt.value })}
              className={`flex items-center gap-2 px-4 py-3 rounded-xl border-2 transition-all text-sm font-medium ${
                profile.cookingTime === opt.value
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
    </motion.div>
  );
};

export default CookingStep;
