import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5FCFF",
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  filterContainer: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#EEE",
  },
  filterTitle: {
    fontWeight: "bold",
    fontSize: 18,
    marginBottom: 12,
  },
  buttonGroup: {
    flexDirection: "row",
    gap: 8,
    flexWrap: "wrap",
    alignItems: "center",
  },
  chartWrapper: {
    alignItems: "center",
    paddingBottom: 20,
  },
  chartViewContainer: {
    height: 300,
    width: "100%",
    paddingHorizontal: 10,
    marginBottom: 15,
  },
  errorText: {
    color: "red",
    textAlign: "center",
  },
  legendContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
    marginHorizontal: 10,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 15,
    marginBottom: 5,
  },
  legendSwatch: {
    width: 10,
    height: 10,
    borderRadius: 2,
    marginRight: 5,
  },
  legendLabel: {},
});
