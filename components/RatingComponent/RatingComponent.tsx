import React, { useState } from "react";
import { View, Text, TouchableOpacity, Alert } from "react-native";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { StyleSheet } from "react-native";

export interface RatingOption<T> {
  value: T;
  display: string | React.ReactNode;
  label: string;
}

interface RatingComponentProps<T> {
  title: string;
  options: RatingOption<T>[];
  onSave?: (value: T) => Promise<void>;
  onChange?: (value: T) => void;
  queryKeys?: string[][];
  successMessage?: string;
  errorMessage?: string;
  selectedMessage?: (value: T, option: RatingOption<T>) => string;
  containerStyle?: object;
  titleStyle?: object;
  buttonContainerStyle?: object;
  buttonStyle?: object;
  selectedButtonStyle?: object;
  displayTextStyle?: object;
  selectedTextStyle?: object;
  autoSave?: boolean;
  defaultValue?: T;
}

export function RatingComponent<T extends string | number>({
  title,
  options,
  onSave,
  onChange,
  queryKeys = [],
  successMessage = "Saved successfully",
  errorMessage = "Failed to save",
  selectedMessage,
  containerStyle,
  titleStyle,
  buttonContainerStyle,
  buttonStyle,
  selectedButtonStyle,
  displayTextStyle,
  selectedTextStyle,
  autoSave = true,
  defaultValue,
}: RatingComponentProps<T>) {
  const [selectedValue, setSelectedValue] = useState<T | null>(defaultValue ?? null);
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: onSave || (() => Promise.resolve()),
    onSuccess: () => {
      queryKeys.forEach((key) => {
        queryClient.invalidateQueries({ queryKey: key });
      });
      if (autoSave) {
        Alert.alert("Success", successMessage);
      }
    },
    onError: (error) => {
      console.error("Rating save failed:", error);
      if (autoSave) {
        Alert.alert("Save Failed", errorMessage);
      }
    },
  });

  const handleClick = (value: T) => {
    setSelectedValue(value);
    onChange?.(value);

    if (autoSave && onSave) {
      mutation.mutate(value);
    }
  };

  const selectedOption = options.find((opt) => opt.value === selectedValue);

  return (
    <View style={[styles.container, containerStyle]}>
      <Text style={[styles.title, titleStyle]}>{title}</Text>
      <View style={[styles.buttonContainer, buttonContainerStyle]}>
        {options.map((option, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => handleClick(option.value)}
            style={[
              styles.button,
              buttonStyle,
              selectedValue === option.value && [
                styles.selectedButton,
                selectedButtonStyle,
              ],
            ]}
          >
            <Text style={[styles.displayText, displayTextStyle]}>
              {option.display}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      {selectedValue !== null && selectedOption && (
        <Text style={[styles.selectedText, selectedTextStyle]}>
          {selectedMessage
            ? selectedMessage(selectedValue, selectedOption)
            : `You selected: ${selectedOption.label}`}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 20,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 20,
    marginBottom: 10,
    fontWeight: "bold",
    textAlign: "center",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 10,
  },
  button: {
    padding: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#ccc",
    minWidth: 50,
    alignItems: "center",
  },
  selectedButton: {
    backgroundColor: "#007AFF",
    borderColor: "#007AFF",
  },
  displayText: {
    fontSize: 16,
  },
  selectedText: {
    marginTop: 10,
    fontSize: 16,
    textAlign: "center",
  },
});
