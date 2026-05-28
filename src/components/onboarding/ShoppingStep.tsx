import { motion } from "framer-motion";
import { UserProfile } from "@/types/grocery";
import { Check } from "lucide-react";

interface ShoppingStepProps {
  profile: UserProfile;
  onChange: (updates: Partial<UserProfile>) => void;
}

const retailers = [
  { value: "Trader Joe's", emoji: "🌻" },
  { value: "Whole Foods", emoji: "🥑" },
  { value: "Amazon Fresh", emoji: "📦" },
  { value: "Walmart", emoji: "🏪" },
  { value: "Costco", emoji: "🛒" },
  { value: "Target", emoji: "🎯" },
];

const frequencies = [
  { value: "once", label: "Once a week", emoji: "1️⃣" },
  { value: "twice", label: "Twice a week", emoji: "2️⃣" },
];

const methods = [
  { value: "in-store", label: "In Store", emoji: "🏬" },
  { value: "delivery", label: "Delivery", emoji: "🚚" },
  { value: "pickup", label: "Pickup", emoji: "🅿️" },
];

const ShoppingStep = ({ profile, onChange }: ShoppingStepProps) => {
  const toggleRetailer = (value: string) => {
    const current = profile.preferredRetailers || [];
    const updated = current.includes(value)
      ? current.filter((r) => r !== value)
      : [...current, value];
    onChange({
      preferredRetailers: updated,
      preferredRetailer: updated[0] || "Whole Foods",
    });
  };

  const toggleMethod = (value: string) => {
    const current = profile.shoppingMethods || [];
    const updated = current.includes(value)
      ? current.filter((m) => m !== value)
      : [...current, value];
    onChange({
      shoppingMethods: updated,
      shoppingMethod: updated[0] || "in-store",
    });
  };

  const selectedRetailers = profile.preferredRetailers || [profile.preferredRetailer];
  const selectedMethods = profile.shoppingMethods || [profile.shoppingMethod];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div>
        <h2 className="text-2xl font-display font-semibold text-foreground">
          Where do you shop?
        </h2>
        <p className="text-muted-foreground mt-1">
          Select all that apply — we'll tailor your list
        </p>
      </div>

      <div className="space-y-5">
        <div>
          <label className="text-sm font-medium text-foreground mb-2 block">
            Preferred Retailers (select multiple)
          </label>
          <div className="grid grid-cols-2 gap-2">
            {retailers.map((r) => {
              const isSelected = selectedRetailers.includes(r.value);
              return (
                <button
                  key={r.value}
                  onClick={() => toggleRetailer(r.value)}
                  className={`relative flex items-center gap-2 px-4 py-3 rounded-xl border-2 transition-all text-sm font-medium ${
                    isSelected
                      ? "border-primary bg-primary/5 text-primary"
                      : "border-border bg-card text-foreground hover:border-primary/30"
                  }`}
                >
                  <span>{r.emoji}</span>
                  {r.value}
                  {isSelected && (
                    <Check size={14} className="absolute top-2 right-2 text-primary" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <label className="text-sm font-medium text-foreground mb-2 block">
            Shopping Frequency
          </label>
          <div className="grid grid-cols-2 gap-2">
            {frequencies.map((f) => (
              <button
                key={f.value}
                onClick={() => onChange({ shoppingFrequency: f.value })}
                className={`flex items-center gap-2 px-4 py-3 rounded-xl border-2 transition-all text-sm font-medium ${
                  profile.shoppingFrequency === f.value
                    ? "border-primary bg-primary/5 text-primary"
                    : "border-border bg-card text-foreground hover:border-primary/30"
                }`}
              >
                <span>{f.emoji}</span>
                {f.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="text-sm font-medium text-foreground mb-2 block">
            Shopping Methods (select multiple)
          </label>
          <div className="grid grid-cols-3 gap-2">
            {methods.map((m) => {
              const isSelected = selectedMethods.includes(m.value);
              return (
                <button
                  key={m.value}
                  onClick={() => toggleMethod(m.value)}
                  className={`relative flex flex-col items-center gap-1 px-3 py-3 rounded-xl border-2 transition-all text-sm font-medium ${
                    isSelected
                      ? "border-primary bg-primary/5 text-primary"
                      : "border-border bg-card text-foreground hover:border-primary/30"
                  }`}
                >
                  <span className="text-xl">{m.emoji}</span>
                  {m.label}
                  {isSelected && (
                    <Check size={12} className="absolute top-1.5 right-1.5 text-primary" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ShoppingStep;
