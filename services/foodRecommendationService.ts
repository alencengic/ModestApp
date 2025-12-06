import { supabase } from '@/lib/supabase';
import { DateTime } from 'luxon';

export interface FoodRecommendation {
  food: string;
  impact: 'positive' | 'negative' | 'neutral';
  moodChange: number; // -1 to 1
  frequency: number;
  alternatives?: string[];
  warning?: string;
}

export interface FoodWarning {
  message: string;
  severity: 'low' | 'medium' | 'high';
}

export interface FoodSuggestion {
  food: string;
  reason: string;
}

export const analyzeFoodMoodImpact = async (): Promise<FoodRecommendation[]> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const thirtyDaysAgo = DateTime.now().minus({ days: 30 }).toISODate();

    const [foodData, moodData] = await Promise.all([
      supabase
        .from('food_intakes')
        .select('*')
        .eq('user_id', user.id)
        .gte('date', thirtyDaysAgo),
      supabase
        .from('mood_ratings')
        .select('*')
        .eq('user_id', user.id)
        .gte('date', thirtyDaysAgo),
    ]);

    if (!foodData.data || !moodData.data) return [];

    const foodImpactMap = new Map<string, { moods: number[]; count: number }>();

    // Analyze mood changes after eating specific foods
    foodData.data.forEach(food => {
      const moodOnDate = moodData.data?.find(m => m.date === food.date);
      
      if (moodOnDate) {
        food.foods?.forEach((f: string) => {
          const normalized = f.toLowerCase().trim();
          if (!foodImpactMap.has(normalized)) {
            foodImpactMap.set(normalized, { moods: [], count: 0 });
          }
          const impact = foodImpactMap.get(normalized)!;
          impact.moods.push(moodOnDate.mood);
          impact.count++;
        });
      }
    });

    const recommendations: FoodRecommendation[] = [];

    foodImpactMap.forEach((value, food) => {
      if (value.count >= 2) { // Only if eaten at least 2 times
        const avgMood = value.moods.reduce((a, b) => a + b, 0) / value.moods.length;
        const moodChange = (avgMood - 3) / 5; // Normalize to -1 to 1

        let impact: 'positive' | 'negative' | 'neutral';
        if (moodChange > 0.2) impact = 'positive';
        else if (moodChange < -0.2) impact = 'negative';
        else impact = 'neutral';

        const rec: FoodRecommendation = {
          food,
          impact,
          moodChange,
          frequency: value.count,
        };

        // Add alternatives for negative impact foods
        if (impact === 'negative') {
          rec.alternatives = suggestAlternatives(food);
          rec.warning = `Eating ${food} is often followed by lower moods. Consider alternatives.`;
        }

        recommendations.push(rec);
      }
    });

    return recommendations.sort((a, b) => Math.abs(b.moodChange) - Math.abs(a.moodChange));
  } catch (error) {
    console.error('Error analyzing food mood impact:', error);
    return [];
  }
};

const suggestAlternatives = (food: string): string[] => {
  const alternatives: Record<string, string[]> = {
    'chocolate': ['berries', 'dark chocolate 70%+', 'nuts'],
    'coffee': ['green tea', 'herbal tea', 'water'],
    'fast food': ['salad', 'grilled chicken', 'brown rice bowl'],
    'soda': ['sparkling water', 'fresh juice', 'kombucha'],
    'sweets': ['fruit', 'yogurt with honey', 'protein bar'],
    'fried': ['baked', 'grilled', 'steamed'],
    'alcohol': ['mocktail', 'sparkling cider', 'kombucha'],
    'processed': ['whole foods', 'organic', 'homemade'],
  };

  for (const [trigger, alts] of Object.entries(alternatives)) {
    if (food.toLowerCase().includes(trigger)) {
      return alts;
    }
  }

  return ['fresh fruits', 'vegetables', 'nuts'];
};

export const checkFoodWarning = async (food: string): Promise<FoodWarning | null> => {
  // Check if foods contain known problematic items
  const problematicFoods = [
    { trigger: 'alcohol', message: 'Alcohol may affect your sleep and mood tomorrow.', severity: 'high' as const },
    { trigger: 'sugar', message: 'High sugar foods may cause energy crashes.', severity: 'medium' as const },
    { trigger: 'caffeine', message: 'Caffeine late in the day may affect sleep.', severity: 'medium' as const },
    { trigger: 'fried', message: 'Fried foods may make you feel sluggish.', severity: 'low' as const },
    { trigger: 'processed', message: 'Processed foods may affect your energy levels.', severity: 'low' as const },
  ];
  
  const lowerFood = food.toLowerCase();
  for (const item of problematicFoods) {
    if (lowerFood.includes(item.trigger)) {
      return { message: `⚠️ ${item.message}`, severity: item.severity };
    }
  }

  return null;
};

export const getSmartFoodSuggestions = async (mealType?: string): Promise<FoodSuggestion[]> => {
  try {
    const recommendations = await analyzeFoodMoodImpact();
    const positiveFood = recommendations.filter(r => r.impact === 'positive').slice(0, 3);
    
    if (positiveFood.length > 0) {
      return positiveFood.map(r => ({ 
        food: r.food, 
        reason: 'Often improves your mood' 
      }));
    }

    // Default healthy suggestions by meal type
    const defaults: Record<string, FoodSuggestion[]> = {
      breakfast: [
        { food: 'oatmeal', reason: 'Steady energy release' },
        { food: 'eggs', reason: 'High in protein' },
        { food: 'berries', reason: 'Rich in antioxidants' },
      ],
      lunch: [
        { food: 'grilled chicken', reason: 'Lean protein' },
        { food: 'salad', reason: 'Nutrient-rich' },
        { food: 'brown rice', reason: 'Complex carbs' },
      ],
      dinner: [
        { food: 'fish', reason: 'Omega-3 fatty acids' },
        { food: 'vegetables', reason: 'Fiber and vitamins' },
        { food: 'sweet potato', reason: 'Complex carbs' },
      ],
      snacks: [
        { food: 'nuts', reason: 'Healthy fats' },
        { food: 'fruit', reason: 'Natural sugars' },
        { food: 'yogurt', reason: 'Probiotics' },
      ],
    };

    return defaults[mealType?.toLowerCase() || 'snacks'] || defaults.snacks;
  } catch (error) {
    console.error('Error getting food suggestions:', error);
    return [];
  }
};
