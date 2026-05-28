# GrocerEase

AI-powered meal planning and grocery list app, built in 3 hours during a [Lovable](https://lovable.dev) hackathon at NYU Stern.

The challenge was to build a working app using Lovable within a single session. This is a quick prototype addressing a universal pain point: figuring out what to eat and what to buy at the grocery store. This first iteration targets singles and couples doing weekly meal planning, but there is significant room to expand to different demographics (families, dietary-specific communities, budget-conscious shoppers) in future iterations.

### The Problem

Weekly meal planning is a surprisingly high-friction task. Most people cycle through the same handful of meals, struggle to balance nutrition goals with time constraints, and end up at the grocery store without a clear list. Existing apps are either too complex (full recipe databases with manual planning) or too simple (basic list apps with no intelligence).

### The Hypothesis

A mobile-first experience that combines preference-aware meal suggestions with a low-effort selection interface (swipe to keep or skip) can reduce the friction of meal planning from a 30-minute chore to a 3-minute interaction, while generating an organized, retailer-aware grocery list automatically.

### What This Prototype Explores

- **Personalized onboarding** - Captures calorie goals, dietary restrictions, allergies, household size, cooking time preferences, cuisine preferences, and shopping habits to tailor every suggestion
- **Swipe-based meal selection** - Tinder-style cards with nutritional breakdown (calories, protein, carbs, fat, prep time) let users build a weekly plan in under 2 minutes
- **Conversational plan editing** - AI chat assistant lets users modify their plan in natural language ("make this week vegetarian", "swap salmon for chicken", "remove mushrooms") with instant updates
- **Auto-generated grocery lists** - Accepted meals are converted into a categorized, retailer-aware shopping list (produce, dairy, protein, pantry, frozen, beverages)
- **Thread-based plan history** - Each weekly plan is saved as a thread, allowing users to revisit past plans and archived grocery lists
- **Multi-retailer support** - Users can set preferred retailers and shopping methods (in-store, delivery, pickup)

### Product Thinking

- **Reducing decision fatigue**: The swipe interface constrains choice to a binary (keep/skip) rather than asking users to browse and select from a catalog
- **Progressive disclosure**: Onboarding captures preferences once; the app uses them silently rather than asking repeatedly
- **Conversational modification over form-based editing**: Editing a meal plan through chat ("remove mushrooms") is faster and more intuitive than navigating settings and filters
- **Plan-as-thread model**: Treating each weekly plan as an independent thread avoids the complexity of a persistent, ever-changing meal calendar

## Architecture

| Layer | Tech |
|-------|------|
| Frontend | React, TypeScript, Vite, Tailwind CSS, shadcn/ui |
| Animations | Framer Motion (swipe gestures, transitions) |
| Prototyping | Vibe-coded with [Lovable](https://lovable.dev) |

## Project Structure

```
src/
  pages/
    Index.tsx              # App shell with tab navigation and thread state
  components/
    PlanTab.tsx            # Plan hub, onboarding, and active plan phases
    MealSwipeCard.tsx      # Tinder-style swipe cards with nutritional data
    MealPlanView.tsx       # Weekly meal plan overview
    GroceryListView.tsx    # Categorized grocery list with retailer support
    ChatInterface.tsx      # AI assistant for natural language plan editing
    ExploreTab.tsx         # Recipe discovery and bookmarking
    ProfileTab.tsx         # User profile, saved recipes, archived lists
    PlanPrefsSheet.tsx     # Pre-plan preference review
    onboarding/            # Multi-step onboarding flow
  types/
    grocery.ts             # Type definitions (UserProfile, Meal, GroceryItem, PlanThread)
  data/
    sampleMeals.ts         # Sample meal data for prototype
```

## Getting Started

```bash
bun install  # or npm install
bun dev      # or npm run dev
```

## Built By

Lucie Le Cren-Boussuard - [LinkedIn](https://linkedin.com/in/lucielcb)
