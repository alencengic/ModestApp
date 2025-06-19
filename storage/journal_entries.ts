import { DateTime } from "luxon";
import { openDatabase } from "./db_connection";

type JournalEntryRow = { content: string; date: string };

export const insertJournalEntry = async (note: string, date: string) => {
  const db = await openDatabase();

  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS journal_entries (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      note TEXT,
      date TEXT
    );
  `);

  return await db.runAsync(
    "INSERT INTO journal_entries (note, date) VALUES (?, ?)",
    note,
    date
  );
};

export const getJournalEntriesByRange = async (
  fromDate: Date,
  toDate: Date
): Promise<{ content: string; date: string }[]> => {
  const db = await openDatabase();

  const fromISO = DateTime.fromJSDate(fromDate).startOf("day").toISO();
  const toISO = DateTime.fromJSDate(toDate).endOf("day").toISO();

  const rows = await db.getAllAsync(
    `SELECT note as content, date FROM journal_entries WHERE date BETWEEN ? AND ? ORDER BY date DESC`,
    fromISO,
    toISO
  );

  return (rows as JournalEntryRow[]).map((row) => ({
    content: row.content,
    date: row.date,
  }));
};
