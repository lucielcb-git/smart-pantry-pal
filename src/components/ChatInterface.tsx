import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, X, Sparkles } from "lucide-react";
import { Meal } from "@/types/grocery";
import { sampleMeals } from "@/data/sampleMeals";

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
}

interface ChatInterfaceProps {
  isOpen: boolean;
  onClose: () => void;
  acceptedMeals?: Meal[];
  onUpdateMeals?: (meals: Meal[]) => void;
}

const quickActions = [
  "Make this week vegetarian",
  "Add high-protein lunches",
  "Remove mushrooms",
  "Swap salmon for chicken",
  "Add snacks",
];

// Simple keyword-based meal swap logic
function processCommand(text: string, accepted: Meal[]): { meals: Meal[]; response: string } | null {
  const lower = text.toLowerCase();

  // "swap X for Y" or "replace X with Y"
  const swapMatch = lower.match(/(?:swap|replace|change)\s+(.+?)\s+(?:for|with|to)\s+(.+)/);
  if (swapMatch) {
    const oldKeyword = swapMatch[1].trim();
    const newKeyword = swapMatch[2].trim();

    const mealToReplace = accepted.find((m) =>
      m.name.toLowerCase().includes(oldKeyword)
    );
    if (!mealToReplace) {
      return { meals: accepted, response: `I couldn't find a meal matching "${oldKeyword}" in your plan. Try being more specific!` };
    }

    const replacement = sampleMeals.find(
      (m) =>
        m.name.toLowerCase().includes(newKeyword) &&
        !accepted.some((a) => a.id === m.id)
    );
    if (replacement) {
      const updated = accepted.map((m) => (m.id === mealToReplace.id ? replacement : m));
      return {
        meals: updated,
        response: `Done! Swapped **${mealToReplace.name}** → **${replacement.name}** (${replacement.calories} cal, ${replacement.protein}g protein). ✅`,
      };
    }
    return { meals: accepted, response: `I don't have a "${newKeyword}" alternative available right now. Try another option!` };
  }

  // "remove X"
  const removeMatch = lower.match(/(?:remove|delete|drop)\s+(.+)/);
  if (removeMatch) {
    const keyword = removeMatch[1].trim();
    const mealToRemove = accepted.find((m) => m.name.toLowerCase().includes(keyword));
    if (mealToRemove) {
      const updated = accepted.filter((m) => m.id !== mealToRemove.id);
      return { meals: updated, response: `Removed **${mealToRemove.name}** from your plan. You now have ${updated.length} meals. ✅` };
    }

    // Check if it's an ingredient removal
    const mealsWithIngredient = accepted.filter((m) =>
      m.ingredients.some((ing) => ing.toLowerCase().includes(keyword))
    );
    if (mealsWithIngredient.length > 0) {
      // Find alternatives without the ingredient
      let updated = [...accepted];
      const changes: string[] = [];
      for (const meal of mealsWithIngredient) {
        const alt = sampleMeals.find(
          (m) =>
            m.type === meal.type &&
            !updated.some((a) => a.id === m.id) &&
            !m.ingredients.some((ing) => ing.toLowerCase().includes(keyword))
        );
        if (alt) {
          updated = updated.map((m) => (m.id === meal.id ? alt : m));
          changes.push(`${meal.name} → ${alt.name}`);
        }
      }
      if (changes.length > 0) {
        return {
          meals: updated,
          response: `Removed meals containing "${keyword}" and replaced them:\n\n${changes.map((c) => `• ${c}`).join("\n")}\n\n✅ Your plan is updated!`,
        };
      }
      return {
        meals: accepted,
        response: `Found ${mealsWithIngredient.length} meal(s) with "${keyword}" but no alternatives available without it.`,
      };
    }
    return { meals: accepted, response: `Couldn't find "${keyword}" in your meals or ingredients.` };
  }

  // "make vegetarian" / "vegetarian"
  if (lower.includes("vegetarian") || lower.includes("vegan") || lower.includes("plant")) {
    const meatMeals = accepted.filter((m) =>
      m.ingredients.some((ing) =>
        /chicken|beef|salmon|fish|meat|pork|turkey/i.test(ing)
      )
    );
    if (meatMeals.length === 0) {
      return { meals: accepted, response: "Your plan is already vegetarian! 🌱" };
    }
    let updated = [...accepted];
    const changes: string[] = [];
    for (const meal of meatMeals) {
      const alt = sampleMeals.find(
        (m) =>
          m.type === meal.type &&
          !updated.some((a) => a.id === m.id) &&
          !m.ingredients.some((ing) => /chicken|beef|salmon|fish|meat|pork|turkey/i.test(ing))
      );
      if (alt) {
        updated = updated.map((m) => (m.id === meal.id ? alt : m));
        changes.push(`${meal.name} → ${alt.name}`);
      }
    }
    return {
      meals: updated,
      response: changes.length > 0
        ? `Made your plan vegetarian! 🌱\n\n${changes.map((c) => `• ${c}`).join("\n")}\n\nYour grocery list will update accordingly.`
        : "Couldn't find enough vegetarian alternatives, but I removed what I could.",
    };
  }

  // "high protein"
  if (lower.includes("high protein") || lower.includes("more protein")) {
    const highProteinAlts = sampleMeals
      .filter((m) => m.protein >= 30 && !accepted.some((a) => a.id === m.id))
      .slice(0, 2);
    if (highProteinAlts.length > 0) {
      const updated = [...accepted, ...highProteinAlts];
      return {
        meals: updated,
        response: `Added high-protein options:\n\n${highProteinAlts.map((m) => `• **${m.name}** (${m.protein}g protein, ${m.calories} cal)`).join("\n")}\n\n✅ Plan updated!`,
      };
    }
    return { meals: accepted, response: "No additional high-protein meals available to add." };
  }

  return null;
}

