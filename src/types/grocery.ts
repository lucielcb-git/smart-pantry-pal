export interface UserProfile {
  calorieGoal: number;
  macroPreferences: string[];
  dietaryType: string;
  householdSize: number;
  planDays: number;
  breakfastsAtHome: number;
  lunchesAtHome: number;
  dinnersAtHome: number;
  daysEatingOut: number;
  cookingTime: string;
  allergies: string[];
  dislikedFoods: string[];
  restrictions: string[];
  cuisinePreferences: string[];
  preferredRetailers: string[];
  shoppingFrequency: string;
  shoppingMethods: string[];
  // Keep old single fields for backward compat
  preferredRetailer: string;
  shoppingMethod: string;
}

export interface Meal {
  id: string;
  name: string;
  description: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  prepTime: number;
  ingredients: string[];
  type: "breakfast" | "lunch" | "dinner" | "snack";
  image?: string;
  day?: string;
}

export interface GroceryItem {
  id: string;
  name: string;
  quantity: string;
  category: "produce" | "dairy" | "protein" | "pantry" | "frozen" | "beverages";
  checked: boolean;
  emoji?: string;
  retailerBrands?: Record<string, string>;
}

export interface ExploreRecipe {
  id: string;
  title: string;
  description: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  prepTime: number;
  tag: string;
  image?: string;
  saved: boolean;
}

export interface ArchivedList {
  id: string;
  date: string;
  itemCount: number;
  retailer: string;
  items: GroceryItem[];
}

export type PlanPhase = "onboarding" | "prefs" | "generating" | "swipe" | "groceryList" | "done";

export interface PlanThread {
  id: string;
  createdAt: string;
  phase: PlanPhase;
  accepted: Meal[];
  currentIndex: number;
  retailer: string;
  archivedList?: ArchivedList;
}

export const defaultProfile: UserProfile = {
  calorieGoal: 2000,
  macroPreferences: ["balanced"],
  dietaryType: "none",
  householdSize: 2,
  planDays: 7,
  breakfastsAtHome: 5,
  lunchesAtHome: 3,
  dinnersAtHome: 5,
  daysEatingOut: 2,
  cookingTime: "30min",
  allergies: [],
  dislikedFoods: [],
  restrictions: [],
  cuisinePreferences: ["Italian", "Mexican", "Asian"],
  preferredRetailers: ["Whole Foods"],
  shoppingFrequency: "once",
  shoppingMethods: ["in-store"],
  preferredRetailer: "Whole Foods",
  shoppingMethod: "in-store",
};
