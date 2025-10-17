import React, { useState } from "react";
import { Button, Text, SegmentedButtons, Switch } from "react-native-paper";
import { useCreateSymptom } from "../../hooks/symptoms";
import { View } from "react-native";

type MealType = "breakfast" | "lunch" | "dinner" | "snack";

export interface SymptomFormData {
  bloating: "None" | "Mild" | "Moderate" | "Severe";
  energy: 1 | 2 | 3 | 4 | 5;
  stool: 1 | 2 | 3 | 4 | 5 | 6 | 7;
  diarrhea: boolean;
  nausea: boolean;
  pain: boolean;
  mealTag?: MealType;
}

export default function SymptomForm({
  mealId,
  defaultMealType,
  onSaved,
  autoSave = true,
  onChange,
}: {
  mealId?: string;
  defaultMealType?: MealType;
  onSaved?: () => void;
  autoSave?: boolean;
  onChange?: (data: SymptomFormData) => void;
}) {
  const create = useCreateSymptom();
  const [bloating, setBloating] = useState<
    "None" | "Mild" | "Moderate" | "Severe"
  >("None");
  const [energy, setEnergy] = useState<1 | 2 | 3 | 4 | 5>(3);
  const [stool, setStool] = useState<1 | 2 | 3 | 4 | 5 | 6 | 7>(4);
  const [diarrhea, setDiarrhea] = useState(false);
  const [nausea, setNausea] = useState(false);
  const [pain, setPain] = useState(false);
  const [mealTag, setMealTag] = useState<MealType | undefined>(defaultMealType);

  // Notify parent of changes
  React.useEffect(() => {
    if (onChange) {
      onChange({
        bloating,
        energy,
        stool,
        diarrhea,
        nausea,
        pain,
        mealTag,
      });
    }
  }, [bloating, energy, stool, diarrhea, nausea, pain, mealTag, onChange]);

  const onSave = async () => {
    if (!autoSave) {
      // Just call onSaved callback without actually saving
      onSaved?.();
      return;
    }

    await create.mutateAsync({
      meal_id: mealId ?? null,
      meal_type_tag: mealTag ?? null,
      bloating,
      energy,
      stool_consistency: stool,
      diarrhea: diarrhea ? 1 : 0,
      nausea: nausea ? 1 : 0,
      pain: pain ? 1 : 0,
    });
    onSaved?.();
  };

  return (
    <View style={{ gap: 12 }}>
      <Text variant="titleMedium">How do you feel after your meal?</Text>
      <SegmentedButtons
        value={bloating}
        onValueChange={(v: any) => setBloating(v)}
        buttons={[
          { value: "None", label: "None" },
          { value: "Mild", label: "Mild" },
          { value: "Moderate", label: "Moderate" },
          { value: "Severe", label: "Severe" },
        ]}
      />
      <Text>Energy (1–5)</Text>
      <SegmentedButtons
        value={String(energy)}
        onValueChange={(v: any) => setEnergy(Number(v) as any)}
        buttons={[1, 2, 3, 4, 5].map((n) => ({
          value: String(n),
          label: String(n),
        }))}
      />
      <Text>Stool (Bristol 1–7)</Text>
      <SegmentedButtons
        value={String(stool)}
        onValueChange={(v: any) => setStool(Number(v) as any)}
        buttons={[1, 2, 3, 4, 5, 6, 7].map((n) => ({
          value: String(n),
          label: String(n),
        }))}
      />
      {(
        [
          ["Diarrhea", diarrhea, setDiarrhea],
          ["Nausea", nausea, setNausea],
          ["Pain", pain, setPain],
        ] as const
      ).map(([label, val, setter]) => (
        <View
          key={label}
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Text>{label}</Text>
          <Switch value={val} onValueChange={setter} />
        </View>
      ))}
      <Text>Tag meal (optional)</Text>
      <SegmentedButtons
        value={mealTag ?? ""}
        onValueChange={(v: any) => setMealTag(v as MealType)}
        buttons={[
          { value: "breakfast", label: "Breakfast" },
          { value: "lunch", label: "Lunch" },
          { value: "dinner", label: "Dinner" },
          { value: "snack", label: "Snack" },
        ]}
      />
      {autoSave && (
        <Button mode="contained" onPress={onSave} loading={create.isPending}>
          Save Symptoms
        </Button>
      )}
    </View>
  );
}
