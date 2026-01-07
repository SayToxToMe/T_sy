export interface Ingredient {
  name: string;
  quantity: string;
  function: string; // The functional role of the ingredient (e.g., "Binder", "Flavor enhancer", "Source of fiber")
}

export interface NutritionInfo {
  calories: number;
  protein: string;
  carbohydrates: string;
  fiber: string;
  fat: string;
  sugar: string;
  sodium: string;
}

export interface FoodAnalysis {
  dishName: string;
  description: string;
  targetAudience: string;
  nutrition: NutritionInfo;
  ingredients: Ingredient[];
  recipeInstructions: string[];
  estimatedCost: string; // Interpretation of "receipt" as cost/bill of materials
}

export enum AppState {
  IDLE = 'IDLE',
  ANALYZING = 'ANALYZING',
  RESULTS = 'RESULTS',
  GENERATING_IMAGE = 'GENERATING_IMAGE',
  ERROR = 'ERROR'
}
