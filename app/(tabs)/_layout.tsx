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
        swipeEnabled: true,
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
        name="daily"
        options={{
          title: "Daily Journal",
          drawerIcon: ({ color }) => (
            <IconSymbol size={24} name="book.closed.fill" color={color} />
          ),
          headerShown: true,
        }}
      />
      <Drawer.Screen
        name="trends"
        options={{
          title: "Trends & Analytics",
          drawerIcon: ({ color }) => (
            <IconSymbol size={24} name="chart.bar" color={color} />
          ),
          headerShown: true,
        }}
      />
      <Drawer.Screen
        name="mood"
        options={{
          title: "Mood Analytics",
          drawerIcon: ({ color }) => (
            <IconSymbol size={24} name="face.smiling" color={color} />
          ),
          headerShown: true,
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
        name="symptoms"
        options={{
          drawerItemStyle: { display: "none" },
          headerShown: false,
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
        name="settings/user-profile"
        options={{
          title: "User Profile",
          drawerIcon: ({ color }) => (
            <IconSymbol size={24} name="person.fill" color={color} />
          ),
          headerShown: true,
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
    </Drawer>
  );
}
