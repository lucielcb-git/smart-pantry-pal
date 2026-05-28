import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { UserProfile, defaultProfile } from "@/types/grocery";
import { ChevronLeft, Sparkles, Check, Plus, X } from "lucide-react";
import logo from "@/assets/logo.png";
import welcomeBg from "@/assets/welcome-bg.jpg";

interface OnboardingFlowProps {
  onComplete: (profile: UserProfile) => void;
}

// ── Inline counter for "meals at home" combined page ──
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
  <div className="flex items-center justify-between bg-white/60 rounded-2xl px-5 py-4">
    <div className="flex items-center gap-3">
      <span className="text-xl">{emoji}</span>
      <span className="text-sm font-semibold text-foreground">{label}</span>
    </div>
    <div className="flex items-center gap-3">
      <button
        onClick={() => onChange(Math.max(0, value - 1))}
        className="w-9 h-9 rounded-full bg-muted flex items-center justify-center text-muted-foreground hover:bg-primary/10 hover:text-primary transition-colors text-base font-medium"
      >−</button>
      <span className="text-base font-display font-bold text-foreground w-5 text-center">{value}</span>
      <button
        onClick={() => onChange(Math.min(max, value + 1))}
        className="w-9 h-9 rounded-full bg-muted flex items-center justify-center text-muted-foreground hover:bg-primary/10 hover:text-primary transition-colors text-base font-medium"
      >+</button>
    </div>
  </div>
);

// ── Step definitions ──
type StepType = "single" | "multi" | "slider" | "counter" | "chips" | "meals" | "combined";

interface OptionItem {
  value: string;
  label: string;
  description?: string;
  emoji?: string;
}

interface OnboardingStep {
  id: string;
  question: string;
  subtitle?: string;
  type: StepType;
  // For single/multi/chips
  options?: OptionItem[];
  field?: keyof UserProfile;
  chipOptions?: string[];
  allowCustomChip?: boolean;
  // For slider
  sliderConfig?: { min: number; max: number; step: number; unit: string };
  // For counter
  counterConfig?: { min: number; max: number };
  // For combined - multiple sections on one page
  sections?: {
    label: string;
    type: "single" | "multi" | "chips" | "counter";
    field: keyof UserProfile;
    options?: OptionItem[];
    chipOptions?: string[];
    allowCustomChip?: boolean;
    counterConfig?: { min: number; max: number };
  }[];
}

