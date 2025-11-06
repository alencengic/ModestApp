// Legacy database exports - now pointing to Supabase implementations
export * from "./supabase/userProfile";
export * from "./supabase/foodIntakes";
export * from "./supabase/journalEntries";
export * from "./supabase/meals";
export * from "./supabase/moodEntries";
export * from "./supabase/productivityEntries";
export * from "./supabase/weatherData";

// Note: Some complex functions like correlations may need separate migration
// export * from "./correlations"; // TODO: Migrate to Supabase
