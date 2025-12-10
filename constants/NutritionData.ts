// Nutrition data for common foods
// Calories are approximate per typical serving
// Caffeine is in mg per serving

export interface FoodNutrition {
  calories: number;        // kcal per serving
  protein?: number;        // grams
  carbs?: number;          // grams
  fat?: number;            // grams
  caffeine?: number;       // mg (only for caffeinated items)
  category: FoodCategory;
}

export type FoodCategory =
  | 'fruits'
  | 'grains'
  | 'meat'
  | 'seafood'
  | 'plant_protein'
  | 'dairy'
  | 'vegetables'
  | 'prepared'
  | 'beverages'
  | 'snacks'
  | 'condiments';

// Foods that contain caffeine
export const CAFFEINATED_FOODS = [
  'Coffee',
  'Espresso',
  'Latte',
  'Iced coffee',
  'Tea',
  'Green tea',
  'Chai tea',
  'Matcha',
  'Iced tea',
  'Energy drink',
  'Cola',
  'Soda',
  'Hot chocolate',
  'Chocolate',
  'Chocolate bar',
  'Dark chocolate',
];

// Nutrition database - calories per typical serving
export const NUTRITION_DATA: Record<string, FoodNutrition> = {
  // Fruits (per medium fruit or 1 cup)
  "Apple": { calories: 95, carbs: 25, protein: 0.5, fat: 0.3, category: 'fruits' },
  "Apricot": { calories: 17, carbs: 4, protein: 0.5, fat: 0.1, category: 'fruits' },
  "Avocado": { calories: 234, carbs: 12, protein: 3, fat: 21, category: 'fruits' },
  "Banana": { calories: 105, carbs: 27, protein: 1.3, fat: 0.4, category: 'fruits' },
  "Blackberries": { calories: 62, carbs: 14, protein: 2, fat: 0.7, category: 'fruits' },
  "Blueberries": { calories: 84, carbs: 21, protein: 1, fat: 0.5, category: 'fruits' },
  "Cantaloupe": { calories: 53, carbs: 13, protein: 1.3, fat: 0.3, category: 'fruits' },
  "Cherries": { calories: 77, carbs: 19, protein: 1.6, fat: 0.5, category: 'fruits' },
  "Coconut": { calories: 283, carbs: 12, protein: 3, fat: 27, category: 'fruits' },
  "Cranberries": { calories: 46, carbs: 12, protein: 0.4, fat: 0.1, category: 'fruits' },
  "Dates": { calories: 66, carbs: 18, protein: 0.4, fat: 0, category: 'fruits' },
  "Dragon fruit": { calories: 60, carbs: 13, protein: 1, fat: 0, category: 'fruits' },
  "Figs": { calories: 37, carbs: 10, protein: 0.4, fat: 0.1, category: 'fruits' },
  "Grapefruit": { calories: 52, carbs: 13, protein: 1, fat: 0.2, category: 'fruits' },
  "Grapes": { calories: 62, carbs: 16, protein: 0.6, fat: 0.3, category: 'fruits' },
  "Guava": { calories: 37, carbs: 8, protein: 1.4, fat: 0.5, category: 'fruits' },
  "Kiwi": { calories: 42, carbs: 10, protein: 0.8, fat: 0.4, category: 'fruits' },
  "Lemon": { calories: 17, carbs: 5, protein: 0.6, fat: 0.2, category: 'fruits' },
  "Lime": { calories: 20, carbs: 7, protein: 0.5, fat: 0.1, category: 'fruits' },
  "Mango": { calories: 99, carbs: 25, protein: 1.4, fat: 0.6, category: 'fruits' },
  "Melon": { calories: 46, carbs: 11, protein: 1.1, fat: 0.2, category: 'fruits' },
  "Nectarine": { calories: 62, carbs: 15, protein: 1.5, fat: 0.4, category: 'fruits' },
  "Orange": { calories: 62, carbs: 15, protein: 1.2, fat: 0.2, category: 'fruits' },
  "Papaya": { calories: 55, carbs: 14, protein: 0.9, fat: 0.2, category: 'fruits' },
  "Passion fruit": { calories: 17, carbs: 4, protein: 0.4, fat: 0.1, category: 'fruits' },
  "Peach": { calories: 58, carbs: 14, protein: 1.4, fat: 0.4, category: 'fruits' },
  "Pear": { calories: 101, carbs: 27, protein: 0.6, fat: 0.2, category: 'fruits' },
  "Persimmon": { calories: 118, carbs: 31, protein: 1, fat: 0.3, category: 'fruits' },
  "Pineapple": { calories: 82, carbs: 22, protein: 0.9, fat: 0.2, category: 'fruits' },
  "Plum": { calories: 30, carbs: 8, protein: 0.5, fat: 0.2, category: 'fruits' },
  "Pomegranate": { calories: 83, carbs: 19, protein: 1.7, fat: 1.2, category: 'fruits' },
  "Raspberries": { calories: 64, carbs: 15, protein: 1.5, fat: 0.8, category: 'fruits' },
  "Strawberries": { calories: 49, carbs: 12, protein: 1, fat: 0.5, category: 'fruits' },
  "Tangerine": { calories: 47, carbs: 12, protein: 0.7, fat: 0.3, category: 'fruits' },
  "Watermelon": { calories: 46, carbs: 11, protein: 0.9, fat: 0.2, category: 'fruits' },

  // Grains & Carbs (per serving)
  "Bagel": { calories: 245, carbs: 48, protein: 10, fat: 1.5, category: 'grains' },
  "Barley": { calories: 193, carbs: 44, protein: 4, fat: 0.7, category: 'grains' },
  "Bread": { calories: 79, carbs: 15, protein: 3, fat: 1, category: 'grains' },
  "Brown rice": { calories: 216, carbs: 45, protein: 5, fat: 1.8, category: 'grains' },
  "Buckwheat": { calories: 155, carbs: 33, protein: 6, fat: 1, category: 'grains' },
  "Cereal": { calories: 120, carbs: 26, protein: 3, fat: 1, category: 'grains' },
  "Couscous": { calories: 176, carbs: 36, protein: 6, fat: 0.3, category: 'grains' },
  "Crackers": { calories: 60, carbs: 10, protein: 1, fat: 2, category: 'grains' },
  "Croissant": { calories: 231, carbs: 26, protein: 5, fat: 12, category: 'grains' },
  "English muffin": { calories: 134, carbs: 26, protein: 5, fat: 1, category: 'grains' },
  "Farro": { calories: 170, carbs: 34, protein: 7, fat: 1.5, category: 'grains' },
  "Granola": { calories: 200, carbs: 32, protein: 5, fat: 7, category: 'grains' },
  "Millet": { calories: 207, carbs: 41, protein: 6, fat: 1.7, category: 'grains' },
  "Muffin": { calories: 340, carbs: 52, protein: 5, fat: 12, category: 'grains' },
  "Oats": { calories: 150, carbs: 27, protein: 5, fat: 3, category: 'grains' },
  "Pancakes": { calories: 227, carbs: 38, protein: 6, fat: 5, category: 'grains' },
  "Pasta": { calories: 220, carbs: 43, protein: 8, fat: 1.3, category: 'grains' },
  "Pita bread": { calories: 165, carbs: 33, protein: 5.5, fat: 0.7, category: 'grains' },
  "Quinoa": { calories: 222, carbs: 39, protein: 8, fat: 3.5, category: 'grains' },
  "Rice": { calories: 206, carbs: 45, protein: 4.3, fat: 0.4, category: 'grains' },
  "Rice cakes": { calories: 35, carbs: 7, protein: 0.7, fat: 0.3, category: 'grains' },
  "Rye bread": { calories: 83, carbs: 15, protein: 3, fat: 1, category: 'grains' },
  "Toast": { calories: 79, carbs: 15, protein: 3, fat: 1, category: 'grains' },
  "Tortilla": { calories: 90, carbs: 15, protein: 2.5, fat: 2.5, category: 'grains' },
  "Waffles": { calories: 218, carbs: 25, protein: 6, fat: 11, category: 'grains' },
  "White rice": { calories: 206, carbs: 45, protein: 4.3, fat: 0.4, category: 'grains' },
  "Whole wheat bread": { calories: 81, carbs: 14, protein: 4, fat: 1, category: 'grains' },

  // Proteins - Meat & Poultry (per 100g / 3.5 oz)
  "Bacon": { calories: 541, carbs: 1, protein: 37, fat: 42, category: 'meat' },
  "Beef": { calories: 250, carbs: 0, protein: 26, fat: 15, category: 'meat' },
  "Bison": { calories: 143, carbs: 0, protein: 28, fat: 2.4, category: 'meat' },
  "Chicken": { calories: 165, carbs: 0, protein: 31, fat: 3.6, category: 'meat' },
  "Chicken breast": { calories: 165, carbs: 0, protein: 31, fat: 3.6, category: 'meat' },
  "Chicken thighs": { calories: 209, carbs: 0, protein: 26, fat: 11, category: 'meat' },
  "Duck": { calories: 337, carbs: 0, protein: 19, fat: 28, category: 'meat' },
  "Ground beef": { calories: 250, carbs: 0, protein: 26, fat: 15, category: 'meat' },
  "Ground turkey": { calories: 149, carbs: 0, protein: 28, fat: 3, category: 'meat' },
  "Ham": { calories: 145, carbs: 1.5, protein: 21, fat: 6, category: 'meat' },
  "Hot dog": { calories: 290, carbs: 2, protein: 10, fat: 26, category: 'meat' },
  "Lamb": { calories: 294, carbs: 0, protein: 25, fat: 21, category: 'meat' },
  "Pork": { calories: 242, carbs: 0, protein: 27, fat: 14, category: 'meat' },
  "Pork chops": { calories: 231, carbs: 0, protein: 27, fat: 13, category: 'meat' },
  "Ribs": { calories: 277, carbs: 0, protein: 24, fat: 20, category: 'meat' },
  "Sausage": { calories: 301, carbs: 2, protein: 12, fat: 27, category: 'meat' },
  "Steak": { calories: 271, carbs: 0, protein: 26, fat: 18, category: 'meat' },
  "Turkey": { calories: 135, carbs: 0, protein: 30, fat: 1, category: 'meat' },
  "Veal": { calories: 172, carbs: 0, protein: 31, fat: 5, category: 'meat' },
  "Venison": { calories: 158, carbs: 0, protein: 30, fat: 3, category: 'meat' },

  // Proteins - Seafood (per 100g / 3.5 oz)
  "Anchovies": { calories: 131, carbs: 0, protein: 20, fat: 5, category: 'seafood' },
  "Calamari": { calories: 175, carbs: 7, protein: 18, fat: 8, category: 'seafood' },
  "Catfish": { calories: 105, carbs: 0, protein: 18, fat: 3, category: 'seafood' },
  "Clams": { calories: 74, carbs: 3, protein: 13, fat: 1, category: 'seafood' },
  "Cod": { calories: 82, carbs: 0, protein: 18, fat: 0.7, category: 'seafood' },
  "Crab": { calories: 97, carbs: 0, protein: 19, fat: 1.5, category: 'seafood' },
  "Fish": { calories: 120, carbs: 0, protein: 22, fat: 3, category: 'seafood' },
  "Halibut": { calories: 111, carbs: 0, protein: 23, fat: 2, category: 'seafood' },
  "Lobster": { calories: 89, carbs: 0, protein: 19, fat: 0.9, category: 'seafood' },
  "Mackerel": { calories: 205, carbs: 0, protein: 19, fat: 14, category: 'seafood' },
  "Mussels": { calories: 86, carbs: 4, protein: 12, fat: 2, category: 'seafood' },
  "Oysters": { calories: 68, carbs: 4, protein: 7, fat: 2, category: 'seafood' },
  "Salmon": { calories: 208, carbs: 0, protein: 20, fat: 13, category: 'seafood' },
  "Sardines": { calories: 208, carbs: 0, protein: 25, fat: 11, category: 'seafood' },
  "Scallops": { calories: 111, carbs: 5, protein: 21, fat: 1, category: 'seafood' },
  "Shrimp": { calories: 99, carbs: 0, protein: 24, fat: 0.3, category: 'seafood' },
  "Tilapia": { calories: 96, carbs: 0, protein: 20, fat: 1.7, category: 'seafood' },
  "Trout": { calories: 148, carbs: 0, protein: 21, fat: 6.6, category: 'seafood' },
  "Tuna": { calories: 132, carbs: 0, protein: 28, fat: 1, category: 'seafood' },

  // Proteins - Plant-based (per cup cooked)
  "Black beans": { calories: 227, carbs: 41, protein: 15, fat: 0.9, category: 'plant_protein' },
  "Chickpeas": { calories: 269, carbs: 45, protein: 15, fat: 4, category: 'plant_protein' },
  "Edamame": { calories: 188, carbs: 14, protein: 18, fat: 8, category: 'plant_protein' },
  "Kidney beans": { calories: 225, carbs: 40, protein: 15, fat: 0.9, category: 'plant_protein' },
  "Lentils": { calories: 230, carbs: 40, protein: 18, fat: 0.8, category: 'plant_protein' },
  "Navy beans": { calories: 255, carbs: 47, protein: 15, fat: 1, category: 'plant_protein' },
  "Pinto beans": { calories: 245, carbs: 45, protein: 15, fat: 1, category: 'plant_protein' },
  "Seitan": { calories: 370, carbs: 14, protein: 75, fat: 2, category: 'plant_protein' },
  "Tempeh": { calories: 193, carbs: 9, protein: 19, fat: 11, category: 'plant_protein' },
  "Tofu": { calories: 76, carbs: 2, protein: 8, fat: 4.5, category: 'plant_protein' },
  "White beans": { calories: 249, carbs: 45, protein: 17, fat: 0.6, category: 'plant_protein' },

  // Eggs & Dairy
  "Boiled eggs": { calories: 78, carbs: 0.6, protein: 6, fat: 5, category: 'dairy' },
  "Butter": { calories: 102, carbs: 0, protein: 0.1, fat: 12, category: 'dairy' },
  "Cheddar cheese": { calories: 113, carbs: 0.4, protein: 7, fat: 9, category: 'dairy' },
  "Cheese": { calories: 113, carbs: 0.4, protein: 7, fat: 9, category: 'dairy' },
  "Cottage cheese": { calories: 98, carbs: 3, protein: 11, fat: 4, category: 'dairy' },
  "Cream": { calories: 52, carbs: 0.4, protein: 0.4, fat: 5.5, category: 'dairy' },
  "Cream cheese": { calories: 99, carbs: 1.6, protein: 1.7, fat: 10, category: 'dairy' },
  "Deviled eggs": { calories: 62, carbs: 0.3, protein: 3, fat: 5, category: 'dairy' },
  "Eggs": { calories: 78, carbs: 0.6, protein: 6, fat: 5, category: 'dairy' },
  "Feta cheese": { calories: 75, carbs: 1, protein: 4, fat: 6, category: 'dairy' },
  "Fried eggs": { calories: 90, carbs: 0.4, protein: 6, fat: 7, category: 'dairy' },
  "Goat cheese": { calories: 103, carbs: 0.2, protein: 6, fat: 8.5, category: 'dairy' },
  "Greek yogurt": { calories: 100, carbs: 6, protein: 17, fat: 0.7, category: 'dairy' },
  "Ice cream": { calories: 207, carbs: 24, protein: 3.5, fat: 11, category: 'dairy' },
  "Milk": { calories: 149, carbs: 12, protein: 8, fat: 8, category: 'dairy' },
  "Mozzarella": { calories: 85, carbs: 0.6, protein: 6, fat: 6, category: 'dairy' },
  "Omelet": { calories: 154, carbs: 1, protein: 11, fat: 12, category: 'dairy' },
  "Parmesan": { calories: 111, carbs: 1, protein: 10, fat: 7, category: 'dairy' },
  "Poached eggs": { calories: 71, carbs: 0.4, protein: 6, fat: 5, category: 'dairy' },
  "Ricotta": { calories: 174, carbs: 6, protein: 11, fat: 12, category: 'dairy' },
  "Scrambled eggs": { calories: 91, carbs: 1, protein: 6, fat: 7, category: 'dairy' },
  "Sour cream": { calories: 60, carbs: 1, protein: 0.7, fat: 6, category: 'dairy' },
  "Swiss cheese": { calories: 108, carbs: 1.5, protein: 8, fat: 8, category: 'dairy' },
  "Whipped cream": { calories: 51, carbs: 0.4, protein: 0.3, fat: 5.5, category: 'dairy' },
  "Yogurt": { calories: 100, carbs: 17, protein: 6, fat: 1.5, category: 'dairy' },

  // Vegetables (per cup)
  "Artichoke": { calories: 64, carbs: 14, protein: 3.5, fat: 0.2, category: 'vegetables' },
  "Arugula": { calories: 5, carbs: 0.7, protein: 0.5, fat: 0.1, category: 'vegetables' },
  "Asparagus": { calories: 27, carbs: 5, protein: 3, fat: 0.2, category: 'vegetables' },
  "Bean sprouts": { calories: 31, carbs: 6, protein: 3, fat: 0.2, category: 'vegetables' },
  "Beets": { calories: 58, carbs: 13, protein: 2, fat: 0.2, category: 'vegetables' },
  "Bell pepper": { calories: 31, carbs: 6, protein: 1, fat: 0.3, category: 'vegetables' },
  "Bok choy": { calories: 9, carbs: 1.5, protein: 1, fat: 0.1, category: 'vegetables' },
  "Broccoli": { calories: 31, carbs: 6, protein: 2.5, fat: 0.3, category: 'vegetables' },
  "Brussels sprouts": { calories: 56, carbs: 11, protein: 4, fat: 0.4, category: 'vegetables' },
  "Cabbage": { calories: 22, carbs: 5, protein: 1, fat: 0.1, category: 'vegetables' },
  "Carrot": { calories: 52, carbs: 12, protein: 1, fat: 0.3, category: 'vegetables' },
  "Cauliflower": { calories: 25, carbs: 5, protein: 2, fat: 0.1, category: 'vegetables' },
  "Celery": { calories: 16, carbs: 3, protein: 0.7, fat: 0.2, category: 'vegetables' },
  "Chard": { calories: 7, carbs: 1.4, protein: 0.6, fat: 0.1, category: 'vegetables' },
  "Collard greens": { calories: 11, carbs: 2, protein: 1, fat: 0.2, category: 'vegetables' },
  "Corn": { calories: 132, carbs: 29, protein: 5, fat: 1.8, category: 'vegetables' },
  "Cucumber": { calories: 16, carbs: 4, protein: 0.7, fat: 0.1, category: 'vegetables' },
  "Eggplant": { calories: 35, carbs: 8.6, protein: 0.8, fat: 0.2, category: 'vegetables' },
  "Garlic": { calories: 4, carbs: 1, protein: 0.2, fat: 0, category: 'vegetables' },
  "Green beans": { calories: 31, carbs: 7, protein: 1.8, fat: 0.1, category: 'vegetables' },
  "Green onion": { calories: 32, carbs: 7, protein: 1.8, fat: 0.2, category: 'vegetables' },
  "Jalapeno": { calories: 4, carbs: 0.9, protein: 0.1, fat: 0, category: 'vegetables' },
  "Kale": { calories: 33, carbs: 6, protein: 2.2, fat: 0.5, category: 'vegetables' },
  "Leek": { calories: 54, carbs: 13, protein: 1.3, fat: 0.3, category: 'vegetables' },
  "Lettuce": { calories: 5, carbs: 1, protein: 0.5, fat: 0.1, category: 'vegetables' },
  "Mushrooms": { calories: 15, carbs: 2, protein: 2, fat: 0.2, category: 'vegetables' },
  "Okra": { calories: 33, carbs: 7, protein: 1.9, fat: 0.2, category: 'vegetables' },
  "Onion": { calories: 44, carbs: 10, protein: 1.2, fat: 0.1, category: 'vegetables' },
  "Peas": { calories: 118, carbs: 21, protein: 8, fat: 0.6, category: 'vegetables' },
  "Pickle": { calories: 4, carbs: 0.8, protein: 0.2, fat: 0, category: 'vegetables' },
  "Potato": { calories: 161, carbs: 37, protein: 4, fat: 0.2, category: 'vegetables' },
  "Pumpkin": { calories: 30, carbs: 8, protein: 1, fat: 0.1, category: 'vegetables' },
  "Radish": { calories: 19, carbs: 4, protein: 0.8, fat: 0.1, category: 'vegetables' },
  "Red onion": { calories: 44, carbs: 10, protein: 1.2, fat: 0.1, category: 'vegetables' },
  "Romaine lettuce": { calories: 8, carbs: 1.5, protein: 0.6, fat: 0.1, category: 'vegetables' },
  "Salad": { calories: 20, carbs: 3, protein: 1.5, fat: 0.2, category: 'vegetables' },
  "Shallot": { calories: 72, carbs: 17, protein: 2.5, fat: 0.1, category: 'vegetables' },
  "Snap peas": { calories: 41, carbs: 7, protein: 3, fat: 0.2, category: 'vegetables' },
  "Spinach": { calories: 7, carbs: 1, protein: 0.9, fat: 0.1, category: 'vegetables' },
  "Squash": { calories: 31, carbs: 7, protein: 1, fat: 0.1, category: 'vegetables' },
  "Sweet potato": { calories: 103, carbs: 24, protein: 2, fat: 0.1, category: 'vegetables' },
  "Tomato": { calories: 22, carbs: 5, protein: 1, fat: 0.2, category: 'vegetables' },
  "Turnip": { calories: 36, carbs: 8, protein: 1.2, fat: 0.1, category: 'vegetables' },
  "Yam": { calories: 158, carbs: 37, protein: 2, fat: 0.2, category: 'vegetables' },
  "Zucchini": { calories: 21, carbs: 4, protein: 1.5, fat: 0.4, category: 'vegetables' },

  // Prepared Foods & Meals (per serving)
  "Burrito": { calories: 430, carbs: 53, protein: 14, fat: 18, category: 'prepared' },
  "Burger": { calories: 540, carbs: 40, protein: 25, fat: 31, category: 'prepared' },
  "Caesar salad": { calories: 190, carbs: 8, protein: 5, fat: 16, category: 'prepared' },
  "Casserole": { calories: 350, carbs: 30, protein: 20, fat: 16, category: 'prepared' },
  "Chicken nuggets": { calories: 286, carbs: 18, protein: 14, fat: 18, category: 'prepared' },
  "Chicken wings": { calories: 320, carbs: 8, protein: 27, fat: 21, category: 'prepared' },
  "Chili": { calories: 287, carbs: 22, protein: 25, fat: 12, category: 'prepared' },
  "Curry": { calories: 300, carbs: 15, protein: 20, fat: 18, category: 'prepared' },
  "Dumplings": { calories: 80, carbs: 11, protein: 3, fat: 3, category: 'prepared' },
  "Enchiladas": { calories: 323, carbs: 30, protein: 12, fat: 18, category: 'prepared' },
  "Fajitas": { calories: 300, carbs: 20, protein: 24, fat: 14, category: 'prepared' },
  "Fish and chips": { calories: 585, carbs: 55, protein: 23, fat: 30, category: 'prepared' },
  "Fried chicken": { calories: 320, carbs: 12, protein: 27, fat: 19, category: 'prepared' },
  "Fried rice": { calories: 238, carbs: 34, protein: 8, fat: 8, category: 'prepared' },
  "Grilled cheese": { calories: 440, carbs: 28, protein: 18, fat: 28, category: 'prepared' },
  "Gyro": { calories: 593, carbs: 42, protein: 44, fat: 27, category: 'prepared' },
  "Kebab": { calories: 280, carbs: 12, protein: 28, fat: 14, category: 'prepared' },
  "Lasagna": { calories: 377, carbs: 38, protein: 20, fat: 16, category: 'prepared' },
  "Mac and cheese": { calories: 350, carbs: 42, protein: 12, fat: 15, category: 'prepared' },
  "Meatballs": { calories: 196, carbs: 7, protein: 14, fat: 12, category: 'prepared' },
  "Meatloaf": { calories: 255, carbs: 11, protein: 17, fat: 16, category: 'prepared' },
  "Nachos": { calories: 346, carbs: 36, protein: 9, fat: 19, category: 'prepared' },
  "Noodles": { calories: 221, carbs: 43, protein: 7, fat: 1.5, category: 'prepared' },
  "Pad thai": { calories: 400, carbs: 50, protein: 15, fat: 16, category: 'prepared' },
  "Paella": { calories: 310, carbs: 35, protein: 18, fat: 10, category: 'prepared' },
  "Pasta salad": { calories: 200, carbs: 26, protein: 5, fat: 9, category: 'prepared' },
  "Pho": { calories: 350, carbs: 45, protein: 25, fat: 6, category: 'prepared' },
  "Pizza": { calories: 285, carbs: 36, protein: 12, fat: 10, category: 'prepared' },
  "Pot pie": { calories: 450, carbs: 40, protein: 15, fat: 26, category: 'prepared' },
  "Pot roast": { calories: 320, carbs: 15, protein: 35, fat: 14, category: 'prepared' },
  "Quesadilla": { calories: 470, carbs: 38, protein: 22, fat: 26, category: 'prepared' },
  "Quiche": { calories: 340, carbs: 18, protein: 14, fat: 24, category: 'prepared' },
  "Ramen": { calories: 436, carbs: 62, protein: 12, fat: 15, category: 'prepared' },
  "Risotto": { calories: 280, carbs: 38, protein: 7, fat: 10, category: 'prepared' },
  "Roast chicken": { calories: 190, carbs: 0, protein: 29, fat: 7.5, category: 'prepared' },
  "Salad bowl": { calories: 350, carbs: 25, protein: 20, fat: 18, category: 'prepared' },
  "Sandwich": { calories: 350, carbs: 35, protein: 18, fat: 15, category: 'prepared' },
  "Shepherd's pie": { calories: 280, carbs: 28, protein: 18, fat: 10, category: 'prepared' },
  "Soup": { calories: 120, carbs: 15, protein: 6, fat: 4, category: 'prepared' },
  "Spaghetti": { calories: 400, carbs: 58, protein: 15, fat: 12, category: 'prepared' },
  "Spring rolls": { calories: 90, carbs: 12, protein: 3, fat: 4, category: 'prepared' },
  "Stew": { calories: 235, carbs: 18, protein: 20, fat: 10, category: 'prepared' },
  "Stir fry": { calories: 280, carbs: 22, protein: 22, fat: 12, category: 'prepared' },
  "Sushi": { calories: 200, carbs: 38, protein: 9, fat: 1, category: 'prepared' },
  "Tacos": { calories: 226, carbs: 20, protein: 9, fat: 13, category: 'prepared' },
  "Teriyaki chicken": { calories: 280, carbs: 15, protein: 30, fat: 10, category: 'prepared' },
  "Wrap": { calories: 350, carbs: 38, protein: 18, fat: 14, category: 'prepared' },

  // Beverages (per cup/serving) - WITH CAFFEINE
  "Coffee": { calories: 2, carbs: 0, protein: 0.3, fat: 0, caffeine: 95, category: 'beverages' },
  "Espresso": { calories: 3, carbs: 0.5, protein: 0.1, fat: 0, caffeine: 63, category: 'beverages' },
  "Latte": { calories: 190, carbs: 18, protein: 10, fat: 7, caffeine: 75, category: 'beverages' },
  "Iced coffee": { calories: 5, carbs: 1, protein: 0.2, fat: 0, caffeine: 95, category: 'beverages' },
  "Tea": { calories: 2, carbs: 0.5, protein: 0, fat: 0, caffeine: 47, category: 'beverages' },
  "Green tea": { calories: 2, carbs: 0, protein: 0, fat: 0, caffeine: 28, category: 'beverages' },
  "Chai tea": { calories: 120, carbs: 23, protein: 2, fat: 2, caffeine: 50, category: 'beverages' },
  "Matcha": { calories: 5, carbs: 1, protein: 0.5, fat: 0, caffeine: 70, category: 'beverages' },
  "Iced tea": { calories: 90, carbs: 22, protein: 0, fat: 0, caffeine: 25, category: 'beverages' },
  "Energy drink": { calories: 110, carbs: 28, protein: 0, fat: 0, caffeine: 80, category: 'beverages' },
  "Cola": { calories: 140, carbs: 39, protein: 0, fat: 0, caffeine: 34, category: 'beverages' },
  "Hot chocolate": { calories: 190, carbs: 27, protein: 9, fat: 6, caffeine: 5, category: 'beverages' },

  // Beverages (no caffeine)
  "Almond milk": { calories: 39, carbs: 3.4, protein: 1, fat: 2.5, category: 'beverages' },
  "Apple juice": { calories: 114, carbs: 28, protein: 0.2, fat: 0.3, category: 'beverages' },
  "Beer": { calories: 153, carbs: 13, protein: 1.6, fat: 0, category: 'beverages' },
  "Champagne": { calories: 84, carbs: 1.5, protein: 0.1, fat: 0, category: 'beverages' },
  "Cider": { calories: 117, carbs: 14, protein: 0, fat: 0, category: 'beverages' },
  "Coconut water": { calories: 46, carbs: 9, protein: 2, fat: 0.5, category: 'beverages' },
  "Cranberry juice": { calories: 116, carbs: 31, protein: 0, fat: 0.3, category: 'beverages' },
  "Green juice": { calories: 70, carbs: 15, protein: 2, fat: 0.5, category: 'beverages' },
  "Herbal tea": { calories: 2, carbs: 0.5, protein: 0, fat: 0, category: 'beverages' },
  "Juice": { calories: 112, carbs: 26, protein: 0.5, fat: 0.3, category: 'beverages' },
  "Kombucha": { calories: 30, carbs: 7, protein: 0, fat: 0, category: 'beverages' },
  "Lemonade": { calories: 99, carbs: 26, protein: 0.2, fat: 0.1, category: 'beverages' },
  "Oat milk": { calories: 120, carbs: 16, protein: 3, fat: 5, category: 'beverages' },
  "Orange juice": { calories: 112, carbs: 26, protein: 1.7, fat: 0.5, category: 'beverages' },
  "Protein shake": { calories: 200, carbs: 10, protein: 25, fat: 5, category: 'beverages' },
  "Red wine": { calories: 125, carbs: 4, protein: 0.1, fat: 0, category: 'beverages' },
  "Smoothie": { calories: 250, carbs: 45, protein: 5, fat: 5, category: 'beverages' },
  "Soda": { calories: 140, carbs: 39, protein: 0, fat: 0, caffeine: 30, category: 'beverages' },
  "Soy milk": { calories: 105, carbs: 12, protein: 6, fat: 3.5, category: 'beverages' },
  "Sparkling water": { calories: 0, carbs: 0, protein: 0, fat: 0, category: 'beverages' },
  "Sports drink": { calories: 63, carbs: 16, protein: 0, fat: 0, category: 'beverages' },
  "Tomato juice": { calories: 41, carbs: 10, protein: 1.8, fat: 0.1, category: 'beverages' },
  "Water": { calories: 0, carbs: 0, protein: 0, fat: 0, category: 'beverages' },
  "White wine": { calories: 121, carbs: 3.8, protein: 0.1, fat: 0, category: 'beverages' },

  // Snacks & Sweets (per serving)
  "Almonds": { calories: 164, carbs: 6, protein: 6, fat: 14, category: 'snacks' },
  "Brownie": { calories: 227, carbs: 36, protein: 3, fat: 9, category: 'snacks' },
  "Cake": { calories: 350, carbs: 52, protein: 4, fat: 14, category: 'snacks' },
  "Candy": { calories: 100, carbs: 25, protein: 0, fat: 0, category: 'snacks' },
  "Cashews": { calories: 157, carbs: 9, protein: 5, fat: 12, category: 'snacks' },
  "Cheese crackers": { calories: 150, carbs: 18, protein: 3, fat: 7, category: 'snacks' },
  "Chips": { calories: 152, carbs: 15, protein: 2, fat: 10, category: 'snacks' },
  "Chocolate": { calories: 155, carbs: 17, protein: 1.4, fat: 9, caffeine: 12, category: 'snacks' },
  "Chocolate bar": { calories: 235, carbs: 26, protein: 3, fat: 13, caffeine: 20, category: 'snacks' },
  "Cookies": { calories: 142, carbs: 20, protein: 1.5, fat: 7, category: 'snacks' },
  "Donut": { calories: 269, carbs: 31, protein: 4, fat: 15, category: 'snacks' },
  "Energy bar": { calories: 200, carbs: 25, protein: 10, fat: 7, category: 'snacks' },
  "Fruit snacks": { calories: 80, carbs: 19, protein: 1, fat: 0, category: 'snacks' },
  "Gelato": { calories: 180, carbs: 24, protein: 4, fat: 8, category: 'snacks' },
  "Gummy bears": { calories: 87, carbs: 22, protein: 2, fat: 0, category: 'snacks' },
  "Hazelnuts": { calories: 178, carbs: 5, protein: 4, fat: 17, category: 'snacks' },
  "Jerky": { calories: 116, carbs: 3, protein: 9, fat: 7, category: 'snacks' },
  "Macadamia nuts": { calories: 204, carbs: 4, protein: 2, fat: 21, category: 'snacks' },
  "Mints": { calories: 20, carbs: 5, protein: 0, fat: 0, category: 'snacks' },
  "Mixed nuts": { calories: 172, carbs: 6, protein: 5, fat: 15, category: 'snacks' },
  "Nuts": { calories: 172, carbs: 6, protein: 5, fat: 15, category: 'snacks' },
  "Peanuts": { calories: 161, carbs: 5, protein: 7, fat: 14, category: 'snacks' },
  "Pecans": { calories: 196, carbs: 4, protein: 3, fat: 20, category: 'snacks' },
  "Pie": { calories: 296, carbs: 43, protein: 2, fat: 14, category: 'snacks' },
  "Pistachios": { calories: 159, carbs: 8, protein: 6, fat: 13, category: 'snacks' },
  "Popcorn": { calories: 31, carbs: 6, protein: 1, fat: 0.4, category: 'snacks' },
  "Potato chips": { calories: 152, carbs: 15, protein: 2, fat: 10, category: 'snacks' },
  "Pretzels": { calories: 108, carbs: 23, protein: 3, fat: 1, category: 'snacks' },
  "Protein bar": { calories: 200, carbs: 22, protein: 20, fat: 6, category: 'snacks' },
  "Pudding": { calories: 154, carbs: 25, protein: 3, fat: 5, category: 'snacks' },
  "Rice crisps": { calories: 100, carbs: 22, protein: 2, fat: 0.5, category: 'snacks' },
  "Seeds": { calories: 160, carbs: 5, protein: 5, fat: 14, category: 'snacks' },
  "Sorbet": { calories: 120, carbs: 30, protein: 0, fat: 0, category: 'snacks' },
  "Sunflower seeds": { calories: 165, carbs: 7, protein: 5.5, fat: 14, category: 'snacks' },
  "Trail mix": { calories: 173, carbs: 17, protein: 5, fat: 11, category: 'snacks' },
  "Walnuts": { calories: 185, carbs: 4, protein: 4, fat: 18, category: 'snacks' },

  // Condiments & Spreads (per tablespoon)
  "Aioli": { calories: 90, carbs: 0, protein: 0, fat: 10, category: 'condiments' },
  "BBQ sauce": { calories: 29, carbs: 7, protein: 0, fat: 0, category: 'condiments' },
  "Chutney": { calories: 30, carbs: 8, protein: 0, fat: 0, category: 'condiments' },
  "Gravy": { calories: 25, carbs: 3, protein: 0.5, fat: 1, category: 'condiments' },
  "Guacamole": { calories: 23, carbs: 1, protein: 0.3, fat: 2, category: 'condiments' },
  "Honey": { calories: 64, carbs: 17, protein: 0, fat: 0, category: 'condiments' },
  "Hot sauce": { calories: 1, carbs: 0.1, protein: 0, fat: 0, category: 'condiments' },
  "Hummus": { calories: 25, carbs: 2, protein: 1, fat: 1.4, category: 'condiments' },
  "Jam": { calories: 56, carbs: 14, protein: 0, fat: 0, category: 'condiments' },
  "Jelly": { calories: 56, carbs: 14, protein: 0, fat: 0, category: 'condiments' },
  "Ketchup": { calories: 19, carbs: 5, protein: 0.2, fat: 0, category: 'condiments' },
  "Maple syrup": { calories: 52, carbs: 13, protein: 0, fat: 0, category: 'condiments' },
  "Marinara sauce": { calories: 35, carbs: 7, protein: 1, fat: 0.5, category: 'condiments' },
  "Mayo": { calories: 94, carbs: 0.1, protein: 0.1, fat: 10, category: 'condiments' },
  "Mustard": { calories: 3, carbs: 0.3, protein: 0.2, fat: 0.2, category: 'condiments' },
  "Nutella": { calories: 100, carbs: 11, protein: 1, fat: 5.5, category: 'condiments' },
  "Olive oil": { calories: 119, carbs: 0, protein: 0, fat: 14, category: 'condiments' },
  "Peanut butter": { calories: 94, carbs: 3, protein: 4, fat: 8, category: 'condiments' },
  "Pesto": { calories: 80, carbs: 1, protein: 2, fat: 8, category: 'condiments' },
  "Ranch dressing": { calories: 73, carbs: 1, protein: 0.3, fat: 8, category: 'condiments' },
  "Salsa": { calories: 5, carbs: 1, protein: 0.2, fat: 0, category: 'condiments' },
  "Soy sauce": { calories: 9, carbs: 1, protein: 1, fat: 0, category: 'condiments' },
  "Sriracha": { calories: 5, carbs: 1, protein: 0, fat: 0, category: 'condiments' },
  "Tahini": { calories: 89, carbs: 3, protein: 3, fat: 8, category: 'condiments' },
  "Tartar sauce": { calories: 74, carbs: 2, protein: 0.1, fat: 8, category: 'condiments' },
  "Teriyaki sauce": { calories: 16, carbs: 3, protein: 1, fat: 0, category: 'condiments' },
  "Tzatziki": { calories: 12, carbs: 1, protein: 0.5, fat: 0.7, category: 'condiments' },
  "Vinaigrette": { calories: 45, carbs: 1, protein: 0, fat: 4.5, category: 'condiments' },
  "Worcestershire sauce": { calories: 4, carbs: 1, protein: 0, fat: 0, category: 'condiments' },
};

