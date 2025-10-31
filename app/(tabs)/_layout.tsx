import React from "react";
import { Drawer } from "expo-router/drawer";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { useTheme } from "@/context/ThemeContext";
import { useTranslation } from "react-i18next";

export default function TabLayout() {
  const { theme } = useTheme();
  const { t } = useTranslation();

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
          title: t('navigation.home'),
          drawerIcon: ({ color }) => (
            <IconSymbol size={24} name="house.fill" color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="daily"
        options={{
          title: t('navigation.dailyJournal'),
          drawerIcon: ({ color }) => (
            <IconSymbol size={24} name="book.closed.fill" color={color} />
          ),
          headerShown: true,
        }}
      />
      <Drawer.Screen
        name="trends"
        options={{
          title: t('navigation.trendsAnalytics'),
          drawerIcon: ({ color }) => (
            <IconSymbol size={24} name="chart.bar" color={color} />
          ),
          headerShown: true,
        }}
      />
      <Drawer.Screen
        name="mood"
        options={{
          title: t('navigation.moodAnalytics'),
          drawerIcon: ({ color }) => (
            <IconSymbol size={24} name="face.smiling" color={color} />
          ),
          headerShown: true,
        }}
      />
      <Drawer.Screen
        name="meals/meals"
        options={{
          title: t('navigation.myMeals'),
          drawerIcon: ({ color }) => (
            <IconSymbol size={24} name="list.bullet.clipboard" color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="weather/weather-mood"
        options={{
          title: t('navigation.weatherMood'),
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
          title: t('navigation.userProfile'),
          drawerIcon: ({ color }) => (
            <IconSymbol size={24} name="person.fill" color={color} />
          ),
          headerShown: true,
        }}
      />
      <Drawer.Screen
        name="settings/settings"
        options={{
          title: t('navigation.settings'),
          drawerIcon: ({ color }) => (
            <IconSymbol size={24} name="gearshape.fill" color={color} />
          ),
        }}
      />
    </Drawer>
  );
}
