import { isAxiosError } from "axios";
import { Alert } from "react-native";

export const handleQueryError = (fallbackMessage?: string) => (err: Error) => {
  if (!isAxiosError(err)) {
    return;
  }

  const message = err.response?.data?.error;
  fallbackMessage || "An unknown error occurred.";

  Alert.alert("Error", message);
};
