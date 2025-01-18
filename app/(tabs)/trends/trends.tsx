import { SafeAreaView, ScrollView, StyleSheet, View } from "react-native";

import { Pie, PolarChart } from "victory-native";
import Slider from "@react-native-community/slider";

const randomNumber = (): number => {
  return Math.floor(Math.random() * 26) + 125;
};
const generateRandomColor = (): string => {
  const randomColor = Math.floor(Math.random() * 0xffffff);

  return `#${randomColor.toString(16).padStart(6, "0")}`;
};

const data = (numberPoints = 5) =>
  Array.from({ length: numberPoints }, (_, index) => ({
    value: randomNumber(),
    color: generateRandomColor(),
    label: `Label ${index + 1}`,
  }));

export default function TrendsAndAnalyticsScreen() {
  return (
    <SafeAreaView>
      <ScrollView>
        <View style={{ height: 300 }}>
          <PolarChart
            data={data()}
            labelKey="label"
            valueKey={"value"}
            colorKey={"color"}
          >
            <Pie.Chart />
          </PolarChart>
        </View>
        <Slider
          style={{ width: 200, height: 40 }}
          minimumValue={0}
          maximumValue={1}
          minimumTrackTintColor="#FFFFFF"
          maximumTrackTintColor="#000000"
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    color: "#808080",
    bottom: -90,
    left: -35,
    position: "absolute",
  },
  titleContainer: {
    flexDirection: "row",
    gap: 8,
  },
});
