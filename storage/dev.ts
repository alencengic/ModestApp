import { openDatabase } from "./db_connection";

export const dropEntryTables = async () => {
  const db = await openDatabase();

  await db.execAsync(`
    DROP TABLE IF EXISTS food_intakes;
    DROP TABLE IF EXISTS mood_ratings;
    DROP TABLE IF EXISTS journal_entries;
  `);
};
