export interface MealPlan {
  id: string;
  userId: string;
  date: string;
  meals: Meal[];
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
}

export interface Meal {
  id: string;
  name: string;
  description: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  ingredients: string[];
  instructions: string[];
  imageUrl?: string;
}

export interface DietaryPreferences {
  userId: string;
  dietaryRestrictions: string[];
  allergies: string[];
  preferredCuisines: string[];
  mealCount: number;
  calorieGoal: number;
  proteinGoal: number;
  carbGoal: number;
  fatGoal: number;
}

export interface NutritionPlannerState {
  loading: boolean;
  error: string | null;
  mealPlans: MealPlan[];
  preferences: DietaryPreferences | null;
  selectedMealPlan: MealPlan | null;
  isGenerating: boolean;
} 