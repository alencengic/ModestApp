// Legacy database exports - now pointing to Supabase implementations
export * from "./supabase/userProfile";
export * from "./supabase/foodIntakes";
export * from "./supabase/journalEntries";
export * from "./supabase/meals";
export * from "./supabase/moodEntries";
export * from "./supabase/productivityEntries";
export * from "./supabase/weatherData";

// Correlations and analysis functions (still using SQLite)
export * from "./correlations";