const steps: OnboardingStep[] = [
  {
    id: "welcome",
    question: "",
    type: "single" as StepType,
    field: "dietaryType" as keyof UserProfile, // dummy, not used
  },
  {
    id: "calorie",
    question: "What's your daily calorie goal?",
    subtitle: "We'll plan meals around this target",
    type: "slider",
    field: "calorieGoal",
    sliderConfig: { min: 1200, max: 4000, step: 50, unit: "cal" },
  },
  {
    id: "preferences",
    question: "Your dietary preferences",
    subtitle: "Tell us about your diet and macro goals",
    type: "combined",
    sections: [
      {
        label: "Macro preferences",
        type: "multi",
        field: "macroPreferences",
        options: [
          { value: "balanced", label: "Balanced", emoji: "⚖️" },
          { value: "high-protein", label: "High Protein", emoji: "💪" },
          { value: "low-carb", label: "Low Carb", emoji: "🥑" },
          { value: "low-fat", label: "Low Fat", emoji: "🥗" },
        ],
      },
      {
        label: "Diet type",
        type: "single",
        field: "dietaryType",
        options: [
          { value: "none", label: "No Preference", emoji: "🍽️" },
          { value: "vegetarian", label: "Vegetarian", emoji: "🥬" },
          { value: "vegan", label: "Vegan", emoji: "🌱" },
          { value: "pescatarian", label: "Pescatarian", emoji: "🐟" },
          { value: "keto", label: "Keto", emoji: "🥓" },
          { value: "paleo", label: "Paleo", emoji: "🦴" },
        ],
      },
    ],
  },
  {
    id: "household",
    question: "How many people are you cooking for?",
    subtitle: "We'll scale portions accordingly",
    type: "counter",
    field: "householdSize",
    counterConfig: { min: 1, max: 10 },
  },
  {
    id: "mealsAtHome",
    question: "How many meals at home per week?",
    subtitle: "We'll plan around your schedule",
    type: "meals",
  },
  {
    id: "cookTime",
    question: "How much time do you have to cook?",
    subtitle: "Per meal, on average",
    type: "single",
    field: "cookingTime",
    options: [
      { value: "15min", label: "Under 15 min", description: "Quick & easy meals", emoji: "⚡" },
      { value: "30min", label: "15–30 min", description: "Moderate effort", emoji: "🕐" },
      { value: "45min", label: "30–45 min", description: "More involved cooking", emoji: "👩‍🍳" },
      { value: "60min+", label: "60+ min", description: "Elaborate recipes", emoji: "🍲" },
    ],
  },
  {
    id: "cuisine",
    question: "What cuisines do you enjoy?",
    subtitle: "Select all that sound good",
    type: "chips",
    field: "cuisinePreferences",
    chipOptions: ["Italian", "Mexican", "Asian", "Mediterranean", "Indian", "American", "Japanese", "Thai", "Middle Eastern", "Korean", "French", "Caribbean"],
  },
  {
    id: "restrictions",
    question: "Allergies & dislikes",
    subtitle: "We'll keep these off your plate",
    type: "combined",
    sections: [
      {
        label: "Allergies",
        type: "chips",
        field: "allergies",
        chipOptions: ["Peanuts", "Tree Nuts", "Dairy", "Eggs", "Shellfish", "Soy", "Wheat", "Fish"],
        allowCustomChip: true,
      },
      {
        label: "Foods you dislike",
        type: "chips",
        field: "dislikedFoods",
        chipOptions: ["Mushrooms", "Olives", "Cilantro", "Onions", "Bell Peppers", "Tomatoes", "Eggplant", "Beets"],
        allowCustomChip: true,
      },
    ],
  },
  {
    id: "shopping",
    question: "Where & how do you shop?",
    subtitle: "Select all that apply",
    type: "combined",
    sections: [
      {
        label: "Preferred stores",
        type: "multi",
        field: "preferredRetailers",
        options: [
          { value: "Trader Joe's", label: "Trader Joe's", emoji: "🌻" },
          { value: "Whole Foods", label: "Whole Foods", emoji: "🥑" },
          { value: "Amazon Fresh", label: "Amazon Fresh", emoji: "📦" },
          { value: "Walmart", label: "Walmart", emoji: "🏪" },
          { value: "Costco", label: "Costco", emoji: "🛒" },
          { value: "Target", label: "Target", emoji: "🎯" },
        ],
      },
      {
        label: "Shopping method",
        type: "multi",
        field: "shoppingMethods",
        options: [
          { value: "in-store", label: "In Store", emoji: "🏬" },
          { value: "delivery", label: "Delivery", emoji: "🚚" },
          { value: "pickup", label: "Pickup", emoji: "🅿️" },
        ],
      },
    ],
  },
];

// ── Reusable renderers ──

