import React from "react";
import { Drawer } from "expo-router/drawer";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { useTheme } from "@/context/ThemeContext";

export default function TabLayout() {
  const { theme } = useTheme();

  return (
    <Drawer
      screenOptions={{
        drawerActiveTintColor: theme.colors.primary,
        drawerInactiveTintColor: theme.colors.textSecondary,
        drawerStyle: {
          backgroundColor: theme.colors.background,
        },
        drawerLabelStyle: {
          color: theme.colors.textPrimary,
        },
        headerShown: true,
        headerStyle: {
          backgroundColor: theme.colors.surface,
        },
        headerTintColor: theme.colors.primary,
        headerTitleStyle: {
          color: theme.colors.textPrimary,
        },
      }}
    >
      <Drawer.Screen
        name="index"
        options={{
          title: "Home",
          drawerIcon: ({ color }) => (
            <IconSymbol size={24} name="house.fill" color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="daily/journal"
        options={{
          title: "Daily Journal",
          drawerIcon: ({ color }) => (
            <IconSymbol size={24} name="book.closed.fill" color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="trends/trends"
        options={{
          title: "Trends and Analytics",
          drawerIcon: ({ color }) => (
            <IconSymbol size={24} name="chart.bar" color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="mood/analytics"
        options={{
          title: "Mood Analytics",
          drawerIcon: ({ color }) => (
            <IconSymbol size={24} name="face.smiling" color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="trends/food-analytics"
        options={{
          title: "Food Analytics",
          drawerIcon: ({ color }) => (
            <IconSymbol size={24} name="fork.knife" color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="meals/meals"
        options={{
          title: "My Meals",
          drawerIcon: ({ color }) => (
            <IconSymbol size={24} name="list.bullet.clipboard" color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="weather/weather-mood"
        options={{
          title: "Weather & Mood",
          drawerIcon: ({ color }) => (
            <IconSymbol size={24} name="cloud.sun.fill" color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="settings/settings"
        options={{
          title: "Settings",
          drawerIcon: ({ color }) => (
            <IconSymbol size={24} name="gearshape.fill" color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="daily/daily"
        options={{
          drawerItemStyle: { display: "none" },
          headerShown: true,
          title: "Daily Entry",
        }}
      />
      <Drawer.Screen
        name="weather"
        options={{
          drawerItemStyle: { display: "none" },
          headerShown: false,
        }}
      />
      <Drawer.Screen
        name="symptoms/post-meal"
        options={{
          drawerItemStyle: { display: "none" },
          headerShown: true,
          title: "Symptoms",
        }}
      />
    </Drawer>
  );
}