// Helper function to get nutrition for a food item
export const getNutrition = (foodName: string): FoodNutrition | null => {
  // Try exact match first
  if (NUTRITION_DATA[foodName]) {
    return NUTRITION_DATA[foodName];
  }

  // Try case-insensitive match
  const lowerFood = foodName.toLowerCase();
  for (const [key, value] of Object.entries(NUTRITION_DATA)) {
    if (key.toLowerCase() === lowerFood) {
      return value;
    }
  }

  // Try partial match for compound foods
  for (const [key, value] of Object.entries(NUTRITION_DATA)) {
    if (lowerFood.includes(key.toLowerCase()) || key.toLowerCase().includes(lowerFood)) {
      return value;
    }
  }

  return null;
};

// Helper function to check if food contains caffeine
export const hasCaffeine = (foodName: string): boolean => {
  const nutrition = getNutrition(foodName);
  return nutrition?.caffeine !== undefined && nutrition.caffeine > 0;
};

// Helper function to get caffeine amount
export const getCaffeine = (foodName: string): number => {
  const nutrition = getNutrition(foodName);
  return nutrition?.caffeine || 0;
};

// Calculate total nutrition from a list of foods
export const calculateTotalNutrition = (foods: string[]): {
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
  totalCaffeine: number;
  breakdown: { food: string; nutrition: FoodNutrition | null }[];
} => {
  let totalCalories = 0;
  let totalProtein = 0;
  let totalCarbs = 0;
  let totalFat = 0;
  let totalCaffeine = 0;
  const breakdown: { food: string; nutrition: FoodNutrition | null }[] = [];

  foods.forEach(food => {
    const nutrition = getNutrition(food.trim());
    breakdown.push({ food, nutrition });

    if (nutrition) {
      totalCalories += nutrition.calories;
      totalProtein += nutrition.protein || 0;
      totalCarbs += nutrition.carbs || 0;
      totalFat += nutrition.fat || 0;
      totalCaffeine += nutrition.caffeine || 0;
    }
  });

  return {
    totalCalories,
    totalProtein,
    totalCarbs,
    totalFat,
    totalCaffeine,
    breakdown,
  };
};
