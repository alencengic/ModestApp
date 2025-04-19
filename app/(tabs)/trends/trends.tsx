import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  View,
  ActivityIndicator,
  Text,
} from "react-native";
import { Pie, PolarChart } from "victory-native";
import Slider from "@react-native-community/slider";
import { getFoodIntakeChartData } from "@/storage/database";
import { useFont } from "@shopify/react-native-skia";

export interface ChartData extends Record<string, unknown> {
  label: string;
  value: number;
  color: string;
}

const TrendsAndAnalyticsScreen: React.FC = () => {
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const font = useFont(require("@/assets/fonts/SpaceMono-Regular.ttf"), 12);

  useEffect(() => {
    fetchChartData();
  }, []);

  const fetchChartData = async (): Promise<void> => {
    setLoading(true);
    try {
      const data: ChartData[] = await getFoodIntakeChartData();

      setChartData(data);
    } catch (error) {
      console.error("Error fetching chart data:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView>
      <ScrollView>
        <View style={{ height: 300 }}>
          {loading ? (
            <ActivityIndicator size="large" color="#0000ff" />
          ) : chartData.length > 0 ? (
            <View style={{ height: 300 }}>
              <PolarChart
                data={chartData}
                labelKey="label"
                valueKey="value"
                colorKey="color"
              >
                <Pie.Chart>
                  {({ slice }) => {
                    return (
                      <>
                        <Pie.Slice>
                          <Pie.Label
                            color={"white"}
                            font={font}
                            text={slice.label}
                          />
                        </Pie.Slice>
                      </>
                    );
                  }}
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
