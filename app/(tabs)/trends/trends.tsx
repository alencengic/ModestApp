import React, { useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  View,
  ActivityIndicator,
  Text,
  Button,
} from "react-native";
import { Pie, PolarChart } from "victory-native";
import Slider from "@react-native-community/slider";
import { useQuery } from "@tanstack/react-query";
import { useFont } from "@shopify/react-native-skia";

import DateTimePicker from "@react-native-community/datetimepicker";
import { useQueryFoodIntakeChartData } from "@/hooks/queries/useMutationInsertFoodIntake";

export interface ChartData extends Record<string, unknown> {
  label: string;
  value: number;
  color: string;
}

const TrendsAndAnalyticsScreen: React.FC = () => {
  const font = useFont(require("@/assets/fonts/SpaceMono-Regular.ttf"), 12);
  const [range, setRange] = useState<"day" | "week" | "month" | "custom">(
    "week"
  );
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  const {
    data: chartData = [],
    isLoading,
    isError,
  } = useQuery(useQueryFoodIntakeChartData(range, selectedDate));

  return (
    <SafeAreaView>
      <ScrollView>
        <View style={{ paddingHorizontal: 20, marginBottom: 16 }}>
          <Text style={{ fontWeight: "bold", fontSize: 18, marginBottom: 8 }}>
            Filter By
          </Text>
          <View style={{ flexDirection: "row", gap: 8, flexWrap: "wrap" }}>
            <Button title="Today" onPress={() => setRange("day")} />
            <Button title="This Week" onPress={() => setRange("week")} />
            <Button title="This Month" onPress={() => setRange("month")} />
            <Button
              title="Choose a Day"
              onPress={() => {
                setRange("custom");
                setShowDatePicker(true);
              }}
            />
          </View>
          {showDatePicker && (
            <DateTimePicker
              value={selectedDate}
              mode="date"
              display="default"
              onChange={(event, date) => {
                setShowDatePicker(false);
                if (date) {
                  setSelectedDate(date);
                  setRange("custom");
                }
              }}
            />
          )}
        </View>

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
      </ScrollView>
    </SafeAreaView>
  );
};

export default TrendsAndAnalyticsScreen;
