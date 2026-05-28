import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GroceryItem } from "@/types/grocery";
import { ShoppingCart, Check, Share2, Store, Trash2, RefreshCw, CheckCheck, X, Archive } from "lucide-react";

interface GroceryListViewProps {
  items: GroceryItem[];
  retailers: string[];
  onArchive?: (items: GroceryItem[], retailer: string) => void;
}

const categoryInfo: Record<string, { label: string; emoji: string }> = {
  produce: { label: "Produce", emoji: "🥬" },
  dairy: { label: "Dairy & Eggs", emoji: "🥛" },
  protein: { label: "Protein", emoji: "🥩" },
  pantry: { label: "Pantry", emoji: "🫙" },
  frozen: { label: "Frozen", emoji: "🧊" },
  beverages: { label: "Beverages", emoji: "🥤" },
};

const substitutions: Record<string, string[]> = {
  "Avocados": ["Hummus", "Guacamole (pre-made)", "Mashed banana"],
  "Spinach": ["Kale", "Arugula", "Swiss chard"],
  "Mixed Berries": ["Frozen berry blend", "Strawberries", "Blueberries"],
  "Greek Yogurt": ["Skyr", "Cottage cheese", "Coconut yogurt"],
  "Chicken Breast": ["Turkey breast", "Tofu", "Tempeh"],
  "Salmon Fillet": ["Cod fillet", "Tuna steak", "Shrimp"],
  "Beef Strips": ["Chicken thigh strips", "Pork loin strips", "Mushroom strips"],
  "Brown Rice": ["Cauliflower rice", "Farro", "Bulgur wheat"],
  "Quinoa": ["Couscous", "Buckwheat", "Millet"],
  "Rolled Oats": ["Steel cut oats", "Instant oats", "Buckwheat flakes"],
  "Almond Milk": ["Oat milk", "Soy milk", "Coconut milk"],
  "Eggs": ["Egg substitute", "Tofu scramble", "Flax eggs"],
};

const allRetailers = ["Whole Foods", "Trader Joe's", "Target", "Walmart", "Costco", "Amazon Fresh"];

