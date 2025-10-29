import { openDatabase } from "./db_connection";

export interface ProductivityEntry {
  id: number;
  productivity: number;
  date: string;
}

export const insertOrUpdateProductivity = async (
  productivity: number,
  date: string
) => {
  const db = await openDatabase();
  return await db.runAsync(
    `INSERT INTO productivity_ratings (productivity, date)
     VALUES (?, ?)
     ON CONFLICT(date) DO UPDATE SET productivity = excluded.productivity`,
    productivity,
    date
  );
};

export const getProductivityByDate = async (
  date: string
): Promise<ProductivityEntry | null> => {
  const db = await openDatabase();
  const result = await db.getFirstAsync<ProductivityEntry>(
    "SELECT * FROM productivity_ratings WHERE date = ?",
    date
  );
  return result;
};

export const getAllProductivityRatings = async (): Promise<
  ProductivityEntry[]
> => {
  const db = await openDatabase();
  return await db.getAllAsync<ProductivityEntry>(
    "SELECT * FROM productivity_ratings ORDER BY date DESC"
  );
};
