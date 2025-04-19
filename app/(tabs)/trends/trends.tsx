import React from "react";
import {
  SafeAreaView,
  ScrollView,
  View,
  ActivityIndicator,
  Text,
} from "react-native";
import { Pie, PolarChart } from "victory-native";
import Slider from "@react-native-community/slider";
import { useQuery } from "@tanstack/react-query";
import { useFont } from "@shopify/react-native-skia";
import { useQueryFoodIntakeChartData } from "@/hooks/queries/useMutationInsertFoodIntake";

export interface ChartData extends Record<string, unknown> {
  label: string;
  value: number;
  color: string;
}

const TrendsAndAnalyticsScreen: React.FC = () => {
  const font = useFont(require("@/assets/fonts/SpaceMono-Regular.ttf"), 12);

  const {
    data: chartData = [],
    isLoading,
    isError,
  } = useQuery(useQueryFoodIntakeChartData());

  return (
    <SafeAreaView>
      <ScrollView>
        <View style={{ height: 300 }}>
          {isLoading ? (
            <ActivityIndicator size="large" color="#0000ff" />
          ) : isError ? (
            <Text>Error loading data.</Text>
          ) : chartData.length > 0 ? (
            <View style={{ height: 300 }}>
              <PolarChart
                data={chartData}
                labelKey="label"
                valueKey="value"
                colorKey="color"
              >
                <Pie.Chart>
                  {({ slice }) => (
                    <Pie.Slice>
                      <Pie.Label color="white" font={font} text={slice.label} />
                    </Pie.Slice>
                  )}
                </Pie.Chart>
              </PolarChart>
            </View>
          ) : (
            <Text>No food intake data available.</Text>
          )}
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
};

export default TrendsAndAnalyticsScreen;
