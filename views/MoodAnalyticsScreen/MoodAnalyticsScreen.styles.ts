import { StyleSheet } from "react-native";
import { Theme } from "@/constants/ColorPalettes";
import { scaleFontSize, scale } from "@/utils/responsive";

export const createStyles = (theme: Theme) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  optionsContainer: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.lg,
  },
  optionCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.md,
    borderLeftWidth: 4,
    ...theme.shadows.md,
  },
  optionEmojiContainer: {
    width: scale(60),
    height: scale(60),
    borderRadius: scale(30),
    backgroundColor: theme.colors.background,
    alignItems: "center",
    justifyContent: "center",
    marginRight: theme.spacing.md,
  },
  optionEmoji: {
    fontSize: scaleFontSize(32),
  },
  optionContent: {
    flex: 1,
  },
  optionTitle: {
    fontSize: scaleFontSize(18),
    fontWeight: "700",
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.xs / 2,
  },
  optionDescription: {
    fontSize: scaleFontSize(14),
    color: theme.colors.textSecondary,
    lineHeight: 20,
  },
  optionChevron: {
    fontSize: scaleFontSize(28),
    color: theme.colors.primary,
    fontWeight: "700",
    marginLeft: theme.spacing.sm,
  },
  infoCard: {
    margin: theme.spacing.md,
    padding: theme.spacing.lg,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    ...theme.shadows.sm,
  },
  infoTitle: {
    fontSize: scaleFontSize(18),
    fontWeight: "700",
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.sm,
  },
  infoText: {
    fontSize: scaleFontSize(15),
    color: theme.colors.textPrimary,
    lineHeight: 22,
    marginBottom: theme.spacing.md,
  },
  infoBullets: {
    marginBottom: theme.spacing.md,
  },
  infoBullet: {
    fontSize: scaleFontSize(14),
    color: theme.colors.textSecondary,
    lineHeight: 24,
    marginBottom: theme.spacing.xs / 2,
  },
  infoNote: {
    fontSize: scaleFontSize(13),
    color: theme.colors.textSecondary,
    fontStyle: "italic",
    padding: theme.spacing.md,
    backgroundColor: theme.colors.background,
    borderRadius: theme.borderRadius.md,
    lineHeight: 20,
  },
});