const SelectCards = ({
  options,
  value,
  type,
  onUpdate,
}: {
  options: OptionItem[];
  value: any;
  type: "single" | "multi";
  onUpdate: (v: any) => void;
}) => (
  <div className="space-y-2">
    {options.map((opt) => {
      const isSelected = type === "multi"
        ? (value as string[])?.includes(opt.value)
        : value === opt.value;
      return (
        <button
          key={opt.value}
          onClick={() => {
            if (type === "multi") {
              const arr = (value as string[]) || [];
              onUpdate(arr.includes(opt.value) ? arr.filter((v: string) => v !== opt.value) : [...arr, opt.value]);
            } else {
              onUpdate(opt.value);
            }
          }}
          className={`w-full flex items-center gap-4 px-5 py-3.5 rounded-2xl border-2 transition-all text-left ${
            isSelected
              ? "border-primary bg-primary/5 shadow-sm"
              : "border-transparent bg-white/60 hover:bg-white/80"
          }`}
        >
          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${
            isSelected ? "border-primary bg-primary" : "border-foreground/20"
          }`}>
            {isSelected && <Check size={12} className="text-primary-foreground" />}
          </div>
          {opt.emoji && <span className="text-lg">{opt.emoji}</span>}
          <div className="flex-1">
            <p className="text-sm font-semibold text-foreground">{opt.label}</p>
            {opt.description && <p className="text-xs text-foreground/50 mt-0.5">{opt.description}</p>}
          </div>
        </button>
      );
    })}
  </div>
);

const ChipSelect = ({
  chipOptions,
  value,
  allowCustomChip,
  onUpdate,
  customInput,
  setCustomInput,
  showCustomInput,
  setShowCustomInput,
}: {
  chipOptions: string[];
  value: string[];
  allowCustomChip?: boolean;
  onUpdate: (v: string[]) => void;
  customInput: string;
  setCustomInput: (v: string) => void;
  showCustomInput: boolean;
  setShowCustomInput: (v: boolean) => void;
}) => (
  <div className="space-y-3">
    <div className="flex flex-wrap gap-2">
      {chipOptions.map((chip) => {
        const isSelected = value.includes(chip);
        return (
          <button
            key={chip}
            onClick={() => onUpdate(isSelected ? value.filter((c) => c !== chip) : [...value, chip])}
            className={`px-4 py-2.5 rounded-full text-sm font-medium transition-all ${
              isSelected ? "bg-primary text-primary-foreground shadow-sm" : "bg-white/60 text-foreground/70 hover:bg-white/80"
            }`}
          >
            {chip}
            {isSelected && <X size={12} className="inline ml-1.5" />}
          </button>
        );
      })}
      {value.filter((v) => !chipOptions.includes(v)).map((chip) => (
        <button
          key={chip}
          onClick={() => onUpdate(value.filter((c) => c !== chip))}
          className="px-4 py-2.5 rounded-full text-sm font-medium bg-primary text-primary-foreground shadow-sm"
        >
          {chip} <X size={12} className="inline ml-1.5" />
        </button>
      ))}
      {allowCustomChip && !showCustomInput && (
        <button
          onClick={() => setShowCustomInput(true)}
          className="px-4 py-2.5 rounded-full text-sm font-medium bg-white/60 text-foreground/50 hover:bg-white/80 flex items-center gap-1"
        >
          <Plus size={14} /> Add other
        </button>
      )}
    </div>
    {allowCustomChip && showCustomInput && (
      <div className="flex gap-2">
        <input
          autoFocus
          value={customInput}
          onChange={(e) => setCustomInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              const trimmed = customInput.trim();
              if (trimmed && !value.includes(trimmed)) onUpdate([...value, trimmed]);
              setCustomInput("");
              setShowCustomInput(false);
            }
          }}
          placeholder="Type and press enter..."
          className="flex-1 bg-white/60 rounded-xl px-4 py-2.5 text-sm text-foreground placeholder:text-foreground/30 outline-none focus:ring-2 focus:ring-primary/20"
        />
        <button
          onClick={() => {
            const trimmed = customInput.trim();
            if (trimmed && !value.includes(trimmed)) onUpdate([...value, trimmed]);
            setCustomInput("");
            setShowCustomInput(false);
          }}
          className="px-4 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-medium"
        >Add</button>
        <button onClick={() => { setShowCustomInput(false); setCustomInput(""); }} className="px-3 py-2.5 rounded-xl bg-white/60 text-foreground/50 text-sm">✕</button>
      </div>
    )}
  </div>
);

// ── Main component ──

const OnboardingFlow = ({ onComplete }: OnboardingFlowProps) => {
  const [step, setStep] = useState(0);
  const [profile, setProfile] = useState<UserProfile>(defaultProfile);
  const [customInput, setCustomInput] = useState("");
  const [showCustomInput, setShowCustomInput] = useState(false);
  // Track which combined section's custom input is active
  const [activeCustomSection, setActiveCustomSection] = useState<string | null>(null);

  const current = steps[step];
  const total = steps.length;
  const isLast = step === total - 1;
  const isWelcome = current.id === "welcome";
  // For progress display, exclude welcome step
  const progressStep = step; // welcome is step 0
  const progressTotal = total - 1; // don't count welcome

  const update = (changes: Partial<UserProfile>) => {
    setProfile((prev) => ({ ...prev, ...changes }));
  };

  const canContinue = () => {
    if (isWelcome) return true;
    if (current.type === "single" && current.field && current.id !== "welcome") {
      const val = profile[current.field];
      return val !== undefined && val !== "";
    }
    if (current.type === "multi" && current.field) {
      const val = profile[current.field];
      return Array.isArray(val) && (val as string[]).length > 0;
    }
    return true;
  };

  const handleComplete = () => {
    const finalProfile = {
      ...profile,
      preferredRetailer: profile.preferredRetailers[0] || "Whole Foods",
      shoppingMethod: profile.shoppingMethods[0] || "in-store",
    };
    onComplete(finalProfile);
  };

  const renderSection = (section: NonNullable<OnboardingStep["sections"]>[number]) => {
    const val = profile[section.field];
    if (section.type === "single" || section.type === "multi") {
      return (
        <SelectCards
          options={section.options || []}
          value={val}
          type={section.type}
          onUpdate={(v) => update({ [section.field]: v } as any)}
        />
      );
    }
    if (section.type === "chips") {
      return (
        <ChipSelect
          chipOptions={section.chipOptions || []}
          value={(val as string[]) || []}
          allowCustomChip={section.allowCustomChip}
          onUpdate={(v) => update({ [section.field]: v } as any)}
          customInput={activeCustomSection === section.field ? customInput : ""}
          setCustomInput={setCustomInput}
          showCustomInput={activeCustomSection === section.field && showCustomInput}
          setShowCustomInput={(v) => {
            setActiveCustomSection(v ? section.field : null);
            setShowCustomInput(v);
          }}
        />
      );
    }
    return null;
  };

  return (
    <div
      className="min-h-screen flex flex-col relative overflow-hidden max-w-md mx-auto"
      style={{
        background: isWelcome
          ? "black"
          : "linear-gradient(160deg, hsl(160 30% 96%) 0%, hsl(140 20% 94%) 30%, hsl(170 25% 92%) 60%, hsl(150 15% 97%) 100%)",
      }}
    >
      {/* Welcome photo background */}
      {isWelcome && (
        <>
          <motion.img
            src={welcomeBg}
            alt=""
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 0.45, scale: 1 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-black/5" />
        </>
      )}
      {/* Grain overlay */}
      {!isWelcome && (
        <div
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E\")" }}
        />
      )}

      {/* Top nav - hidden on welcome */}
      {!isWelcome && (
        <div className="relative z-10 max-w-lg mx-auto w-full px-5 pt-6">
          <div className="flex items-center justify-between mb-4">
            {step > 0 ? (
              <button onClick={() => setStep(step - 1)} className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-black/5 transition-colors">
                <ChevronLeft size={22} className="text-foreground" />
              </button>
            ) : <div className="w-10" />}
            <span className="text-sm font-medium text-foreground/60">{progressStep} of {progressTotal}</span>
            <div className="w-10" />
          </div>
          <div className="h-1.5 bg-black/5 rounded-full overflow-hidden mb-8">
            <motion.div
              className="h-full rounded-full bg-primary"
              animate={{ width: `${(progressStep / progressTotal) * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>
      )}

      {/* Content */}
      <div className={`flex-1 relative z-10 max-w-lg mx-auto w-full px-5 pb-28 overflow-y-auto ${isWelcome ? "flex flex-col items-center justify-center text-center" : ""}`}>
        <AnimatePresence mode="wait">
          <motion.div
            key={current.id}
            initial={{ opacity: 0, x: isWelcome ? 0 : 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: isWelcome ? 0 : -30 }}
            transition={{ duration: 0.25 }}
            className={isWelcome ? "space-y-6 flex flex-col items-center" : "space-y-6"}
          >
            {/* Welcome screen */}
            {isWelcome && (
              <div className="flex flex-col items-center gap-4 pt-12">
                <motion.img 
                  src={logo} 
                  alt="GrocerEase" 
                  className="w-28 h-28 object-contain drop-shadow-lg"
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.1, type: "spring", bounce: 0.4 }}
                />
                <h1 className="text-4xl font-display font-bold text-white">
                  <span className="text-white/90">Grocer</span>Ease
                </h1>
                <p className="text-base text-white/60 max-w-xs">
                  AI-powered meal planning & grocery lists, personalized to you.
                </p>
              </div>
            )}

            {/* Question header - skip for welcome */}
            {!isWelcome && (
              <div>
                <h2 className="text-2xl font-display font-bold text-foreground leading-tight">
                  {current.question}
                </h2>
                {current.subtitle && (
                  <p className="text-sm text-foreground/50 mt-1.5">{current.subtitle}</p>
                )}
              </div>
            )}

            {/* Single / Multi select */}
            {(current.type === "single" || current.type === "multi") && current.options && current.field && (
              <SelectCards
                options={current.options}
                value={profile[current.field]}
                type={current.type}
                onUpdate={(v) => update({ [current.field!]: v } as any)}
              />
            )}

            {/* Slider */}
            {current.type === "slider" && current.sliderConfig && current.field && (
              <div className="space-y-6 pt-4">
                <div className="text-center">
                  <span className="text-5xl font-display font-bold text-primary">
                    {profile[current.field] as number}
                  </span>
                  <span className="text-lg text-foreground/40 ml-2">{current.sliderConfig.unit}</span>
                </div>
                <input
                  type="range"
                  min={current.sliderConfig.min}
                  max={current.sliderConfig.max}
                  step={current.sliderConfig.step}
                  value={profile[current.field] as number}
                  onChange={(e) => update({ [current.field!]: Number(e.target.value) } as any)}
                  className="w-full accent-primary h-2"
                />
                <div className="flex justify-between text-xs text-foreground/40">
                  <span>{current.sliderConfig.min}</span>
                  <span>{current.sliderConfig.max}</span>
                </div>
              </div>
            )}

            {/* Counter */}
            {current.type === "counter" && current.counterConfig && current.field && (
              <div className="flex flex-col items-center gap-6 pt-8">
                <div className="flex items-center gap-6">
                  <button
                    onClick={() => {
                      const v = (profile[current.field!] as number) || 0;
                      update({ [current.field!]: Math.max(current.counterConfig!.min, v - 1) } as any);
                    }}
                    className="w-14 h-14 rounded-full bg-white/60 border-2 border-foreground/10 flex items-center justify-center text-foreground/60 hover:bg-white hover:border-foreground/20 transition-all text-xl font-medium"
                  >−</button>
                  <span className="text-5xl font-display font-bold text-foreground min-w-[80px] text-center">
                    {profile[current.field!] as number}
                  </span>
                  <button
                    onClick={() => {
                      const v = (profile[current.field!] as number) || 0;
                      update({ [current.field!]: Math.min(current.counterConfig!.max, v + 1) } as any);
                    }}
                    className="w-14 h-14 rounded-full bg-white/60 border-2 border-foreground/10 flex items-center justify-center text-foreground/60 hover:bg-white hover:border-foreground/20 transition-all text-xl font-medium"
                  >+</button>
                </div>
              </div>
            )}

            {/* Meals at home - combined counters */}
            {current.type === "meals" && (
              <div className="space-y-3">
                <MealCounter label="Breakfasts" emoji="🥣" value={profile.breakfastsAtHome} max={7} onChange={(v) => update({ breakfastsAtHome: v })} />
                <MealCounter label="Lunches" emoji="🥗" value={profile.lunchesAtHome} max={7} onChange={(v) => update({ lunchesAtHome: v })} />
                <MealCounter label="Dinners" emoji="🍝" value={profile.dinnersAtHome} max={7} onChange={(v) => update({ dinnersAtHome: v })} />
              </div>
            )}

            {/* Chips */}
            {current.type === "chips" && current.chipOptions && current.field && (
              <ChipSelect
                chipOptions={current.chipOptions}
                value={(profile[current.field] as string[]) || []}
                allowCustomChip={current.allowCustomChip}
                onUpdate={(v) => update({ [current.field!]: v } as any)}
                customInput={customInput}
                setCustomInput={setCustomInput}
                showCustomInput={showCustomInput}
                setShowCustomInput={setShowCustomInput}
              />
            )}

            {/* Combined sections */}
            {current.type === "combined" && current.sections && (
              <div className="space-y-6">
                {current.sections.map((section) => (
                  <div key={section.field} className="space-y-2.5">
                    <label className="text-xs font-semibold text-foreground/50 uppercase tracking-wider">
                      {section.label}
                    </label>
                    {renderSection(section)}
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bottom button */}
      <div className="fixed bottom-0 left-0 right-0 z-20 px-5 py-5">
        <div className="max-w-lg mx-auto">
          <button
            onClick={() => (isLast ? handleComplete() : setStep(step + 1))}
            disabled={!canContinue()}
            className="w-full max-w-[200px] mx-auto py-3 rounded-2xl font-semibold text-sm transition-all disabled:opacity-40 flex items-center justify-center gap-2 bg-primary text-primary-foreground shadow-lg"
            style={{ opacity: canContinue() ? 1 : 0.4 }}
          >
            {isWelcome ? (
              "Get Started"
            ) : isLast ? (
              <>
                <Sparkles size={16} />
                Generate My Plan
              </>
            ) : (
              "Continue"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default OnboardingFlow;