const GroceryListView = ({ items: initialItems, retailers, onArchive }: GroceryListViewProps) => {
  const [items, setItems] = useState(initialItems);
  const displayRetailers = [...new Set([...retailers, ...allRetailers])];
  const [activeRetailer, setActiveRetailer] = useState(retailers[0] || "Whole Foods");
  const [showBrands, setShowBrands] = useState(false);
  const [substituteFor, setSubstituteFor] = useState<string | null>(null);
  const [allDone, setAllDone] = useState(false);

  const toggleItem = (id: string) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, checked: !item.checked } : item
      )
    );
  };

  const deleteItem = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const substituteItem = (id: string, newName: string) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, name: newName } : item
      )
    );
    setSubstituteFor(null);
  };

  const selectAll = () => {
    setItems((prev) => prev.map((item) => ({ ...item, checked: true })));
  };

  const handleFinish = () => {
    if (onArchive) {
      onArchive(items, activeRetailer);
    }
    setAllDone(true);
  };

  const categories = [...new Set(items.map((i) => i.category))];
  const checkedCount = items.filter((i) => i.checked).length;

  const getDisplayName = (item: GroceryItem) => {
    if (showBrands && item.retailerBrands?.[activeRetailer]) {
      return item.retailerBrands[activeRetailer];
    }
    return item.name;
  };

  if (allDone) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center justify-center min-h-[50vh] gap-4 text-center"
      >
        <div className="text-5xl">✅</div>
        <h2 className="text-2xl font-display font-bold text-foreground">Shopping Complete!</h2>
        <p className="text-muted-foreground">Your grocery list has been archived to your profile.</p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-5"
    >
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-display font-bold text-foreground flex items-center gap-2">
            <ShoppingCart size={20} className="text-primary" />
            Grocery List
          </h2>
          <p className="text-sm text-muted-foreground mt-0.5">
            {checkedCount}/{items.length} items
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={selectAll}
            className="w-9 h-9 rounded-lg bg-muted flex items-center justify-center text-muted-foreground hover:text-primary transition-colors"
            title="Select all"
          >
            <CheckCheck size={16} />
          </button>
          <button className="w-9 h-9 rounded-lg bg-muted flex items-center justify-center text-muted-foreground hover:text-primary transition-colors">
            <Share2 size={16} />
          </button>
        </div>
      </div>

      {/* Progress */}
      <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-gradient-primary rounded-full"
          animate={{ width: `${items.length > 0 ? (checkedCount / items.length) * 100 : 0}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>

      {/* Retailer toggle */}
      {displayRetailers.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs font-medium text-muted-foreground">Shop at:</p>
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
            {displayRetailers.map((r) => (
              <button
                key={r}
                onClick={() => setActiveRetailer(r)}
                className={`whitespace-nowrap px-3 py-2 rounded-xl text-xs font-medium border-2 transition-all ${
                  activeRetailer === r
                    ? "border-primary bg-primary/5 text-primary"
                    : "border-border bg-card text-muted-foreground hover:border-primary/30"
                }`}
              >
                {r}
              </button>
            ))}
          </div>
          <button
            onClick={() => setShowBrands(!showBrands)}
            className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium transition-all ${
              showBrands
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:bg-primary/10"
            }`}
          >
            <Store size={14} />
            {showBrands ? `Showing ${activeRetailer} brands` : "Show store-specific brands"}
          </button>
        </div>
      )}

      {/* Insight */}
      <div className="bg-secondary/50 border border-border rounded-xl px-4 py-3 text-sm text-foreground">
        🛒 This grocery list covers everything needed for the week.
      </div>

      {categories.map((cat) => {
        const info = categoryInfo[cat] || { label: cat, emoji: "📦" };
        const catItems = items.filter((i) => i.category === cat);

        return (
          <div key={cat}>
            <h3 className="text-sm font-semibold text-foreground flex items-center gap-2 mb-2">
              <span>{info.emoji}</span> {info.label}
              <span className="text-xs text-muted-foreground font-normal">
                ({catItems.length})
              </span>
            </h3>
            <div className="space-y-1">
              {catItems.map((item) => (
                <div key={item.id} className="space-y-1">
                  <div
                    className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl border transition-all ${
                      item.checked
                        ? "bg-muted/50 border-border"
                        : "bg-card border-border hover:border-primary/30"
                    }`}
                  >
                    <button
                      onClick={() => toggleItem(item.id)}
                      className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all shrink-0 ${
                        item.checked
                          ? "bg-primary border-primary"
                          : "border-muted-foreground"
                      }`}
                    >
                      {item.checked && <Check size={12} className="text-primary-foreground" />}
                    </button>
                    {item.emoji && <span className="text-base">{item.emoji}</span>}
                    <span
                      className={`flex-1 text-sm ${
                        item.checked
                          ? "line-through text-muted-foreground"
                          : "text-foreground"
                      }`}
                    >
                      {getDisplayName(item)}
                    </span>
                    <span className="text-xs text-muted-foreground mr-1">{item.quantity}</span>
                    {/* Actions */}
                    <button
                      onClick={() => setSubstituteFor(substituteFor === item.id ? null : item.id)}
                      className="p-1 rounded-md text-muted-foreground hover:text-primary hover:bg-primary/5 transition-colors"
                      title="Substitute"
                    >
                      <RefreshCw size={14} />
                    </button>
                    <button
                      onClick={() => deleteItem(item.id)}
                      className="p-1 rounded-md text-muted-foreground hover:text-destructive hover:bg-destructive/5 transition-colors"
                      title="Remove"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                  {/* Substitute dropdown */}
                  <AnimatePresence>
                    {substituteFor === item.id && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="ml-8 space-y-1 overflow-hidden"
                      >
                        <p className="text-xs font-medium text-muted-foreground">Replace with:</p>
                        {(substitutions[item.name] || ["No suggestions available"]).map((sub) => (
                          <button
                            key={sub}
                            onClick={() => sub !== "No suggestions available" && substituteItem(item.id, sub)}
                            className={`w-full text-left px-3 py-2 rounded-lg text-xs transition-all ${
                              sub === "No suggestions available"
                                ? "bg-muted/50 text-muted-foreground italic"
                                : "bg-muted text-foreground hover:bg-primary/10 hover:text-primary"
                            }`}
                          >
                            {sub}
                          </button>
                        ))}
                        <button
                          onClick={() => setSubstituteFor(null)}
                          className="text-xs text-muted-foreground hover:text-foreground"
                        >
                          Cancel
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </div>
        );
      })}

      {/* Finish & Archive */}
      <div className="pt-2 pb-4 space-y-2">
        <button
          onClick={selectAll}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border border-border text-foreground font-medium text-sm hover:bg-muted transition-colors"
        >
          <CheckCheck size={16} />
          Select All Items
        </button>
        <button
          onClick={handleFinish}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-primary text-primary-foreground font-semibold text-sm"
        >
          <Archive size={16} />
          Finish & Archive List
        </button>
      </div>
    </motion.div>
  );
};

export default GroceryListView;
