import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { UserProfile, GroceryItem, Meal, PlanThread, PlanPhase } from "@/types/grocery";
import { sampleMeals, sampleGroceryList } from "@/data/sampleMeals";
import MealPlanView from "./MealPlanView";
import GroceryListView from "./GroceryListView";
import ChatInterface from "./ChatInterface";
import OnboardingFlow from "./onboarding/OnboardingFlow";
import PlanPrefsSheet from "./PlanPrefsSheet";
import { Sparkles, MessageCircle, Plus, ChevronRight, ShoppingCart, Calendar, ArrowLeft, CheckCircle2 } from "lucide-react";
import { mealImages } from "@/assets/meals";
import logo from "@/assets/logo.png";

interface PlanTabProps {
  profile: UserProfile | null;
  onSetProfile: (p: UserProfile) => void;
  onArchiveList: (items: GroceryItem[], retailer: string) => void;
  activeThread: PlanThread | null;
  pastThreads: PlanThread[];
  onSelectThread: (id: string) => void;
  onNewPlan: (prefs: UserProfile) => void;
  onUpdateThread: (updates: Partial<PlanThread>) => void;
  onBackToHub: () => void;
}

const PlanTab = ({
  profile, onSetProfile, onArchiveList,
  activeThread, pastThreads,
  onSelectThread, onNewPlan,
  onUpdateThread, onBackToHub,
}: PlanTabProps) => {
  const [chatOpen, setChatOpen] = useState(false);
  const [viewingThread, setViewingThread] = useState<PlanThread | null>(null);
  const [showPrefs, setShowPrefs] = useState(false);

  // Onboarding
  if (!profile) {
    return <OnboardingFlow onComplete={onSetProfile} />;
  }

  // Prefs sheet before starting a new plan
  if (showPrefs) {
    return (
      <div>
        <button
          onClick={() => setShowPrefs(false)}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-4"
        >
          <ArrowLeft size={16} /> Back
        </button>
        <PlanPrefsSheet
          profile={profile}
          onStart={(prefs) => {
            onSetProfile(prefs);
            onNewPlan(prefs);
            setShowPrefs(false);
          }}
        />
      </div>
    );
  }

  // Viewing a past thread's details
  if (viewingThread) {
    return (
      <div className="space-y-5">
        <button
          onClick={() => setViewingThread(null)}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft size={16} /> Back to Plans
        </button>

        <div>
          <h2 className="text-xl font-display font-bold text-foreground">
            Plan from {viewingThread.createdAt}
          </h2>
          <p className="text-sm text-muted-foreground mt-0.5">
            {viewingThread.accepted.length} meals · {viewingThread.retailer || "No retailer"}
          </p>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-foreground mb-2">Meals</h3>
          <div className="space-y-2">
            {viewingThread.accepted.map((meal) => (
              <div key={meal.id} className="flex items-center gap-3 bg-card rounded-xl border border-border p-3">
                {mealImages[meal.id] ? (
                  <img src={mealImages[meal.id]} alt={meal.name} className="w-10 h-10 rounded-lg object-cover" />
                ) : (
                  <div className="w-10 h-10 rounded-lg bg-gradient-primary flex items-center justify-center text-primary-foreground text-xs font-bold">
                    {meal.day?.[0]}
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{meal.name}</p>
                  <p className="text-xs text-muted-foreground">{meal.day} · {meal.type} · {meal.calories} cal</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {viewingThread.archivedList && (
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-2 flex items-center gap-2">
              <ShoppingCart size={14} className="text-primary" />
              Grocery List ({viewingThread.archivedList.itemCount} items)
            </h3>
            <div className="space-y-1">
              {viewingThread.archivedList.items.map((item) => (
                <div key={item.id} className="flex items-center gap-2 bg-card rounded-lg border border-border px-3 py-2">
                  <span className="text-sm">{item.emoji || "•"}</span>
                  <span className="flex-1 text-sm text-foreground">{item.name}</span>
                  <span className="text-xs text-muted-foreground">{item.quantity}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  // No active thread → Plan Hub
  if (!activeThread) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <img src={logo} alt="GrocerEase" className="h-8 w-8 object-contain" />
          <div>
            <h1 className="text-2xl font-display font-bold text-foreground">
              <span className="text-primary">Grocer</span>Ease
            </h1>
            <p className="text-sm text-muted-foreground mt-0.5">Your grocery planning history</p>
          </div>
        </div>

        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          onClick={() => setShowPrefs(true)}
          className="w-full flex items-center gap-4 bg-gradient-primary rounded-2xl p-5 text-left group"
        >
          <div className="w-14 h-14 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
            <Plus size={24} className="text-primary-foreground" />
          </div>
          <div className="flex-1">
            <p className="text-base font-bold text-primary-foreground">Start New Plan</p>
            <p className="text-sm text-primary-foreground/70 mt-0.5">
              Review preferences & generate meals
            </p>
          </div>
          <ChevronRight size={20} className="text-primary-foreground/50 group-hover:translate-x-1 transition-transform" />
        </motion.button>

        {pastThreads.length > 0 && (
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
              <Calendar size={14} className="text-primary" />
              Your Plans
            </h3>
            <div className="space-y-2">
              {pastThreads.map((thread, i) => {
                const isDone = thread.phase === "done";
                const isInProgress = thread.phase === "swipe" || thread.phase === "groceryList";
                const statusLabel = isDone
                  ? "Completed"
                  : thread.phase === "swipe"
                  ? "Selecting meals"
                  : thread.phase === "groceryList"
                  ? "Grocery list"
                  : thread.phase === "generating"
                  ? "Generating..."
                  : thread.phase;

                return (
                  <motion.button
                    key={thread.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    onClick={() => {
                      if (isDone) {
                        setViewingThread(thread);
                      } else {
                        onSelectThread(thread.id);
                      }
                    }}
                    className="w-full flex items-center gap-3 bg-card rounded-xl border border-border p-4 text-left hover:border-primary/30 transition-colors"
                  >
                    <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${isDone ? "bg-primary/10" : "bg-accent/10"}`}>
                      {isDone ? (
                        <CheckCircle2 size={20} className="text-primary" />
                      ) : (
                        <Sparkles size={20} className="text-accent" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-foreground">{thread.createdAt}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {thread.accepted.length} meals
                        {isDone && thread.archivedList ? ` · ${thread.archivedList.itemCount} grocery items` : ""}
                        {thread.retailer ? ` · ${thread.retailer}` : ""}
                      </p>
                      <span className={`inline-block mt-1 text-[10px] font-medium px-2 py-0.5 rounded-full ${
                        isDone ? "bg-primary/10 text-primary" : "bg-accent/10 text-accent"
                      }`}>
                        {isInProgress ? `⏳ ${statusLabel} — tap to resume` : statusLabel}
                      </span>
                    </div>
                    <ChevronRight size={16} className="text-muted-foreground" />
                  </motion.button>
                );
              })}
            </div>
          </div>
        )}

        {pastThreads.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-center gap-3">
            <span className="text-4xl">📋</span>
            <p className="text-sm text-muted-foreground">
              No past plans yet. Start your first grocery plan above!
            </p>
          </div>
        )}
      </div>
    );
  }

  // Active thread phases
  const phase = activeThread.phase;

  if (phase === "generating") {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 rounded-2xl bg-gradient-primary flex items-center justify-center"
        >
          <Sparkles size={28} className="text-primary-foreground" />
        </motion.div>
        <div className="text-center">
          <h2 className="text-xl font-display font-semibold text-foreground">
            Generating your plan...
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Creating meals based on your goals
          </p>
        </div>
      </div>
    );
  }

  const retailers = profile?.preferredRetailers || [profile?.preferredRetailer || "Whole Foods"];

  const handleSwipe = (direction: "left" | "right") => {
    const meal = sampleMeals[activeThread.currentIndex];
    if (direction === "right") {
      onUpdateThread({ accepted: [...activeThread.accepted, meal] });
    }
    onUpdateThread({ currentIndex: activeThread.currentIndex + 1 });
  };

  return (
    <div className="relative">
      <div className="flex items-center gap-3 mb-4">
        <button
          onClick={phase === "groceryList" ? () => onUpdateThread({ phase: "swipe" }) : onBackToHub}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft size={16} /> {phase === "groceryList" ? "Back to Meals" : "All Plans"}
        </button>
      </div>

      {phase === "swipe" && (
        <MealPlanView
          meals={sampleMeals.slice(0, 7)}
          onFinalize={() => onUpdateThread({ phase: "groceryList" })}
          onOpenChat={() => setChatOpen(true)}
          accepted={activeThread.accepted}
          currentIndex={activeThread.currentIndex}
          onSwipe={handleSwipe}
          onUpdateAccepted={(meals) => onUpdateThread({ accepted: meals })}
        />
      )}

      {phase === "groceryList" && (
        <GroceryListView
          items={sampleGroceryList}
          retailers={retailers}
          onArchive={onArchiveList}
        />
      )}

      {!chatOpen && (
        <button
          onClick={() => setChatOpen(true)}
          className="fixed bottom-20 right-4 z-40 w-14 h-14 rounded-full bg-gradient-primary shadow-elevated flex items-center justify-center text-primary-foreground"
        >
          <MessageCircle size={22} />
        </button>
      )}

      <AnimatePresence>
        {chatOpen && (
          <ChatInterface
            isOpen={chatOpen}
            onClose={() => setChatOpen(false)}
            acceptedMeals={activeThread.accepted}
            onUpdateMeals={(meals) => onUpdateThread({ accepted: meals })}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default PlanTab;
