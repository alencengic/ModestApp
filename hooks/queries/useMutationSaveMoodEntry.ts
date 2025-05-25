import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  insertOrReplaceMoodEntry,
  MoodEntry, // Assuming MoodEntry includes id, if not, it's fine for the args
} from "../../storage/database";
import { handleQueryError } from "./helpers/handleQueryError.helper";

// Interface for the arguments expected by the mutation function
interface SaveMoodEntryArgs {
  mood_label: string;
  emoji: string;
  date: string;
}

export const useMutationSaveMoodEntry = () => {
  const queryClient = useQueryClient();

  return useMutation<SQLite.SQLiteRunResult, Error, SaveMoodEntryArgs>({
    mutationFn: (moodEntryData: SaveMoodEntryArgs) =>
      insertOrReplaceMoodEntry(moodEntryData),
    onSuccess: () => {
      // Invalidate queries related to mood entries to refetch fresh data
      queryClient.invalidateQueries({ queryKey: ["moodEntries"] }); // For lists of entries if any
      queryClient.invalidateQueries({ queryKey: ["moodEntryByDate"] }); // For specific entries by date
    },
    onError: handleQueryError("Failed to save mood entry"),
  });
};
