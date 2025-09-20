import React, { useMemo } from "react";
import { ScrollView, View } from "react-native";
import { Text } from "react-native-paper";
import { CartesianChart, Bar } from "victory-native";
import { useSymptomAggregates } from "../../hooks/symptoms";

export default function SymptomTrendsScreen() {
  const { bloatingPerWeek, energyVsMeal, stoolDist } = useSymptomAggregates();

  const bloatingData = useMemo(
    () =>
      (bloatingPerWeek.data ?? []).map((d) => ({
        label: d.week_start,
        value: d.avg,
        color: "#888888",
      })),
    [bloatingPerWeek.data]
  );
  const energyData = useMemo(
    () =>
      (energyVsMeal.data ?? []).map((d) => ({
        label: d.meal ?? "unknown",
        value: d.mean,
        color: "#888888",
      })),
    [energyVsMeal.data]
  );
  const stoolData = useMemo(
    () =>
      (stoolDist.data ?? []).map((d) => ({
        label: d.label,
        value: d.count,
        color: "#888888",
      })),
    [stoolDist.data]
  );

  return (
    <ScrollView contentContainerStyle={{ padding: 16, gap: 24 }}>
      <Text variant="titleLarge">Trends</Text>

      <View>
        <Text variant="titleMedium">Average bloating per week</Text>
        {!!bloatingData.length && (
          <View style={{ height: 240 }}>
            <CartesianChart
              data={bloatingData}
              xKey="label"
              yKeys={["value"]}
              domainPadding={{ left: 20, right: 20, top: 10, bottom: 10 }}
            >
              {({ points, chartBounds }) => (
                <>
                  {points.value.map((point, idx) => (
                    <Bar
                      key={`bloat-${idx}`}
                      chartBounds={chartBounds}
                      points={[point]}
                      roundedCorners={{ topLeft: 6, topRight: 6 }}
                      color={bloatingData[idx].color}
                      barWidth={28}
                    />
                  ))}
                </>
              )}
            </CartesianChart>
          </View>
        )}
      </View>

      <View>
        <Text variant="titleMedium">Energy vs meal type</Text>
        {!!energyData.length && (
          <View style={{ height: 240 }}>
            <CartesianChart
              data={energyData}
              xKey="label"
              yKeys={["value"]}
              domainPadding={{ left: 20, right: 20, top: 10, bottom: 10 }}
            >
              {({ points, chartBounds }) => (
                <>
                  {points.value.map((point, idx) => (
                    <Bar
                      key={`energy-${idx}`}
                      chartBounds={chartBounds}
                      points={[point]}
                      roundedCorners={{ topLeft: 6, topRight: 6 }}
                      color={energyData[idx].color}
                      barWidth={28}
                    />
                  ))}
                </>
              )}
            </CartesianChart>
          </View>
        )}
      </View>

      <View>
        <Text variant="titleMedium">Stool consistency distribution</Text>
        {!!stoolData.length && (
          <View style={{ height: 240 }}>
            <CartesianChart
              data={stoolData}
              xKey="label"
              yKeys={["value"]}
              domainPadding={{ left: 20, right: 20, top: 10, bottom: 10 }}
            >
              {({ points, chartBounds }) => (
                <>
                  {points.value.map((point, idx) => (
                    <Bar
                      key={`stool-${idx}`}
                      chartBounds={chartBounds}
                      points={[point]}
                      roundedCorners={{ topLeft: 6, topRight: 6 }}
                      color={stoolData[idx].color}
                      barWidth={28}
                    />
                  ))}
                </>
              )}
            </CartesianChart>
          </View>
        )}
      </View>
    </ScrollView>
  );
}
