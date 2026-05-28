import { useState } from "react";
import BottomNav from "@/components/BottomNav";
import PlanTab from "@/components/PlanTab";
import ExploreTab from "@/components/ExploreTab";
import ProfileTab from "@/components/ProfileTab";
import { UserProfile, ExploreRecipe, ArchivedList, Meal, GroceryItem, PlanThread, PlanPhase } from "@/types/grocery";
import { sampleMeals } from "@/data/sampleMeals";

const createNewThread = (): PlanThread => ({
  id: `plan-${Date.now()}`,
  createdAt: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
  phase: "generating",
  accepted: [],
  currentIndex: 0,
  retailer: "",
});

const Index = () => {
  const [activeTab, setActiveTab] = useState<"plan" | "explore" | "profile">("plan");
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [savedRecipes, setSavedRecipes] = useState<ExploreRecipe[]>([]);
  
  // Thread system
  const [threads, setThreads] = useState<PlanThread[]>([]);
  const [activeThreadId, setActiveThreadId] = useState<string | null>(null);

  const activeThread = threads.find((t) => t.id === activeThreadId) || null;
  const pastThreads = threads.filter((t) => t.id !== activeThreadId);
  const isOnboarding = !profile;

  const handleSaveRecipe = (recipe: ExploreRecipe) => {
    setSavedRecipes((prev) => {
      const exists = prev.find((r) => r.id === recipe.id);
      if (exists) return prev.filter((r) => r.id !== recipe.id);
      return [...prev, { ...recipe, saved: true }];
    });
  };

  const updateThread = (id: string, updates: Partial<PlanThread>) => {
    setThreads((prev) => prev.map((t) => t.id === id ? { ...t, ...updates } : t));
  };

  const handleNewPlan = (prefs?: UserProfile) => {
    if (prefs) setProfile(prefs);
    const thread = createNewThread();
    setThreads((prev) => [thread, ...prev]);
    setActiveThreadId(thread.id);
    setTimeout(() => {
      updateThread(thread.id, { phase: "swipe" });
    }, 1500);
  };

  const handleArchiveList = (items: GroceryItem[], retailer: string) => {
    if (!activeThreadId) return;
    const archived: ArchivedList = {
      id: `archive-${Date.now()}`,
      date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      itemCount: items.length,
      retailer,
      items,
    };
    updateThread(activeThreadId, { phase: "done", archivedList: archived, retailer });
    setActiveThreadId(null); // go back to hub
  };

  const handleSetProfile = (p: UserProfile) => {
    setProfile(p);
    // Auto-start first plan after onboarding
    const thread = createNewThread();
    setThreads([thread]);
    setActiveThreadId(thread.id);
    setTimeout(() => {
      updateThread(thread.id, { phase: "swipe" });
    }, 1500);
  };

  const archivedLists = threads
    .filter((t) => t.archivedList)
    .map((t) => t.archivedList!);

  return (
    <div className="min-h-screen bg-background">
      {isOnboarding && activeTab === "plan" ? (
        <PlanTab
          profile={profile}
          onSetProfile={handleSetProfile}
          onArchiveList={handleArchiveList}
          activeThread={null}
          pastThreads={[]}
          onSelectThread={() => {}}
          onNewPlan={() => {}}
          onUpdateThread={() => {}}
          onBackToHub={() => {}}
        />
      ) : (
        <div className="max-w-lg mx-auto px-5 pt-12 pb-24">
          {activeTab === "plan" && (
            <PlanTab
              profile={profile}
              onSetProfile={handleSetProfile}
              onArchiveList={handleArchiveList}
              activeThread={activeThread}
              pastThreads={pastThreads}
              onSelectThread={(id) => setActiveThreadId(id)}
              onNewPlan={handleNewPlan}
              onUpdateThread={(updates) => activeThreadId && updateThread(activeThreadId, updates)}
              onBackToHub={() => setActiveThreadId(null)}
            />
          )}
          {activeTab === "explore" && (
            <ExploreTab
              savedRecipes={savedRecipes}
              onSaveRecipe={handleSaveRecipe}
            />
          )}
          {activeTab === "profile" && profile && (
            <ProfileTab
              profile={profile}
              onEditProfile={() => setActiveTab("plan")}
              savedRecipes={savedRecipes}
              archivedLists={archivedLists}
              onRemoveSavedRecipe={(id) => setSavedRecipes((prev) => prev.filter((r) => r.id !== id))}
            />
          )}
          {activeTab === "profile" && !profile && (
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3 text-center">
              <span className="text-4xl">👤</span>
              <p className="text-muted-foreground">Complete the onboarding first to see your profile</p>
              <button
                onClick={() => setActiveTab("plan")}
                className="px-5 py-2.5 rounded-xl bg-gradient-primary text-primary-foreground font-semibold text-sm"
              >
                Get Started
              </button>
            </div>
          )}
        </div>
      )}
      {!isOnboarding && <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />}
    </div>
  );
};

export default Index;