const ChatInterface = ({ isOpen, onClose, acceptedMeals = [], onUpdateMeals }: ChatInterfaceProps) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      role: "assistant",
      content: "Hi! I'm your grocery planning assistant 🛒\n\nI can help you adjust your meal plan — swap meals, remove ingredients, or go vegetarian. What would you like to change?",
    },
  ]);
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  const sendMessage = (text: string) => {
    if (!text.trim()) return;
    const userMsg: ChatMessage = { id: Date.now().toString(), role: "user", content: text };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");

    setTimeout(() => {
      const result = processCommand(text, acceptedMeals);
      let responseText: string;

      if (result) {
        responseText = result.response;
        if (onUpdateMeals && result.meals !== acceptedMeals) {
          onUpdateMeals(result.meals);
        }
      } else {
        responseText = "I've noted your request! Try commands like:\n\n• \"Swap salmon for chicken\"\n• \"Remove mushrooms\"\n• \"Make this week vegetarian\"\n• \"Add high-protein lunches\"";
      }

      const botMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: responseText,
      };
      setMessages((prev) => [...prev, botMsg]);
    }, 600);
  };

  if (!isOpen) return null;

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm"
      />

      <motion.div
        initial={{ y: "100%", opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: "100%", opacity: 0 }}
        transition={{ type: "spring", bounce: 0.15, duration: 0.5 }}
        className="fixed bottom-16 left-3 right-3 z-50 bg-card rounded-2xl shadow-elevated border border-border flex flex-col overflow-hidden"
        style={{ maxHeight: "65vh" }}
      >
        <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-card">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-primary flex items-center justify-center">
              <Sparkles size={18} className="text-primary-foreground" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-foreground">AI Assistant</h3>
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                <span className="text-xs font-semibold text-primary">ONLINE</span>
              </div>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-muted transition-colors">
            <X size={18} className="text-muted-foreground" />
          </button>
        </div>

        <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-3 space-y-3" style={{ minHeight: "200px" }}>
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap ${
                  msg.role === "user"
                    ? "bg-primary text-primary-foreground rounded-br-md"
                    : "bg-muted text-foreground rounded-bl-md"
                }`}
              >
                {msg.content.split(/(\*\*[^*]+\*\*)/).map((part, i) =>
                  part.startsWith("**") && part.endsWith("**") ? (
                    <strong key={i}>{part.slice(2, -2)}</strong>
                  ) : (
                    <span key={i}>{part}</span>
                  )
                )}
              </div>
            </motion.div>
          ))}

          {messages.length <= 2 && (
            <div className="flex flex-wrap gap-1.5 pt-1">
              {quickActions.map((action) => (
                <button
                  key={action}
                  onClick={() => sendMessage(action)}
                  className="text-xs bg-secondary text-secondary-foreground px-3 py-1.5 rounded-full hover:bg-primary/10 hover:text-primary transition-colors"
                >
                  {action}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="px-3 py-3 border-t border-border bg-card">
          <div className="flex gap-2 items-center bg-muted rounded-full px-4 py-1">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage(input)}
              placeholder="Ask me to swap a meal or add an item"
              className="flex-1 bg-transparent py-2.5 text-sm text-foreground placeholder:text-muted-foreground outline-none"
            />
            <button
              onClick={() => sendMessage(input)}
              disabled={!input.trim()}
              className="w-9 h-9 rounded-full bg-gradient-primary flex items-center justify-center text-primary-foreground disabled:opacity-40 transition-opacity shrink-0"
            >
              <Send size={14} />
            </button>
          </div>
        </div>
      </motion.div>
    </>
  );
};

export default ChatInterface;
