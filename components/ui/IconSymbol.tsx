import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { SymbolWeight } from "expo-symbols";
import React from "react";
import { OpaqueColorValue, StyleProp, TextStyle } from "react-native";

const MAPPING = {
  "house.fill": "home",
  "paperplane.fill": "send",
  "chart.bar": "insert-chart",
  "slider.horizontal.3": "tune",
  "chevron.left.forwardslash.chevron.right": "code",
  "chevron.right": "chevron-right",
  "book.closed.fill": "menu-book",
  "face.smiling": "sentiment-satisfied-alt",
  "fork.knife": "restaurant",
  "cloud.sun.fill": "wb-sunny",
  "gearshape.fill": "settings",
} as const;

export type IconSymbolName = keyof typeof MAPPING;

export function IconSymbol({
  name,
  size = 24,
  color,
  style,
}: {
  name: IconSymbolName;
  size?: number;
  color: string | OpaqueColorValue;
  style?: StyleProp<TextStyle>;
  weight?: SymbolWeight;
}) {
  return (
    <MaterialIcons
      color={color}
      size={size}
      name={MAPPING[name]}
      style={style}
    />
  );
}
