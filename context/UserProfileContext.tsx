import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import {
  getUserProfile,
  upsertUserProfile,
  type UserProfile,
  type UserProfileInput,
  type WeightUnit,
  type DayOfWeek,
} from "@/storage/userProfile";

interface UserProfileContextType {
  profile: UserProfile | null;
  loading: boolean;
  name: string | null;
  age: number | null;
  weight: number | null;
  weightUnit: WeightUnit;
  workingDays: DayOfWeek[];
  sportDays: DayOfWeek[];
  updateProfile: (input: UserProfileInput) => Promise<void>;
  updateWeight: (weight: number, unit: WeightUnit) => Promise<void>;
  updateWorkingDays: (days: DayOfWeek[]) => Promise<void>;
  updateSportDays: (days: DayOfWeek[]) => Promise<void>;
  refresh: () => Promise<void>;
}

const UserProfileContext = createContext<UserProfileContextType | undefined>(undefined);

export const UserProfileProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [workingDays, setWorkingDays] = useState<DayOfWeek[]>([]);
  const [sportDays, setSportDays] = useState<DayOfWeek[]>([]);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const userProfile = await getUserProfile();
      setProfile(userProfile);

      if (userProfile) {
        // Parse working days and sport days from JSON strings
        try {
          const working = userProfile.working_days ? JSON.parse(userProfile.working_days) : [];
          const sport = userProfile.sport_days ? JSON.parse(userProfile.sport_days) : [];
          setWorkingDays(working);
          setSportDays(sport);
        } catch (e) {
          console.error("Error parsing days:", e);
          setWorkingDays([]);
          setSportDays([]);
        }
      }
    } catch (error) {
      console.error("Error loading user profile:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  const updateProfile = async (input: UserProfileInput) => {
    try {
      const updatedProfile = await upsertUserProfile(input);
      setProfile(updatedProfile);

      // Update local state for days
      if (input.working_days) setWorkingDays(input.working_days);
      if (input.sport_days) setSportDays(input.sport_days);
    } catch (error) {
      console.error("Error updating profile:", error);
      throw error;
    }
  };

  const updateWeight = async (weight: number, unit: WeightUnit) => {
    await updateProfile({ weight, weight_unit: unit });
  };

  const updateWorkingDaysHandler = async (days: DayOfWeek[]) => {
    await updateProfile({ working_days: days });
  };

  const updateSportDaysHandler = async (days: DayOfWeek[]) => {
    await updateProfile({ sport_days: days });
  };

  const refresh = async () => {
    await loadProfile();
  };

  const value: UserProfileContextType = {
    profile,
    loading,
    name: profile?.name ?? null,
    age: profile?.age ?? null,
    weight: profile?.weight ?? null,
    weightUnit: profile?.weight_unit ?? "kg",
    workingDays,
    sportDays,
    updateProfile,
    updateWeight,
    updateWorkingDays: updateWorkingDaysHandler,
    updateSportDays: updateSportDaysHandler,
    refresh,
  };

  return <UserProfileContext.Provider value={value}>{children}</UserProfileContext.Provider>;
};

export const useUserProfile = (): UserProfileContextType => {
  const context = useContext(UserProfileContext);
  if (context === undefined) {
    throw new Error("useUserProfile must be used within a UserProfileProvider");
  }
  return context;
};
